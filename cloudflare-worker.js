/**
 * ALO Cloudflare Worker CORS Proxy + Telegram Send Photo
 * Deploy lên Cloudflare Workers, rồi copy URL workers.dev vào proxy-config.js
 *
 * Cần set trong Cloudflare Worker -> Settings -> Variables and Secrets:
 * - TELEGRAM_BOT_TOKEN = token bot mới từ BotFather (Secret)
 * - TELEGRAM_CHAT_ID = 5655216839 (Text hoặc Secret)
 */
const ALLOWED_ORIGINS = [
  "https://phamtranceven-lang.github.io",
  "http://localhost:3000",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

function isAllowedOrigin(origin) {
  return !origin || ALLOWED_ORIGINS.includes(origin);
}

function corsHeaders(origin) {
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Range, User-Agent, Accept",
    "Access-Control-Expose-Headers": "Content-Type, Content-Length, Content-Disposition, Accept-Ranges",
    "Vary": "Origin"
  };
}

function errorResponse(message, status, origin) {
  return new Response(message, {
    status,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}

function jsonResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

async function handleTelegramSend(request, env, origin) {
  if (request.method !== "POST") {
    return errorResponse("Method not allowed", 405, origin);
  }

  if (!isAllowedOrigin(origin)) {
    return errorResponse("Origin not allowed", 403, origin);
  }

  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    return errorResponse("Missing Telegram env variables", 500, origin);
  }

  try {
    const form = await request.formData();
    const photo = form.get("photo");
    const caption = form.get("caption") || "";

    if (!photo || !(photo instanceof Blob)) {
      return errorResponse("Missing photo", 400, origin);
    }

    const fileName = photo && typeof photo === "object" && "name" in photo && photo.name
      ? photo.name
      : "the-du-thi.png";

    const tgForm = new FormData();
    tgForm.append("chat_id", env.TELEGRAM_CHAT_ID);
    tgForm.append("photo", photo, fileName);
    tgForm.append("caption", caption);

    const tgRes = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendPhoto`,
      {
        method: "POST",
        body: tgForm
      }
    );

    const tgText = await tgRes.text();

    if (!tgRes.ok) {
      return jsonResponse(
        {
          ok: false,
          message: "Telegram send failed",
          telegram: tgText
        },
        500,
        origin
      );
    }

    return jsonResponse(
      {
        ok: true,
        message: "Sent to Telegram successfully"
      },
      200,
      origin
    );
  } catch (e) {
    return errorResponse("Telegram worker failed: " + (e && e.message ? e.message : e), 502, origin);
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const reqUrl = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Route mới: nhận ảnh thẻ dự thi từ web rồi gửi qua Telegram
    // Frontend gọi: POST https://WORKER.workers.dev/send-card-telegram
    if (reqUrl.pathname === "/send-card-telegram") {
      return handleTelegramSend(request, env, origin);
    }

    // Phần cũ: Worker mở file / proxy file
    if (!["GET", "HEAD"].includes(request.method)) {
      return errorResponse("Method not allowed", 405, origin);
    }

    const target = reqUrl.searchParams.get("url") || reqUrl.searchParams.get("quest");

    if (!target) {
      return errorResponse("Missing ?url=", 400, origin);
    }

    let targetUrl;
    try {
      targetUrl = new URL(target);
    } catch (e) {
      return errorResponse("Invalid target URL", 400, origin);
    }

    if (!["http:", "https:"].includes(targetUrl.protocol)) {
      return errorResponse("Only http/https URLs are allowed", 400, origin);
    }

    // Chặn dùng proxy cho link nội bộ/localhost để tránh lạm dụng SSRF.
    const host = targetUrl.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local")) {
      return errorResponse("Blocked host", 403, origin);
    }

    const upstreamHeaders = new Headers();
    upstreamHeaders.set("User-Agent", "Mozilla/5.0 ALO-CF-Worker");
    upstreamHeaders.set("Accept", request.headers.get("Accept") || "*/*");
    const range = request.headers.get("Range");
    if (range) upstreamHeaders.set("Range", range);

    try {
      const upstream = await fetch(targetUrl.toString(), {
        method: request.method,
        headers: upstreamHeaders,
        redirect: "follow",
        cf: { cacheTtl: 0, cacheEverything: false }
      });

      const headers = new Headers(upstream.headers);
      for (const [k, v] of Object.entries(corsHeaders(origin))) headers.set(k, v);
      headers.set("Cache-Control", "no-store");

      // Bỏ vài header có thể gây lỗi khi response bị proxy.
      headers.delete("content-security-policy");
      headers.delete("x-frame-options");

      return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers
      });
    } catch (e) {
      return errorResponse("Worker fetch failed: " + (e && e.message ? e.message : e), 502, origin);
    }
  }
};
