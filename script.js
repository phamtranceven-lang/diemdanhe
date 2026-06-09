document.addEventListener("DOMContentLoaded", function () {
    const allQaData = [
        ...generalInfo,
        ...dtuWebsites,
        ...fbLinks,
        ...zaloLinks,
        ...telegramLinks,
        ...externalLinks,
        ...huongdan
        // (Nếu bạn thêm mảng mới, chỉ cần thêm vào đây)
    ];

    const totalCount = allQaData.length;
    const counterDisplay = document.getElementById("resultCounter");

    let searchTimer;
    const noResultTimeout = 1;
    const noDataMessage = "Vui lòng liên hệ: <a href='https://t.me/babyhaituoi' target='_blank'>Telegram</a>, <a href='https://t.me/Dai_Hoc_Duy_Tan' target='_blank'>Bản Tin Đại học Duy Tân</a>";
    const welcomeMessage = "Nhật Tân chào bạn";

    const searchInput = document.getElementById("searchInput");
    const resultDisplay = document.getElementById("resultDisplay");
    const clearButton = document.getElementById("clearButton");
    const suggestionsWrapper = document.getElementById("suggestionsWrapper");
    const donateModal = document.getElementById("donateModal");
    const closeModalBtn = document.querySelector(".modal-close-btn");

    let suggestionActiveIndex = -1;

    function updateCounter(count) {
        if (count !== null) {
            counterDisplay.textContent = `${count} kết quả`;
        } else {
            counterDisplay.textContent = `Tổng: ${totalCount}`;
        }
    }
    updateCounter(null);

    // Xử lý nút Xóa (X)
    if (clearButton) {
        clearButton.addEventListener("click", function () {
            searchInput.value = "";
            clearButton.style.display = "none";
            searchInput.focus();
            resultDisplay.innerHTML = welcomeMessage;
            suggestionsWrapper.style.display = "none";
            suggestionActiveIndex = -1;
            clearTimeout(searchTimer);
            updateCounter(null);
            document.body.classList.remove('search-active');
        });
    }

    searchInput.addEventListener("input", function () {
        clearTimeout(searchTimer);
        const query = searchInput.value;
        const normalizedQuery = normalizeText(query);

        // === KIỂM TRA TỪ KHÓA ĐẶC BIỆT "ỦNG HỘ" ===
        if (normalizedQuery === 'ung ho' || normalizedQuery === 'donate' || normalizedQuery === 'quyen gop') {
            if (donateModal) showDonateModal();
            return;
        }
        // ============================================

        suggestionActiveIndex = -1;

        if (normalizedQuery.length > 0) {
            const suggestions = findSuggestions(normalizedQuery);
            displaySuggestions(suggestions, query);
            document.body.classList.add('search-active'); // Kích hoạt CSS ẩn menu nút bấm
        } else {
            suggestionsWrapper.style.display = "none";
            document.body.classList.remove('search-active');
        }

        if (query.length > 0) {
            if (clearButton) clearButton.style.display = "block";
            const bestMatches = performSearch();

            if (bestMatches && bestMatches.length > 0) {
                const formattedAnswer = bestMatches.map(match => {
                    const keywordsHtml = match.keywords
                        .map(kw => `<span class='related-keyword-tag'>${kw}</span>`)
                        .join('');

                    // Tự động xóa tất cả các thuộc tính target='_blank'
                    const cleanAnswer = match.answer.replace(/target='_blank'/g, "");

                    return `
                        <div class="result-item">
                            <button class="copy-card-btn" title="Chụp ảnh toàn bộ nội dung">📋</button>                           
                            <div class="result-answer">${cleanAnswer}</div>
                            <div class="result-keywords">
                                <strong>Từ khóa liên quan:</strong>
                                ${keywordsHtml}
                            </div>
                        </div>`;

                }).join('');
                resultDisplay.innerHTML = formattedAnswer;
                updateCounter(bestMatches.length);

            } else {
                resultDisplay.innerHTML = "Xin lỗi, tôi không tìm thấy thông tin cho từ khóa: '<strong>" + query + "</strong>'. Vui lòng thử lại.";
                searchTimer = setTimeout(() => {
                    resultDisplay.innerHTML = noDataMessage;
                }, noResultTimeout);
                updateCounter(0);
            }
        } else {
            if (clearButton) clearButton.style.display = "none";
            resultDisplay.innerHTML = welcomeMessage;
            updateCounter(null);
        }
    });

    function performSearch() {
        const query = normalizeText(searchInput.value);
        if (query === "") return null;
        let matches = [];
        let maxScore = 0;

        for (const item of allQaData) {
            let bestScoreForItem = 0;
            for (const keyword of item.keywords) {
                const normalizedKeyword = normalizeText(keyword);
                let currentScore = 0;
                if (normalizedKeyword === query) currentScore = 3;
                else if (normalizedKeyword.startsWith(query)) currentScore = 2;
                else if (normalizedKeyword.includes(query)) currentScore = 1;
                if (currentScore > bestScoreForItem) bestScoreForItem = currentScore;
            }
            if (bestScoreForItem > 0) {
                matches.push({
                    answer: item.answer,
                    keywords: item.keywords,
                    score: bestScoreForItem
                });
                if (bestScoreForItem > maxScore) maxScore = bestScoreForItem;
            }
        }
        if (matches.length === 0) return null;
        const bestMatches = matches.filter(match => match.score === maxScore);
        return bestMatches;
    }

    function findSuggestions(normalizedQuery) {
        const suggestions = new Set();
        if (normalizedQuery.length < 1) return [];

        for (const item of allQaData) {
            for (const keyword of item.keywords) {
                const normalizedKeyword = normalizeText(keyword);
                if (normalizedKeyword.includes(normalizedQuery)) {
                    suggestions.add(keyword);
                }
            }
        }
        return Array.from(suggestions).slice(0, 10);
    }

    function displaySuggestions(suggestions, query) {
        suggestionsWrapper.innerHTML = "";
        if (suggestions.length === 0) {
            suggestionsWrapper.style.display = "none";
            return;
        }
        function escapeRegExp(string) {
            return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        }
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        suggestions.forEach(keyword => {
            const div = document.createElement("div");
            div.className = "suggestion-item";
            const highlightedKeyword = keyword.replace(regex, '<strong>$1</strong>');
            div.innerHTML = highlightedKeyword;
            div.addEventListener("click", () => {
                selectSuggestion(keyword);
            });
            suggestionsWrapper.appendChild(div);
        });
        suggestionsWrapper.style.display = "block";
    }

    function selectSuggestion(keyword) {
        searchInput.value = keyword;
        suggestionsWrapper.style.display = "none";
        suggestionActiveIndex = -1;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.focus();
    }

    function updateSuggestionHighlight() {
        const items = suggestionsWrapper.querySelectorAll('.suggestion-item');
        items.forEach((item, index) => {
            if (index === suggestionActiveIndex) {
                item.classList.add('suggestion-active');
                item.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            } else {
                item.classList.remove('suggestion-active');
            }
        });
    }

    function normalizeText(text) {
        return text.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    document.addEventListener("click", function (event) {
        if (event.target !== searchInput && !suggestionsWrapper.contains(event.target)) {
            suggestionsWrapper.style.display = "none";
            suggestionActiveIndex = -1;
        }
    });

    searchInput.addEventListener("keydown", function (event) {
        const items = suggestionsWrapper.querySelectorAll('.suggestion-item');
        if (suggestionsWrapper.style.display === 'none' || items.length === 0) return;
        if (event.key === "ArrowDown") {
            event.preventDefault();
            suggestionActiveIndex++;
            if (suggestionActiveIndex >= items.length) suggestionActiveIndex = 0;
            updateSuggestionHighlight();
        }
        else if (event.key === "ArrowUp") {
            event.preventDefault();
            suggestionActiveIndex--;
            if (suggestionActiveIndex < 0) suggestionActiveIndex = items.length - 1;
            updateSuggestionHighlight();
        }
        else if (event.key === "Enter") {
            event.preventDefault();
            if (suggestionActiveIndex > -1) {
                const selectedKeyword = items[suggestionActiveIndex].textContent;
                selectSuggestion(selectedKeyword);
            } else {
                suggestionsWrapper.style.display = 'none';
            }
        }
        else if (event.key === "Escape") {
            suggestionsWrapper.style.display = 'none';
            suggestionActiveIndex = -1;
        }
    });

    resultDisplay.addEventListener('click', function (event) {
        const target = event.target;

        if (target.classList.contains('related-keyword-tag')) {
            const keyword = target.textContent;
            searchInput.value = keyword;
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            searchInput.focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        if (target.classList.contains('copy-card-btn')) {
            handleCopyCard(target);
        }
    });

    // =========================================================================
    // --- HÀM XỬ LÝ CHỤP ẢNH
    // =========================================================================
    function handleCopyCard(button) {
        const card = button.closest('.result-item');
        const originalAnswerDiv = card.querySelector('.result-answer');

        if (!originalAnswerDiv) return;

        const originalButtonContent = button.innerHTML;
        button.innerHTML = '⏳'; // Hiện icon chờ

        // 1. TẠO BẢN SAO (CLONE) CỦA NỘI DUNG
        // cloneNode(true) sẽ copy toàn bộ html/text bên trong
        const clone = originalAnswerDiv.cloneNode(true);

        // 2. THIẾT LẬP CSS CHO BẢN SAO ĐỂ NÓ BUNG HẾT CỠ
        // Lấy chiều rộng thực tế của bản gốc để text không bị vỡ dòng
        const originalWidth = window.getComputedStyle(originalAnswerDiv).width;

        Object.assign(clone.style, {
            position: 'fixed',      // Cố định để không phụ thuộc vị trí trang
            top: '-10000px',        // Đẩy ra khỏi màn hình (người dùng không thấy)
            left: '0',
            width: 'auto',   // Giữ nguyên chiều rộng
            height: 'auto',         // Chiều cao tự do
            maxHeight: 'none',      // Gỡ bỏ giới hạn chiều cao
            overflow: 'visible',    // Hiển thị toàn bộ
            background: '#ffffff',  // Nền trắng
            zIndex: '-1000',        // Nằm dưới cùng
            padding: '20px',        // Thêm chút lề cho đẹp
            border: 'none',
            fontFamily: "'Inter', sans-serif" // Đảm bảo font chữ đúng
        });

        // 3. GẮN BẢN SAO VÀO THÂN TRANG (BODY)
        // Lúc này bản sao nằm ngoài hoàn toàn các thẻ cha bị giới hạn scroll
        document.body.appendChild(clone);

        // 4. CHỤP ẢNH BẢN SAO
        // Dùng requestAnimationFrame để đảm bảo trình duyệt đã vẽ xong clone
        requestAnimationFrame(() => {
            html2canvas(clone, {
                useCORS: true,
                logging: false,
                scale: 2, // Tăng độ nét (2x)
                backgroundColor: '#ffffff',
                windowWidth: document.documentElement.offsetWidth,
                windowHeight: document.documentElement.offsetHeight
            }).then(canvas => {

                // 5. XÓA BẢN SAO SAU KHI CHỤP XONG
                document.body.removeChild(clone);

                // Xử lý lưu ảnh vào Clipboard
                canvas.toBlob(function (blob) {
                    if (blob) {
                        try {
                            const item = new ClipboardItem({ 'image/png': blob });
                            navigator.clipboard.write([item]).then(() => {
                                button.innerHTML = '✅';
                                setTimeout(() => { button.innerHTML = originalButtonContent; }, 2000);
                            }).catch(err => {
                                console.error('Lỗi clipboard:', err);
                                // Fallback nếu trình duyệt chặn
                                alert("Đã chụp xong nhưng trình duyệt chặn copy tự động. Bạn có thể lưu ảnh thủ công.");
                                button.innerHTML = originalButtonContent;
                            });
                        } catch (error) {
                            console.error('Lỗi tạo ClipboardItem:', error);
                            button.innerHTML = '❌';
                            setTimeout(() => { button.innerHTML = originalButtonContent; }, 2000);
                        }
                    }
                }, 'image/png');

            }).catch(err => {
                console.error('html2canvas lỗi:', err);
                if (document.body.contains(clone)) document.body.removeChild(clone);
                button.innerHTML = '❌';
                setTimeout(() => { button.innerHTML = originalButtonContent; }, 2000);
            });
        });
    }
    // --- CÁC HÀM ĐIỀU KHIỂN POPUP ỦNG HỘ ---
    function showDonateModal() {
        if (donateModal) donateModal.style.display = "flex";
    }

    function hideDonateModal() {
        if (donateModal) donateModal.style.display = "none";
    }

    if (closeModalBtn) closeModalBtn.addEventListener("click", hideDonateModal);

    if (donateModal) {
        donateModal.addEventListener("click", function (event) {
            if (event.target === donateModal) {
                hideDonateModal();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && donateModal && donateModal.style.display === "flex") {
            hideDonateModal();
        }
    });

});
