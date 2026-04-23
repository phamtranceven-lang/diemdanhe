const EXAM_SOURCE_KEYS = {
    mode: "examSourceMode",
    url: "examSourceUrl",
    data: "examSourceData",
    name: "examSourceName",
    updatedAt: "examSourceUpdatedAt"
};

function setExamSourceMode(mode) {
    localStorage.setItem(EXAM_SOURCE_KEYS.mode, mode);
}

function getExamSourceMode() {
    return localStorage.getItem(EXAM_SOURCE_KEYS.mode) || "";
}

function saveExamSourceUrl(url) {
    localStorage.setItem(EXAM_SOURCE_KEYS.url, url);
    localStorage.setItem(EXAM_SOURCE_KEYS.updatedAt, new Date().toISOString());
    setExamSourceMode("url");
}

function getExamSourceUrl() {
    return localStorage.getItem(EXAM_SOURCE_KEYS.url) || "";
}

function saveExamSourceData(data, fileName = "") {
    localStorage.setItem(EXAM_SOURCE_KEYS.data, JSON.stringify(data));
    localStorage.setItem(EXAM_SOURCE_KEYS.name, fileName || "");
    localStorage.setItem(EXAM_SOURCE_KEYS.updatedAt, new Date().toISOString());
    setExamSourceMode("upload");
}

function getExamSourceData() {
    const raw = localStorage.getItem(EXAM_SOURCE_KEYS.data);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function getExamSourceName() {
    return localStorage.getItem(EXAM_SOURCE_KEYS.name) || "";
}

function clearExamSource() {
    localStorage.removeItem(EXAM_SOURCE_KEYS.mode);
    localStorage.removeItem(EXAM_SOURCE_KEYS.url);
    localStorage.removeItem(EXAM_SOURCE_KEYS.data);
    localStorage.removeItem(EXAM_SOURCE_KEYS.name);
    localStorage.removeItem(EXAM_SOURCE_KEYS.updatedAt);
}

function getExamSourceUpdatedAt() {
    return localStorage.getItem(EXAM_SOURCE_KEYS.updatedAt) || "";
}

function normalizeExcelRowsToSourcePayload(arrayBuffer) {
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    let title = "HỆ THỐNG TRA CỨU LỊCH THI KTHP";
    rows.slice(0, 15).forEach(row => {
        if (row) {
            row.forEach(cell => {
                const text = String(cell || "");
                const up = text.toUpperCase();
                if (up.includes("LỊCH THI") || up.includes("LỊCH THI")) {
                    title = text;
                }
            });
        }
    });

    let headerIndex = -1;
    let headers = [];

    for (let i = 0; i < 30; i++) {
        if (rows[i] && rows[i].some(c => String(c).includes("Ngày"))) {
            headerIndex = i;
            headers = rows[i].map(h => String(h || "").trim());
            break;
        }
    }

    if (headerIndex === -1) {
        throw new Error("Không tìm thấy dòng tiêu đề.");
    }

    const data = XLSX.utils.sheet_to_json(worksheet, {
        header: headers,
        range: headerIndex + 1,
        defval: ""
    }).filter(r => r[headers[0]] && !isNaN(parseInt(r[headers[0]])));

    return {
        title,
        headers,
        data
    };
}
