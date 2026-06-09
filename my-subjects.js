let mySubjects = JSON.parse(localStorage.getItem("mySubjects") || "[]");

const DATE_FILTER_KEY = "mainDateFilter";

function normalizeSubject(v) {
    return String(v || "").trim().toUpperCase();
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[m]));
}

function renderMySubjects() {
    const box = document.getElementById("mySubjectsList");
    if (!box) return;

    if (!mySubjects.length) {
        box.innerHTML = `<div class="my-empty">Chưa có môn nào</div>`;
        return;
    }

    box.innerHTML = mySubjects.map(subject => `
        <span class="my-tag">
            ${escapeHtml(subject)}
            <button type="button" onclick="removeMySubject('${escapeHtml(subject)}')">×</button>
        </span>
    `).join("");
}

function addMySubject() {
    const input = document.getElementById("mySubjectInput");
    if (!input) return;

    const values = input.value
        .split(",")
        .map(s => normalizeSubject(s))
        .filter(Boolean);

    if (!values.length) {
        input.focus();
        return;
    }

    values.forEach(value => {
        if (!mySubjects.includes(value)) {
            mySubjects.push(value);
        }
    });

    input.value = "";
    renderMySubjects();
    input.focus();
}

function removeMySubject(subject) {
    mySubjects = mySubjects.filter(s => s !== subject);
    renderMySubjects();
    saveAllFilters(true);
}

function saveMySubjects(silent = false) {
    localStorage.setItem("mySubjects", JSON.stringify(mySubjects));
}

function clearMySubjects() {
    mySubjects = [];
    renderMySubjects();
    saveMySubjects(true);
}

function getMainDateFilter() {
    const fromInput = document.getElementById("mainFromDate");
    const toInput = document.getElementById("mainToDate");

    return {
        from: fromInput?.value || "",
        to: toInput?.value || ""
    };
}

function saveMainDateFilter() {
    const dateFilter = getMainDateFilter();
    localStorage.setItem(DATE_FILTER_KEY, JSON.stringify(dateFilter));
}

function loadMainDateFilter() {
    const saved = JSON.parse(localStorage.getItem(DATE_FILTER_KEY) || "{}");

    const fromInput = document.getElementById("mainFromDate");
    const toInput = document.getElementById("mainToDate");

    if (fromInput) fromInput.value = saved.from || "";
    if (toInput) toInput.value = saved.to || "";
}

function clearMainDateFilter() {
    localStorage.removeItem(DATE_FILTER_KEY);

    const fromInput = document.getElementById("mainFromDate");
    const toInput = document.getElementById("mainToDate");

    if (fromInput) fromInput.value = "";
    if (toInput) toInput.value = "";
}

function saveAllFilters(silent = false) {
    saveMySubjects(true);
    saveMainDateFilter();
}

function buildOpenUrl(page) {
    const params = new URLSearchParams();

    if (mySubjects.length) {
        params.set("m", mySubjects.join(", "));
    }

    const { from, to } = getMainDateFilter();

    if (from) params.set("from", from);
    if (to) params.set("to", to);

    const queryString = params.toString();
    return queryString ? `${page}?${queryString}` : page;
}

function openWithSubjects(page) {
    if (!mySubjects.length) {
        return;
    }

    window.location.href = buildOpenUrl(page);
}

function openWithFilters(page) {
    window.location.href = buildOpenUrl(page);
}

function clearAllFilters() {
    clearMySubjects();
    clearMainDateFilter();
}

function bindMainDateAutoSave() {
    const fromInput = document.getElementById("mainFromDate");
    const toInput = document.getElementById("mainToDate");

    if (fromInput) {
        fromInput.addEventListener("change", () => {
            saveMainDateFilter();
        });
    }

    if (toInput) {
        toInput.addEventListener("change", () => {
            saveMainDateFilter();
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderMySubjects();
    loadMainDateFilter();
    bindMainDateAutoSave();
});
