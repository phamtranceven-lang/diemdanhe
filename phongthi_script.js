
        let db = [];
        let sourceFileKind = "";
        let sourceWorkbook = null;
        let sourceRowsBySheet = {};
        let sourcePdfDoc = null;
        let autoProofModalShownKey = "";
        let examProofModalShownKey = "";
        let openedFileSubject = "";
        let sourceSubjectBySheet = {};
        let telegramAutoSendRequested = false;
        let telegramAutoSendDone = false;
        let telegramAutoSendTryCount = 0;
        let telegramAutoSendTimer = null;
        const MANUAL_EXAM_INFO_KEY_PREFIX = "ALO_MANUAL_EXAM_INFO_V1::";

        function escapeHtml(value) {
            return String(value ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        const toast = (m) => {
            const b = document.getElementById('toast-box'), d = document.createElement('div');
            d.className = 'toast'; d.innerText = m; b.appendChild(d);
            setTimeout(() => d.remove(), 2500);
        };

        function cleanManualKeyPart(value) {
            return String(value ?? '')
                .replace(/\s+/g, ' ')
                .trim()
                .slice(0, 120);
        }

        function manualExamInfoStorageKey(d = {}) {
            const msv = cleanManualKeyPart(d.msv);
            const manualLookup = cleanManualKeyPart(d.manualLookupKey || d.name || '');
            // Nếu tự quét ra MSSV thì key theo MSSV như cũ.
            // Nếu PDF/Excel không quét ra sinh viên, vẫn cho lưu tay theo chuỗi người dùng nhập.
            const identity = (msv && msv !== '---') ? msv : (manualLookup ? `MANUAL:${manualLookup}` : '');
            if (!identity) return '';
            return MANUAL_EXAM_INFO_KEY_PREFIX + [
                cleanManualKeyPart(sourceFileKind || 'file'),
                cleanManualKeyPart(d.source || ''),
                identity,
                cleanManualKeyPart(d.mon || ''),
                cleanManualKeyPart(d.ngay || ''),
                cleanManualKeyPart(d.gio || '')
            ].join('||');
        }

        function loadManualExamInfo(d = {}) {
            const key = manualExamInfoStorageKey(d);
            if (!key) return null;
            try {
                const raw = localStorage.getItem(key);
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                if (!parsed || typeof parsed !== 'object') return null;
                return parsed;
            } catch (err) {
                return null;
            }
        }

        function applyManualExamInfo(d = {}) {
            const saved = loadManualExamInfo(d);
            if (!saved) return d;
            if (String(saved.phong || '').trim()) {
                d.phong = String(saved.phong).trim();
                d.manualRoom = true;
            }
            if (String(saved.coso || '').trim()) {
                d.coso = String(saved.coso).trim();
                d.manualCampus = true;
            }
            return d;
        }

        function updateCardManualDisplay(card, room, campus) {
            if (!card) return;
            const roomValue = String(room || '').trim() || '---';
            const campusValue = String(campus || '').trim() || 'Chưa xác định';
            const roomEl = card.querySelector('.room-big');
            const campusEl = card.querySelector('.coso-text');
            if (roomEl) roomEl.textContent = `Phòng: ${roomValue}`;
            if (campusEl) campusEl.textContent = campusValue;
            card.dataset.manualRoom = roomValue;
            card.dataset.manualCampus = campusValue;
        }

        function saveManualExamInfo(btn) {
            const wrap = btn?.closest?.('.sidebar-card-wrap');
            const card = wrap?.querySelector?.('.card');
            const editBox = wrap?.querySelector?.('.manual-edit-box');
            const key = card?.dataset?.manualKey || editBox?.dataset?.manualKey || '';
            if (!key) {
                toast('❌ Không có MSSV để lưu phòng/cơ sở');
                return;
            }

            const room = String(editBox?.querySelector?.('.manual-room-input')?.value || '').replace(/\s+/g, ' ').trim();
            const campus = String(editBox?.querySelector?.('.manual-campus-input')?.value || '').replace(/\s+/g, ' ').trim();
            if (!room && !campus) {
                localStorage.removeItem(key);
                updateCardManualDisplay(card, '', '');
                toast('🧹 Đã xoá sửa tay phòng/cơ sở');
                return;
            }

            localStorage.setItem(key, JSON.stringify({ phong: room, coso: campus, savedAt: new Date().toISOString() }));

            document.querySelectorAll('.sidebar-card-wrap').forEach(item => {
                const c = item.querySelector('.card');
                if (c?.dataset?.manualKey === key) {
                    updateCardManualDisplay(c, room, campus);
                    const hint = item.querySelector('.manual-save-hint');
                    if (hint) hint.textContent = 'Đã lưu. Khi chụp ảnh, thẻ sẽ dùng phòng/cơ sở vừa sửa.';
                }
            });

            btn.textContent = '✅ Đã lưu';
            setTimeout(() => { btn.textContent = '💾 Lưu phòng/cơ sở'; }, 1200);
            toast('✅ Đã lưu phòng/cơ sở sửa tay');
        }


        function showLoading(message = "ĐANG LOAD DANH SÁCH") {
            const overlay = document.getElementById('loadingOverlay');
            if (!overlay) return;
            const title = overlay.querySelector('.loading-title');
            if (title) title.textContent = message;
            overlay.classList.add('show');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.classList.add('loading-lock');
        }

        function hideLoading() {
            const overlay = document.getElementById('loadingOverlay');
            if (!overlay) return;
            overlay.classList.remove('show');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('loading-lock');
        }


        function guideUserToSearchBox() {
            const input = document.getElementById('mssvIn');
            const label = document.querySelector('label[for="mssvIn"], .label[style*="dtu-red"]');
            const bubble = document.getElementById('mssvHintBubble');
            const area = document.getElementById('resultArea');

            if (!input) return;

            input.classList.add('ready-attention');
            if (label) label.classList.add('input-step-ready');
            if (bubble) bubble.classList.add('show');
            if (area) area.classList.add('ready-guide');

            // Mobile: kéo tới ô nhập để người dùng thấy ngay. PC: giữ bố cục, chỉ focus.
            const isMobile = window.matchMedia('(max-width: 850px)').matches;
            setTimeout(() => {
                try {
                    if (isMobile) {
                        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    input.focus({ preventScroll: true });
                } catch (e) {
                    input.focus();
                }
            }, 120);

            // Sau vài giây thì bớt nhấp nháy, khi người dùng nhập thì cũng tự tắt.
            const stopAttention = () => {
                input.classList.remove('ready-attention');
                if (label) label.classList.remove('input-step-ready');
                if (bubble) bubble.classList.remove('show');
                if (area) area.classList.remove('ready-guide');
                input.removeEventListener('input', stopAttention);
                input.removeEventListener('focus', softStop);
            };

            const softStop = () => {
                setTimeout(() => {
                    if ((input.value || '').trim().length > 0) stopAttention();
                }, 80);
            };

            input.addEventListener('input', stopAttention);
            input.addEventListener('focus', softStop);

            clearTimeout(window.__mssvAttentionTimer);
            window.__mssvAttentionTimer = setTimeout(() => {
                input.classList.remove('ready-attention');
                if (label) label.classList.remove('input-step-ready');
                if (bubble) bubble.classList.remove('show');
                if (area) area.classList.remove('ready-guide');
            }, 8500);
        }



        function isProbablyPdf(url, blob, forcePdf = false) {
            const contentType = (blob && blob.type || "").toLowerCase();
            return !!forcePdf || /\.pdf(\?|#|$)/i.test(url || "") || contentType.includes("pdf");
        }

        async function sniffBlobKind(url, blob, forcePdf = false) {
            if (forcePdf) return "pdf";
            const contentType = (blob && blob.type || "").toLowerCase();
            const rawUrl = String(url || "");

            if (/\.pdf(?:[?#].*)?$/i.test(rawUrl) || contentType.includes("pdf")) return "pdf";
            if (/\.(xls|xlsx|xlsm)(?:[?#].*)?$/i.test(rawUrl) || contentType.includes("excel") || contentType.includes("spreadsheet")) return "excel";

            // Nhiều link pdaotao/proxy trả về application/octet-stream nên phải đọc magic bytes.
            try {
                const head = await blob.slice(0, 8).arrayBuffer();
                const bytes = Array.from(new Uint8Array(head));
                const ascii = String.fromCharCode(...bytes);
                if (ascii.startsWith("%PDF")) return "pdf";
                // XLSX/XLSM là zip: PK. XLS cũ thường bắt đầu D0 CF 11 E0.
                if (bytes[0] === 0x50 && bytes[1] === 0x4B) return "excel";
                if (bytes[0] === 0xD0 && bytes[1] === 0xCF && bytes[2] === 0x11 && bytes[3] === 0xE0) return "excel";
            } catch (e) {
                console.warn("Không sniff được loại file:", e);
            }

            return isProbablyPdf(rawUrl, blob, false) ? "pdf" : "excel";
        }

        function buildCorsProxyUrls(targetUrl) {
            const encoded = encodeURIComponent(targetUrl);
            const workerBase = String(window.ALO_CLOUDFLARE_WORKER_PROXY || "").trim().replace(/\/$/, "");
            if (!workerBase || workerBase.includes("REPLACE-ME")) {
                console.warn("Chưa cấu hình Cloudflare Worker proxy. Mở proxy-config.js và dán URL Worker vào.");
                return [];
            }
            return [`${workerBase}/?url=${encoded}`];
        }

        async function fetchWithTimeoutSafe(resource, options = {}, timeoutMs = 25000) {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);
            try {
                return await fetch(resource, { ...options, signal: controller.signal });
            } finally {
                clearTimeout(timer);
            }
        }

        async function readShortResponseText(response) {
            try {
                const text = await response.clone().text();
                return text ? " - " + text.slice(0, 120).replace(/\s+/g, " ") : "";
            } catch (e) {
                return "";
            }
        }

        async function fetchOnlineFile(url) {
            // Thử trực tiếp trước; nếu vướng CORS/proxy 400 thì thử thêm nhiều proxy dự phòng.
            const errors = [];

            try {
                const direct = await fetchWithTimeoutSafe(url, {
                    method: "GET",
                    mode: "cors",
                    cache: "no-store"
                }, 18000);
                if (direct.ok) return await direct.blob();
                errors.push(`direct HTTP ${direct.status}${await readShortResponseText(direct)}`);
            } catch (e) {
                errors.push(`direct ${e && e.name === "AbortError" ? "timeout" : (e.message || e)}`);
            }

            for (const proxyUrl of buildCorsProxyUrls(url)) {
                let host = proxyUrl;
                try { host = new URL(proxyUrl).hostname; } catch (e) {}
                try {
                    const proxied = await fetchWithTimeoutSafe(proxyUrl, {
                        method: "GET",
                        cache: "no-store"
                    }, 25000);
                    if (proxied.ok) return await proxied.blob();
                    errors.push(`${host} HTTP ${proxied.status}${await readShortResponseText(proxied)}`);
                } catch (e) {
                    errors.push(`${host} ${e && e.name === "AbortError" ? "timeout" : (e.message || e)}`);
                }
            }

            throw new Error(errors.join(" | "));
        }

        async function loadOnlineLink(text, options = {}) {
            showLoading("ĐANG LOAD DANH SÁCH");
            try {
                text = (text || "").trim();
                if (!/^https?:\/\//i.test(text)) {
                    toast("Link không hợp lệ!");
                    return;
                }
                document.getElementById('urlIn').value = text;
                toast("⌛ Đang tải file danh sách...");
                const blob = await fetchOnlineFile(text);
                const kind = await sniffBlobKind(text, blob, !!options.forcePdf);
                await processData(blob, kind === "pdf");
            } catch (e) {
                console.error(e);
                toast("❌ Lỗi nạp link Excel/PDF: " + (e && e.message ? e.message.slice(0, 180) : "không rõ lỗi"));
            } finally {
                hideLoading();
            }
        }

        async function pasteAndLoad() {
            try {
                const typed = (document.getElementById('urlIn')?.value || '').trim();
                if (typed) {
                    await loadOnlineLink(typed);
                    return;
                }
                const text = await navigator.clipboard.readText();
                await loadOnlineLink(text);
            } catch (e) {
                console.error(e);
                toast("Không đọc được link. Hãy dán link vào ô Link Online rồi bấm Dán.");
            }
        }

        // Hỗ trợ mở thẳng từ trang "Danh sách thi":
        // phongthi_auto_link_v2.html?url=<link_excel_hoac_pdf>
        // Có thể kèm: &mssv=<MSSV> hoặc &q=<ten/MSSV> để tự điền ô tìm.
        window.addEventListener('DOMContentLoaded', async () => {
            const params = new URLSearchParams(location.search);
            const autoUrl = params.get('url') || params.get('src') || params.get('excel');
            const autoQuery = params.get('mssv') || params.get('q') || params.get('search') || params.get('name') || params.get('ten') || params.get('pdfText');
            const forcePdf = /^(1|true|yes|pdf)$/i.test(params.get('pdf') || '') || /pdf/i.test(params.get('fileType') || '');
            telegramAutoSendRequested = /^(1|true|yes)$/i.test(params.get('autoSendTelegram') || params.get('sendTelegram') || '');
            if (autoUrl) {
                await loadOnlineLink(autoUrl, { forcePdf });
                if (autoQuery) {
                    const input = document.getElementById('mssvIn');
                    input.value = autoQuery;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    scheduleAutoSendTelegramFirstCard('auto-query');
                }
            }
        });

        document.getElementById('fileIn').onchange = async (e) => {
            const f = e.target.files[0]; if (!f) return;
            showLoading("ĐANG LOAD DANH SÁCH");
            try {
                toast("⌛ Đang xử lý file...");
                const kind = await sniffBlobKind(f.name, f, f.name.toLowerCase().endsWith('.pdf'));
                await processData(f, kind === 'pdf');
            } catch (err) {
                console.error(err);
                toast("❌ Lỗi xử lý file!");
            } finally {
                hideLoading();
            }
        };

        async function processData(blob, isPdf) {
            sourceFileKind = isPdf ? "pdf" : "excel";
            sourceWorkbook = null;
            sourceRowsBySheet = {};
            sourcePdfDoc = null;
            examProofModalShownKey = "";
            autoProofModalShownKey = "";

            if (isPdf) await parsePDF(blob); else await parseExcel(blob);
            updateOpenedSubjectCache();
            const input = document.getElementById('mssvIn');
            input.disabled = false;
            input.placeholder = "Hãy nhập mã sinh viên hoặc tên người muốn tra danh sách";

            renderOriginalFileOverview();
            toast(openedFileSubject ? `✅ Nạp xong - đã bắt môn: ${openedFileSubject}` : "✅ Nạp xong - đã hiện ảnh/bảng gốc của file");
            guideUserToSearchBox();
        }

        async function parseExcel(blob) {
            const data = await blob.arrayBuffer();
            const wb = XLSX.read(data, { type: 'array' });
            db = [];
            sourceWorkbook = wb;
            sourceRowsBySheet = {};
            sourceFileKind = "excel";

            wb.SheetNames.forEach(name => {
                const json = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, defval: "" });
                sourceRowsBySheet[name] = json;
                json.forEach((row, i) => {
                    row._sheet = name;
                    row._row = i + 1;
                    db.push(row);
                });
            });
        }


        function normalizeNoSpaceText(value) {
            return normalizeLookupText(value).replace(/\s+/g, '');
        }

        function shouldJoinPdfTextWithoutSpace(prevText, nextText, gap, avgHeight) {
            const left = String(prevText || '');
            const right = String(nextText || '');
            if (!left || !right) return false;
            if (gap <= Math.max(1.5, avgHeight * 0.18)) return true;
            if (left.length <= 2 && right.length <= 2 && gap <= Math.max(3.5, avgHeight * 0.45)) return true;
            if (/^\d+$/.test(left) && /^\d+$/.test(right) && gap <= Math.max(5, avgHeight * 0.7)) return true;
            return false;
        }

        function mergePdfLineItemsToCells(items, lineHeight = 10) {
            const sorted = Array.from(items || []).sort((a, b) => Number(a.x || 0) - Number(b.x || 0));
            const cells = [];
            let current = null;
            const avgHeight = Number(lineHeight || 10) || 10;

            sorted.forEach(it => {
                const text = String(it.str || '').trim();
                if (!text) return;
                const x = Number(it.x || 0);
                const endX = Number(it.endX || (x + Number(it.width || 0)));

                if (!current) {
                    current = { text, x, endX, raw: [it] };
                    return;
                }

                const gap = x - Number(current.endX || x);
                const bigColumnGap = gap > Math.max(9, avgHeight * 0.95);
                if (bigColumnGap) {
                    cells.push(current);
                    current = { text, x, endX, raw: [it] };
                    return;
                }

                const noSpace = shouldJoinPdfTextWithoutSpace(current.text.slice(-3), text.slice(0, 3), gap, avgHeight);
                current.text += noSpace ? text : ` ${text}`;
                current.endX = Math.max(Number(current.endX || 0), endX);
                current.raw.push(it);
            });

            if (current) cells.push(current);

            cells.forEach(c => {
                c.text = String(c.text || '')
                    .replace(/(?<=\d)\s+(?=\d)/g, '')
                    .replace(/\s+/g, ' ')
                    .trim();
            });
            return cells;
        }

        function buildPdfLineSearchText(items, cells) {
            const cellText = Array.from(cells || []).map(c => c.text || '').join(' ');
            const itemTextWithSpace = Array.from(items || []).map(it => it.str || '').join(' ');
            const itemTextNoSpace = Array.from(items || []).map(it => it.str || '').join('');
            return [cellText, itemTextWithSpace, itemTextNoSpace]
                .filter(Boolean)
                .join('   ')
                .replace(/(?<=\d)\s+(?=\d)/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        }

        function rowSearchText(row) {
            const base = row?._searchText || Array.from(row || []).map(c => String(c ?? '').trim()).filter(Boolean).join(' ');
            return String(base || '')
                .replace(/(?<=\d)\s+(?=\d)/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        }

        function getPdfNearbyRows(row, radius = 3, yTolerance = 9.5) {
            if (sourceFileKind !== 'pdf' || !row) return [row].filter(Boolean);
            const idx = db.indexOf(row);
            if (idx < 0) return [row];
            const page = row._page;
            const y = Number(row._pdfY || 0);
            const out = [];
            for (let j = Math.max(0, idx - radius); j <= Math.min(db.length - 1, idx + radius); j++) {
                const r = db[j];
                if (!r || r._page !== page) continue;
                const dy = Math.abs(Number(r._pdfY || 0) - y);
                if (j === idx || dy <= yTolerance) out.push(r);
            }
            return out;
        }

        function getPdfCombinedSearchText(row) {
            if (sourceFileKind !== 'pdf' || !row) return rowSearchText(row);
            const rows = getPdfNearbyRows(row, 3, 9.5);
            const withSpace = rows.map(r => rowSearchText(r)).filter(Boolean).join(' ');
            const noSpace = rows.map(r => rowSearchText(r)).filter(Boolean).join('');
            return `${withSpace} ${noSpace}`
                .replace(/(?<=\d)\s+(?=\d)/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        }

        function isCourseOrClassCell(value) {
            const s = cleanExamText(value).replace(/\s+/g, ' ').trim();
            if (!s) return false;
            const knownPrefix = '(AES|AET|STA|ENG|MTH|PNU|MEC|CS|CSC|CSE|CSI|IS|LAW|JPN|KOR|CHI|FR|GER|PSY|BUS|ACC|FIN|MKT|HRM|THM|HIS|BIO|PHY|CHE|MED|NUR|PHR|ECO|MIS|CIS|SE|IT|GDTC|POL)';
            return (
                /^K\d{2}[A-Z0-9\-_.\/]*$/i.test(s) ||
                new RegExp('^' + knownPrefix + '\s*[-_\/]*\s*\d{2,4}\s*[A-Z0-9\-_.\/]*$', 'i').test(s) ||
                // Bắt các mã lớp môn học dạng "HRM 402 B", "ENG 129 B", "CSU PHY 306"...
                /^(?:[A-Z]{2,6}\s*){1,3}\d{2,4}\s*[A-Z0-9\-_.\/]*$/i.test(s) ||
                /^K\d{2}/i.test(s)
            );
        }

        function splitPdfStudentRow(row) {
            const arr = Array.from(row || []).map(c => String(c ?? '').replace(/\s+/g, ' ').trim()).filter(Boolean);
            const full = rowSearchText(row);
            const combinedFull = sourceFileKind === 'pdf' ? getPdfCombinedSearchText(row) : full;
            const msv = getRowMsv(row);
            if (!msv) return { stt: '', msv: '', name: '', lopHocPhan: '', lop: '' };

            let mi = arr.findIndex(c => normalizeDigitsOnly(c) === msv || normalizeDigitsOnly(c).includes(msv));
            let stt = '';
            let name = '';
            let lopHocPhan = '';
            let lop = '';

            if (mi >= 0) {
                const sameCellNums = String(arr[mi] || '').match(/\d+/g) || [];
                if (sameCellNums.length >= 2) {
                    const first = sameCellNums[0];
                    const rest = sameCellNums.slice(1).join('');
                    if (rest === msv && /^\d{1,3}$/.test(first)) stt = first;
                }

                for (let i = mi - 1; i >= 0; i--) {
                    const d = normalizeDigitsOnly(arr[i]);
                    if (d && d.length <= 3) { stt = d; break; }
                }

                const nameParts = [];
                for (let i = mi + 1; i < arr.length; i++) {
                    const cell = arr[i];
                    if (!cell) continue;
                    if (isCourseOrClassCell(cell)) {
                        if (!lopHocPhan && !/^K\d{2}/i.test(cleanExamText(cell))) lopHocPhan = cell;
                        else if (!lop) lop = cell;
                        continue;
                    }
                    if (/^(nợ\s*hp|no\s*hp|ký\s*tên|ky\s*ten|điểm|diem|ghi\s*chú|ghi\s*chu)$/i.test(cell)) break;
                    if (!lopHocPhan && nameParts.length < 5) nameParts.push(cell);
                }
                name = nameParts.join(' ').replace(/\s+/g, ' ').trim();

                if (!lop) {
                    const classCell = arr.find(c => /^K\d{2}/i.test(cleanExamText(c)));
                    if (classCell) lop = classCell;
                }
            }

            if (!name) {
                const m = full.match(/\b\d{8,12}\b\s+(.+?)(?=\s+(?:AES|AET|STA|ENG|MTH|PNU|MEC|CS|IS|LAW|JPN|KOR|CHI|FR|GER|PSY|BUS|ACC|FIN|MKT|HIS|BIO|PHY|CHE)\s*[-_\/]*\s*\d{2,4}|\s+K\d{2}|\s+N[OỢ]\s*HP|$)/i);
                if (m) name = (m[1] || '').replace(/^\d{1,3}\s+/, '').replace(/\s+/g, ' ').trim();
            }

            if (!name && combinedFull && combinedFull !== full) {
                const m = combinedFull.match(/\b\d{8,12}\b\s+(.+?)(?=\s+(?:AES|AET|STA|ENG|MTH|PNU|MEC|CS|IS|LAW|JPN|KOR|CHI|FR|GER|PSY|BUS|ACC|FIN|MKT|HIS|BIO|PHY|CHE)\s*[-_\/]*\s*\d{2,4}|\s+K\d{2}|\s+N[OỢ]\s*HP|$)/i);
                if (m) name = (m[1] || '').replace(/^\d{1,3}\s+/, '').replace(/\s+/g, ' ').trim();
            }

            return { stt, msv, name, lopHocPhan, lop };
        }

        async function parsePDF(blob) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
            const data = await blob.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(data) }).promise;
            db = [];
            sourcePdfDoc = pdf;
            sourceFileKind = "pdf";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1 });
                const content = await page.getTextContent();

                const buckets = [];
                content.items.forEach(it => {
                    const text = String(it.str || '').trim();
                    if (!text) return;
                    const x = Number(it.transform?.[4] || 0);
                    const y = Number(it.transform?.[5] || 0);
                    const width = Number(it.width || 0);
                    const height = Number(it.height || 0) || 10;
                    const lineTolerance = Math.max(5.8, Math.min(9.0, height * 0.72));
                    let bucket = null;
                    let bestDistance = Infinity;
                    buckets.forEach(b => {
                        const dist = Math.abs(Number(b.y || 0) - y);
                        const tol = Math.max(lineTolerance, Math.max(Number(b.height || height || 10), height) * 0.58);
                        if (dist <= tol && dist < bestDistance) {
                            bucket = b;
                            bestDistance = dist;
                        }
                    });
                    if (!bucket) {
                        bucket = { y, items: [], minX: x, maxX: x + width, height };
                        buckets.push(bucket);
                    }
                    bucket.y = (bucket.y * bucket.items.length + y) / (bucket.items.length + 1);
                    bucket.minX = Math.min(bucket.minX, x);
                    bucket.maxX = Math.max(bucket.maxX, x + width);
                    bucket.height = Math.max(bucket.height, height);
                    bucket.items.push({ str: text, x, y, width, height, endX: x + width });
                });

                buckets.sort((a, b) => b.y - a.y).forEach((bucket, idx) => {
                    const sorted = bucket.items.sort((a, b) => a.x - b.x);
                    const cells = mergePdfLineItemsToCells(sorted, bucket.height);
                    const row = cells.map(c => c.text).filter(Boolean);
                    row._pdfItems = sorted;
                    row._pdfCells = cells;
                    row._searchText = buildPdfLineSearchText(sorted, cells);
                    row._sheet = `Trang ${i}`;
                    row._page = i;
                    row._row = idx + 1;
                    row._pdfY = Number(bucket.y);
                    row._pdfHeight = Number(bucket.height || 10);
                    row._pdfPageWidth = viewport.width;
                    row._pdfPageHeight = viewport.height;
                    row._pdfMinX = Number(bucket.minX || 0);
                    row._pdfMaxX = Number(bucket.maxX || viewport.width);
                    db.push(row);
                });
            }

            if (!db.length) {
                toast("⚠️ PDF này có thể là ảnh scan, không có text để tự check. Bạn vẫn xem được ảnh gốc nhưng phải dò tay.");
            }
        }

        function getRowsForSameSource(row) {
            if (!row) return [];
            return db.filter(r => r && r._sheet === row._sheet);
        }

        function rowHasVisibleText(row) {
            return Array.from(row || []).some(cell => String(cell ?? "").trim() !== "");
        }

        function buildRowsTableHtml(rows, options = {}) {
            const visibleRows = (rows || []).filter(rowHasVisibleText);
            if (!visibleRows.length) return `<div class="original-file-empty">Không có dữ liệu để hiện ảnh file gốc.</div>`;

            const maxColsFromData = visibleRows.reduce((m, r) => Math.max(m, Array.from(r || []).length), 0);
            const maxCols = Math.max(1, Math.min(options.maxCols || 16, maxColsFromData || 1));
            const hitRow = options.hitRow || null;
            const hitRowNumber = hitRow ? hitRow._row : options.hitRowNumber;
            const nearRows = new Set(options.nearRowNumbers || []);

            let html = `<div class="original-file-scroll"><table class="original-file-table"><thead><tr><th class="row-num">#</th>`;
            for (let c = 0; c < maxCols; c++) html += `<th>${String.fromCharCode(65 + c)}</th>`;
            html += `</tr></thead><tbody>`;

            visibleRows.forEach(row => {
                const rowNo = row._row || "";
                const isHit = hitRowNumber && Number(rowNo) === Number(hitRowNumber);
                const isNear = nearRows.has(Number(rowNo));
                html += `<tr class="${isHit ? 'original-row-hit' : (isNear ? 'original-row-near' : '')}"><td class="row-num">${escapeHtml(rowNo)}</td>`;
                for (let c = 0; c < maxCols; c++) {
                    html += `<td>${escapeHtml(Array.from(row || [])[c] ?? "")}</td>`;
                }
                html += `</tr>`;
            });
            html += `</tbody></table></div>`;
            return html;
        }

        function buildExcelOverviewHtml() {
            const sheetName = Object.keys(sourceRowsBySheet)[0];
            if (!sheetName) return `<div class="original-file-empty">Không đọc được sheet trong file Excel.</div>`;
            const rows = (sourceRowsBySheet[sheetName] || []).slice(0, 45);
            return buildRowsTableHtml(rows, { maxCols: 18 });
        }

        function buildEvidenceSectionHtml(title, rows, options = {}) {
            return `
                <div class="original-evidence-section" style="margin-top:12px;">
                    <div style="font-weight:900; color:#b91c1c; margin-bottom:8px; font-size:13px; letter-spacing:.2px;">${title}</div>
                    ${buildRowsTableHtml(rows, options)}
                </div>
            `;
        }

        function excelColName(index) {
            let name = "";
            let n = Number(index) + 1;
            while (n > 0) {
                const rem = (n - 1) % 26;
                name = String.fromCharCode(65 + rem) + name;
                n = Math.floor((n - 1) / 26);
            }
            return name;
        }

        function getWorksheetForRow(row) {
            if (!sourceWorkbook || !row || !row._sheet) return null;
            return sourceWorkbook.Sheets[row._sheet] || null;
        }

        function getSheetRange(ws) {
            try {
                if (!ws || !ws['!ref']) return null;
                return XLSX.utils.decode_range(ws['!ref']);
            } catch (e) {
                return null;
            }
        }

        function getMergeAnchorMap(ws, startR, endR, startC, endC) {
            const anchors = new Map();
            const covered = new Set();
            const merges = Array.isArray(ws?.['!merges']) ? ws['!merges'] : [];
            merges.forEach(m => {
                const sR = Math.max(m.s.r, startR);
                const eR = Math.min(m.e.r, endR);
                const sC = Math.max(m.s.c, startC);
                const eC = Math.min(m.e.c, endC);
                if (sR > eR || sC > eC) return;
                const anchorKey = `${sR}:${sC}`;
                anchors.set(anchorKey, { rowspan: eR - sR + 1, colspan: eC - sC + 1 });
                for (let r = sR; r <= eR; r++) {
                    for (let c = sC; c <= eC; c++) {
                        const key = `${r}:${c}`;
                        if (key !== anchorKey) covered.add(key);
                    }
                }
            });
            return { anchors, covered };
        }

        function cellDisplayValue(ws, r, c) {
            const addr = XLSX.utils.encode_cell({ r, c });
            const cell = ws?.[addr];
            if (!cell) return "";
            return cell.w ?? cell.v ?? "";
        }

        function excelColumnWidthPx(ws, c) {
            const col = ws?.['!cols']?.[c];
            if (col) {
                const raw = Number(col.wpx || (col.wch ? col.wch * 9 : 0));
                if (raw) return Math.max(92, Math.min(260, Math.round(raw * 1.25)));
            }
            const presets = [76, 120, 220, 130, 145, 165, 90, 120, 70, 95, 150, 95, 95, 260, 110, 110, 110, 110];
            return presets[c] || 120;
        }

        function cellClassFromValue(value) {
            const s = String(value || '');
            const norm = cleanExamText(s);
            const classes = [];
            if (/^(BO GIAO DUC|DAI HOC DUY TAN|DANH SACH SINH VIEN|MON\s*:|KHOI LOP)/.test(norm)) classes.push('excel-title-cell');
            if (norm.includes('THOI GIAN') || norm.includes('CO SO') || norm.includes('PHONG')) classes.push('excel-italic-cell');
            return classes.join(' ');
        }

        function buildRealExcelRangeHtml(row, cardData = null) {
            const ws = getWorksheetForRow(row);
            const range = getSheetRange(ws);
            const hitRowNumber = Number(row?._row || 0);
            if (!ws || !range || !hitRowNumber) return '';

            const contextRowNumber = Number(cardData?.contextRowNumber || cardData?.campusRowNumber || cardData?.roomRowNumber || hitRowNumber);
            const hitR = hitRowNumber - 1;
            const contextR = contextRowNumber ? contextRowNumber - 1 : hitR;

            // Hiện giống ảnh Excel: lấy từ vài dòng trước phần thời gian/phòng/cơ sở xuống tới dòng tên.
            let startR = Math.max(range.s.r, Math.min(contextR, hitR) - 4);
            let endR = Math.min(range.e.r, hitR + 1);
            if (endR - startR > 85) endR = Math.min(range.e.r, startR + 85);

            // Luôn lấy từ cột A qua tối thiểu O để thấy đủ bảng + cột ghi chú/phòng bên phải.
            let startC = range.s.c;
            let endC = Math.min(range.e.c, Math.max(14, range.s.c + 14));
            endC = Math.min(endC, range.e.c);

            const { anchors, covered } = getMergeAnchorMap(ws, startR, endR, startC, endC);
            let html = `<div class="original-file-scroll original-file-scroll-full"><table class="excel-real-table"><thead><tr><th class="excel-corner"></th>`;
            for (let c = startC; c <= endC; c++) {
                const colWidth = excelColumnWidthPx(ws, c);
                html += `<th class="excel-col-head" style="min-width:${colWidth}px;">${excelColName(c)}</th>`;
            }
            html += `</tr></thead><tbody>`;

            for (let r = startR; r <= endR; r++) {
                const rowNo = r + 1;
                const rowClasses = [];
                if (rowNo === hitRowNumber) rowClasses.push('excel-hit-row');
                if (contextRowNumber && rowNo === contextRowNumber && rowNo !== hitRowNumber) rowClasses.push('excel-campus-row');
                html += `<tr class="${rowClasses.join(' ')}"><th class="excel-row-head">${rowNo}</th>`;

                for (let c = startC; c <= endC; c++) {
                    const key = `${r}:${c}`;
                    if (covered.has(key)) continue;
                    const merge = anchors.get(key);
                    const value = cellDisplayValue(ws, r, c);
                    const cls = cellClassFromValue(value);
                    const span = merge ? ` rowspan="${merge.rowspan}" colspan="${merge.colspan}"` : '';
                    html += `<td${span} class="${cls}">${escapeHtml(value)}</td>`;
                }
                html += `</tr>`;
            }

            html += `</tbody></table></div>`;
            return html;
        }

        function buildRowsTableHtmlFull(rows, options = {}) {
            const visibleRows = (rows || []).filter(rowHasVisibleText);
            if (!visibleRows.length) return `<div class="original-file-empty">Không có dữ liệu để hiện ảnh phòng thi.</div>`;

            const maxColsFromData = visibleRows.reduce((m, r) => Math.max(m, Array.from(r || []).length), 0);
            const maxCols = Math.max(1, Math.min(options.maxCols || 18, maxColsFromData || 1));
            const hitRow = options.hitRow || null;
            const hitRowNumber = hitRow ? hitRow._row : options.hitRowNumber;
            const nearRows = new Set(options.nearRowNumbers || []);

            let html = `<div class="original-file-scroll original-file-scroll-full"><table class="original-file-table"><thead><tr><th class="row-num">#</th>`;
            for (let c = 0; c < maxCols; c++) html += `<th>${String.fromCharCode(65 + c)}</th>`;
            html += `</tr></thead><tbody>`;

            visibleRows.forEach(row => {
                const rowNo = row._row || "";
                const isHit = hitRowNumber && Number(rowNo) === Number(hitRowNumber);
                const isNear = nearRows.has(Number(rowNo));
                html += `<tr class="${isHit ? 'original-row-hit' : (isNear ? 'original-row-near' : '')}"><td class="row-num">${escapeHtml(rowNo)}</td>`;
                for (let c = 0; c < maxCols; c++) {
                    html += `<td>${escapeHtml(Array.from(row || [])[c] ?? "")}</td>`;
                }
                html += `</tr>`;
            });
            html += `</tbody></table></div>`;
            return html;
        }

        function buildExcelWholeExamSnapshotHtml(row, cardData = null) {
            const rows = getRowsForSameSource(row);
            const hitRowNumber = Number(row?._row || 0);
            const contextRowNumber = Number(cardData?.contextRowNumber || cardData?.campusRowNumber || cardData?.roomRowNumber || hitRowNumber || 0);
            if (!rows.length || !hitRowNumber) return '';

            const realExcelHtml = buildRealExcelRangeHtml(row, cardData);
            if (realExcelHtml) return realExcelHtml;

            let startRowNumber = contextRowNumber ? Math.max(1, Math.min(contextRowNumber, hitRowNumber) - 4) : Math.max(1, hitRowNumber - 24);
            let endRowNumber = Math.max(hitRowNumber + 1, contextRowNumber ? contextRowNumber + 2 : hitRowNumber + 1);
            if (endRowNumber - startRowNumber > 80) endRowNumber = startRowNumber + 80;

            const sectionRows = rows.filter(r => {
                const no = Number(r?._row || 0);
                return no >= startRowNumber && no <= endRowNumber;
            });
            if (!sectionRows.length) return '';

            const nearRowNumbers = sectionRows.map(r => Number(r._row)).filter(Boolean);
            return buildRowsTableHtmlFull(sectionRows, { hitRow: row, nearRowNumbers, maxCols: 18 });
        }

        function buildExcelEvidenceHtml(row, cardData = null) {
            // Chỉ giữ ảnh Excel gốc/khung gốc, bỏ các bảng phụ dựng lại từ text.
            return buildExcelWholeExamSnapshotHtml(row, cardData);
        }

        function getPdfPageFromRow(row) {
            if (!row) return 1;
            if (row._page) return Number(row._page) || 1;
            const m = String(row._sheet || '').match(/(\d+)/);
            return m ? Number(m[1]) : 1;
        }

        function buildPdfPreviewHtml(pageNumber = 1, compact = false, hitRow = null) {
            const hitAttrs = hitRow
                ? ` data-hit-y="${escapeHtml(hitRow._pdfY || '')}" data-hit-height="${escapeHtml(hitRow._pdfHeight || '')}" data-hit-row="${escapeHtml(hitRow._row || '')}"`
                : '';
            return `<div class="pdf-preview-box"><canvas class="pdf-source-canvas" data-page="${escapeHtml(pageNumber)}" data-compact="${compact ? '1' : '0'}"${hitAttrs}></canvas></div>`;
        }

        function buildPdfEvidenceLinesHtml(row) {
            const rows = getRowsForSameSource(row);
            const idx = rows.findIndex(r => r === row || Number(r._row) === Number(row._row));
            const start = Math.max(0, idx - 8);
            const end = Math.min(rows.length, idx + 10);
            const sliced = rows.slice(start, end);
            const nearRowNumbers = sliced.map(r => Number(r._row)).filter(Boolean);
            return buildRowsTableHtml(sliced, { hitRow: row, nearRowNumbers, maxCols: 8 });
        }

        function buildOriginalPanelHtml({ title, note, bodyHtml, compact = false, extraClass = "" }) {
            return `
                <div class="original-file-panel ${compact ? 'compact' : ''} ${extraClass}">
                    <div class="original-file-head">
                        <div class="original-file-title">${title}</div>
                        <div class="original-file-actions">
                            ${extraClass.includes('source-evidence-panel') ? '<button type="button" class="btn-open-proof-modal" onclick="openProofModalFromPanel(this)">⚠️ Xem thông báo</button>' : ''}
                            <button type="button" class="btn-mini-capture" onclick="copyOriginalPreviewImage(this)">📸 Copy ảnh này</button>
                        </div>
                    </div>
                    ${note ? `<div class="original-file-note">${note}</div>` : ``}
                    ${bodyHtml}
                </div>
            `;
        }

        function getSidebarResultSlot() {
            return document.getElementById('sidebarResultSlot');
        }

        function clearSidebarResultSlot() {
            const slot = getSidebarResultSlot();
            if (slot) slot.innerHTML = '';
        }

        function subjectLooksValid(subject) {
            const s = String(subject || '').trim();
            const n = cleanExamText(s);
            if (!s || s.length < 3) return false;
            if (n === 'HOC' || n === 'MON HOC') return false;
            if (n.includes('LOP MON HOC') || n.includes('LOP HOC PHAN') || n.includes('LOP SINH HOAT')) return false;
            if (n.includes('STT') || n.includes('MSV') || n.includes('HO VA') || n.includes('KY TEN') || n.includes('SO TO')) return false;
            return true;
        }

        function findSubjectInRows(rows) {
            let best = "";
            let bestScore = -1;

            (rows || []).forEach((row, idx) => {
                const text = rowText(row);
                if (!text) return;

                const subject = extractSubjectFromText(text);
                if (!subjectLooksValid(subject)) return;

                const norm = cleanExamText(text);
                let score = 10;

                // Dòng chuẩn trong Excel thường có: "MÔN: ... MÃ MÔN: ..."
                if (/(^|[\s;|,.\-–—])(?:môn|mon)\s*[:：]/i.test(text)) score += 80;
                if (norm.includes('MA MON')) score += 40;
                if (norm.includes('DANH SACH SINH VIEN') || norm.includes('KHOI LOP')) score += 10;

                // Dòng càng gần đầu khối càng đáng tin hơn.
                score += Math.max(0, 30 - idx);

                if (score > bestScore) {
                    bestScore = score;
                    best = subject;
                }
            });

            return best;
        }

        function updateOpenedSubjectCache() {
            openedFileSubject = "";
            sourceSubjectBySheet = {};

            if (sourceFileKind === "excel" && sourceRowsBySheet) {
                Object.keys(sourceRowsBySheet).forEach(sheetName => {
                    const subject = findSubjectInRows(sourceRowsBySheet[sheetName] || []);
                    if (subject) {
                        sourceSubjectBySheet[sheetName] = subject;
                        if (!openedFileSubject) openedFileSubject = subject;
                    }
                });
                return;
            }

            // PDF fallback: nhóm theo trang/sheet đã parse được.
            const groups = {};
            (db || []).forEach(row => {
                const key = row?._sheet || "default";
                if (!groups[key]) groups[key] = [];
                groups[key].push(row);
            });

            Object.keys(groups).forEach(key => {
                const subject = findSubjectInRows(groups[key] || []);
                if (subject) {
                    sourceSubjectBySheet[key] = subject;
                    if (!openedFileSubject) openedFileSubject = subject;
                }
            });
        }

        function getOpenedSubjectForRow(row) {
            if (!row) return openedFileSubject || "";
            return sourceSubjectBySheet[row._sheet] || openedFileSubject || "";
        }

        function renderOriginalFileOverview() {
            const area = document.getElementById('resultArea');
            clearSidebarResultSlot();
            if (!area) return;

            const title = sourceFileKind === 'pdf'
                ? '📄 ẢNH FILE GỐC VỪA MỞ'
                : '📊 BẢNG GỐC VỪA MỞ';
            const note = 'Mình cho hiện file gốc ngay trên web để bạn đối chiếu trực tiếp. Khi nhập MSSV/Họ tên, dòng tìm thấy sẽ được tô xanh bên dưới từng thẻ.';
            const bodyHtml = sourceFileKind === 'pdf'
                ? buildPdfPreviewHtml(1, false)
                : buildExcelOverviewHtml();

            area.innerHTML = `
                <div id="welcomeArea" style="width:100%; min-width:260px; text-align:center; color:#166534; margin-top:30px; font-weight:900; line-height:1.5;">
                    <b>✅ Đã mở file.</b><br><span style="font-size:14px; color:#374151;">Nhập MSSV / Họ tên để check, hoặc xem ảnh/bảng gốc bên cạnh.</span>
                </div>
                ${buildOriginalPanelHtml({ title, note, bodyHtml })}
            `;
            if (sourceFileKind === 'pdf') renderPendingPdfCanvases(area);
        }

        function buildSourceEvidencePanel(row, cardData = null) {
            if (!row) return '';
            const title = sourceFileKind === 'pdf'
                ? `📌 ẢNH GỐC TRANG ${getPdfPageFromRow(row)}`
                : `🖼️ ẢNH EXCEL GỐC CÓ TÊN BẠN`;
            const note = sourceFileKind === 'pdf'
                ? 'Dòng khớp được tô xanh để kiểm tra lại phòng/cơ sở.'
                : '';
            const bodyHtml = sourceFileKind === 'pdf'
                ? buildPdfPreviewHtml(getPdfPageFromRow(row), true, row) + buildPdfEvidenceLinesHtml(row)
                : buildExcelEvidenceHtml(row, cardData);
            return buildOriginalPanelHtml({ title, note, bodyHtml, compact: true, extraClass: 'source-evidence-panel' });
        }


        function buildProofWarningHtml(cardData = null) {
            const campus = escapeHtml(cardData?.coso || 'Chưa xác định');
            const room = escapeHtml(cardData?.phong || '---');
            const time = escapeHtml(cardData?.gio || '---');
            const msv = escapeHtml(cardData?.msv || '---');
            const sourceLabel = sourceFileKind === 'pdf' ? 'PDF gốc' : 'Excel gốc';
            const markLabel = sourceFileKind === 'pdf'
                ? 'Trong PDF, tool tô xanh dòng text khớp và render đúng trang PDF để bạn dò lại bằng mắt.'
                : 'Dòng thông tin/phòng trong Excel được tô vàng, dòng tên/MSSV được tô xanh.';
            return `
                <div class="excel-proof-warning">
                    ⚠️ <b>THÔNG BÁO KIỂM TRA FILE GỐC</b><br>
                    Tool chỉ dò nhanh. Bạn phải tự nhìn lại <b>${sourceLabel}</b> để kiểm tra đúng <b>thời gian / phòng / cơ sở</b>.<br>
                    ${markLabel} Nếu thẻ kết quả khác file gốc thì <b>tin file gốc</b>.
                    <div class="proof-keyline">
                        <div class="proof-keyitem is-msv">
                            <span class="proof-keyicon">🆔</span>
                            <span class="proof-keytext">
                                <span class="proof-keylabel">MSSV</span>
                                <span class="proof-keyvalue">${msv}</span>
                            </span>
                        </div>
                        <div class="proof-keyitem is-time">
                            <span class="proof-keyicon">⏰</span>
                            <span class="proof-keytext">
                                <span class="proof-keylabel">Giờ thi</span>
                                <span class="proof-keyvalue">${time}</span>
                            </span>
                        </div>
                        <div class="proof-keyitem is-room">
                            <span class="proof-keyicon">🚪</span>
                            <span class="proof-keytext">
                                <span class="proof-keylabel">Phòng</span>
                                <span class="proof-keyvalue">${room}</span>
                            </span>
                        </div>
                        <div class="proof-keyitem is-campus">
                            <span class="proof-keyicon">📍</span>
                            <span class="proof-keytext">
                                <span class="proof-keylabel">Cơ sở đang đọc</span>
                                <span class="proof-keyvalue">${campus}</span>
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }

        function closeExamProofModal() {
            const modal = document.getElementById('examProofModal');
            if (modal) modal.remove();
        }

        function showExamProofModal(row, cardData = null, force = false) {
            if (!row) return;

            const key = `${sourceFileKind}_${cardData?.msv || ''}_${cardData?.ngay || ''}_${cardData?.gio || ''}_${cardData?.phong || ''}_${row?._row || ''}`;
            if (!force && autoProofModalShownKey === key) return;
            if (!force) autoProofModalShownKey = key;

            const bodyHtml = sourceFileKind === 'pdf'
                ? buildPdfPreviewHtml(getPdfPageFromRow(row), false, row) + buildPdfEvidenceLinesHtml(row)
                : buildExcelEvidenceHtml(row, cardData);
            if (!bodyHtml) return;

            closeExamProofModal();

            const modal = document.createElement('div');
            modal.id = 'examProofModal';
            modal.className = 'exam-proof-modal';
            const headTitle = sourceFileKind === 'pdf'
                ? '⚠️ KIỂM TRA LẠI PDF GỐC TRƯỚC KHI TIN KẾT QUẢ'
                : '⚠️ KIỂM TRA LẠI ẢNH EXCEL GỐC TRƯỚC KHI TIN KẾT QUẢ';
            modal.innerHTML = `
                <div class="exam-proof-modal-content" role="dialog" aria-modal="true">
                    <div class="exam-proof-modal-head">
                        <div>${headTitle}</div>
                        <button type="button" class="exam-proof-modal-close" onclick="closeExamProofModal()">Đóng</button>
                    </div>
                    <div class="exam-proof-modal-body">
                        ${buildProofWarningHtml(cardData)}
                        ${bodyHtml}
                    </div>
                </div>
            `;
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeExamProofModal();
            });
            document.body.appendChild(modal);
            if (sourceFileKind === 'pdf') renderPendingPdfCanvases(modal);
        }

        function openProofModalFromPanel(btn) {
            const panel = btn.closest('.original-file-panel');
            if (!panel) return;

            closeExamProofModal();

            const body = panel.querySelector('.original-file-scroll');
            const pdfBox = panel.querySelector('.pdf-preview-box');
            const localCard = panel.closest('.evidence-only-wrap')?.previousElementSibling?.querySelector?.('.card') || document.querySelector('.sidebar-card-wrap .card');
            const card = panel.closest('.card-container')?.querySelector('.card') || localCard;
            const cardData = card ? {
                msv: card.getAttribute('data-msv') || '---',
                phong: (card.querySelector('.room-big')?.textContent || '').replace(/^.*?Phòng:\s*/i, '').trim() || '---',
                coso: (card.querySelector('.coso-text')?.textContent || '').trim() || 'Chưa xác định'
            } : null;

            const modal = document.createElement('div');
            modal.id = 'examProofModal';
            modal.className = 'exam-proof-modal';
            const headTitle = sourceFileKind === 'pdf'
                ? '⚠️ KIỂM TRA LẠI PDF GỐC TRƯỚC KHI TIN KẾT QUẢ'
                : '⚠️ KIỂM TRA LẠI ẢNH EXCEL GỐC TRƯỚC KHI TIN KẾT QUẢ';
            const clonedPdf = pdfBox ? pdfBox.outerHTML.replace(/data-rendered="1"/g, '') : '';
            modal.innerHTML = `
                <div class="exam-proof-modal-content" role="dialog" aria-modal="true">
                    <div class="exam-proof-modal-head">
                        <div>${headTitle}</div>
                        <button type="button" class="exam-proof-modal-close" onclick="closeExamProofModal()">Đóng</button>
                    </div>
                    <div class="exam-proof-modal-body">
                        ${buildProofWarningHtml(cardData)}
                        ${clonedPdf}
                        ${body ? body.outerHTML : ''}
                    </div>
                </div>
            `;
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeExamProofModal();
            });
            document.body.appendChild(modal);
            if (sourceFileKind === 'pdf') renderPendingPdfCanvases(modal);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeExamProofModal();
        });

        async function renderPendingPdfCanvases(root = document) {
            if (!sourcePdfDoc) return;
            const canvases = Array.from(root.querySelectorAll('canvas.pdf-source-canvas:not([data-rendered="1"])'));
            for (const canvas of canvases) {
                canvas.dataset.rendered = "1";
                const pageNo = Number(canvas.dataset.page || 1) || 1;
                try {
                    const page = await sourcePdfDoc.getPage(pageNo);
                    const compact = canvas.dataset.compact === '1';
                    const scale = compact ? 1.05 : 1.25;
                    const viewport = page.getViewport({ scale });
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const ctx = canvas.getContext('2d');
                    await page.render({ canvasContext: ctx, viewport }).promise;

                    const hitY = Number(canvas.dataset.hitY || 0);
                    if (hitY) {
                        const hitHeight = Number(canvas.dataset.hitHeight || 10) || 10;
                        const yOnCanvas = viewport.height - (hitY * scale);
                        const h = Math.max(14, hitHeight * scale + 8);
                        ctx.save();
                        ctx.fillStyle = 'rgba(34, 197, 94, 0.24)';
                        ctx.strokeStyle = 'rgba(22, 163, 74, 0.95)';
                        ctx.lineWidth = Math.max(2, 2 * scale);
                        ctx.fillRect(0, yOnCanvas - h, viewport.width, h + 6);
                        ctx.strokeRect(1, yOnCanvas - h, viewport.width - 2, h + 6);
                        ctx.restore();
                    }
                } catch (e) {
                    const box = canvas.closest('.pdf-preview-box');
                    if (box) box.innerHTML = `<div class="original-file-empty">Không render được ảnh PDF trang ${escapeHtml(pageNo)}.</div>`;
                }
            }
        }

        async function copyOriginalPreviewImage(btn) {
            const panel = btn.closest('.original-file-panel');
            if (!panel || !window.html2canvas) return;
            const actions = panel.querySelector('.original-file-actions');
            const oldText = btn.textContent;
            try {
                btn.textContent = 'ĐANG CHỤP...';
                if (actions) actions.style.visibility = 'hidden';
                await new Promise(resolve => requestAnimationFrame(resolve));
                const canvas = await html2canvas(panel, {
                    scale: 3,
                    backgroundColor: '#ffffff',
                    useCORS: true,
                    logging: false
                });
                canvas.toBlob(async blob => {
                    try {
                        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                        toast('📸 Đã copy ảnh file gốc');
                    } catch (e) {
                        const link = document.createElement('a');
                        link.download = 'anh-file-goc.png';
                        link.href = canvas.toDataURL('image/png', 1.0);
                        link.click();
                        toast('📥 Trình duyệt không cho copy, đã tải ảnh xuống');
                    }
                }, 'image/png', 1.0);
            } catch (e) {
                console.error(e);
                toast('❌ Lỗi chụp ảnh file gốc!');
            } finally {
                if (actions) actions.style.visibility = '';
                btn.textContent = oldText;
            }
        }

        function normalizeLookupText(value) {
            return String(value || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/[^a-z0-9]+/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
        }

        function normalizeDigitsOnly(value) {
            return String(value || '').replace(/\D+/g, '');
        }

        function isLikelyStudentIdDigits(digits) {
            const d = String(digits || '');
            // MSSV DTU trong các file này thường 10-11 số.
            // Không nhận 12+ số để tránh ghép nhầm STT + MSSV, ví dụ: "2 28204455009" -> "228204455009".
            return /^\d{10,11}$/.test(d);
        }

        function scoreStudentIdCandidate(digits) {
            const d = String(digits || '');
            if (!isLikelyStudentIdDigits(d)) return -999;
            let score = 100;
            if (/^(28|29|31|32|30|27|26|25|24|23|22|21)/.test(d)) score += 30;
            if (d.length === 10 || d.length === 11) score += 10;
            return score;
        }

        function extractStudentIdCandidates(value) {
            const raw = String(value || '').replace(/[\u00a0\t]+/g, ' ').replace(/\s+/g, ' ').trim();
            if (!raw) return [];
            const out = [];
            const push = (digits, scoreBonus = 0, source = '') => {
                const d = normalizeDigitsOnly(digits);
                const score = scoreStudentIdCandidate(d) + scoreBonus;
                if (score > 0) out.push({ digits: d, score, source });
            };

            // Ưu tiên các cụm số nguyên vẹn 10-11 chữ số.
            for (const m of raw.matchAll(/\b\d{10,11}\b/g)) push(m[0], 80, 'direct');

            // Có file Excel/PDF để MSSV bị chèn khoảng trắng trong cùng một cell: "312 12445256".
            // Nếu tổng số sau khi bỏ khoảng trắng là 10-11 thì vẫn nhận là MSSV.
            for (const m of raw.matchAll(/\b\d(?:[\d ]{8,15})\d\b/g)) {
                const compact = normalizeDigitsOnly(m[0]);
                if (isLikelyStudentIdDigits(compact)) push(compact, 70, 'spaced-msv');
            }

            // PDF hay render STT và MSSV chung một text item: "2 28204455009".
            // Tách STT ở đầu rồi lấy phần còn lại làm MSSV.
            for (const m of raw.matchAll(/(?:^|\D)(\d{1,3})\s+(\d[\d\s]{8,13})(?=\D|$)/g)) {
                const stt = normalizeDigitsOnly(m[1]);
                const rest = normalizeDigitsOnly(m[2]);
                if (Number(stt) >= 1 && Number(stt) <= 300 && isLikelyStudentIdDigits(rest)) {
                    push(rest, 120, 'stt+msv');
                }
            }

            // Trường hợp hiếm: OCR/PDF đã dính STT vào MSSV thành 12-14 số.
            // Cắt thử 1-3 số đầu nếu phần sau đúng dạng MSSV và có prefix hợp lý.
            for (const m of raw.matchAll(/\b\d{12,14}\b/g)) {
                const d = m[0];
                for (let cut = 1; cut <= 3; cut++) {
                    const maybeStt = d.slice(0, cut);
                    const rest = d.slice(cut);
                    if (Number(maybeStt) >= 1 && Number(maybeStt) <= 300 && isLikelyStudentIdDigits(rest)) {
                        push(rest, 40 - cut, 'joined-stt+msv');
                    }
                }
            }

            // Khử trùng, chọn điểm cao nhất.
            const best = new Map();
            for (const c of out) {
                if (!best.has(c.digits) || best.get(c.digits).score < c.score) best.set(c.digits, c);
            }
            return Array.from(best.values()).sort((a, b) => b.score - a.score);
        }

        function getRowMsv(row) {
            const cells = Array.from(row || []);
            let best = null;
            for (const c of cells) {
                const candidates = extractStudentIdCandidates(c);
                if (candidates.length) {
                    const top = { ...candidates[0], score: candidates[0].score + 30 };
                    if (!best || top.score > best.score) best = top;
                }
            }
            if (best) return best.digits;

            const text = rowSearchText(row);
            const candidates = extractStudentIdCandidates(text);
            return candidates.length ? candidates[0].digits : '';
        }

        function getRowNameAfterMsv(row) {
            if (sourceFileKind === 'pdf') {
                const parsed = splitPdfStudentRow(row);
                if (parsed.name) return parsed.name;
            }
            const arr = Array.from(row || []);
            const msv = getRowMsv(arr);
            if (!msv) return '';
            const mi = arr.findIndex(c => normalizeDigitsOnly(c) === msv || normalizeDigitsOnly(c).includes(msv));
            if (mi < 0) return '';
            const parts = [];
            for (let i = mi + 1; i < Math.min(arr.length, mi + 7); i++) {
                const cell = String(arr[i] ?? '').trim();
                if (!cell) continue;
                const norm = normalizeLookupText(cell);
                if (!norm) continue;
                if (/^\d+$/.test(norm)) break;
                if (isCourseOrClassCell(cell)) break;
                if (/^(lop|stt|so|to|ky|ten|diem|ghi|chu|no|hp)$/i.test(norm)) break;
                parts.push(cell);
                if (parts.length >= 4) break;
            }
            return parts.join(' ').replace(/\s+/g, ' ').trim();
        }

        function scoreSearchText(searchText, rawTerm) {
            const termRaw = String(rawTerm || '').trim();
            const termNorm = normalizeLookupText(termRaw);
            if (!termNorm) return 0;

            const textRaw = String(searchText || '');
            const textNorm = normalizeLookupText(textRaw);
            const textCompact = normalizeNoSpaceText(textRaw);
            if (!textNorm && !textCompact) return 0;

            const queryDigits = normalizeDigitsOnly(termRaw);
            if (queryDigits.length >= 8) {
                return textRaw.replace(/\D+/g, '').includes(queryDigits) ? 820 : 0;
            }

            const tokens = termNorm.split(' ').filter(Boolean);
            if (tokens.length < 2) return 0;

            const termCompact = normalizeNoSpaceText(termRaw);
            if (termCompact && textCompact.includes(termCompact)) return 760 + tokens.length;

            const words = textNorm.split(' ').filter(Boolean);
            if (tokens.every(t => words.includes(t) || textCompact.includes(t))) return 430 + tokens.length;

            return 0;
        }

        function getBestPdfStudentRowAround(row, preferredTerm = '') {
            if (sourceFileKind !== 'pdf' || !row) return row;
            const nearbyRows = getPdfNearbyRows(row, 6, 13.5);
            let bestRow = row;
            let bestScore = -Infinity;

            nearbyRows.forEach(r => {
                if (!r) return;
                let score = 0;
                const msv = getRowMsv(r);
                const name = getRowNameAfterMsv(r);
                if (msv) score += 120;
                if (name) score += 45;
                if (preferredTerm) score += scoreSearchText(getPdfCombinedSearchText(r), preferredTerm);
                score -= Math.abs(Number(r._pdfY || 0) - Number(row._pdfY || 0)) * 0.6;
                if (score > bestScore) {
                    bestScore = score;
                    bestRow = r;
                }
            });

            return bestRow || row;
        }

        function findPdfFallbackMatches(terms) {
            if (sourceFileKind !== 'pdf') return [];
            const out = [];
            const seen = new Set();

            db.forEach(row => {
                if (!row) return;
                const nearbyRows = getPdfNearbyRows(row, 6, 13.5);
                const combinedText = nearbyRows.map(r => rowSearchText(r)).filter(Boolean).join(' ');
                if (!combinedText) return;

                let totalScore = 0;
                let matchedCount = 0;
                terms.forEach(term => {
                    const s = scoreSearchText(combinedText, term);
                    if (s > 0) {
                        totalScore += s;
                        matchedCount += 1;
                    }
                });
                if (!matchedCount) return;

                const anchorRow = getBestPdfStudentRowAround(row, terms[0] || '');
                const key = `${anchorRow._page || 0}_${Math.round(Number(anchorRow._pdfY || 0))}_${getRowMsv(anchorRow) || normalizeNoSpaceText(combinedText).slice(0, 40)}`;
                if (seen.has(key)) return;
                seen.add(key);
                out.push({ row: anchorRow, term: terms[0] || '', score: totalScore + (getRowMsv(anchorRow) ? 140 : 35) });
            });

            out.sort((a, b) => b.score - a.score || Number(a.row._page || 0) - Number(b.row._page || 0) || Number(a.row._row || 0) - Number(b.row._row || 0));
            return out.slice(0, 20);
        }

        function scoreRowForSearch(row, rawTerm) {
            const termRaw = String(rawTerm || '').trim();
            const termNorm = normalizeLookupText(termRaw);
            if (!termNorm) return 0;

            const queryDigits = normalizeDigitsOnly(termRaw);
            const rowMsv = getRowMsv(row);
            if (queryDigits.length >= 8) {
                if (rowMsv === queryDigits) return 1000;
                if (sourceFileKind === 'pdf' && getPdfCombinedSearchText(row).replace(/\D+/g, '').includes(queryDigits)) return 820;
                return 0;
            }

            const tokens = termNorm.split(' ').filter(Boolean);
            if (tokens.length < 2) return 0;

            const nameRaw = getRowNameAfterMsv(row);
            const searchTextForScore = sourceFileKind === 'pdf' ? getPdfCombinedSearchText(row) : rowSearchText(row);
            const rowNameNorm = normalizeLookupText(nameRaw);
            const rowNameCompact = normalizeNoSpaceText(nameRaw);
            const termCompact = normalizeNoSpaceText(termRaw);
            if (!rowNameNorm && !searchTextForScore) return 0;

            if (rowNameNorm && rowNameNorm.includes(termNorm)) return 950 + tokens.length;
            if (rowNameCompact && termCompact && rowNameCompact.includes(termCompact)) return 940 + tokens.length;

            const nameWords = rowNameNorm.split(' ').filter(Boolean);
            if (rowNameNorm && tokens.every(t => nameWords.includes(t))) return 720 + tokens.length;

            return scoreSearchText(searchTextForScore, termRaw);
        }


        function selectCandidateMsv(msv) {
            const input = document.getElementById('mssvIn');
            if (!input) return;
            input.value = String(msv || '').trim();
            input.dispatchEvent(new Event('input', { bubbles: true }));
            try { input.focus(); } catch (e) {}
        }

        function buildDuplicateNameCandidatesHtml(matches, rawVal) {
            const seen = new Set();
            const candidates = [];
            matches.forEach(item => {
                const d = getCardData(item.row);
                if (!d || !d.msv || d.msv === '---' || seen.has(d.msv)) return;
                seen.add(d.msv);
                candidates.push({ d, rowNo: Number(item.row?._row || 0) });
            });

            const list = candidates.slice(0, 12).map(({ d, rowNo }) => `
                <button type="button" onclick="selectCandidateMsv('${escapeHtml(d.msv)}')" style="width:100%;text-align:left;margin-top:8px;padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:#111827;color:#fff;cursor:pointer;">
                    <b>${escapeHtml(d.msv)}</b> — ${escapeHtml(d.name || '---')}<br>
                    <span style="font-size:12px;color:#cbd5e1;">${escapeHtml(d.ngay)} ${escapeHtml(d.gio)} · Phòng ${escapeHtml(d.phong)} · STT ${escapeHtml(d.stt)} · dòng ${escapeHtml(rowNo)}</span>
                </button>
            `).join('');

            return `<b>⚠️ Có nhiều sinh viên khớp tên:</b> ${escapeHtml(rawVal)}<br>
                <span style="font-size:13px;color:#ffb4b4">Tên này bị trùng. Bấm đúng <b>MSSV</b> bên dưới để check chính xác, hoặc nhập MSSV trực tiếp.</span>
                <div style="margin-top:8px;">${list || '<span style="font-size:13px;color:#777">Không dựng được danh sách ứng viên.</span>'}</div>`;
        }


        function buildManualFallbackCardData(rawVal = '') {
            const raw = String(rawVal || '').replace(/\s+/g, ' ').trim();
            const candidateMsv = extractStudentIdCandidates(raw)[0]?.digits || '';
            const digits = candidateMsv || normalizeDigitsOnly(raw);
            const nameGuess = raw.replace(/(?:^|\D)\d{1,3}\s+\d[\d\s]{8,13}(?=\D|$)/g, ' ')
                .replace(/\b\d{10,14}\b/g, ' ')
                .replace(/[,;|]+/g, ' ').replace(/\s+/g, ' ').trim();
            const d = {
                ngay: '---',
                gio: '---',
                phong: '---',
                coso: 'Chưa xác định',
                msv: isLikelyStudentIdDigits(digits) ? digits : '---',
                stt: '---',
                name: nameGuess || raw || 'Nhập tay',
                lop: '---',
                lopHocPhan: '---',
                mon: openedFileSubject || 'CHƯA XÁC ĐỊNH',
                source: sourceFileKind === 'pdf' ? 'PDF gốc - nhập tay' : 'File gốc - nhập tay',
                note: '',
                manualFallback: true,
                manualLookupKey: raw || nameGuess || digits || 'manual'
            };

            // Vẫn cố lấy thông tin chung của ca thi từ những dòng text đọc được.
            // Nếu PDF là ảnh scan hoàn toàn thì các ô này để trống cho người dùng nhập tay.
            for (let i = 0; i < db.length; i++) {
                const row = db[i];
                const text = rowText(row);

                if (d.ngay === '---') {
                    const foundDate = extractExamDateFromText(text);
                    if (foundDate) d.ngay = foundDate;
                }

                if (d.gio === '---') {
                    const foundTime = extractExamTimeFromText(text);
                    if (foundTime) d.gio = foundTime;
                }

                if (d.mon === 'CHƯA XÁC ĐỊNH') {
                    const foundSubject = extractSubjectFromText(text);
                    if (foundSubject) d.mon = foundSubject;
                }

                if (d.phong === '---' && (isStrongExamInfoRow(row) || cleanExamText(text).includes('PHONG'))) {
                    const foundRoom = extractExamRoomFromRow(row) || extractExamRoomFromText(text);
                    if (foundRoom) d.phong = foundRoom;
                }

                if (d.coso === 'Chưa xác định') {
                    const campus = detectCampusFromRow(row);
                    if (campus?.value) d.coso = campus.value;
                }

                if (d.ngay !== '---' && d.gio !== '---' && d.phong !== '---' && d.coso !== 'Chưa xác định' && d.mon !== 'CHƯA XÁC ĐỊNH') {
                    break;
                }
            }

            applyManualExamInfo(d);
            return d;
        }

        function renderManualFallbackCard(rawVal) {
            const d = buildManualFallbackCardData(rawVal);
            renderCard(d, 'DÒ TAY', null);
            const slot = getSidebarResultSlot();
            const wrap = slot?.querySelector?.('.sidebar-card-wrap:last-child');
            if (wrap) {
                wrap.classList.add('manual-fallback-result');
                const hint = wrap.querySelector('.manual-save-hint');
                if (hint) {
                    hint.textContent = 'Không quét được sinh viên trong file. Bạn dò PDF/Excel gốc bên phải, nhập phòng/cơ sở rồi bấm Lưu.';
                }
            }
        }

        document.getElementById('mssvIn').oninput = (e) => {
            e.target.classList.remove('ready-attention');
            const bubble = document.getElementById('mssvHintBubble');
            if (bubble) bubble.classList.remove('show');
            const areaGuide = document.getElementById('resultArea');
            if (areaGuide) areaGuide.classList.remove('ready-guide');
            const rawVal = e.target.value.trim();
            const area = document.getElementById('resultArea');
            const batchBtn = document.getElementById('btnSaveBatch');
            clearSidebarResultSlot();
            area.innerHTML = "";
            if (rawVal.length < 3) { renderOriginalFileOverview(); batchBtn.style.display = "none"; return; }

            const terms = rawVal.split(/[\n,]+/).map(t => t.trim()).filter(t => t.length >= 3);
            const matches = [];

            db.forEach(row => {
                terms.forEach(term => {
                    const score = scoreRowForSearch(row, term);
                    if (score > 0) matches.push({ row, term, score });
                });
            });

            if (!matches.length && sourceFileKind === 'pdf') {
                const pdfFallbackMatches = findPdfFallbackMatches(terms);
                pdfFallbackMatches.forEach(item => matches.push(item));
            }

            matches.sort((a, b) => b.score - a.score || Number(a.row._page || 0) - Number(b.row._page || 0) || Number(a.row._row || 0) - Number(b.row._row || 0));

            const queryIsMssv = terms.some(t => normalizeDigitsOnly(t).length >= 8);
            const uniqueMsv = new Set();
            matches.forEach(item => {
                const msv = getRowMsv(item.row);
                if (msv) uniqueMsv.add(msv);
            });

            // Chống tô nhầm khi share cho nhiều người:
            // Nếu tìm bằng tên mà trong file có nhiều người khớp, hiện danh sách MSSV để chọn thay vì đứng màn hình trống.
            if (!queryIsMssv && uniqueMsv.size > 1) {
                area.innerHTML = buildDuplicateNameCandidatesHtml(matches, rawVal);
                batchBtn.style.display = "none";
                return;
            }

            const results = new Set();
            matches.forEach(item => {
                let sourceRow = item.row;
                if (sourceFileKind === 'pdf') {
                    sourceRow = getBestPdfStudentRowAround(sourceRow, item.term || rawVal);
                }
                let d = getCardData(sourceRow);

                if (sourceFileKind === 'pdf' && (d.msv === "---" || d.name === "---" || !d.name)) {
                    const nearbyStudentRow = getBestPdfStudentRowAround(item.row, item.term || rawVal);
                    if (nearbyStudentRow) {
                        sourceRow = nearbyStudentRow;
                        d = getCardData(sourceRow);
                    }
                }

                if ((d.name === "---" || !d.name) && item.term && normalizeDigitsOnly(item.term).length < 8) {
                    d.name = item.term;
                }

                const identityKey = d.msv !== "---"
                    ? d.msv
                    : normalizeNoSpaceText(d.name || item.term || rawVal).slice(0, 80) || `row_${Number(sourceRow?._row || 0)}`;
                const key = `${identityKey}_${d.phong}_${d.ngay}_${d.mon}`;
                if (!results.has(key) && (d.msv !== "---" || (d.name && d.name !== "---"))) {
                    renderCard(d, sourceRow._row, sourceRow);
                    results.add(key);
                }
            });

            if (!results.size) {
                const oneWord = terms.some(t => normalizeDigitsOnly(t).length < 8 && normalizeLookupText(t).split(' ').length < 2);
                const pdfHint = sourceFileKind === 'pdf'
                    ? `<br><span style="font-size:13px;color:#ffb4b4">PDF có thể bị tách chữ hoặc là ảnh scan. Bản này vẫn giữ ảnh PDF gốc bên dưới để bạn dò tay.</span>`
                    : `<br><span style="font-size:13px;color:#ffb4b4">Nếu Excel/PDF không tự bắt được, hãy dò trong bảng gốc bên dưới.</span>`;
                const fallbackTitle = sourceFileKind === 'pdf' ? '📄 FILE PDF GỐC ĐỂ DÒ TAY' : '📊 FILE EXCEL GỐC ĐỂ DÒ TAY';
                const fallbackBody = sourceFileKind === 'pdf' ? buildPdfPreviewHtml(1, false) : buildExcelOverviewHtml();
                const fallbackPanel = buildOriginalPanelHtml({
                    title: fallbackTitle,
                    note: 'Không tìm thấy tự động nhưng file gốc vẫn hiện ở đây để kiểm tra phòng/cơ sở bằng mắt.',
                    bodyHtml: fallbackBody,
                    compact: true,
                    extraClass: 'source-evidence-panel'
                });
                const notFoundMessage = oneWord
                    ? `<b>Không tự check tên quá ngắn:</b> ${escapeHtml(rawVal)}<br><span style="font-size:13px;color:#777">Nhập <b>đủ họ tên</b> hoặc <b>MSSV</b> để tránh tô nhầm người khác.</span>${pdfHint}`
                    : `<b>Không tìm thấy tự động:</b> ${escapeHtml(rawVal)}<br><span style="font-size:13px;color:#777">Có thể PDF là ảnh scan hoặc text bị tách. Mình vẫn dựng <b>thẻ nhập tay</b> bên trái, bạn dò file gốc bên dưới rồi lưu phòng/cơ sở.</span>${pdfHint}`;
                area.innerHTML = `<div class="not-found-with-source">${notFoundMessage}</div>${fallbackPanel}`;
                renderManualFallbackCard(rawVal);
                if (sourceFileKind === 'pdf') renderPendingPdfCanvases(area);
            }
            batchBtn.style.display = results.size >= 2 ? "block" : "none";
        };

        function cleanExamText(value) {
            return String(value || '')
                .toUpperCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/Đ/g, 'D')
                .replace(/đ/g, 'd')
                .replace(/\s+/g, ' ')
                .trim();
        }

        function cleanCampusValue(value) {
            let raw = String(value || '')
                .replace(/\s+/g, ' ')
                .replace(/^[-–—:;,.\s]+/, '')
                .replace(/\b(lần\s*thi|lan\s*thi|stt|msv|họ\s*và|ho\s*va|ghi\s*chú|ghi\s*chu)\b.*$/i, '')
                .trim();
            raw = raw.replace(/^cơ\s*sở\s*[:：-]?\s*/i, '').trim();
            return raw;
        }



        function extractBuildingNameFromText(text) {
            const raw = String(text || '').replace(/\s+/g, ' ').trim();
            if (!raw) return '';

            const plain = cleanExamText(raw);
            const stopTokens = new Set(['CO', 'SO', 'THI', 'MON', 'HOC', 'KY', 'LOP', 'NGAY', 'GIO', 'PHONG', 'MSV', 'STT']);
            const validCode = (code) => {
                const c = String(code || '').replace(/[^A-Z0-9À-Ỹ]/gi, '').toUpperCase();
                if (!c || stopTokens.has(c)) return '';
                // Chặn bắt nhầm số phòng 3-4 chữ số thành tên tòa. VD: Phòng 405 không phải Tòa Nhà 405.
                if (/^\d{3,4}$/.test(c)) return '';
                return c;
            };

            // Nhận nhiều dạng khác nhau: "Tòa Nhà F (405)", "Toà F", "Toa nha F", "Nhà F", "Khối F", "Dãy F", "Block F".
            const patterns = [
                { re: /\bTOA\s*(?:NHA\s*)?([A-Z0-9]{1,4})\b/i, prefix: 'Tòa Nhà' },
                { re: /\bNHA\s*([A-Z0-9]{1,4})\b/i, prefix: 'Tòa Nhà' },
                { re: /\bKHOI\s*([A-Z0-9]{1,4})\b/i, prefix: 'Khối' },
                { re: /\bDAY\s*([A-Z0-9]{1,4})\b/i, prefix: 'Dãy' },
                { re: /\bBLOCK\s*([A-Z0-9]{1,4})\b/i, prefix: 'Block' }
            ];

            for (const p of patterns) {
                const m = plain.match(p.re);
                const code = validCode(m?.[1]);
                if (code) return `${p.prefix} ${code}`;
            }
            return '';
        }

        function campusAllowsBuilding(campus) {
            // Chỉ cơ sở Hòa Khánh Nam có nhiều tòa A/B/C/D/E/F/G.
            // Các cơ sở 209 Phan Thanh, 254 Nguyễn Văn Linh, K7/25 Quang Trung không ghép tên tòa.
            const s = cleanExamText(campus);
            return s.includes('HOA KHANH') || s.includes('3.5HA');
        }

        function stripBuildingPhrase(value) {
            let raw = String(value || '').replace(/\s+/g, ' ').trim();
            if (!raw) return '';
            // Xóa phần tòa nếu lỡ bị dính vào tên cơ sở không phải Hòa Khánh Nam.
            // VD: "254 Nguyễn Văn Linh - Tòa Nhà F (405)" => "254 Nguyễn Văn Linh".
            return raw
                .replace(/\s*[-–—,;:]?\s*(?:tòa|toà|toa)\s*(?:nhà|nha)?\s*[A-ZÀ-Ỹ0-9]{1,4}(?:\s*\([^)]*\))?.*$/i, '')
                .replace(/\s*[-–—,;:]?\s*(?:nhà|nha|khối|khoi|dãy|day|block)\s*[A-ZÀ-Ỹ0-9]{1,4}(?:\s*\([^)]*\))?.*$/i, '')
                .replace(/\s*[-–—,;:,]+\s*$/g, '')
                .trim();
        }

        function mergeCampusWithBuilding(campus, sourceText) {
            const value = String(campus || '').replace(/\s+/g, ' ').trim();
            if (!value) return '';

            const source = `${sourceText || ''} ${value}`;
            const sourceNorm = cleanExamText(source);
            const building = extractBuildingNameFromText(source);

            // Cơ sở khác Hòa Khánh Nam thì tuyệt đối không hiện tòa.
            // Dù Excel/PDF có chữ "Tòa Nhà F (405)" trong cùng dòng phòng, thẻ vẫn chỉ hiện địa chỉ cơ sở.
            if (!campusAllowsBuilding(source)) {
                return stripBuildingPhrase(value);
            }

            // Hòa Khánh Nam: nếu có tòa thì chuẩn hóa về "Hòa Khánh Nam - Tòa Nhà X".
            // Tránh lỗi dạng "Tòa Nhà F (405) Hòa Khánh Nam" khi thứ tự ô trong Excel/PDF bị đảo.
            let baseCampus = stripBuildingPhrase(value) || value;
            if (sourceNorm.includes('HOA KHANH')) baseCampus = 'Hòa Khánh Nam';
            if (sourceNorm.includes('3.5HA') && !sourceNorm.includes('HOA KHANH')) baseCampus = '3.5ha Hòa Khánh Nam';

            if (building && !cleanExamText(baseCampus).includes(cleanExamText(building))) {
                return `${baseCampus} - ${building}`;
            }
            return baseCampus;
        }

        function campusFromKnownText(text) {
            const raw = String(text || '');
            const s = cleanExamText(raw);
            if (!s) return '';

            const withBuilding = (campus) => mergeCampusWithBuilding(campus, raw);

            // Chỉ nhận cơ sở khi trong file có chữ cơ sở/khuôn viên rõ ràng.
            // Không suy diễn từ số phòng như 504/1 nữa.
            if (s.includes('HOA KHANH')) return withBuilding('Hòa Khánh Nam');
            if (s.includes('3.5HA')) return withBuilding('3.5ha Hòa Khánh Nam');
            if (s.includes('254') && (s.includes('NGUYEN') || s.includes('VAN LINH'))) return withBuilding('254 Nguyễn Văn Linh');
            if (s.includes('NGUYEN VAN LINH')) return withBuilding('254 Nguyễn Văn Linh');
            if (s.includes('209') && s.includes('PHAN THANH')) return withBuilding('209 Phan Thanh');
            if (s.includes('PHAN THANH')) return withBuilding('209 Phan Thanh');
            if ((s.includes('K7/25') || s.includes('K7 25')) && s.includes('QUANG TRUNG')) return withBuilding('K7/25 Quang Trung');
            if (s.includes('QUANG TRUNG') && (s.includes('PHONG') || s.includes('THOI GIAN') || s.includes('CO SO'))) return withBuilding('K7/25 Quang Trung');
            return '';
        }

        function extractCampusFromRow(row) {
            const cells = Array.from(row || []).map(c => String(c ?? '').trim());
            const nonEmpty = cells.filter(Boolean);
            const joined = nonEmpty.join(' ');

            // Ưu tiên tuyệt đối: đọc đúng giá trị sau nhãn "cơ sở" trong cùng dòng/các ô kế bên.
            for (let i = 0; i < cells.length; i++) {
                const cell = cells[i];
                const norm = cleanExamText(cell);
                if (!norm.includes('CO SO')) continue;

                let after = cell.replace(/^.*?cơ\s*sở\s*[:：-]?\s*/i, '').trim();
                const parts = [];
                if (after && cleanExamText(after) !== 'CO SO') parts.push(after);

                for (let j = i + 1; j < Math.min(cells.length, i + 8); j++) {
                    const next = cells[j];
                    if (!next) continue;
                    const n = cleanExamText(next);
                    if (/^(LAN THI|SO TC|HOC KY|STT|MSV|HO VA|TEN|GHI CHU|DIEM|KY TEN)\b/.test(n)) break;
                    parts.push(next);
                    if (campusFromKnownText(parts.join(' '))) break;
                }

                const value = cleanCampusValue(parts.join(' '));
                if (value) return mergeCampusWithBuilding(value, joined);
            }

            // Trường hợp nhãn và giá trị nằm chung trong một chuỗi: "... cơ sở: Hòa Khánh Nam - Tòa nhà E".
            const explicit = joined.match(/cơ\s*sở\s*[:：-]?\s*(.+?)(?=\s+(?:lần\s*thi|lan\s*thi|stt|msv|ghi\s*chú|ghi\s*chu)\b|$)/i);
            if (explicit) {
                const value = cleanCampusValue(explicit[1]);
                if (value) return mergeCampusWithBuilding(value, joined);
            }

            return '';
        }

        function isExamInfoRowForCampus(row) {
            const cells = Array.from(row || []).map(c => String(c ?? '').trim()).filter(Boolean);
            const joined = cells.join(' ');
            const s = cleanExamText(joined);

            // Chỉ fallback lấy cơ sở từ dòng đang chứa thông tin lịch thi/phòng thi,
            // không lấy từ dòng tên sinh viên để tránh nhầm tên như "Quang Trung".
            return (
                s.includes('THOI GIAN') ||
                s.includes('NGAY') ||
                s.includes('PHONG') ||
                s.includes('LICH THI') ||
                /\b\d{1,2}H\d{2}\b/.test(s) ||
                /\b\d{1,2}\/\d{1,2}\/\d{4}\b/.test(s)
            );
        }

        function detectCampusFromRow(row) {
            const explicitCampus = extractCampusFromRow(row);
            if (explicitCampus) return { value: explicitCampus, explicit: true };

            // Fallback đàng hoàng: nếu cùng dòng lịch thi/phòng thi có ghi hẳn tên/địa chỉ cơ sở
            // như "254 Nguyễn Văn Linh", "Hòa Khánh Nam", "209 Phan Thanh", "K7/25 Quang Trung"
            // thì lấy. Không lấy từ dòng sinh viên.
            if (isExamInfoRowForCampus(row)) {
                const knownCampus = campusFromKnownText(Array.from(row || []).join(' '));
                if (knownCampus) return { value: knownCampus, explicit: true };
            }

            return null;
        }

        function inferCampusFromRoom(room) {
            // Không ép cơ sở theo số phòng nữa. Phòng 504/1 vẫn có thể thuộc cơ sở khác nếu file ghi vậy.
            return '';
        }


        function extractExamDateFromText(text) {
            const raw = String(text || '');
            const m = raw.match(/\b(\d{1,2})\s*[\/.\-]\s*(\d{1,2})\s*[\/.\-]\s*(\d{4})\b/);
            if (!m) return '';
            return `${m[1].padStart(2, '0')}/${m[2].padStart(2, '0')}/${m[3]}`;
        }

        function extractExamTimeFromText(text) {
            const raw = String(text || '');
            let m = raw.match(/\b(\d{1,2})\s*(?:h|H|:|giờ|gio)\s*(\d{2})\b/i);
            if (m) return `${m[1].padStart(2, '0')}H${m[2]}`;
            m = raw.match(/\b(\d{1,2})\s*(?:h|H|giờ|gio)\b/i);
            if (m) return `${m[1].padStart(2, '0')}H00`;
            return '';
        }

        function cleanExamRoomValue(value) {
            let raw = String(value || '').replace(/\s+/g, ' ').trim();
            if (!raw) return '';

            // Chặn các dữ liệu hay bị PDF kéo lẫn vào dòng phòng.
            raw = raw
                .replace(/\b\d{1,2}\s*[\/.\-]\s*\d{1,2}\s*[\/.\-]\s*\d{2,4}\b/g, ' ')
                .replace(/\b\d{1,2}\s*(?:h|H|:|giờ|gio)\s*\d{0,2}\b/g, ' ')
                .replace(/\b(?:thời\s*gian|thoi\s*gian|môn|mon|mã\s*môn|ma\s*mon|học\s*kỳ|hoc\s*ky|lần\s*thi|lan\s*thi)\b.*$/i, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            // Excel DTU nhiều file ghi phòng dạng: "Tòa Nhà F (405)" hoặc "Tòa Nhà F (405) - cơ sở...".
            // Bản cũ chỉ nhận số đứng đầu nên bị hiện Phòng: ---.
            const buildingRoom = raw.match(/\b(?:tòa|toa)\s*(?:nhà|nha)?\s*[A-ZÀ-Ỹ0-9]+\s*\(\s*([A-Z]?\d{2,4}(?:\s*[\/\-]\s*[A-Z0-9À-Ỹ]{1,4})?)\s*\)/i);
            if (buildingRoom && buildingRoom[1]) {
                const roomInParen = buildingRoom[1].replace(/\s*\/\s*/g, '/').replace(/\s*-\s*/g, '-').replace(/\s+/g, ' ').trim();
                if (roomInParen && normalizeDigitsOnly(roomInParen).length < 8) return roomInParen;
            }

            // Ưu tiên dạng phòng đứng ngay sau nhãn: 401, 208/3, 504/I, A401, 401A.
            const m = raw.match(/^([A-ZÀ-Ỹ]?\s*\d{2,4}(?:\s*[\/\-]\s*[A-Z0-9À-Ỹ]{1,4})?|\d{2,4}\s*[A-ZÀ-Ỹ]?)\b/i);
            if (!m || !m[1]) return '';

            let room = m[1]
                .replace(/\s*[-–—]\s*(?:cơ\s*sở|co\s*so|254|209|K7|Hòa|Hoa|Nguyễn|Nguyen|Phan|Quang|Tòa|Toa).*$/i, '')
                .replace(/\s*\/\s*/g, '/')
                .replace(/\s*-\s*/g, '-')
                .replace(/\s+/g, ' ')
                .trim();

            // Không coi ngày/tháng, giờ, hoặc MSSV 8-12 số là phòng.
            const digits = normalizeDigitsOnly(room);
            if (!room) return '';
            if (/^\d{1,2}[\/\-.]\d{1,2}/.test(room)) return '';
            if (digits.length >= 8) return '';
            return room;
        }

        function extractExamRoomFromText(text) {
            const raw = String(text || '').replace(/\s+/g, ' ').trim();
            if (!raw) return '';

            // Dạng chuẩn: "Phòng: 208/3", "Phòng số: 211", "P.504/1", "P. 401".
            // Lưu ý: KHÔNG dùng "p\.?") vì nó bắt nhầm chữ p trong text PDF rồi kéo số MSV thành phòng.
            let m = raw.match(/(?:^|[^A-Za-zÀ-ỹ0-9])(?:phòng|phong|phg|p\.)\s*(?:số|so|thi)?\s*[:：.]?\s*([^|,;\n\r]+)/i);
            if (m && m[1]) {
                const room = cleanExamRoomValue(m[1]);
                if (room) return room;
            }

            // Fallback cực hẹp: chỉ lấy dạng phòng 208/3 nếu dòng đó là dòng thông tin lịch thi.
            // Không lấy số rời 3-4 chữ số để tránh nhầm với MSSV trong PDF.
            if (isExamInfoRowForCampus([raw])) {
                const dateLike = /\b\d{1,2}\s*[\/.\-]\s*\d{1,2}\s*[\/.\-]\s*\d{2,4}\b/g;
                const rawWithoutDates = raw.replace(dateLike, ' ');
                m = rawWithoutDates.match(/\b([A-Z]?\d{2,4}\s*\/\s*[A-Z0-9]{1,4})\b/i);
                if (m) return m[1].replace(/\s+/g, '');
            }

            return '';
        }

        function extractExamRoomFromRow(row) {
            if (!row) return '';
            const cells = Array.from(row || []).map(c => String(c ?? '').replace(/\s+/g, ' ').trim());

            // PDF thường tách "Phòng:" và giá trị phòng thành nhiều text item/cell.
            // Đọc theo cell kế bên nhãn "Phòng" sẽ ổn hơn đọc nguyên dòng.
            for (let i = 0; i < cells.length; i++) {
                const cell = cells[i];
                const norm = cleanExamText(cell);
                if (!norm || !/\b(PHONG|PHG|P)\b/.test(norm)) continue;
                if (norm.includes('LOP HOC PHAN')) continue;

                const parts = [];
                const after = cell.replace(/^.*?(?:phòng|phong|phg|p\.)\s*(?:số|so|thi)?\s*[:：.]?\s*/i, '').trim();
                if (after && cleanExamText(after) !== norm) parts.push(after);

                for (let j = i + 1; j < Math.min(cells.length, i + 8); j++) {
                    const next = cells[j];
                    if (!next) continue;
                    const n = cleanExamText(next);
                    if (/^(MON|MA MON|HOC KY|LAN THI|SO TC|STT|MSV|MA SV|HO VA|HO TEN|TEN|GHI CHU|DIEM|KY TEN)\b/.test(n)) break;
                    parts.push(next);
                    if (campusFromKnownText(parts.join(' ')) || cleanExamRoomValue(parts.join(' '))) break;
                }

                const byCells = cleanExamRoomValue(parts.join(' '));
                if (byCells) return byCells;
            }

            return extractExamRoomFromText(rowText(row));
        }

        function extractSubjectFromText(text) {
            const raw = String(text || '').replace(/\s+/g, ' ').trim();
            if (!raw) return '';

            const norm = cleanExamText(raw);

            // Không lấy tên môn từ dòng tiêu đề bảng sinh viên:
            // ví dụ "STT MSV HỌ VÀ TÊN LỚP MÔN HỌC LỚP SINH HOẠT..."
            if (
                norm.includes('LOP MON HOC') ||
                norm.includes('LOP HOC PHAN') ||
                (norm.includes('STT') && norm.includes('MSV') && norm.includes('LOP MON'))
            ) {
                return '';
            }

            // Dạng chuẩn: "MÔN: Toán Cao Cấp A2  MÃ MÔN: MTH 104"
            // Bắt buộc "môn" là nhãn độc lập, không bắt chữ "môn" trong "lớp môn học".
            let m = raw.match(/(?:^|[\s;|,.\-–—])(?:môn|mon)\s*[:：]\s*(.+?)(?=\s+(?:mã\s*môn|ma\s*mon|số\s*tín|so\s*tin|số\s*tc|so\s*tc|học\s*kỳ|hoc\s*ky|lần\s*thi|lan\s*thi)\b|$)/i);

            // Fallback nếu thiếu dấu ":" sau chữ MÔN, nhưng vẫn chặn "MÔN HỌC".
            if (!m) {
                m = raw.match(/(?:^|[\s;|,.\-–—])(?:môn|mon)\s+(?!học\b|hoc\b)(.+?)(?=\s+(?:mã\s*môn|ma\s*mon|số\s*tín|so\s*tin|số\s*tc|so\s*tc|học\s*kỳ|hoc\s*ky|lần\s*thi|lan\s*thi)\b|$)/i);
            }

            if (!m || !m[1]) return '';

            let subject = m[1]
                .replace(/^[\-–—:.\s]+/, '')
                .replace(/\b(mã\s*môn|ma\s*mon).*$/i, '')
                .replace(/\s+/g, ' ')
                .trim();

            const subjectNorm = cleanExamText(subject);
            if (
                !subject ||
                subjectNorm === 'HOC' ||
                subjectNorm === 'MON HOC' ||
                subjectNorm.includes('LOP MON HOC') ||
                subjectNorm.includes('LOP SINH HOAT') ||
                subjectNorm.includes('SO TO') ||
                subjectNorm.includes('KY TEN')
            ) {
                return '';
            }

            return subject;
        }


        function rowText(row) {
            return rowSearchText(row);
        }

        function isStudentHeaderRow(row) {
            const s = cleanExamText(rowText(row));
            if (!s) return false;
            const hasStudentCode = /\b(MSV|MA SV|MSSV)\b/.test(s);
            const hasName = (s.includes('HO VA') || s.includes('HO TEN') || /\bTEN\b/.test(s));
            const hasClass = s.includes('LOP MON') || s.includes('LOP HOC PHAN') || s.includes('LOP SINH') || s.includes('LOP SH');
            return s.includes('STT') && hasStudentCode && (hasName || hasClass);
        }

        function isStrongExamInfoRow(row) {
            const s = cleanExamText(rowText(row));
            if (!s) return false;
            const hasTime = /\b\d{1,2}H\d{2}\b/.test(s) || /\b\d{1,2}\s*GIO\s*\d{0,2}\b/.test(s);
            const hasDate = /\b\d{1,2}\/\d{1,2}\/\d{4}\b/.test(s);
            const hasRoom = s.includes('PHONG');
            return s.includes('THOI GIAN') || (hasRoom && (hasTime || hasDate)) || (hasTime && hasDate);
        }

        function findNearestStudentHeaderIndex(dbIdx) {
            for (let j = dbIdx; j >= Math.max(0, dbIdx - 80); j--) {
                if (isStudentHeaderRow(db[j])) return j;
            }
            return -1;
        }

        function findExamInfoIndexForStudent(dbIdx, headerIdx) {
            const start = headerIdx >= 0 ? headerIdx : dbIdx;
            for (let j = start; j >= Math.max(0, start - 60); j--) {
                if (isStrongExamInfoRow(db[j])) return j;
            }
            for (let j = start; j >= Math.max(0, start - 60); j--) {
                const t = rowText(db[j]);
                if (extractExamDateFromText(t) || extractExamTimeFromText(t) || extractExamRoomFromText(t)) return j;
            }
            return -1;
        }


        function getScanRangeForStudentRow(dbIdx) {
            const headerIdx = findNearestStudentHeaderIndex(dbIdx);
            const examInfoIdx = findExamInfoIndexForStudent(dbIdx, headerIdx);
            let start = examInfoIdx >= 0 ? Math.max(0, examInfoIdx - 8) : Math.max(0, dbIdx - 45);
            let infoEnd = headerIdx >= 0 ? headerIdx : dbIdx;
            let end = Math.min(db.length - 1, dbIdx + 25);
            for (let j = dbIdx + 1; j <= Math.min(db.length - 1, dbIdx + 80); j++) {
                if (isStrongExamInfoRow(db[j]) || isStudentHeaderRow(db[j])) {
                    end = Math.min(end, j - 1);
                    break;
                }
            }
            return { start, infoEnd, end, headerIdx, examInfoIdx };
        }

        function getPreferredExamRoomCandidate(centerIdx) {
            if (!Number.isFinite(centerIdx) || centerIdx < 0 || centerIdx >= db.length) {
                return { room: '', rowNumber: 0 };
            }

            const candidates = [];
            for (let j = Math.max(0, centerIdx - 2); j <= Math.min(db.length - 1, centerIdx + 2); j++) {
                const row = db[j];
                if (!row) continue;

                const text = rowText(row);
                const room = extractExamRoomFromRow(row) || extractExamRoomFromText(text);
                if (!room) continue;

                const norm = cleanExamText(text);
                let score = 0;
                if (/\b(PHONG|PHG|P\.)\b/.test(norm)) score += 100;
                if (isStrongExamInfoRow(row)) score += 40;
                if (extractExamDateFromText(text)) score += 15;
                if (extractExamTimeFromText(text)) score += 15;
                if (detectCampusFromRow(row)) score += 10;
                score -= Math.abs(j - centerIdx) * 5;

                candidates.push({ room, rowNumber: Number(row?._row || 0), score, distance: Math.abs(j - centerIdx) });
            }

            if (!candidates.length) return { room: '', rowNumber: 0 };
            candidates.sort((a, b) => b.score - a.score || a.distance - b.distance || a.room.length - b.room.length);
            return candidates[0];
        }

        function getCellByHeader(row, headerRow, headerNames) {
            if (!row || !headerRow) return '';
            const headers = Array.from(headerRow || []).map(h => cleanExamText(h));
            const names = headerNames.map(cleanExamText);
            for (let i = 0; i < headers.length; i++) {
                if (names.some(name => headers[i] === name || headers[i].includes(name))) {
                    const value = row[i];
                    if (value !== undefined && String(value).trim() !== '') return value;
                }
            }
            return '';
        }

        function sanitizeStudentIdForDisplay(value, stt = '') {
            const raw = String(value || '').trim();
            const digits = normalizeDigitsOnly(raw);
            if (!digits) return '';
            if (isLikelyStudentIdDigits(digits)) return digits;

            const sttDigits = normalizeDigitsOnly(stt);
            if (sttDigits && digits.startsWith(sttDigits)) {
                const rest = digits.slice(sttDigits.length);
                if (isLikelyStudentIdDigits(rest)) return rest;
            }

            const candidates = extractStudentIdCandidates(raw);
            if (candidates.length) return candidates[0].digits;

            // Chốt chặn cuối: nếu bị dính STT + MSSV thành 12-14 số, thử cắt 1-3 số đầu.
            if (/^\d{12,14}$/.test(digits)) {
                for (let cut = 1; cut <= 3; cut++) {
                    const maybeStt = digits.slice(0, cut);
                    const rest = digits.slice(cut);
                    if (Number(maybeStt) >= 1 && Number(maybeStt) <= 300 && isLikelyStudentIdDigits(rest)) return rest;
                }
            }
            return digits;
        }

        function cleanStudentDisplayName(value) {
            let name = String(value || '')
                .replace(/\s+/g, ' ')
                .trim();
            if (!name || name === '---') return name;

            // Không cho cột lớp môn học/lớp sinh hoạt dính vào tên, ví dụ: "Lê Lan Anh HRM 402 B".
            // Dùng prefix mã môn thật, không dùng [A-Z] chung để khỏi cắt nhầm tên kiểu "Lê Lan Anh".
            const coursePrefix = '(?:AES|AET|STA|ENG|MTH|PNU|MEC|CS|CSC|CSE|CSI|IS|LAW|JPN|KOR|CHI|FR|GER|PSY|BUS|ACC|FIN|MKT|HRM|THM|HIS|BIO|PHY|CHE|MED|NUR|PHR|ECO|MIS|CIS|SE|IT|GDTC|POL)';
            const courseTail = new RegExp('\s+' + coursePrefix + '(?:\s+' + coursePrefix + '){0,2}\s*[-_\/]*\s*\d{2,4}\s*[A-Z0-9\-_.\/]*.*$');
            name = name
                .replace(/\s+K\d{2}[A-Z0-9\-_.\/]*.*$/i, '')
                .replace(courseTail, '')
                .replace(/\s+(?:NỢ\s*HP|NO\s*HP|KÝ\s*TÊN|KY\s*TEN|ĐIỂM|DIEM|GHI\s*CHÚ|GHI\s*CHU).*$/i, '')
                .replace(/\s+/g, ' ')
                .trim();
            return name || '---';
        }

        function normalizeCardStudentIdentity(d, row, pdfParsedStudent = null) {
            if (!d) return d;
            d.stt = String(d.stt || '---').replace(/\s+/g, ' ').trim() || '---';
            d.msv = sanitizeStudentIdForDisplay(d.msv, d.stt) || sanitizeStudentIdForDisplay(getRowMsv(row), d.stt) || '---';
            d.name = cleanStudentDisplayName(d.name);

            // Nếu tên sau khi clean rỗng hoặc vẫn có dấu hiệu dính lớp, ưu tiên parser theo dòng PDF.
            if (pdfParsedStudent && pdfParsedStudent.name) {
                const pdfName = cleanStudentDisplayName(pdfParsedStudent.name);
                if (pdfName && pdfName !== '---' && (!d.name || d.name === '---' || isCourseOrClassCell(d.name))) {
                    d.name = pdfName;
                }
            }

            // Nếu lớp môn học/lớp sinh hoạt vô tình dính vào tên thì tách bỏ lần nữa theo chính giá trị đã đọc.
            [d.lopHocPhan, d.lop].forEach(v => {
                const x = String(v || '').trim();
                if (x && x !== '---' && d.name && d.name.includes(x)) {
                    d.name = cleanStudentDisplayName(d.name.replace(x, ''));
                }
            });
            return d;
        }

        function getCardData(row) {
            let dbIdx = db.indexOf(row);
            const range = getScanRangeForStudentRow(dbIdx);
            const headerRow = range.headerIdx >= 0 ? db[range.headerIdx] : null;

            const subjectFromOpenedFile = getOpenedSubjectForRow(row);
            let d = { ngay: "---", gio: "---", phong: "---", coso: "Chưa xác định", msv: "---", stt: "---", name: "---", lop: "---", lopHocPhan: "---", mon: subjectFromOpenedFile || "CHƯA XÁC ĐỊNH", source: row._sheet, roomRowNumber: 0, campusRowNumber: 0, contextRowNumber: 0 };
            const campusCandidates = [];

            const preferredRoomCandidate = getPreferredExamRoomCandidate(range.examInfoIdx >= 0 ? range.examInfoIdx : range.infoEnd);
            if (preferredRoomCandidate.room) {
                d.phong = preferredRoomCandidate.room;
                d.roomRowNumber = preferredRoomCandidate.rowNumber || 0;
            }

            for (let j = range.infoEnd; j >= range.start; j--) {
                const originalLine = rowText(db[j]);

                const foundDate = extractExamDateFromText(originalLine);
                if (d.ngay === "---" && foundDate) d.ngay = foundDate;

                const foundTime = extractExamTimeFromText(originalLine);
                if (d.gio === "---" && foundTime) d.gio = foundTime;

                const foundSubject = extractSubjectFromText(originalLine);
                if (d.mon === "CHƯA XÁC ĐỊNH" && foundSubject) d.mon = foundSubject;

                const foundRoom = extractExamRoomFromRow(db[j]) || extractExamRoomFromText(originalLine);
                if (d.phong === "---" && foundRoom) {
                    d.phong = foundRoom;
                    if (!d.roomRowNumber) d.roomRowNumber = Number(db[j]?._row || 0);
                }

                const campus = detectCampusFromRow(db[j]);
                if (campus) {
                    campusCandidates.push({ value: campus.value, distance: Math.abs(dbIdx - j), priority: campus.explicit ? 100 : 50 });
                    if (!d.campusRowNumber) d.campusRowNumber = Number(db[j]?._row || 0);
                }
            }

            for (let j = dbIdx + 1; j <= range.end; j++) {
                const originalLine = rowText(db[j]);

                if (d.ngay === "---") {
                    const foundDate = extractExamDateFromText(originalLine);
                    if (foundDate) d.ngay = foundDate;
                }

                if (d.gio === "---") {
                    const foundTime = extractExamTimeFromText(originalLine);
                    if (foundTime) d.gio = foundTime;
                }

                if (d.phong === "---" && isStrongExamInfoRow(db[j])) {
                    const foundRoom = extractExamRoomFromRow(db[j]) || extractExamRoomFromText(originalLine);
                    if (foundRoom) {
                        d.phong = foundRoom;
                        if (!d.roomRowNumber) d.roomRowNumber = Number(db[j]?._row || 0);
                    }
                }

                const campus = detectCampusFromRow(db[j]);
                if (campus) {
                    campusCandidates.push({ value: campus.value, distance: Math.abs(dbIdx - j) + 0.5, priority: campus.explicit ? 90 : 40 });
                    if (!d.campusRowNumber) d.campusRowNumber = Number(db[j]?._row || 0);
                }
            }

            if (campusCandidates.length) {
                campusCandidates.sort((a, b) => {
                    if (b.priority !== a.priority) return b.priority - a.priority;
                    return a.distance - b.distance;
                });
                d.coso = campusCandidates[0].value;
            }

            d.contextRowNumber = Number(d.campusRowNumber || d.roomRowNumber || (range.examInfoIdx >= 0 ? db[range.examInfoIdx]?._row : 0) || 0);

            const pdfParsedStudent = sourceFileKind === 'pdf' ? splitPdfStudentRow(row) : null;
            const detectedMsv = getRowMsv(row) || pdfParsedStudent?.msv || '';
            d.msv = detectedMsv || "---";
            if (d.msv !== "---") d.msv = String(d.msv).trim().replace(/\s+/g, '');
            let mi = Array.from(row || []).findIndex(c => String(c).trim().replace(/\s+/g, '') === d.msv || normalizeDigitsOnly(c) === d.msv);

            const sttByHeader = getCellByHeader(row, headerRow, ['STT']);
            const msvByHeader = getCellByHeader(row, headerRow, ['MSV', 'MA SV', 'MSSV']);
            const hoByHeader = getCellByHeader(row, headerRow, ['HO VA', 'HO']);
            const tenByHeader = getCellByHeader(row, headerRow, ['TEN']);
            const lopHocPhanByHeader = getCellByHeader(row, headerRow, ['LOP MON HOC', 'LOP HOC PHAN']);
            const lopSinhHoatByHeader = getCellByHeader(row, headerRow, ['LOP SINH HOAT', 'LOP SH']);

            const msvHeaderCandidate = extractStudentIdCandidates(msvByHeader)[0]?.digits || '';
            if (msvHeaderCandidate) d.msv = msvHeaderCandidate;
            d.stt = sttByHeader || pdfParsedStudent?.stt || row[mi - 1] || "---";
            d.name = (hoByHeader || tenByHeader)
                ? `${hoByHeader || ''} ${tenByHeader || ''}`.replace(/\s+/g, ' ').trim()
                : (pdfParsedStudent?.name || ((row[mi + 1] && isNaN(row[mi + 1])) ? (row[mi + 1] + " " + (row[mi + 2] || "")) : "---"));
            d.lopHocPhan = lopHocPhanByHeader || pdfParsedStudent?.lopHocPhan || "---";
            d.lop = lopSinhHoatByHeader || pdfParsedStudent?.lop || row.find(c => /K\d{2}/i.test(String(c))) || "---";
            d.note = row.some(c => String(c).toUpperCase().includes("NỢ HP")) ? "NỢ HP" : "";
            normalizeCardStudentIdentity(d, row, pdfParsedStudent);
            applyManualExamInfo(d);
            normalizeCardStudentIdentity(d, row, pdfParsedStudent);
            return d;
        }

        function renderCard(d, realRow, sourceRow) {
            const slot = getSidebarResultSlot();
            const area = document.getElementById('resultArea');
            if (!slot || !area) return;

            const positionLabel = d.stt && d.stt !== '---' ? 'STT TRONG DANH SÁCH' : (sourceFileKind === 'pdf' ? 'DÒNG TEXT PDF' : 'VỊ TRÍ HÀNG TRONG FILE');
            const positionValue = d.stt && d.stt !== '---' ? d.stt : realRow;
            const manualKey = manualExamInfoStorageKey(d);
            const safeManualKey = escapeHtml(manualKey);
            const manualRoomValue = d.phong && d.phong !== '---' ? d.phong : '';
            const manualCampusValue = d.coso && d.coso !== 'Chưa xác định' ? d.coso : '';
            const manualNeedsFix = !manualRoomValue || !manualCampusValue;
            const manualTitle = manualNeedsFix ? '✍️ Tool chưa chắc? Nhập phòng/cơ sở rồi lưu' : '✍️ Sửa phòng/cơ sở nếu file gốc khác';

            const sidebarWrap = document.createElement('div');
            sidebarWrap.className = 'sidebar-card-wrap';
            sidebarWrap.innerHTML = `
<div class="card" data-msv="${escapeHtml(d.msv)}" data-manual-key="${safeManualKey}">
    <div class="c-header">THÔNG TIN DỰ THI</div>
    <div class="subject-line">📚 ${d.mon}</div>
    <div class="c-body">
        <div class="source-line" style="font-size:10px; color:#666; margin-bottom:8px;">📁 NGUỒN: ${d.source}</div>
        <div style="display:flex; gap:8px; margin-bottom:10px;">
            <div class="exam-date-box" style="flex:1; border:1.5px solid #007bff; border-radius:10px; padding:7px; text-align:center; background:#ffffff; color:#111827;"><b style="color:#111827;">${d.ngay}</b></div>
            <div class="exam-time-box" style="flex:1; border:1.5px solid #fd7e14; border-radius:10px; padding:7px; text-align:center; background:#ffffff; color:#111827;"><b style="color:#111827;">${d.gio}</b></div>
        </div>
        <div class="room-big">Phòng: ${d.phong}</div>
        <div class="coso-block" style="text-align:center; font-weight:800; margin-bottom:10px; color:#111827;">📍 CƠ SỞ:<br><span class="coso-text" style="color:var(--dtu-red); font-size: 13px;">${d.coso}</span></div>
        ${d.note ? `<div class="warning-hp">⚠️ BẠN ĐANG NỢ HỌC PHÍ</div>` : ''}
        <div class="student-code" style="background:var(--dtu-green); color:white; padding:10px; border-radius:10px; text-align:center; font-size:20px; font-weight:900; margin-bottom:10px;">${d.msv}</div>
        <table class="info-table" style="background:#ffffff; color:#111827;">
            <tr><th>STT</th><th>HỌ VÀ TÊN</th><th>LỚP</th></tr>
            <tr><td>${d.stt}</td><td>${d.name}</td><td>${d.lop}</td></tr>
        </table>
        <div class="seat-box" style="background:#f3e5f5; padding:10px; border:1.5px dashed #6f42c1; border-radius:10px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:900; color:#6f42c1">${positionLabel}</span>
            <span style="font-size:28px; font-weight:900; color:#6f42c1">${positionValue}</span>
        </div>
    </div>
</div>
<div class="manual-edit-box ${manualNeedsFix ? 'needs-fix' : ''}" data-manual-key="${safeManualKey}">
    <div class="manual-edit-title">${manualTitle}</div>
    <div class="manual-edit-grid">
        <label>Phòng
            <input class="manual-room-input" value="${escapeHtml(manualRoomValue)}" placeholder="VD: 8312">
        </label>
        <label>Cơ sở
            <input class="manual-campus-input" value="${escapeHtml(manualCampusValue)}" placeholder="VD: Hòa Khánh Nam - Tòa nhà G">
        </label>
    </div>
    <button type="button" class="manual-save-btn" onclick="saveManualExamInfo(this)">💾 Lưu phòng/cơ sở</button>
    <div class="manual-save-hint">Sau khi lưu, thẻ và ảnh chụp sẽ dùng thông tin bạn nhập. File gốc bên phải vẫn giữ để đối chiếu.</div>
</div>
<button class="btn-main" onclick="capture(this.parentElement.querySelector('.card'))">📸 CHỤP & SAO CHÉP</button>
<button class="btn-main" onclick="sendCardToTelegram(this.parentElement.querySelector('.card'), this)">📤 GỬI TELEGRAM</button>`;
            slot.appendChild(sidebarWrap);

            const evidenceWrap = document.createElement('div');
            evidenceWrap.className = 'evidence-only-wrap';
            evidenceWrap.innerHTML = buildSourceEvidencePanel(sourceRow, d);
            area.appendChild(evidenceWrap);

            if (sourceFileKind === 'pdf') {
                renderPendingPdfCanvases(sidebarWrap);
                renderPendingPdfCanvases(evidenceWrap);
                setTimeout(() => showExamProofModal(sourceRow, d, false), 300);
            }
            if (sourceFileKind === 'excel') {
                setTimeout(() => showExamProofModal(sourceRow, d, false), 250);
                setTimeout(() => showExamProofModal(sourceRow, d, false), 900);
            }
            scheduleAutoSendTelegramFirstCard('render-card');
        }

        async function capture(el, isDownload = false) {
            if (!el) {
                toast("❌ Không tìm thấy thẻ để chụp!");
                return;
            }

            const wrap = el.parentElement || document;
            const btn = wrap.querySelector('.btn-main');
            const footer = el.querySelector('.capture-footer');
            const msv = el.getAttribute('data-msv') || 'the-du-thi';

            const originalBtnText = btn ? btn.textContent : '';
            const originalBtnDisabled = btn ? btn.disabled : false;
            const originalBtnOpacity = btn ? btn.style.opacity : '';
            const originalFooterDisplay = footer ? footer.style.display : '';
            const originalAnimation = el.style.animation;
            const originalColorScheme = document.documentElement.style.colorScheme;

            try {
                if (btn) {
                    btn.disabled = true;
                    btn.style.opacity = '0.65';
                    btn.textContent = isDownload ? '⏳ ĐANG TẢI ẢNH...' : '⏳ ĐANG CHỤP...';
                }

                const renderBlobPromise = (async function renderCardBlob() {
                    try {
                        if (footer) footer.style.display = "none";

                        el.style.animation = "none";
                        el.classList.add("capture-light");
                        document.documentElement.style.colorScheme = "light";

                        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

                        const canvas = await html2canvas(el, {
                            scale: 6,
                            backgroundColor: "#ffffff",
                            useCORS: true,
                            logging: false,
                            scrollX: 0,
                            scrollY: -window.scrollY,
                            onclone: (doc) => {
                                const clonedCard = doc.querySelector(`.card[data-msv="${msv}"]`);
                                if (clonedCard) {
                                    clonedCard.classList.add("capture-light");
                                    clonedCard.style.background = "#ffffff";
                                    clonedCard.style.color = "#111827";
                                    const clonedFooter = clonedCard.querySelector('.capture-footer');
                                    if (clonedFooter) clonedFooter.style.display = 'none';
                                }
                            }
                        });

                        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
                        if (!blob) throw new Error('Không tạo được ảnh PNG.');
                        return { blob, canvas };
                    } finally {
                        if (footer) footer.style.display = originalFooterDisplay;
                        el.classList.remove("capture-light");
                        el.style.animation = originalAnimation;
                        document.documentElement.style.colorScheme = originalColorScheme;
                    }
                })();

                if (isDownload) {
                    const result = await renderBlobPromise;
                    const fileName = `${msv}.png`;
                    const link = document.createElement('a');
                    link.download = fileName;
                    link.href = result.canvas.toDataURL("image/png", 1.0);
                    link.click();
                    toast("✅ Đã tải ảnh: " + msv);
                    return;
                }

                if (!navigator.clipboard || !window.ClipboardItem) {
                    await renderBlobPromise;
                    toast("❌ Trình duyệt này chưa hỗ trợ copy ảnh trực tiếp. Hãy dùng Chrome/Edge bản mới.");
                    return;
                }

                try {
                    // Gọi clipboard.write ngay trong thao tác click; ảnh sẽ render xong rồi resolve Blob sau.
                    await navigator.clipboard.write([
                        new ClipboardItem({ "image/png": renderBlobPromise.then(result => result.blob) })
                    ]);
                    toast("📸 Đã copy ảnh nét: " + msv);
                } catch (copyErr) {
                    console.warn('Không copy được ảnh bằng Blob Promise, thử lại bằng Blob trực tiếp.', copyErr);
                    try {
                        const result = await renderBlobPromise;
                        await navigator.clipboard.write([new ClipboardItem({ "image/png": result.blob })]);
                        toast("📸 Đã copy ảnh nét: " + msv);
                    } catch (copyErr2) {
                        console.error(copyErr2);
                        toast("❌ Chưa copy được ảnh. Bấm lại nút chụp một lần nữa nhé.");
                    }
                }
            } catch (err) {
                console.error(err);
                toast("❌ Lỗi chụp ảnh!");
            } finally {
                if (btn) {
                    btn.disabled = originalBtnDisabled;
                    btn.style.opacity = originalBtnOpacity;
                    btn.textContent = originalBtnText || '📸 CHỤP & SAO CHÉP';
                }
            }
        }


        function notifyParentTelegramStatus(payload) {
            try {
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: 'ALO_TELEGRAM_AUTO_SEND', ...payload }, '*');
                }
            } catch (e) {}
        }

        function scheduleAutoSendTelegramFirstCard(reason = '') {
            if (!telegramAutoSendRequested || telegramAutoSendDone) return;
            clearTimeout(telegramAutoSendTimer);
            telegramAutoSendTimer = setTimeout(() => {
                autoSendTelegramFirstCard(reason);
            }, 650);
        }

        async function autoSendTelegramFirstCard(reason = '') {
            if (!telegramAutoSendRequested || telegramAutoSendDone) return;
            const cards = Array.from(document.querySelectorAll('.sidebar-card-wrap .card, .card[data-msv]'));
            const card = cards.find(c => c && c.getAttribute('data-msv')) || cards[0];

            if (!card) {
                telegramAutoSendTryCount += 1;
                if (telegramAutoSendTryCount <= 25) {
                    telegramAutoSendTimer = setTimeout(() => autoSendTelegramFirstCard(reason), 500);
                } else {
                    notifyParentTelegramStatus({ ok: false, message: 'Không tìm thấy thẻ để gửi Telegram.' });
                    toast('❌ Auto gửi Telegram: chưa tìm thấy thẻ.');
                }
                return;
            }

            telegramAutoSendDone = true;
            try {
                notifyParentTelegramStatus({ ok: null, message: 'Đang gửi thẻ qua Telegram...' });
                const sentOk = await sendCardToTelegram(card, null);
                if (!sentOk) throw new Error('Gửi Telegram thất bại. Kiểm tra Worker Secret/Chat ID.');
                notifyParentTelegramStatus({
                    ok: true,
                    message: 'Đã gửi thẻ qua Telegram.',
                    msv: card.getAttribute('data-msv') || ''
                });
            } catch (err) {
                telegramAutoSendDone = false;
                notifyParentTelegramStatus({ ok: false, message: err && err.message ? err.message : String(err) });
            }
        }

        function getTelegramWorkerUrl() {
            const base = (window.ALO_CLOUDFLARE_WORKER_PROXY || '').replace(/\/+$/, '');
            if (!base) {
                throw new Error('Chưa cấu hình ALO_CLOUDFLARE_WORKER_PROXY trong proxy-config.js');
            }
            return `${base}/send-card-telegram`;
        }

        async function renderExamCardForTelegram(el, msv) {
            const footer = el.querySelector('.capture-footer');
            const originalFooterDisplay = footer ? footer.style.display : '';
            const originalAnimation = el.style.animation;
            const originalColorScheme = document.documentElement.style.colorScheme;

            try {
                if (footer) footer.style.display = "none";

                el.style.animation = "none";
                el.classList.add("capture-light");
                document.documentElement.style.colorScheme = "light";

                await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

                const canvas = await html2canvas(el, {
                    scale: 6,
                    backgroundColor: "#ffffff",
                    useCORS: true,
                    logging: false,
                    scrollX: 0,
                    scrollY: -window.scrollY,
                    onclone: (doc) => {
                        const clonedCard = doc.querySelector(`.card[data-msv="${msv}"]`);
                        if (clonedCard) {
                            clonedCard.classList.add("capture-light");
                            clonedCard.style.background = "#ffffff";
                            clonedCard.style.color = "#111827";
                            const clonedFooter = clonedCard.querySelector('.capture-footer');
                            if (clonedFooter) clonedFooter.style.display = 'none';
                        }
                    }
                });

                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
                if (!blob) throw new Error('Không tạo được ảnh PNG.');
                return blob;
            } finally {
                if (footer) footer.style.display = originalFooterDisplay;
                el.classList.remove("capture-light");
                el.style.animation = originalAnimation;
                document.documentElement.style.colorScheme = originalColorScheme;
            }
        }

        async function sendCardToTelegram(el, btn) {
            if (!el) {
                toast("❌ Không tìm thấy thẻ để gửi!");
                return;
            }

            const msv = el.getAttribute('data-msv') || 'the-du-thi';
            const originalBtnText = btn ? btn.textContent : '';
            const originalBtnDisabled = btn ? btn.disabled : false;
            const originalBtnOpacity = btn ? btn.style.opacity : '';

            try {
                if (btn) {
                    btn.disabled = true;
                    btn.style.opacity = '0.65';
                    btn.textContent = '⏳ ĐANG GỬI TELEGRAM...';
                }

                const blob = await renderExamCardForTelegram(el, msv);
                const form = new FormData();
                form.append('photo', blob, `${msv}.png`);
                form.append('caption', `Thẻ dự thi - ${msv}`);

                const res = await fetch(getTelegramWorkerUrl(), {
                    method: 'POST',
                    body: form
                });

                const text = await res.text();

                if (!res.ok) {
                    console.error('Telegram error:', text);
                    toast('❌ Gửi Telegram thất bại! Kiểm tra Worker Secret/Chat ID.');
                    return false;
                }

                toast('✅ Đã gửi ảnh qua Telegram: ' + msv);
                return true;
            } catch (err) {
                console.error(err);
                toast('❌ Lỗi gửi Telegram: ' + (err && err.message ? err.message : 'không rõ lỗi'));
                return false;
            } finally {
                if (btn) {
                    btn.disabled = originalBtnDisabled;
                    btn.style.opacity = originalBtnOpacity;
                    btn.textContent = originalBtnText || '📤 GỬI TELEGRAM';
                }
            }
        }

        async function saveAllImages() {
            const cards = document.querySelectorAll('.card');
            toast(`⏳ Tải ${cards.length} ảnh...`);
            for (let card of cards) { await capture(card, true); await new Promise(r => setTimeout(r, 800)); }
            toast("✅ Xong!");
        }



// Fix html2canvas: không để rule capture-light cũ tô nền xanh lên chữ MÃ THÍ SINH
(function injectCaptureLightFix(){
    const css = `.card.exam-modern-card.capture-light .student-code.exam-modern-code > .exam-modern-code-label,
.card.exam-modern-card.capture-light .student-code.exam-modern-code .exam-modern-code-label{
    background: transparent !important;
    box-shadow: none !important;
    color:#ffffff !important;
    -webkit-text-fill-color:#ffffff !important;
}`;
    if (document.getElementById('alo-capture-light-fix')) return;
    const style = document.createElement('style');
    style.id = 'alo-capture-light-fix';
    style.textContent = css;
    document.head.appendChild(style);
})();
