// 1. Thông tin & Quy định chung
const generalInfo = [
    {
        keywords: ["xin chào", "hello", "chào", "tư vấn"],
        answer: "Chào bạn. Tôi có thể giúp gì cho bạn?"
    },
    {
        keywords: ["qr", "ủng hộ", "quyen góp", "tài trợ"],
        answer:
            "<img src='maqrtan.png' alt='Mã QR Quyên góp' style='width:350px; height:350px;'>"
    },
    {
        keywords: ["địa chỉ", "cơ sở", "ở đâu", "trường ở đâu", "địa điểm"],
        answer: "<strong>Đại học Duy Tân có nhiều cơ sở tại Đà Nẵng:</strong><br><br>" +
            "- 209 Phan Thanh, Thạc Gián, Thanh Khê<br><br>" +
            "- 254 Đ. Nguyễn Văn Linh, Thạc Gián, Thanh Khê<br><br>" +
            "- 137 Đ. Nguyễn Văn Linh, Phước Ninh, Hải Châu<br><br>" +
            "- 03 Quang Trung, Hải Châu<br><br>" +
            "- K7/25 Quang Trung, Hải Châu<br><br>" +
            "- 120 Hoàng Minh Thảo, Hoà Khánh Nam, Liên Chiểu<br><br>" +
            "- 78 Phan Văn Trị, Khuê Trung, Cẩm Lệ"
    },
    {
        keywords: ["thời gian học", "giờ học", "lịch học", "học mấy giờ", "học tối"],
        answer: "<strong>Thời gian học tập (Thứ 2 - Chủ Nhật):</strong><br><br>" +
            "- Sáng: 07h00 - 09h00, 07h00 - 10h15, 07h00 - 11h15, 09h15 - 11h15<br><br>" +
            "- Chiều: 13h00 - 15h00, 13h00 - 16h15, 13h00 - 17h15, 15h15 - 17h15<br><br>" +
            "- Tối: 17h45 - 21h00"
    },
    {
        keywords: ["học kỳ", "số kỳ", "một năm mấy kỳ", "học hè"],
        answer: "Một năm học có 3 kỳ:<br><br>" +
            "- Học kỳ 1: 4 tháng (bắt buộc)<br><br>" +
            "- Học kỳ 2: 4 tháng (bắt buộc)<br><br>" +
            "- Học kỳ hè: 2 tháng (tự nguyện)"
    },
    {
        keywords: ["phòng tài chính", "kế hoạch tài chính", "tài chính"],
        answer: "<strong>Phòng Kế hoạch Tài chính:</strong><br><br>Địa chỉ: 137 Nguyễn Văn Linh"
    },
    {
        "keywords": ["phòng tài chính", "kế hoạch tài chính", "tài chính", "ví điện tử", "hoàn tiền", "nhận tiền", "chuyển nhầm tiền vào ví điện tử"],
        "answer": "<strong>Hướng dẫn nhận tiền dư(thừa)</strong><br><br>" +
            "Để đăng ký nhận tiền, sinh viên vui lòng thực hiện theo các bước sau:<br><br>" +
            "<strong>Bước 1:</strong> Đến trực tiếp <span style=\"color: #D32F2F;\"><strong>Phòng Kế hoạch Tài chính</strong></span> tại địa chỉ 137 Nguyễn Văn Linh, Thạc Gián, Q. Thanh Khê, Đà Nẵng.<br><br>" +
            "<strong>Bước 2:</strong> Liên hệ bộ phận Kế toán để cung cấp thông tin và hoàn tất thủ tục đăng ký nhận tiền<br><br>" +
            "<strong>Bước 3:</strong> Sau khi thủ tục hoàn tất, tiền sẽ được chuyển về ví của bạn trong thời gian dự kiến từ <span style=\"color: #D32F2F;\"><strong>2 đến 4 tuần</strong></span> làm việc."
    },
    {
        keywords: ["nhập học", "làm thủ tục nhập học", "nhập học ở đâu", "giờ nhập học"],
        answer: "Thí sinh đến nhập học trực tiếp tại 254 Đ. Nguyễn Văn Linh, Đà Nẵng.<br><br>" +
            "<strong>Thời gian làm việc:</strong><br><br>" +
            "- Sáng: 07g00 - 11g00 (Thứ 2 - Chủ Nhật)<br><br>" +
            "- Chiều: 13g00 - 17g00 (Thứ 2 - Chủ Nhật)"
    },
    {
        keywords: ["học phí chương trình thông thường", "tín chỉ thông thường", "cách tính học phí thông thường", "cách tính học phí"],
        answer: "<i>Ghi chú: Đơn giá 1 tín chỉ = Học phí học kì 1 (gốc chưa miễn giảm) chia cho 16.</i><br><br>" +
            "<strong>Học phí theo Số/Khung Tín chỉ Đăng ký (Chương trình thông thường):</strong><br><br>" +
            "- Sinh viên đăng ký hoặc được đăng ký từ 14 tín chỉ đến 19 tín chỉ: Đóng học phí 16 tín chỉ, theo đơn giá tín chỉ của từng chương trình.<br><br>" +
            "- Sinh viên đăng ký hoặc được đăng ký dưới 14 tín chỉ: Đóng học phí theo đúng số tín chỉ đăng ký, theo đơn giá tín chỉ của từng chương trình.<br><br>" +
            "- Sinh viên đăng ký hoặc được đăng ký trên 19 tín chỉ: Đóng học phí 16 tín chỉ (cho 19 tín chỉ đầu tiên) cộng với học phí cho số tín chỉ dôi trên 19 tín chỉ, theo đơn giá tín chỉ của từng chương trình."
    },
    {
        keywords: ["học phí chương trình tiên tiến", "tín chỉ tiên tiến", "cách tính học phí quốc tế", "cách tính học phí"],
        answer: "<i>Ghi chú: Đơn giá 1 tín chỉ = Học phí học kì 1 (gốc chưa miễn giảm) chia cho 16.</i><br><br>" +
            "<strong>Học phí theo Số/Khung Tín chỉ Đăng ký (Chương trình Tiên tiến quốc tế):</strong><br><br>" +
            "- Sinh viên đăng ký hoặc được đăng ký từ 14 tín chỉ đến 21 tín chỉ: Đóng học phí 16 tín chỉ, theo đơn giá tín chỉ của từng chương trình.<br><br>" +
            "- Sinh viên đăng ký hoặc được đăng ký dưới 14 tín chỉ: Đóng học phí theo đúng số tín chỉ đăng ký, theo đơn giá tín chỉ của từng chương trình.<br><br>" +
            "- Sinh viên đăng ký hoặc được đăng ký trên 21 tín chỉ: Đóng học phí 16 tín chỉ (cho 21 tín chỉ đầu tiên) cộng với học phí cho số tín chỉ dôi trên 21 tín chỉ, theo đơn giá tín chỉ của từng chương trình."
    },
    {
        keywords: ["nộp học phí sai", "ghi nhầm thông tin", "chuyển khoản sai", "hỗ trợ học phí", "sai nội dung", "điều chỉnh thông tin học phí", "tài chính", "không ghi nội dung"],
        answer: "Nếu bạn <strong>quên, sai hoặc thiếu nội dung</strong> khi chuyển khoản, bạn cần xử lý theo các bước sau:<br><br>" +
            "<strong>Bước 1:</strong> Đến ngân hàng của bạn (nơi bạn đã dùng để chuyển tiền) và yêu cầu <strong>điều chỉnh lại nội dung</strong> chuyển khoản cho chính xác.<br><br>" +
            "<strong>Bước 2:</strong> Sau khi ngân hàng xác nhận đã điều chỉnh, bạn hãy mang theo biên lai hoặc xác nhận đó đến <strong>Phòng Tài chính</strong> để được hỗ trợ."
    },
    {
        keywords: ["hồ sơ nhập học", "cần giấy tờ gì", "hồ sơ", "giấy tờ"],
        answer: "<strong>Hồ sơ nhập học cần chuẩn bị:</strong><br><br>" +
            "- Bản chính Giấy báo Trúng tuyển...<br><br>" +
            "- Bản chính Giấy chứng nhận kết quả thi THPT (nếu xét điểm thi)<br><br>" +
            "- 01 bản sao công chứng Học bạ THPT<br><br>" +
            "- Bản gốc Giấy chứng nhận tốt nghiệp tạm thời hoặc bản sao công chứng Bằng tốt nghiệp (nếu tốt nghiệp trước 2025)<br><br>" +
            "- 01 bản sao Giấy khai sinh<br><br>" +
            "- Giấy tờ ưu tiên (nếu có)<br><br>" +
            "- Giấy di chuyển nghĩa vụ quân sự (đối với Nam)"
    },
    {
        keywords: ["lưu ý học phí", "nộp nhầm", "nộp sai học phí", "sai nội dung", "lỗi chuyển khoản", "máy atm"],
        answer: "<strong>LƯU Ý NỘP HỌC PHÍ:</strong><br><br>" +
            "- Ghi sai MÃ SỐ SINH VIÊN sẽ không cập nhật được học phí, sinh viên vẫn bị báo nợ.<br><br>" +
            "- <strong>Không nộp học phí tại máy ATM</strong> vì không ghi được nội dung, sẽ bị báo nợ.<br><br>" +
            "- Nộp sai số tài khoản sẽ bị báo nợ.<br><br>" +
            "<strong>Xử lý nộp nhầm/sai:</strong> Liên hệ Phòng Kế hoạch tài chính (SĐT: 0236.381.6875 - 0236.381.6874) hoặc đến 137 Nguyễn Văn Linh."
    },
    {
        keywords: ["số tài khoản", "stk", "tài khoản ngân hàng", "chuyển khoản", "học phí", "lệ phí", "bảo hiểm y tế", "bảo hiểm", "bhyt"],
        answer: "<strong>Danh sách tài khoản chính thức của Đại học Duy Tân:</strong><br><br>" +

            "<strong>1. Học phí, lệ phí:</strong><br>" +
            "  - Tên tài khoản: Đại học Duy Tân<br>" +
            "  - STK VietinBank: <strong>118000181119</strong><br>" +
            "  - STK Vietcombank: <strong>6811111994</strong><br><br>" +

            "<strong>2. Bảo hiểm y tế sinh viên:</strong><br>" +
            "  - Tên tài khoản: Đại học Duy Tân<br>" +
            "  - STK VietinBank: <strong>114615167979</strong><br><br>" +

            "<strong>3. Khoá học, lệ phí thi tại Trung tâm Tin học:</strong><br>" +
            "  - Tên tài khoản: Đại học Duy Tân<br>" +
            "  - STK VietinBank: <strong>117699499999</strong><br><br>" +

            "<strong>4. Khoá học, lệ phí thi tại Trung tâm LTC:</strong><br>" +
            "  - Tên tài khoản: Đại học Duy Tân<br>" +
            "  - STK VietinBank: <strong>119644775555</strong><br><br>" +

            "<strong style='color: red;'>CẢNH BÁO QUAN TRỌNG:</strong><br>" +
            "<strong>Tuyệt đối không chuyển tiền vào tài khoản cá nhân</strong> của bất kỳ cán bộ, giảng viên nào. Nhà trường không chịu trách nhiệm đối với các trường hợp sinh viên tự ý chuyển tiền vào tài khoản khác ngoài danh sách trên."
    },
    {
        keywords: [
            "thi tốt nghiệp", "đồ án tốt nghiệp", "ĐATN", "khóa luận tốt nghiệp", "KLTN", "thực tập tốt nghiệp", "TTTN",
            "điều kiện tham gia tốt nghiệp", "điều kiện thi tốt nghiệp", "điều kiện làm đồ án",
            "sinh viên năm cuối", "tốt nghiệp sớm", "học phần tiên quyết", "điểm F",
            "nợ học phí", "kỷ luật đình chỉ", "truy cứu trách nhiệm hình sự",
            "điều kiện đủ", "điều kiện xét vớt", "nợ không quá 5%", "GPA 3.2"
        ],
        answer: "<strong>1. Điều kiện tham gia TTTN (Thực tập tốt nghiệp):</strong><br>" +
            "- <strong>Đối với SV khóa cũ và chính khóa:</strong> <span style='color: red;'>Không bị điểm F</span> ở các học phần tiên quyết cho nội dung TTTN.<br>" +
            "- <strong>Đối với SV tốt nghiệp sớm:</strong> Chỉ được tham gia TTTN nếu tổng số tín chỉ các học phần chưa hoàn thành (bị điểm F hoặc chưa học) <span style='color: darkorange;'>không quá 5%</span> tổng số tín chỉ.<br>" +
            "- <strong>Thời gian:</strong> Mỗi tín chỉ TTTN có thời gian tối thiểu 2 tuần.<br><br>" +

            "<strong>2. Điều kiện KLTN/ĐATN/Thi tốt nghiệp:</strong><br>" +
            "<strong>a. <span style='color: blue;'>Điều kiện ĐỦ</span> (Hoàn thành 100%):</strong><br>" +
            "Thỏa mãn TẤT CẢ các điều kiện sau:<br>" +
            "- <span style='color: red;'>Không nợ học phí</span>;<br>" +
            "- <span style='color: red;'>Không đang trong thời gian bị kỷ luật</span> ở mức đình chỉ học tập;<br>" +
            "- <span style='color: red;'>Không bị truy cứu trách nhiệm hình sự</span>;<br>" +
            "- Đã <span style='color: darkorange;'>hoàn thành TẤT CẢ</span> các học phần trong chương trình;<br>" +
            "- Điểm TB tích lũy toàn khóa đạt từ <span style='color: darkorange;'>2.00 trở lên</span> (thang 4).<br><br>" +

            "<strong>b. <span style='color: blue;'>Điều kiện XÉT VỚT</span>:</strong><br>" +
            "Thỏa mãn TẤT CẢ các điều kiện sau:<br>" +
            "- <span style='color: red;'>Không nợ học phí</span>;<br>" +
            "- <span style='color: red;'>Không đang trong thời gian bị kỷ luật</span> ở mức đình chỉ học tập;<br>" +
            "- <span style='color: red;'>Không bị truy cứu trách nhiệm hình sự</span>;<br>" +
            "- Tổng số tín chỉ các học phần chưa hoàn thành (bị điểm F/chưa học) <span style='color: darkorange;'>không quá 5%</span> tổng số tín chỉ;<br>" +
            "- <span style='color: red;'>Không bị điểm F</span> ở các học phần tiên quyết.<br><br>" +

            "<strong>3. Hình thức tốt nghiệp (Đối với cụm tự chọn):</strong><br>" +
            "- SV chỉ được thực hiện <span style='color: blue;'>ĐATN/KLTN</span> nếu điểm TB chung tích lũy đạt từ <span style='color: darkorange;'>3.2 trở lên</span> (thang 4) VÀ <span style='color: darkorange;'>không có học phần bị nợ</span>.<br>" +
            "- Đối với lớp ít (< 50 SV), Khoa có thể thống nhất cho cả lớp cùng làm ĐATN/KLTN hoặc cùng Thi tốt nghiệp."
    },
    {
        keywords: [
            "điều kiện xét tốt nghiệp", "công nhận tốt nghiệp", "truy cứu trách nhiệm hình sự", "đình chỉ học tập", "kỷ luật",
            "tích lũy đủ số học phần", "tổng tín chỉ", "điểm trung bình chung tích lũy", "gpa 2.0",
            "chứng chỉ giáo dục quốc phòng", "chứng chỉ giáo dục thể chất", "hội đồng xét tốt nghiệp",
            "bảng điểm", "chuyên ngành", "ngành phụ", "nợ chứng chỉ", "không tốt nghiệp", "giấy chứng nhận"
        ],
        answer: "<strong>1. Điều kiện xét và công nhận tốt nghiệp:</strong><br>" +
            "Những sinh viên có đủ các điều kiện sau thì được trường xét và công nhận tốt nghiệp:<br>" +
            "- Cho đến thời điểm xét tốt nghiệp <span style='color: red;'>không bị truy cứu trách nhiệm hình sự</span> hoặc không đang trong thời gian bị <span style='color: red;'>kỷ luật ở mức đình chỉ học tập</span>;<br>" +
            "- <span style='color: darkorange;'>Tích lũy đủ số học phần</span> quy định cho chương trình đào tạo (ĐH 6 năm: >= 180 TC; ĐH 5 năm: >= 150 TC; ĐH 4 năm: >= 120 TC; CĐ 3 năm: >= 90 TC; CĐ 2 năm: >= 60 TC);<br>" +
            "- Điểm trung bình chung tích lũy của toàn khóa học đạt từ <span style='color: darkorange;'>2,00 trở lên</span>;<br>" +
            "- <span style='color: darkorange;'>Có chứng chỉ giáo dục quốc phòng và giáo dục thể chất</span> (đối với các ngành không chuyên);<br>" +
            "- Thỏa mãn một số yêu cầu về kết quả học tập đối với nhóm học phần thuộc ngành đào tạo chính do Hiệu trưởng quy định.<br><br>" +

            "<strong>2. Các quy định khác:</strong><br>" +
            "- (Bảng điểm) Kết quả học tập phải được ghi vào bảng điểm (ghi rõ chuyên ngành/hướng chuyên sâu hoặc ngành phụ nếu có).<br>" +
            "- (Nợ chứng chỉ) Sinh viên còn <span style='color: darkorange;'>nợ chứng chỉ Giáo dục Quốc phòng và Giáo dục Thể chất</span> (đã hết thời gian học) được về trường trả nợ trong <span style='color: darkorange;'>thời hạn 5 năm</span> để đủ điều kiện xét tốt nghiệp.<br>" +
            "- (Không tốt nghiệp) Sinh viên <span style='color: darkorange;'>không tốt nghiệp</span> được cấp <span style='color: darkorange;'>giấy chứng nhận</span> về các học phần đã học.<br><br>" +

            "<strong>3. Quy trình xét:</strong><br>" +
            "Sau mỗi học kỳ, Hội đồng xét tốt nghiệp căn cứ các điều kiện trên để lập danh sách. Hiệu trưởng ký quyết định công nhận tốt nghiệp cho những sinh viên đủ điều kiện."
    },
    {
        keywords: [
            "cấp bằng tốt nghiệp", "hạng tốt nghiệp", "xếp loại tốt nghiệp", "loại xuất sắc", "loại giỏi", "loại khá", "loại trung bình",
            "gpa tốt nghiệp", "hạ bằng", "giảm hạng", "thi lại", "kỷ luật", "đơn ngành", "song ngành"
        ],
        answer: "<strong>1. Hạng tốt nghiệp (Xếp loại):</strong><br>" +
            "Bằng tốt nghiệp được cấp theo ngành đào tạo chính (đơn ngành hoặc song ngành). Hạng tốt nghiệp xác định theo Điểm trung bình chung tích lũy (thang 4) như sau:<br>" +
            "- <span style='color: blue;'>Loại xuất sắc:</span> Điểm trung bình chung tích lũy từ 3,60 đến 4,00<br>" +
            "- <span style='color: blue;'>Loại giỏi:</span> Điểm trung bình chung tích lũy từ 3,20 đến 3,59<br>" +
            "- <span style='color: blue;'>Loại khá:</span> Điểm trung bình chung tích lũy từ 2,50 đến 3,19<br>" +
            "- <span style='color: blue;'>Loại trung bình:</span> Điểm trung bình chung tích lũy từ 2,00 đến 2,49<br><br>" +

            "<strong>2. Hạ hạng tốt nghiệp:</strong><br>" +
            "Hạng tốt nghiệp (Xuất sắc và Giỏi) sẽ bị <span style='color: red;'>giảm 1 mức</span> nếu:<br>" +
            "a) Có khối lượng các học phần phải <span style='color: red;'>thi lại vượt quá 5%</span> so với tổng số tín chỉ toàn chương trình;<br>" +
            "b) Đã bị <span style='color: red;'>kỷ luật từ mức cảnh cáo</span> trở lên trong thời gian học.<br><br>"
    },
    {
        "keywords": [
            "đăng ký tín chỉ", "lưu ý đăng ký học phần", "hướng dẫn đăng ký tín chỉ", "môn tiên quyết", "học cải thiện", "học vượt", "khung chương trình", "cách đăng ký môn"
        ],
        "answer": "<strong>HƯỚNG DẪN ĐĂNG KÝ TÍN CHỈ</strong><br><br>" +
            "<strong>1. Xác định môn học cần đăng ký</strong><br>" +
            "&nbsp;&nbsp;&nbsp;- Bước 1: Truy cập MyDTU: <a href='https://mydtu.duytan.edu.vn/Signin.aspx' target='_blank'>https://mydtu.duytan.edu.vn/Signin.aspx</a><br>" +
            "&nbsp;&nbsp;&nbsp;- Bước 2: Chọn Học tập &rarr; Chương trình học &rarr; Khung Chương trình Dự kiến (để xác định môn học và môn tiên quyết).<br>" +
            "&nbsp;&nbsp;&nbsp;- Bước 3: Xác định các môn cần học trong kỳ tiếp theo (Mã môn – Tên môn – Số ĐVHT).<br>" +
            "&nbsp;&nbsp;&nbsp;- Lưu ý Tiên quyết: Kiểm tra <strong>môn tiên quyết bắt buộc</strong>. Ví dụ: Muốn học MTH 104 – Toán Cao Cấp A2 thì phải hoàn thành MTH 103 – Toán Cao Cấp A1.<br><br>" +
            "<strong>2. Lập thời khóa biểu và tra thông tin lớp học</strong><br>" +
            "&nbsp;&nbsp;&nbsp;- Bước 1: Truy cập trang tra cứu môn học: <a href='https://courses.duytan.edu.vn/Sites/Home_ChuongTrinhDaoTao.aspx?p=home_coursesearch&timespan=92' target='_blank'>courses.duytan.edu.vn</a><br>" +
            "&nbsp;&nbsp;&nbsp;- Bước 2: Chọn năm học, học kỳ và Nhập mã môn học cần tra cứu.<br>" +
            "&nbsp;&nbsp;&nbsp;- Bước 3: Ghi lại thông tin lớp học gồm: Tên lớp, <strong>Mã đăng ký</strong>, Số chỗ còn lại, Tuần học, Giờ học, Địa điểm.<br>" +
            "&nbsp;&nbsp;&nbsp;- Lưu ý Trùng lịch/Điều kiện: Hệ thống sẽ từ chối đăng ký nếu sinh viên chưa đạt môn tiên quyết hoặc đăng ký lớp trùng giờ.<br><br>" +
            "<strong>3. Đăng ký môn học chính thức trên MyDTU</strong><br>" +
            "&nbsp;&nbsp;&nbsp;- Bước 1: Truy cập MyDTU: <a href='https://mydtu.duytan.edu.vn/Signin.aspx' target='_blank'>https://mydtu.duytan.edu.vn/Signin.aspx</a><br>" +
            "&nbsp;&nbsp;&nbsp;- Bước 2: Chọn Học tập &rarr; Đăng ký môn học, sau đó chọn năm học và học kỳ.<br>" +
            "&nbsp;&nbsp;&nbsp;- Bước 3: Nhập Mã môn và Mã lớp đăng ký đã ghi ở bước tra cứu.<br>" +
            "&nbsp;&nbsp;&nbsp;- Bước 4: Nhập mã Captcha và xác nhận để hoàn tất đăng ký.<br><br>" +
            "<strong>Lưu ý Khác </strong><br>" +
            "- Được phép đăng ký học phần tự chọn, <strong>học lại (cải thiện)</strong>, hoặc <strong>học vượt</strong> (với khóa trước) nếu không trùng lịch.<br>" +
            "- Lớp chỉ được mở khi số lượng sinh viên ≥ 20 sinh viên.<br>" +
            "- Theo dõi thông báo đăng ký chính thức tại mục Tin tức & Thông báo trên myDTU."
    },
    {
        keywords: ["lỗi đăng ký học phần", "thông báo đăng ký tín chỉ", "đăng ký trùng giờ", "thiếu môn tiên quyết", "điều kiện chặt", "điều kiện lỏng", "không tồn tại lớp học", "không được phép đăng ký", "đăng ký 2 lớp"],
        answer: "<strong>Các thông báo thường gặp khi đăng ký học phần:</strong><br><br>" +
            "- <strong>Bạn không được phép đăng ký Lớp...:</strong> Sinh viên chưa được cấp quyền đăng ký.<br><br>" +
            "- <strong>Bạn không thể đăng ký 2 lớp trong cùng một môn:</strong> Đã đăng ký 1 lớp (LEC, LAB...) của môn đó rồi.<br><br>" +
            "- <strong>Đăng ký trùng giờ:</strong> Lỗi trùng Tuần học, Thứ học, hoặc Giờ học.<br><br>" +
            "- <strong>Bạn không thể đăng ký vượt quá X tín chỉ:</strong> Đã đăng ký quá số tín chỉ quy định của học kỳ.<br><br>" +
            "- <strong>Thiếu môn tiên quyết XYZ:</strong> Phải học môn XYZ trước.<br><br>" +
            "- <strong>Điều kiện chặt:</strong> Môn tiên quyết phải có điểm ĐẬU.<br><br>" +
            "- <strong>Điều kiện lỏng:</strong> Môn tiên quyết đang học/chưa có điểm vẫn cho đăng ký.<br><br>" +
            "- <strong>Không tồn tại Lớp học...:</strong> Nhập sai Mã đăng ký lớp."
    },
    {
        keywords: ["tín chỉ là gì", "khái niệm tín chỉ", "đơn vị tín chỉ", "tín chỉ tích lũy", "tổng số tín chỉ", "1 tín chỉ bao nhiêu giờ", "1 giờ lên lớp"],
        answer: "<strong>Các khái niệm về Tín chỉ:</strong><br><br>" +
            "- <strong>Tín chỉ:</strong> Con số thể hiện tầm quan trọng của học phần.<br><br>" +
            "- <strong>Đơn vị Tín chỉ:</strong> 1 tín chỉ = 1 giờ lên lớp x 15 (tuần) + 1 giờ ôn tập x 1 (tuần) + 1~2 giờ thi cử.<br><br>" +
            "- <strong>1 giờ lên lớp:</strong> = 50 phút lên lớp + 5~10 phút thảo luận = 60 phút. Đòi hỏi 2-3 giờ chuẩn bị bài ở nhà.<br><br>" +
            "- <strong>Tín chỉ Tích luỹ:</strong> Tổng số tín chỉ của các học phần Đạt (tính từ đầu khoá) cộng với tín chỉ được công nhận chuyển tiếp.<br><br>" +
            "- <strong>Tổng số Tín chỉ (CTĐT Đại học):</strong> Ít nhất 120 tín chỉ tích lũy, đào tạo trong 4-5 năm."
    },
    {
        keywords: ["nợ môn", "điểm f", "khi nào rớt môn", "điểm thi kết thúc", "điểm tổng kết", "học lại", "cách tính điểm học phần", "điểm qua môn"],
        answer: "<strong>Quy định về Điểm và Học lại:</strong><br><br>" +
            "     Sinh viên nhận <strong>điểm F</strong> nếu:<br>" +
            "  1.  <strong> Không tham gia thi</strong> kết thúc học phần.<br>" +
            "  2. Bị kỷ luật đình chỉ thi.<br>" +
            "  3. Trường hợp Điểm thi kết thúc học phần <strong>dưới 1.0</strong> sẽ bị tính là <strong>nợ môn</strong>.<br>" +
            "  4. Tổng điểm kết thúc học phần phải <strong>trên 40%</strong> thì mới được tính qua môn.<br><br>" +
            "- Sinh viên có điểm F (không đạt) <strong>phải đăng ký học lại</strong> học phần đó (hoặc môn tương đương/thay thế) ở các học kỳ sau.<br><br>" +
            "- Cách tính điểm cho học phần Thực hành, Đồ án, Thực tập không thay đổi."
    },
    {
        keywords: ["mã môn học", "mã số môn", "học kỳ fall", "học kỳ spring", "ý nghĩa mã môn", "mã đăng ký lớp"],
        answer: "<strong>Ý nghĩa Mã số (Môn) học:</strong><br><br>" +
            "Thông thường, hai chữ số cuối của Mã số (Môn) thể hiện học kỳ nên học:<br>" +
            "- Từ <strong>00 đến 49</strong>: Nên học trong Học kỳ I (Fall).<br>" +
            "- Từ <strong>50 đến 99</strong>: Nên học trong Học kỳ II (Spring).<br><br>" +
            "Ví dụ: MKT 251 nghĩa là nên học trong Học kỳ II năm thứ 2.<br>" +
            "<i>Lưu ý: Điều này không bắt buộc và không phải luôn đúng.</i>"
    },
    {
        keywords: [
            "ttgv", "giảng viên", "tìm gv", "thông tin gv", "cách tìm gv", "gv dtu", "gv duy tân", "gv mydtu", "gv google", "tìm giảng viên", "xem thông tin giảng viên", "thông tin giảng viên"],
        answer: "<strong>Thông tin giảng viên </strong><br><br>" +
            "<strong>Cách 1: Tìm trong MyDTU</strong><br>" +
            "Bước 1: Vào website <strong>Mydtu</strong><br>" +
            "Bước 2: <strong>Đăng nhập</strong> tài khoản Mydtu<br>" +
            "Bước 3: Chọn <strong>Học tập</strong><br>" +
            "Bước 4: Chọn '<strong>Đề cương Môn học</strong>' hoặc '<strong>Đề thi, Bài tập</strong>'<br>" +
            "<i>Bước 5: Chọn <strong>năm học</strong> và <strong>học kì</strong> tương ứng</i>" +
            "<br><br><hr><br>" +
            "<strong>Cách 2: Tìm trên Google</strong><br>" +
            "Bước 1: Mở trình duyệt web (vd: Google Chrome, Cốc Cốc).<br>" +
            "Bước 2: Gõ vào thanh tìm kiếm theo cú pháp: <br>" +
            "<strong>[Họ và tên giảng viên]</strong> + <strong>DTU</strong><br>" +
            "<i>(Ví dụ: Nguyễn Minh Nhật DTU)</i><br>" +
            "Bước 3: Hoặc gõ theo cú pháp:<br>" +
            "<strong>[Họ và tên giảng viên]</strong> + <strong>Đại học Duy Tân</strong><br>" +
            "<i>(Ví dụ: Nguyễn Minh Nhật Đại học Duy Tân)</i><br>" +
            "Bước 4: Nhấn Enter và xem các kết quả tìm kiếm."
    },
    {
        "keywords": ["kiểm tra", "kiểm tra giữa kỳ", "kiểm tra cuối kỳ", "ktck", "ktgk", "thi kết thúc học phần", "quy định thi", "thi tập trung", "thi tại lớp", "cấm khi thi", "giấy tờ thi"],
        "answer": "<strong>Quy định về Thi cử và Kiểm tra:</strong><br><br>" +
            "<strong>1. Kiểm tra Giữa kỳ (KTGK):</strong><br>" +
            " - Hình thức và lịch thi do <span style='color: #0056b3;'>Giảng viên giảng dạy</span> toàn quyền quyết định và thông báo trực tiếp tại lớp.<br><br>" +
            "<strong>2. Thi Cuối kỳ (CK) / Kết thúc Học phần (KTHP):</strong><br>" +
            " - <strong>Thi tại lớp:</strong> Một số môn học sẽ thi tại lớp, do Giảng viên tổ chức.<br>" +
            " - <strong>Thi tập trung:</strong> Đa số các môn sẽ thi tập trung theo lịch của Phòng Đào tạo. Sinh viên cần <span style='color: #0056b3;'>tra cứu danh sách thi</span> để biết phòng thi. <br>" +
            " &nbsp; &nbsp; - <i>Quy mô:</i> Thường gồm 24-25 sinh viên/phòng, 2 giám thị, cùng thanh tra ngoài hành lang và giám sát camera.<br><br>" +
            "<strong>3. Quy định BẮT BUỘC khi đi thi:</strong><br>" +
            " - <strong>Giấy tờ tùy thân:</strong><br>" +
            " &nbsp; &nbsp; - <span style='color: #D9534F;'>BẮT BUỘC</span> mang <span style='color: #0056b3;'>Thẻ sinh viên</span>. Sinh viên phải tháo khẩu trang khi vào phòng thi để giám thị đối chiếu.<br>" +
            " &nbsp; &nbsp; - <i>Trường hợp mất/quên Thẻ SV:</i> Có thể dùng thay thế tạm thời: <span style='color: #0056b3;'>Căn cước Công dân (CCCD)</span> hoặc <span style='color: #0056b3;'>Bằng lái xe</span>.<br>" +
            " &nbsp; &nbsp; - <i>Trường hợp không có giấy tờ:</i> Phải lập tức đến <span style='color: #D9534F;'>Phòng Hội đồng thi</span> để làm thủ tục xác minh danh tính trước giờ thi.<br>" +
            " - <strong>Vật dụng CẤM:</strong><br>" +
            " &nbsp; &nbsp; - <span style='color: #D9534F;'>NGHIÊM CẤM</span> mang vào phòng thi: <span style='color: #D9534F;'>Điện thoại di động, Đồng hồ thông minh (Smartwatch)</span>, và bất kỳ thiết bị, tài liệu gian lận nào khác.<br>" +
            " &nbsp; &nbsp; - <strong>Xử lý vi phạm:</strong> Mọi trường hợp vi phạm sẽ bị <span style='color: #D9534F;'>lập biên bản và nhận điểm 0 (RỚT MÔN)</span> ngay lập tức."
    },
    {
        keywords: ["mã hình thức lớp", "hình thức lớp", "clc là gì", "lec là gì", "lab là gì", "prj là gì", "ý nghĩa mã lớp học", "số giờ học", "số giờ ôn tập", "dis", "fld", "grp", "ind", "int", "rea", "rec", "sem", "ses", "slf", "std", "sup", "tut", "vol", "wor", "col", "con", "dem"],
        answer: "<strong>Giải thích các Mã Hình Thức Lớp (dựa trên Phụ lục B):</strong><br><br>" +
            "<strong>CLC - Lâm Sàng:</strong><br>- Mô tả: Thực tập/thực hành trực tiếp với bệnh nhân.<br>- Chi tiết: 45 giờ học, 3 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>COL - Hội Thảo Chuyên Đề:</strong><br>- Mô tả: Hội họp với sự góp mặt của nhiều người có nhiều kinh nghiệm thực tế.<br>- Chi tiết: 15 giờ học, 1 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>CON - Đối Thoại:</strong><br>- Mô tả: Thực hành đối thoại ngôn ngữ/ngoại ngữ.<br>- Chi tiết: 30 giờ học, 2 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>DEM - Biểu Diễn:</strong><br>- Mô tả: Học qua quan sát biểu diễn hay mô phỏng của giảng viên.<br>- Chi tiết: 15 giờ học, 1 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>DIS - Thảo Luận:</strong><br>- Mô tả: Hỏi đáp giữa sinh viên/học viên với giảng viên.<br>- Chi tiết: 15 giờ học, 1 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>FLD - Dã Ngoại:</strong><br>- Mô tả: Học qua tham quan/dã ngoại ngoài lớp học.<br>- Chi tiết: 45 giờ học, 3 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>GRP - Học Nhóm:</strong><br>- Mô tả: Học nhóm theo hướng dẫn của giảng viên.<br>- Chi tiết: 45 giờ học, 3 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>IND - Tự Nghiên Cứu:</strong><br>- Mô tả: Tự nghiên cứu và phát triển.<br>- Chi tiết: 36 giờ học (không có giờ ôn tập/thi).<br><br>" +
            "<strong>INT - Thực Tập:</strong><br>- Mô tả: Làm việc ở các doanh nghiệp, cơ quan, tổ chức thực tế.<br>- Chi tiết: 45 giờ học, 3 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>LAB - Thực Hành \\ Thí Nghiệm:</strong><br>- Mô tả: Thực hành trong phòng thí nghiệm.<br>- Chi tiết: 30 giờ học, 2 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>LEC - Giảng Lý Thuyết:</strong><br>- Mô tả: Nghe giảng lý thuyết.<br>- Chi tiết: 15 giờ học, 1 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>PRJ - Đồ Án:</strong><br>- Mô tả: Học qua việc làm đồ án/dự án.<br>- Chi tiết: 45 giờ học, 3 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>REA - Đọc:</strong><br>- Mô tả: Học qua tự đọc hay đọc theo hướng dẫn.<br>- Chi tiết: 48 giờ học (không có giờ ôn tập/thi).<br><br>" +
            "<strong>REC - Ôn Tập:</strong><br>- Mô tả: Ôn tập lại những kiến thức đã học trong các hình thức lớp khác (thường là lý thuyết).<br>- Chi tiết: 16 giờ học (không có giờ ôn tập/thi).<br><br>" +
            "<strong>SEM - Seminar:</strong><br>- Mô tả: Hội họp.<br>- Chi tiết: 15 giờ học, 1 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>SES - Trình Bày \\ Thảo Luận:</strong><br>- Mô tả: Trình bày nội dung và ngay sau đó, thảo luận về nội dung đó.<br>- Chi tiết: 15 giờ học, 1 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>SLF - Tự Học:</strong><br>- Mô tả: Tự học theo những yêu cầu cụ thể (ví dụ qua việc làm danh sách bài học).<br>- Chi tiết: 32 giờ học (không có giờ ôn tập/thi).<br><br>" +
            "<strong>STD - Studio:</strong><br>- Mô tả: Thực hành hoặc làm đồ án trong Studio(s).<br>- Chi tiết: 30 giờ học, 2 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>SUP - Bổ Trợ:</strong><br>- Mô tả: Học thêm hoặc ôn tập thêm.<br>- Chi tiết: 15 giờ học, 1 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>TUT - Phụ Đạo:</strong><br>- Mô tả: Một người phụ đạo cho một hoặc một số người khác.<br>- Chi tiết: 15 giờ học, 1 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>VOL - Tình Nguyện:</strong><br>- Mô tả: Tự nguyện tham gia.<br>- Chi tiết: 45 giờ học, 3 giờ ôn tập, 1-2 giờ thi.<br><br>" +
            "<strong>WOR - Workshop:</strong><br>- Mô tả: Thực hành qua việc trực tiếp làm một việc gì đó, với sự góp mặt của nhiều người khác.<br>- Chi tiết: 30 giờ học, 2 giờ ôn tập, 1-2 giờ thi."
    },
    {
        "keywords": ["đầu ra", "chuẩn đầu ra", "tốt nghiệp", "điều kiện tốt nghiệp", "chuẩn tiếng anh", "chuẩn tin học"],
        "answer": "<strong>Thông tin Chuẩn Đầu ra Tốt nghiệp:</strong><br><br>" +
            "Sinh viên tham khảo thông tin chi tiết về các chuẩn đầu ra (Tiếng Anh, Tin học,...) để đủ điều kiện xét tốt nghiệp tại đây:<br><br>" +
            "<a href='https://t.me/Dai_Hoc_Duy_Tan/140' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        "keywords": ["gửi xe", "phí gửi xe", "giá gửi xe", "tiền gửi xe", "giữ xe", "thanh toán gửi xe", "bãi xe"],
        "answer": "<strong>Phí Gửi xe tại các cơ sở:</strong><br><br>" +
            " - Thanh toán bằng <span style='color: #0056b3;'>Thẻ (quẹt thẻ)</span>: <span style='color: #0056b3;'>2.000 VNĐ/lượt</span><br>" +
            " - Thanh toán bằng <span style='color: #D9534F;'>Tiền mặt</span>: <span style='color: #D9534F;'>4.000 VNĐ/lượt</span>"
    },
    {
        "keywords": ["mất thẻ sinh viên", "làm lại thẻ", "thẻ sinh viên", "mất thẻ", "phòng công tác sinh viên", "ctsv", "quy định thẻ", "hỏng thẻ", "nghiêm cấm thẻ"],
        "answer": "<strong>Quy định về Thẻ Sinh viên (Mất/Làm lại):</strong><br><br>" +
            "Khi bị mất hoặc hỏng thẻ, sinh viên cần <span style='color: #D9534F;'>báo ngay</span> cho <span style='color: #0056b3;'>Phòng Công tác Sinh viên (CTSV)</span> để được cấp lại.<br><br>" +
            "<strong>Địa điểm làm lại:</strong><br>" +
            " - <strong>Văn phòng:</strong> <span style='color: #0056b3;'>Phòng 214 (Phòng công tác sinh viên) </span>, cơ sở K7/25 Quang Trung.<br>" +
            " - <strong>Thủ tục:</strong> <span style='color: #0056b3;'>Không cần chụp ảnh lại</span> (đã có ảnh trên hệ thống).<br>" +
            " - <strong>Thời gian:</strong> Chờ lấy ngay, khoảng <span style='color: #0056b3;'>5 phút</span>.<br>" +
            " - <strong>Lệ phí:</strong> <span style='color: #D9534F;'>100.000 VNĐ</span>.<br>" +
            " - <strong>SĐT (CTSV):</strong> +84-236-3-650 403 (223).<br><br>" +
            "<strong style='color: #D9534F;'>NGHIÊM CẤM CÁC HÀNH VI SAU:</strong><br>" +
            " - Cố tình làm hỏng thẻ.<br>" +
            " - Cho người khác mượn hoặc sử dụng thẻ của mình.<br>" +
            " - Sử dụng thẻ vào các mục đích sai trái (cá cược, đặt cọc,...).<br>" +
            " - Làm giả thẻ sinh viên."
    },
    {
        "keywords": ["chuyển ngành", "thủ tục chuyển ngành", "điều kiện chuyển ngành", "đổi ngành", "xin chuyển ngành", "đơn chuyển ngành", "phòng đào tạo", "p.đt", "trưởng khoa"],
        "answer": "<strong>Quy định về Chuyển ngành:</strong><br><br>" +
            "<strong>Điều kiện được xem xét chuyển ngành:</strong><br>" +
            " - Đã tham dự kỳ thi tuyển sinh theo đề chung và có kết quả thi <span style='color: #0056b3;'>bằng hoặc cao hơn</span> điểm trúng tuyển của ngành xin chuyển đến.<br>" +
            " - <span style='color: #D9534F;'>Không phải là SV năm thứ nhất hoặc năm cuối</span> của thời gian thiết kế khóa học (xem chi tiết trong Quy chế đào tạo).<br>" +
            " - <span style='color: #D9534F;'>Không trong thời gian bị kỷ luật</span> từ cảnh cáo trở lên.<br>" +
            " - Đạt <span style='color: #0056b3;'>số tín chỉ tích lũy</span> tối thiểu và có <span style='color: #0056b3;'>điểm trung bình chung</span> tích lũy theo quy định.<br>" +
            " - Được sự <span style='color: #0056b3;'>chấp thuận của hai Trưởng khoa</span> (chuyển đến và chuyển đi).<br><br>" +
            "<strong>Các bước thực hiện:</strong><br>" +
            " <strong>Bước 1:</strong> SV viết đơn (theo mẫu) và phải có <span style='color: #0056b3;'>xác nhận của gia đình</span>.<br>" +
            " <strong>Bước 2:</strong> SV xin <span style='color: #0056b3;'>xác nhận đồng ý</span> của hai Trưởng khoa (chuyển đi và chuyển đến).<br>" +
            " <strong>Bước 3:</strong> SV nộp đơn và các giấy tờ cần thiết lên <span style='color: #0056b3;'>P.Đào tạo ĐH&SĐH</span>. Phòng Đào tạo sẽ xét duyệt và thông báo kết quả cho SV.<br>" +
            " <strong>Bước 4:</strong> SV đến <span style='color: #0056b3;'>P.Đào tạo ĐH&SĐH</span> để nhận Quyết định (nếu được duyệt).<br><br>" +
            "<strong style='color: #D9534F;'>LƯU Ý QUAN TRỌNG:</strong><br>" +
            " - Thời gian nộp đơn: <span style='color: #D9534F;'>2 tuần đầu tiên của mỗi học kỳ</span>."
    },
    {
        "keywords": ["bảo lưu", "xin bảo lưu", "thời gian bảo lưu", "điều kiện bảo lưu", "nghỉ học tạm thời", "đơn xin bảo lưu", "trường hợp bảo lưu"],
        "answer": "<strong>Quy định về Bảo lưu kết quả học tập (Nghỉ học tạm thời):</strong><br><br>" +
            "<strong>Các trường hợp được xét bảo lưu:</strong><br>" +
            " - Được điều động vào <span style='color: #0056b3;'>lực lượng vũ trang</span> (phải có lệnh điều động của cơ quan có thẩm quyền).<br>" +
            " - Bị <span style='color: #0056b3;'>ốm hoặc tai nạn</span> buộc phải điều trị trong thời gian dài (phải có giấy xác nhận của cơ quan y tế cấp tỉnh, thành trở lên).<br>" +
            " - Vì <span style='color: #0056b3;'>nhu cầu cá nhân</span> (Chỉ chấp nhận khi SV có thời gian học ít nhất 1 học kỳ, không thuộc diện buộc thôi học và đạt điều kiện điểm).<br><br>" +
            "<strong>Điều kiện chung để được xét:</strong><br>" +
            " - Điểm trung bình chung tích lũy <span style='color: #0056b3;'>không dưới 2.0</span> (tương ứng thang điểm 10 là 5.00 – 5.49).<br>" +
            " - Sinh viên phải <span style='color: #0056b3;'>hoàn thành nghĩa vụ tài chính</span> với trường tính đến thời điểm nộp đơn.<br>" +
            " - Có đơn xin nghỉ học tạm thời với đầy đủ các giấy tờ liên quan hợp lệ và hoàn tất thủ tục theo đúng yêu cầu.<br><br>" +
            "<strong>Quy định về thời gian:</strong><br>" +
            " - Thời gian được nghỉ: <span style='color: #D9534F;'>Không quá 4 học kỳ chính</span>.<br>" +
            " - Thời gian nghỉ <span style='color: #0056b3;'>được tính vào tổng thời gian</span> tối đa được phép học tại trường.<br>" +
            " - Trong thời gian nghỉ, nhà trường <span style='color: #D9534F;'>không xác nhận</span> bất kỳ giấy tờ cá nhân nào liên quan đến sinh viên.<br><br>" +
            "<strong style='color: #D9534F;'>LƯU Ý QUAN TRỌNG:</strong><br>" +
            " - Thời gian nộp đơn xin bảo lưu (vì lý do cá nhân): <span style='color: #D9534F;'>2 tuần đầu tiên của mỗi học kỳ</span>."
    },
    {
        "keywords": ["hoãn thi", "xin hoãn thi", "đơn hoãn thi", "thi ghép", "tai nạn", "ốm khi thi", "trùng giờ thi", "phòng đào tạo", "p.đt"],
        "answer": "<strong>Quy định về Hoãn thi:</strong><br><br>" +
            "<strong>Trường hợp được xét:</strong><br>" +
            " - Vì lý do cá nhân (<span style='color: #0056b3;'>trùng giờ thi</span>, <span style='color: #0056b3;'>lý do sức khỏe</span>, <span style='color: #0056b3;'>tai nạn</span>...) khiến SV không thể tham dự kỳ thi kết thúc học phần đúng tiến độ.<br>" +
            " - <span style='color: #D9534F;'>Lưu ý:</span> SV sẽ phải đăng ký <span style='color: #0056b3;'>thi ghép các khóa khác</span> tại P. Đào tạo vào các đợt thi gần nhất có tổ chức học phần đó.<br><br>" +
            "<strong>Các bước thực hiện:</strong><br>" +
            " <strong>Bước 1:</strong> SV <span style='color: #0056b3;'>hoàn thành học phí</span> của môn xin hoãn. Tải mẫu đơn xin hoãn thi tại Website khoa: <a href='https://ktiengtrung.duytan.edu.vn/bieu-mau' style='color: #0056b3; text-decoration: none;'>https://ktiengtrung.duytan.edu.vn/bieu-mau</a>.<br>" +
            " <strong>Bước 2:</strong> Điền đầy đủ thông tin vào đơn + minh chứng (giấy nhập viện, giấy xác nhận...), đưa <span style='color: #0056b3;'>CVHT ký</span>, và trình <span style='color: #0056b3;'>Khoa Ký</span> (gửi văn phòng Viện/Khoa).<br>" +
            " <strong>Bước 3:</strong> Nộp đơn (đã được duyệt) + minh chứng + biên lai học phí cho <span style='color: #0056b3;'>P. Đào tạo</span>. (Nếu SV bị tai nạn/ốm, <span style='color: #0056b3;'>có thể nhờ người thân, bạn bè</span> làm giúp).<br>" +
            " <strong>Bước 4:</strong> SV tự theo dõi lịch thi của các đợt tiếp theo. Khi có môn thi, SV mang đơn hoãn thi đã được duyệt đến <span style='color: #0056b3;'>P. Đào tạo</span> để đăng ký thi ghép."
    },
    {
        "keywords": ["giấy khen", "khen thưởng", "điều kiện giấy khen", "điều kiện khen thưởng", "điểm học tập", "rèn luyện"],
        "answer": "<strong>Điều kiện nhận Giấy khen thưởng:</strong><br><br>" +
            "Để nhận được giấy khen thưởng, SV phải đủ 2 điều kiện sau:<br>" +
            " 1. Điểm học tập: <span style='color: #0056b3;'>>= 3.34</span><br>" +
            " 2. Kết quả rèn luyện năm học đó: <span style='color: #0056b3;'>phải đạt loại Tốt hoặc Xuất sắc</span>."
    },
    {
        "keywords": ["xét tốt nghiệp", "đơn xin xét tốt nghiệp", "tốt nghiệp sớm", "khóa cũ", "thi lại tốt nghiệp", "công nhận tốt nghiệp", "thực tập tốt nghiệp"],
        "answer": "<strong>Đơn xin xét tham dự Tốt nghiệp:</strong><br><br>" +
            "<strong>Đối tượng áp dụng:</strong><br>" +
            " - <span style='color: #0056b3;'>SV khóa cũ:</span> Đăng ký thực tập, thi lại tốt nghiệp, hoặc công nhận tốt nghiệp.<br>" +
            "   (Đơn phải có <span style='color: #D9534F;'>xác nhận của địa phương hoặc cơ quan</span> công tác).<br>" +
            " - <span style='color: #0056b3;'>SV năm cuối:</span> Đăng ký thực tập tốt nghiệp sớm.<br>" +
            "   (Đơn <span style='color: #0056b3;'>không cần có xác nhận</span>).<br><br>" +
            "<strong>Cách làm đơn:</strong><br>" +
            " <strong>Bước 1:</strong> SV điền đơn (theo mẫu) kèm các giấy tờ cần thiết, gửi <span style='color: #0056b3;'>văn phòng Khoa</span> để phê duyệt.<br>" +
            " <strong>Bước 2:</strong> SV theo dõi kế hoạch và tiến độ tốt nghiệp của mỗi đợt để hoàn thành các nội dung yêu cầu.<br>" +
            " <span style='color: #D9534F;'>Lưu ý:</span> Mỗi đợt tốt nghiệp, SV đã nộp đủ các chứng chỉ đầu ra theo quy định thì phải <span style='color: #D9534F;'>nộp lại đơn này</span> để được xét tốt nghiệp."
    },
    {
        "keywords": ["học phí", "thắc mắc học phí", "liên hệ học phí", "khoa tiếng Trung", "cô Diệu", "cô Thư", "P.KHTC", "phòng Kế hoạch Tài chính"],
        "answer": "<strong>Thắc mắc về Học phí (Khoa Tiếng Trung):</strong><br><br>" +
            "Nếu có thắc mắc liên quan đến vấn đề học phí khoa tiếng Trung, SV liên hệ để được hỗ trợ giải đáp:<br>" +
            " - <span style='color: #0056b3;'>Cô Diệu (P.KHTC):</span> <span style='color: #0056b3;'>0935811319</span><br>" +
            " - <span style='color: #0056b3;'>Cô Thư (P.KHTC):</span> <span style='color: #0056b3;'>0916050605</span>"
    },
    {
        "keywords": ["BHYT", "bảo hiểm y tế", "thẻ BHYT", "mất thẻ BHYT", "liên hệ BHYT", "bhyt"],
        "answer": "<strong>Thắc mắc về Thẻ BHYT:</strong><br><br>" +
            "<strong>Thắc mắc chung:</strong><br>" +
            " - SV liên hệ <span style='color: #0056b3;'>Cô Hương (phòng P.KHTC)</span> qua SĐT: <span style='color: #0056b3;'>0779524078</span> để được hỗ trợ giải đáp.<br><br>" +
            "<strong>Trường hợp mất thẻ BHYT:</strong><br>" +
            " - SV phải <span style='color: #D9534F;'>tự đến</span> <span style='color: #0056b3;'>BHXH quận Thanh Khê</span> (tại địa chỉ 574A Trần Cao Vân) để làm lại."
    },
    {
        "keywords": ["chuẩn đầu ra", "tin học", "chuẩn tin học", "MOS", "chứng chỉ tin học", "ứng dụng CNTT", "CNTT nâng cao", "IP", "AP", "FE", "trung cấp tin học"],
        "answer": "<strong>Chuẩn Tin học đầu ra (Hệ Đại học):</strong><br><br>" +
            "SV cần đạt <span style='color: #0056b3;'>một trong</span> các điều kiện sau:<br><br>" +
            " 1. <strong>Chứng chỉ do ĐH Duy Tân cấp:</strong><br>" +
            "  - <span style='color: #0056b3;'>Chứng chỉ kỹ thuật viên tin học</span>, hoặc<br>" +
            "  - <span style='color: #0056b3;'>Chứng chỉ ứng dụng CNTT nâng cao</span> (theo Thông tư 03/2014/TT-BTTTT).<br>" +
            "  - <i>Tham khảo tại:</i> <a href='http://tttinhoc.duytan.edu.vn/' style='color: #0056b3; text-decoration: none;'>http://tttinhoc.duytan.edu.vn/</a><br><br>" +
            " 2. <strong>Chứng chỉ quốc tế:</strong><br>" +
            "  - <span style='color: #0056b3;'>MOS</span> (đạt ít nhất 3 kỹ năng: Word, Excel, Powerpoint).<br>" +
            "  - <span style='color: #0056b3;'>Chứng nhận IP, AP, FE</span> (do Bộ Khoa học và Công nghệ cấp).<br>" +
            "  - <i>Tham khảo tại:</i> <a href='http://ltc.org.vn/' style='color: #0056b3; text-decoration: none;'>http://ltc.org.vn/</a> hoặc <a href='https://www.facebook.com/ltcdtu' style='color: #0056b3; text-decoration: none;'>https://www.facebook.com/ltcdtu</a><br><br>" +
            " 3. <strong>Văn bằng khác:</strong><br>" +
            "  - Có <span style='color: #0056b3;'>bằng Trung cấp Tin học</span> trở lên."
    },
    {
        "keywords": [
            "giấy xác nhận", "đăng ký giấy xác nhận", "xin giấy xác nhận", "nvqs", "gia cảnh", "xin việc", "chính sách", "nhận thưởng", "Vay vốn", "Vay vốn cho sinh viên", "Giấy xác nhận Vay vốn cho sinh viên", "Hưởng chế độ chính sách", "Cấp bù tiền miễn, giảm học phí", "Giấy xác nhận Hưởng chế độ chính sách",
        ],
        "answer": "<strong>Cách Đăng Ký Giấy Xác Nhận (qua mydtu):</strong><br><br>" +
            "<strong>Các bước thực hiện:</strong><br>" +
            " Bước 1: Vào website <span style='color: #0056b3;'>mydtu</span> chọn <strong>Đăng Ký Cấp Giấy xác nhận</strong> -> <strong>Đăng ký Cấp Giấy xác nhận</strong>.<br>" +
            " Bước 2: Chọn <strong>+ Thêm mới</strong>.<br>" +
            " Bước 3: Chọn <strong>Loại Giấy xác nhận</strong> và <strong>Giấy xác nhận</strong> tương ứng. Tùy theo nhu cầu, bạn chọn một trong 3 trường hợp sau:<br><br>" +
            "   <strong>Trường hợp 1:</strong><br>" +
            "   - <i>Loại Giấy xác nhận:</i> <span style='color: #0056b3;'>Giấy xác nhận (NVQS, gia cảnh, xin việc, chính sách, nhận thưởng)</span><br>" +
            "   - <i>Giấy xác nhận:</i> <span style='color: #0056b3;'>Giấy xác nhận (NVQS, gia cảnh, xin việc, chính sách, nhận thưởng)</span><br><br>" +
            "   <strong>Trường hợp 2:</strong><br>" +
            "   - <i>Loại Giấy xác nhận:</i> <span style='color: #0056b3;'>Giấy xác nhận Vay vốn cho sinh viên</span><br>" +
            "   - <i>Giấy xác nhận:</i> <span style='color: #0056b3;'>Giấy xác nhận Vay vốn cho sinh viên</span><br><br>" +
            "   <strong>Trường hợp 3:</strong><br>" +
            "   - <i>Loại Giấy xác nhận:</i> <span style='color: #0056b3;'>Giấy xác nhận Hưởng chế độ chính sách</span><br>" +
            "   - <i>Giấy xác nhận:</i> <span style='color: #0056b3;'>Giấy xác nhận Hưởng chế độ chính sách: Cấp bù tiền miễn, giảm học phí.</span><br><br>" +
            " Bước 4: Chọn Năm học và Học kỳ tương ứng.<br><br>" +
            "<strong>Nơi nhận và Thông tin liên hệ:</strong><br>" +
            " - <strong>Nơi nhận:</strong> Văn phòng<br>" +
            " - <i>Địa chỉ:</i> Phòng 214 - cơ sở K7/25 Quang Trung, Quận Hải Châu, Tp Đà Nẵng<br>" +
            " - <i>Số Điện thoại:</i> 0236 3650 970<br>" +
            " - <i>Hotline:</i> 0236.3827111 (máy lẻ 214)<br>" +
            " - <i>Email:</i> <a href='mailto:hssv@duytan.edu.vn' style='color: #0056b3; text-decoration: none;'>hssv@duytan.edu.vn</a><br>" +
            " - <i>Giờ làm việc:</i> Giờ hành chính"
    },
    {
        "keywords": ["xem xét lại bài thi", "phúc khảo", "đơn phúc khảo", "đơn xem xét lại bài thi", "kết thúc học phần", "thi KTHP", "chấm lại bài", "đơn xem xét điểm", "mẫu đơn xem xét lại bài thi"],
        "answer": "<strong>Mẫu đơn xem xét lại bài thi kết thúc học phần (áp dụng từ 10/10/2025)</strong><br><br>" +
            "<strong>Quy trình đề nghị xem xét lại bài thi kết thúc học phần:</strong><br><br>" +
            "<strong>Bước 1:</strong> Sinh viên làm đơn đề nghị xem xét lại bài thi kết thúc học phần theo mẫu, điền đầy đủ thông tin và nộp đơn về <span style='color: #0056b3;'>Trung tâm khảo thí</span>.<br><br>" +
            "<strong>Bước 2:</strong> <span style='color: #0056b3;'>Trung tâm khảo thí</span> chuyển văn bản và giấy tờ liên quan đến <span style='color: #0056b3;'>Ban Đào tạo</span>. (<a href='https://t.me/Dai_Hoc_Duy_Tan/479' target='_blank' style='color: #D9534F; font-weight: bold;'>XEM MẪU ĐƠN TẠI ĐÂY</a>)<br><br>" +
            "Lãnh đạo <span style='color: #0056b3;'>Ban Đào tạo</span> phê duyệt, giao bộ phận Đào tạo cập nhật lại điểm thi kết thúc học phần nếu có thay đổi."
    },
    {
        "keywords": ["điều chỉnh điểm quá trình", "điểm quá trình", "đơn điều chỉnh điểm quá trình", "cập nhật điểm quá trình", "sửa điểm quá trình", "mẫu đơn điều chỉnh điểm quá trình", "phúc khảo điểm quá trình"],
        "answer": "<strong>Quy trình đề nghị điều chỉnh điểm quá trình</strong><br><br>" +
            "<strong>Bước 1:</strong> Sinh viên làm đơn đề nghị điều chỉnh điểm quá trình theo mẫu (<a href='https://t.me/Dai_Hoc_Duy_Tan/480' target='_blank' style='color: #D9534F; font-weight: bold;'>XEM MẪU ĐƠN TẠI ĐÂY</a>), điền đầy đủ thông tin và nộp tại <span style='color: #0056b3;'>khoa</span>.<br><br>" +
            "<strong>Bước 2:</strong> Lãnh đạo <span style='color: #0056b3;'>Khoa</span> mời giảng viên bộ môn đến làm việc, giảng viên có ý kiến và xác nhận trên đơn.<br><br>" +
            "<strong>Bước 3:</strong> <span style='color: #0056b3;'>Khoa</span> lưu ý chuyển đơn có xác nhận trên đơn của giảng viên đến <span style='color: #0056b3;'>Phòng Tổng hợp</span>.<br><br>" +
            "<strong>Bước 4:</strong> <span style='color: #0056b3;'>Phòng Tổng hợp</span> trình <span style='color: #0056b3;'>Hiệu trưởng</span> ký duyệt đơn và chuyển đến <span style='color: #0056b3;'>Ban Đào tạo</span>.<br><br>" +
            "<strong>Bước 5:</strong> Lãnh đạo <span style='color: #0056b3;'>Ban Đào tạo</span> ký duyệt.<br>Nếu đúng, sẽ chuyển cho cán bộ giáo vụ cập nhật lại điểm quá trình, nếu không đồng ý sẽ ghi lý do và trả đơn cho sinh viên."
    }
];

// 2. Website & Cổng thông tin DTU
const dtuWebsites = [
    {
        keywords: ["tuyển sinh", "ban tuyển sinh", "hotline", "email tuyển sinh", "trang tuyển sinh", "chuyên trang tuyển sinh"],
        answer: "<strong>Ban Tuyển sinh Đại học Duy Tân:</strong><br><br>" +
            "- Địa chỉ: 254 Nguyễn Văn Linh - TP Đà Nẵng<br><br>" +
            "- Email: tuyensinh@duytan.edu.vn<br><br>" +
            "- Điện thoại: 02363.650403 - 02363.653561<br><br>" +
            "- Hotline: 0905.294.390 - 0905.294.391 - 1900.2252<br><br>" +
            "- Trang Tuyển sinh chính thức: <a href='https://duytan.edu.vn/tuyen-sinh/Page/Home.aspx' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["phòng đào tạo", "pđt", "pdaotao"],
        answer: "<strong>Phòng đào tạo (PĐT):</strong> P202, K7/25 Quang Trung<br><br>" +
            "Website: <a href='https://pdaotao.duytan.edu.vn/home/Default.aspx?lang=VN' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["công tác sinh viên", "ctsv", "ban công tác sinh viên"],
        answer: "<strong>Ban Công tác Sinh viên (CTSV):</strong> P214, K7/25 Quang Trung<br><br>" +
            "Website: <a href='https://hssv.duytan.edu.vn/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["giáo dục thể chất", "quốc phòng", "Trung tâm Giáo dục Thể Chất - Quốc phòng", "gdtcqp", "tt gdtc", "thể dục"],
        answer: "<strong>Trung tâm Giáo dục Thể Chất - Quốc phòng:</strong><br><br>" +
            "Địa chỉ: Hòa Khánh Nam<br><br>" +
            "Website: <a href='https://gdtcqp.duytan.edu.vn/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["mydtu", "cổng thông tin", "trang sinh viên", "đăng nhập mydtu", "signin"],
        answer: "<strong>Hệ thống myDTU:</strong><br><br>" +
            "<a href='https://mydtu.duytan.edu.vn/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        "keywords": ["tra danh sách thi", "phòng thi", "danh sách thi", "ds thi", "xem phòng thi", "lịch thi"],
        "answer": "<strong>Hướng dẫn Tra cứu Danh sách thi và Phòng thi:</strong><br><br>" +
            "<strong>Link tra cứu:</strong><br>" +
            " - <strong>Link chính:</strong> <a href='https://pdaotao.duytan.edu.vn/EXAM_LIST/Default.aspx?lang=VN' target='_blank'>Trang tra cứu Danh sách thi (Phòng Đào tạo)</a><br>" +
            " - Link dự phòng: <a href='https://pdaotao.duytan.edu.vn/Search/Default.aspx?lang=VN' target='_blank'>Trang tra cứu (Dự phòng)</a><br><br>" +
            "<strong>Các bước thực hiện:</strong><br>" +
            "<strong>Bước 1:</strong> Sinh viên truy cập vào link <a href='https://pdaotao.duytan.edu.vn/EXAM_LIST/Default.aspx?lang=VN' target='_blank'>Phòng Đào tạo</a>.<br>" +
            "<strong>Bước 2:</strong> Tìm <span style='color: #0056b3;'>Mã môn học</span> và <span style='color: #0056b3;'>Tên môn học</span> tương ứng với lịch thi của bạn.<br>" +
            "<strong>Bước 3:</strong> Nhấn vào tên môn học và <span style='color: #D9534F;'>tải file danh sách đính kèm</span> (thường là file Excel hoặc PDF) về để xem phòng thi.<br><br>" +
            "<strong>Giải thích dòng thông tin:</strong><br>" +
            "<i>Ví dụ: LAW 362 - Thuế Nhà Nước (08:23 17/10/2025)</i><br>" +
            " - <span style='color: #0056b3;'>LAW 362</span>: Mã môn học.<br>" +
            " - <span style='color: #0056b3;'>Thuế Nhà Nước</span>: Tên môn học.<br>" +
            " - <span style='color: #0056b3;'>(08:23 17/10/2025)</span>: Ngày và giờ file danh sách thi được tải lên hệ thống."
    },
    {
        "keywords": ["lịch học", "cách đọc lịch học", "đọc phòng học", "giải thích lịch học"],
        "answer": "<strong>Cách đọc Thông tin trên Lịch học:</strong><br><br>" +
            "<strong>Ví dụ:</strong> <span style='color: #0056b3;'>ENG 129 M | Speaking - Level 1 (International School) | P. 503, K7/25 Quang Trung</span><br><br>" +
            "<strong>Giải thích:</strong><br>" +
            " - <span style='color: #0056b3;'>ENG 129</span>: Mã môn học.<br>" +
            " - <span style='color: #0056b3;'>M</span>: Mã lớp học (Lớp M).<br>" +
            " - <span style='color: #0056b3;'>Speaking - Level 1 (International School)</span>: Tên môn học.<br>" +
            " - <span style='color: #0056b3;'>P. 503</span>: Phòng học. Chữ số đầu tiên là Tầng, các chữ số sau là số phòng. (Ví dụ: P. 503 = <span style='color: #D9534F;'>Tầng 5, Phòng 03</span>).<br>" +
            " - <span style='color: #0056b3;'>K7/25 Quang Trung</span>: Địa điểm/Tên cơ sở học."
    },
    {
        "keywords": ["xem lịch học", "giải thích lịch học", "lịch học mydtu", "lịch học online", "lịch học trực tiếp", "lịch học zoom", "mydtu", "màu lịch học", "màu vàng", "màu xanh lá", "màu xanh dương"],
        "answer": "<strong>Hướng dẫn Xem Lịch học trên MyDTU:</strong><br><br>" +
            "<strong>Bước 1:</strong> Đăng nhập vào tài khoản sinh viên tại website <a href='https://mydtu.duytan.edu.vn/' target='_blank'>mydtu.duytan.edu.vn</a>.<br>" +
            "<strong>Bước 2:</strong> Trên giao diện chính, chọn mục <span style='color: #0056b3;'>'Lịch'</span> (Schedule) và chọn thẻ <span style='color: #0056b3;'>'Lịch học'</span> (Course Schedule).<br>" +
            "<strong>Bước 3:</strong> Phân biệt hình thức học theo màu sắc:<br>" +
            " &nbsp; &nbsp; - <span style='color: #DAA520;'>Màu vàng (Yellow):</span> Lớp học trực tiếp (Offline) tại giảng đường.<br>" +
            " &nbsp; &nbsp; - <span style='color: #90EE90;'>Màu xanh lá (Light Green):</span> Lớp Học Trực Tuyến (Giảng viên và Sinh viên cùng Dạy/Học Online ở Nhà). Sinh viên cần <span style='color: #D9534F;'>có mặt trước 5-10 phút</span>.<br>" +
            " &nbsp; &nbsp; - <span style='color: #ADD8E6;'>Màu xanh dương (Light Blue):</span> Lớp Học Tập Trung & Trực Tuyến (Giảng viên dạy tại Trường, Sinh viên học Online ở Nhà). Sinh viên cần <span style='color: #D9534F;'>có mặt trước 5-10 phút</span>.<br><br>" +
            "<strong>Lưu ý quan trọng:</strong><br>" +
            " - Lịch học có thể <span style='color: #D9534F;'>thay đổi đột xuất không báo trước</span>. Thay đổi (nếu có) sẽ cập nhật sau khoảng 1 giờ.<br>" +
            " - Sinh viên có trách nhiệm <span style='color: #D9534F;'>tự kiểm tra lịch học hàng ngày</span> để đảm bảo thông tin chính xác. Nhà trường không chịu trách nhiệm cho các trường hợp sinh viên nhầm/quên lịch do không kiểm tra."
    },
    {
        "keywords": ["cách vào thư viện", "nội quy thư viện", "sử dụng thư viện", "tủ đồ thư viện", "vào thư viện"],
        "answer": "<strong>Quy trình Sử dụng Thư viện:</strong><br><br>" +
            "<strong>Bước 1:</strong> Xuất trình <span style='color: #0056b3;'>Thẻ sinh viên</span> cho cán bộ thư viện tại quầy lễ tân và nhận chìa khóa tủ đồ.<br>" +
            "<strong>Bước 2:</strong> Cất đồ dùng cá nhân (ba lô, túi xách) vào tủ đồ theo đúng nơi quy định.<br>" +
            "<strong>Bước 3:</strong> Tuân thủ nội quy: <span style='color: #D9534F;'>Không mang đồ ăn, thức uống (trừ nước lọc chai có nắp)</span> vào khu vực thư viện.<br><br>" +
            "<strong>Lưu ý khi ra về:</strong><br>" +
            " - Dọn dẹp sạch sẽ chỗ ngồi.<br>" +
            " - Lấy lại đầy đủ đồ dùng cá nhân và trả chìa khóa tủ đồ.<br>" +
            " - Nhận lại Thẻ sinh viên tại quầy lễ tân.<br>" +
            " - <span style='color: #D9534F;'>Không tự ý mang tài liệu của thư viện ra khỏi cửa</span> khi chưa được sự cho phép của cán bộ."
    },
    {
        "keywords": ["mã môn học", "mã số môn", "học kỳ fall", "học kỳ spring", "ý nghĩa mã môn", "mã đăng ký lớp"],
        "answer": "<strong>Ý nghĩa Mã số (Môn) học:</strong><br><br>" +
            "Thông thường, hai chữ số cuối của Mã số (Môn) thể hiện học kỳ khuyến nghị:<br>" +
            "- Từ <span style='color: #0056b3;'>00 đến 49</span>: Khuyến nghị học trong Học kỳ I (Fall).<br>" +
            "- Từ <span style='color: #0056b3;'>50 đến 99</span>: Khuyến nghị học trong Học kỳ II (Spring).<br><br>" +
            "<strong>Ví dụ:</strong> MKT 251 nghĩa là môn học khuyến nghị cho <span style='color: #0056b3;'>Học kỳ II năm thứ 2</span>.<br>" +
            "<i>Lưu ý: <span style='color: #D9534F;'>Điều này không bắt buộc</span> và chỉ mang tính chất tham khảo.</i>"
    },
    {
        "keywords": ["thuê sách", "mua sách", "mượn sách", "thư viện mượn sách", "thủ tục mượn sách"],
        "answer": "<strong>Hướng dẫn Thuê/Mua sách tại Thư viện:</strong><br><br>" +
            "<strong>Bước 1:</strong> Đến quầy thủ thư tại Thư viện.<br>" +
            "<strong>Bước 2:</strong> Xuất trình <span style='color: #0056b3;'>Thẻ sinh viên</span> còn hiệu lực.<br>" +
            "<strong>Bước 3:</strong> Cung cấp thông tin sách cần thuê hoặc mua (tên sách, mã sách, ...).<br>" +
            "<strong>Bước 4:</strong> Thanh toán và ký giấy tờ liên quan. <br> &nbsp; &nbsp; - <i>Đối với thuê sách:</i> Sinh viên thanh toán <span style='color: #0056b3;'>tiền thuê + tiền cọc (bằng giá sách)</span>. Tiền cọc sẽ được hoàn lại khi sinh viên trả sách đúng hạn và sách không bị hư hỏng.<br><br>" +
            "<strong>Lưu ý:</strong> Sinh viên cần <span style='color: #D9534F;'>đọc kỹ thời hạn thuê/trả sách</span> trên phiếu và <span style='color: #D9534F;'>giữ gìn phiếu cẩn thận</span> để làm thủ tục trả sách."
    },
    {
        keywords: ["tra môn học", "tìm môn học", "môn học", "tìm kiếm môn học"],
        answer: "<strong>Tra/Tìm kiếm môn học:</strong><br><br>" +
            "<a href='https://courses.duytan.edu.vn/sites/Home_ChuongTrinhDaoTao.aspx?p=home_coursesearch' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["trang chủ dtu", "trang chủ đại học duy tân", "duytan.edu.vn"],
        answer: "<strong>Trang chủ Đại học Duy Tân:</strong><br><br><a href='https://duytan.edu.vn' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["khoa cntt", "khoa công nghệ thông tin", "kcntt"],
        answer: "<strong>Khoa CNTT:</strong><br><br><a href='https://kcntt.duytan.edu.vn/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["kthp", "lịch thi", "thi", "lịch thi kthp", "kết thúc học phần", "thi cuối kỳ", "thi học kỳ", "xem lịch thi"],
        answer: "<strong>Lịch Thi KTHP:</strong><br><br><a href='https://lichthi.netlify.app/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    }
];

// 3. Liên kết Facebook
const fbLinks = [
    {
        keywords: ["facebook tuyển sinh", "tuyển sinh facebook", "facebook tuyensinhdtu"],
        answer: "<strong>Facebook Tuyển sinh Đại học Duy Tân:</strong><br><br><a href='https://www.facebook.com/tuyensinhDTU' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb đại học duy tân", "facebook dai hoc duy tan"],
        answer: "<strong>Facebook Đại học Duy Tân:</strong><br><br><a href='https://www.facebook.com/daihocduytan.dtu' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb duy tan university", "facebook duy tan university"],
        answer: "<strong>Facebook Duy Tan University:</strong><br><br><a href='https://www.facebook.com/Duy.Tan.University' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb ltc", "facebook ltc", "learning & testing center"],
        answer: "<strong>Facebook LTC - Learning & Testing Center:</strong><br><br><a href='https://www.facebook.com/ltcdtu' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb tuổi trẻ đại học duy tân", "facebook tuoi tre dtu"],
        answer: "<strong>Facebook Tuổi trẻ Đại học Duy Tân:</strong><br><br><a href='https://www.facebook.com/tuoitreDTU' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb trường đào tạo quốc tế", "facebook truong dao tao quoc te"],
        answer: "<strong>Facebook Trường Đào tạo Quốc tế:</strong><br><br><a href='https://www.facebook.com/DTU.InternationalSchool' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb trường du lịch", "facebook truong du lich", "duytanhti"],
        answer: "<strong>Facebook Trường Du Lịch:</strong><br><br><a href='https://www.facebook.com/DuyTanHTi' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb khoa khoa học xã hội và nhân văn", "facebook khxhvn"],
        answer: "<strong>Facebook Khoa Khoa học Xã hội và Nhân văn:</strong><br><br><a href='https://www.facebook.com/KhoaKhoaHocXaHoiVaNhanVanDaiHocDuyTan' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb tuổi trẻ trường khoa học máy tính", "facebook tuoi tre scs", "cntt.dtu"],
        answer: "<strong>Facebook Tuổi Trẻ Trường Khoa Học Máy Tính:</strong><br><br><a href='https://www.facebook.com/CNTT.DTU' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb khoa tiếng trung", "facebook khoa tieng trung"],
        answer: "<strong>Facebook Khoa Tiếng Trung:</strong><br><br><a href='https://www.facebook.com/KHOATRUNGDTU' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb trung tâm ngoại ngữ", "facebook trung tam ngoai ngu"],
        answer: "<strong>Facebook Trung Tâm Ngoại Ngữ Duy Tân:</strong><br><br><a href='https://www.facebook.com/duytan.luyenthi.toeic.toefl.Danang' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb trung tâm tin học", "facebook trung tam tin hoc"],
        answer: "<strong>Facebook Trung Tâm Tin Học Duy Tân (Group):</strong><br><br><a href='https://www.facebook.com/groups/189204667249513' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb khoa quản lý kinh tế việt mỹ psu", "facebook psu"],
        answer: "<strong>Facebook Khoa Quản lý kinh tế Việt Mỹ- PSU:</strong><br><br><a href='https://www.facebook.com/QuanlykinhteVietMyPSU' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb tuổi trẻ khoa y", "facebook tuoi tre khoa y"],
        answer: "<strong>Facebook Tuổi trẻ Khoa Y ĐH Duy Tân:</strong><br><br><a href='https://www.facebook.com/DOANKHOAYDHDUYTAN' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb clb tiếng anh", "facebook dec", "clb tieng anh duy tan"],
        answer: "<strong>Facebook CLB Tiếng Anh Duy Tân DEC:</strong><br><br><a href='https://www.facebook.com/CLBTiengAnhDuyTan' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb khoa tiếng anh", "facebook khoa tieng anh"],
        answer: "<strong>Facebook Khoa Tiếng Anh:</strong><br><br><a href='https://www.facebook.com/profile.php?id=61577509090321' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb trường khoa học máy tính", "facebook school of computer science", "scs"],
        answer: "<strong>Facebook Trường Khoa học Máy tính - School of Computer Science:</strong><br><br><a href='https://www.facebook.com/truongkhoahocmaytinh' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb tuổi trẻ trường kinh tế", "facebook tuoi tre truong kinh te"],
        answer: "<strong>Facebook Tuổi trẻ Trường Kinh Tế:</strong><br><br><a href='https://www.facebook.com/dtkt.dtu' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb tuổi trẻ khoa dược", "facebook tuoi tre khoa duoc"],
        answer: "<strong>Facebook Tuổi Trẻ Khoa Dược:</strong><br><br><a href='https://www.facebook.com/doankhoaduocdtu' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb cố vấn học tập trường du lịch", "facebook co van hoc tap"],
        answer: "<strong>Facebook Cố vấn học tập - Trường Du lịch DTU:</strong><br><br><a href='https://www.facebook.com/covanhoctapDTU' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb clb y khoa cơ sở", "facebook clb y khoa"],
        answer: "<strong>Facebook CLB Y khoa cơ sở:</strong><br><br><a href='https://www.facebook.com/CLBYKHOACOSO' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb lcđ khoa luật", "facebook khoa luat"],
        answer: "<strong>Facebook LCĐ Khoa Luật:</strong><br><br><a href='https://www.facebook.com/LCDKHOALUATDTU' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb LCĐ Viện Quản lý Nam Khuê", "facebook LCĐ Viện Quản lý Nam Khuê"],
        answer: "<strong>Facebook LCĐ Viện Quản lý Nam Khuê:</strong><br><br><a href='https://www.facebook.com/LCDVQLNK.DTU' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["fb Khoa Quản lý kinh tế Việt Mỹ- PSU ", "facebook Khoa Quản lý kinh tế Việt Mỹ- PSU "],
        answer: "<strong>Facebook Khoa Quản lý kinh tế Việt Mỹ- PSU :</strong><br><br><a href='https://www.facebook.com/QuanlykinhteVietMyPSU' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    }
];

// 4. Liên kết Zalo
const zaloLinks = [
    {
        keywords: ["zalo trường khoa học máy tính", "zalo scs"],
        answer: "<strong>Zalo Trường Khoa học Máy tính:</strong><br><br><a href='https://zalo.me/g/kfhnwd118' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["zalo trường công nghệ & kỹ thuật", "zalo set"],
        answer: "<strong>Zalo Trường Công nghệ & Kỹ thuật:</strong><br><br><a href='https://zalo.me/g/rgchfj749' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["zalo trường kinh tế & kinh doanh", "zalo sbe"],
        answer: "<strong>Zalo Trường Kinh tế & Kinh doanh:</strong><br><br><a href='https://zalo.me/g/ejyzhc042' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["zalo trường ngôn ngữ & xhnv", "zalo sls"],
        answer: "<strong>Zalo Trường Ngôn ngữ & XHNV:</strong><br><br><a href='https://zalo.me/g/fynbqt588' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["zalo trường du lịch", "zalo hti"],
        answer: "<strong>Zalo Trường Du lịch:</strong><br><br><a href='https://zalo.me/g/mvyujq901' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["zalo khối ngành y dược", "zalo y duoc"],
        answer: "<strong>Zalo Khối ngành Y Dược:</strong><br><br><a href='https://zalo.me/g/sfadnd366' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["zalo khoa đào tạo quốc tế", "zalo dao tao quoc te"],
        answer: "<strong>Zalo Khoa Đào tạo Quốc tế:</strong><br><br><a href='https://zalo.me/g/oxxsck718' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["zalo chương trình tài năng", "zalo vien ql nam khue"],
        answer: "<strong>Zalo Chương trình Tài năng (Viện QL Nam Khuê):</strong><br><br><a href='https://zalo.me/g/blxzaf771' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["zalo chương trình việt nhật", "zalo viet nhat"],
        answer: "<strong>Zalo Chương trình Việt Nhật:</strong><br><br><a href='httpshttps://zalo.me/g/cxpzwr696' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    }
];

// 5. Liên kết Telegram
const telegramLinks = [
    {
        keywords: ["học phí", "nộp tiền", "chuyển khoản", "tài chính"],
        answer: "<strong>Cách nộp học phí (Chuyển khoản):</strong><br><br>" +
            "- Đơn vị thụ hưởng: <strong>ĐẠI HỌC DUY TÂN</strong><br><br>" +
            "- STK Vietinbank: <strong>118000181119</strong> - TMCP Công thương - CN Đà Nẵng<br><br>" +
            "- STK Vietcombank: <strong>6811111994</strong> - TMCP Ngoại thương - CN Đà Nẵng<br><br>" +
            "<strong>NỘI DUNG BẮT BUỘC:</strong> `Mã số sinh viên (ghi đầy đủ) + Họ và tên sinh viên + nộp học phí HK... năm học...`<br><br>" +
            "<strong>Ví dụ:</strong> `23211203870 Nguyễn Văn A nộp học phí HK 2 năm học 2024-2025`<br><br>" +
            "(Xem STK chính xác: <a href='https://t.me/Dai_Hoc_Duy_Tan/100' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>)"
    },
    {
        keywords: [
            "học online", "học zoom", "link zoom", "sakai", "zoom", "học trực tuyến", "learning", "hệ thống learning", "cách dùng sakai", "hướng dẫn sakai", "learning sakai", "mydtu", "tìm môn học", "nộp bài tập", "drop box"],
        answer: "<strong>=== HƯỚNG DẪN ===</strong><br><br>" +
            "<strong>1. HỌC QUA ZOOM:</strong><br>" +
            "- Sinh viên học online qua Zoom. Tự vào <strong>mydtu</strong> để lấy link học. Giảng viên không có trách nhiệm gửi link riêng. (Hướng dẫn: <a href='https://t.me/Dai_Hoc_Duy_Tan/147' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>)<br><br>" +
            "- Hướng dẫn đăng ký Zoom bằng email @dtu.edu.vn: <a href='https://t.me/Dai_Hoc_Duy_Tan/160' target='_blank'>Nhấp nhẹ thôi kẻo ra</a><br><br>" +

            "<strong>2. HƯỚNG DẪN CHỨC NĂNG LEARNING:</strong><br>" +
            "<strong>Bước 1:</strong> Đăng nhập vào hệ thống <strong>Mydtu</strong>.<br>" +
            "<strong>Bước 2:</strong> Chọn <strong>Learning</strong> tiếp theo chọn <strong>View All My Sites</strong>.<br>" +
            "<strong>Bước 3:</strong> <strong>Tìm đúng môn học</strong>.<br>" +
            "<strong>Bước 4:</strong> Chọn đúng chức năng mình cần, màn hình làm việc sẽ hiển thị phía bên phải. (<a href='https://t.me/Dai_Hoc_Duy_Tan/130'>Chức năng learning</a>)<br><br>" +

            "<strong>3. HƯỚNG DẪN VIDEO CHUNG SAKAI (Nộp bài, v.v.):</strong><br>" +
            "- Xem video hướng dẫn chung: <a href='https://t.me/Dai_Hoc_Duy_Tan/36' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["hướng dẫn đăng nhập mydtu", "hd dang nhap mydtu", "hdsd"],
        answer: "<strong>Hướng dẫn Đăng nhập myDTU:</strong><br><br>" +
            "<a href='https://t.me/Dai_Hoc_Duy_Tan/31' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["sinh hoạt đầu khóa", "hd xem lich sinh hoat dau khoa", "hdsd"],
        answer: "<strong>Hướng dẫn Xem lịch và Tham gia Lớp Sinh hoạt Đầu khóa:</strong><br><br>" +
            "<a href='https://t.me/Dai_Hoc_Duy_Tan/32' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["xem lịch học", "lịch cá nhân", "hd xem lich hoc", "hdsd"],
        answer: "<strong>Hướng dẫn Xem Lịch học và Thao tác Lịch cá nhân:</strong><br><br>" +
            "<a href='https://t.me/Dai_Hoc_Duy_Tan/33' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["xem chương trình học", "hd xem chuong trinh hoc", "hdsd"],
        answer: "<strong>Hướng dẫn Xem Chương trình học:</strong><br><br>" +
            "<a href='https://t.me/Dai_Hoc_Duy_Tan/34' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["đăng ký môn học", "dang ky tin chi", "hd dang ky mon hoc", "hdsd"],
        answer: "<strong>Hướng dẫn Đăng ký Môn học qua myDTU:</strong><br><br>" +
            "<a href='https://t.me/Dai_Hoc_Duy_Tan/35' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["lấy tài khoản mydtu", "lấy tài khoản zoom", "hd lay tai khoan"],
        answer: "<strong>Hướng dẫn Lấy tài khoản myDTU và ZOOM:</strong><br><br>" +
            "<a href='https://t.me/Dai_Hoc_Duy_Tan/38' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["thư viện", "mượn sách", "đọc sách", "dtu e lib"],
        answer: "<strong>Thư viện DTU:</strong><br><br>" +
            "- Thư viện 1: Tầng 7, 03 Quang Trung, Hải Châu<br><br>" +
            "- Thư viện 2: Tầng 6, 209 Phan Thanh, Thanh Khê<br><br>" +
            "<strong>Lưu ý:</strong> Phải xuất trình Thẻ sinh viên, ăn mặc lịch sự và giữ im lặng.<br><br>" +
            "- Hướng dẫn mượn sách qua DTU e Lib: <a href='https://t.me/Dai_Hoc_Duy_Tan/37' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["quên mật khẩu", "lấy lại pass", "mật khẩu gmail", "mật khẩu zoom", "mk"],
        answer: "<strong>Hướng dẫn khôi phục mật khẩu:</strong><br><br>" +
            "- Khôi phục mật khẩu GMAIL DTU: <a href='https://t.me/Dai_Hoc_Duy_Tan/365' target='_blank'>Nhấp nhẹ thôi kẻo ra</a><br><br>" +
            "- Lấy lại password login ZOOM DTU: <a href='https://t.me/Dai_Hoc_Duy_Tan/366' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["khai báo ngoại trú", "ngoại trú", "đánh giá rèn luyện", "điểm rèn luyện"],
        answer: "<strong>Hoạt động sinh viên:</strong><br><br>" +
            "- Hướng dẫn khai báo ngoại trú sinh viên: <a href='https://t.me/Dai_Hoc_Duy_Tan/176' target='_blank'>Nhấp nhẹ thôi kẻo ra</a><br><br>" +
            "- Hướng dẫn đánh giá rèn luyện sinh viên: <a href='https://t.me/Dai_Hoc_Duy_Tan/181' target='_blank'>Nhấp nhẹ thôi kẻo ra</a><br><br>" +
            "- Quy định Đánh giá rèn luyện: <a href='https://t.me/Dai_Hoc_Duy_Tan/186' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["bản tin", "tin tức", "bản tin đại học duy tân", "thông báo", "tin tức dtu", "telegram", "tài liệu dtu", "tài liệu môn học dtu", "tai lieu dtu", "ds thi", "kênh"],
        answer: "<strong>🎓DTU Official Community🗂</strong><br><br>" +
            "<a href='https://t.me/Dai_Hoc_Duy_Tan' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["hướng dẫn telegram", "hd telegram", "hướng dẫn sử dụng telegram an toàn", "telegram"],
        answer: "<strong>💡 Hướng dẫn sử dụng telegram an toàn:</strong><br><br>" +
            "<a href='https://t.me/huongdandungtelegram' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["tân", "admin", "liên hệ admin", "babyhaituoi", "ban quản trị", "bqt", "telegram"],
        answer: "<strong>Ban Quản Trị:</strong><br><br>" +
            "<a href='https://t.me/babyhaituoi' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["chongluadao", "cld", "telegram"],
        answer: "<strong>Telegram Chongluadao.vn - Report Status</strong><br><br>" +
            "<a href='https://t.me/s/cld_report' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    }
];

// 6. Tiện ích & Liên kết ngoài
const externalLinks = [
    {
        keywords: ["tài liệu tham khảo", "tham khảo", "studocu", "docx", "tài liệu"],
        answer: "<strong>Tài liệu tham khảo:</strong><br><br>" +
            "- Tài liệu Studocu: <a href='https://www.studocu.vn/vn/institution/truong-dai-hoc-duy-tan/11203' target='_blank'>Nhấp nhẹ thôi kẻo ra</a><br><br>" +
            "- Tài liệu Docx: <a href='https://docx.com.vn/dai-hoc-duy-tan' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["tnt"],
        answer: "<strong>Nhật Tân:</strong><br><br>" +
            "<a href='https://tnnhattan.netlify.app/dangnhap.html' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["việc làm", "thực tập", "job", "intern", "realjobs"],
        answer: "<strong>Trang Việc làm - Thực tập (RealJobs):</strong><br><br>" +
            "<a href='https://realjobs.vn/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["tải telegram", "telegram windows", "cài đặt telegram"],
        answer: "<strong>Tải telegram về cho Windows:</strong><br><br><a href='https://telegram.org/dl/desktop/win64' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["telegram web", "telegram website"],
        answer: "<strong>Dùng bản Website telegram:</strong><br><br><a href='https://web.telegram.org/a/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["daihocduytan", "website cộng đồng"],
        answer: "<strong>Website Cộng đồng  :</strong><br><br><a href='https://daihocduytan.netlify.app/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["hotrosinhvien"],
        answer: "<strong>Trang DTU:</strong><br><br>" +
            "<a href='https://hotrosinhvien.netlify.app/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["nhận xét giảng viên", "review giảng viên", "đánh giá gv", "review gv", "gv"],
        answer: "<strong>Nhận xét giảng viên (Google Sheet):</strong><br><br><a href='https://docs.google.com/spreadsheets/d/1XSEGx49YiOg-8oi2QFZux6e5RyULRtkB9yuRPCQZKr4/edit?usp=sharing' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["chống lừa đảo", "chong luu dao", "chongluadao"],
        answer: "<strong>Chống lừa đảo website:</strong><br><br><a href='https://chongluadao.vn/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["camera", "camera đà nẵng", "camera da nang"],
        answer: "<strong>Camera Đà Nẵng:</strong><br><br><a href='https://dhduytan.github.io/camera/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["gửi file", "transfer.it", "gửi file lớn"],
        answer: "<strong>Gửi file:</strong><br><br><a href='httpshttps://transfer.it/start' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["code", "onecompiler", "lập trình online", "compiler"],
        answer: "<strong>Code Online (OneCompiler):</strong><br><br><a href='https://onecompiler.com/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["chu kỳ", "tính chu kỳ", "chu ky kinh nguyet", "dâu"],
        answer: "<strong>Tính chu kỳ:</strong><br><br><a href='https://chukydau.netlify.app/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["rút gọn link", "by.com.vn", "rut gon", "rút gọn"],
        answer: "<strong>Rút gọn link (by.com.vn):</strong><br><br><a href='https://by.com.vn/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["tải tiktok", "download tiktok", "tiktok không logo"],
        answer: "<strong>Tải Tiktok (Không logo):</strong><br><br><a href='https://tcc-agency.com/tiktok-download/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["giá cà phê", "gia ca phe", "cà phê"],
        answer: "<strong>Giá cà phê:</strong><br><br><a href='https://giacaphe.com/gia-ca-phe-dak-nong/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["giá tiêu", "gia tieu", "tiêu"],
        answer: "<strong>Giá tiêu:</strong><br><br><a href='https://giacaphe.com/gia-tieu-hom-nay/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["giá vàng", "gia vàng", "vàng"],
        answer: "<strong>Giá vàng:</strong><br><br><a href='https://www.24h.com.vn/gia-vang-hom-nay-c425.html' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["game nối chữ", "noi chu"],
        answer: "<strong>Game nối chữ:</strong><br><br><a href='https://docs.google.com/spreadsheets/d/18dw8kwvXfVeR0MnPEAk9lLAYmzYk-13eRuXbg5S7Fyg/edit?usp=sharing' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["chatgpt", "chat gpt", "gpt", "AI"],
        answer: "<strong>GPT:</strong><br><br><a href='https://chatgpt.com/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["chatgemini", "chat gemini", "gemini", "AI"],
        answer: "<strong>Gemini:</strong><br><br><a href='https://gemini.google.com/app' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["chatperplexity", "chat perplexity", "perplexity", "AI"],
        answer: "<strong>Perplexity:</strong><br><br><a href='https://www.perplexity.ai/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["chatgrok", "chat grok", "grok", "AI"],
        answer: "<strong>Grok:</strong><br><br><a href='https://grok.com/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["chatclaude", "chat claude", "claude", "AI"],
        answer: "<strong>Claude:</strong><br><br><a href='https://claude.ai/new' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["copilot", "microsoft copilot", "copilot.microsoft.com", "AI"],
        answer: "<strong>Copilot:</strong><br><br><a href='https://copilot.microsoft.com/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["iask", "iask.ai", "iask ai", "AI"],
        answer: "<strong>iAsk.ai:</strong><br><br><a href='https://iask.ai/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["deepai", "deepai.org", "deep ai", "AI"],
        answer: "<strong>DeepAI:</strong><br><br><a href='https://deepai.org/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["poe", "poe.com", "poe ai", "AI"],
        answer: "<strong>Poe:</strong><br><br><a href='https://poe.com/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["meta", "meta ai", "www.meta.ai", "AI"],
        answer: "<strong>Meta AI:</strong><br><br><a href='https://www.meta.ai/' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["dịch", "Google dịch", "gg dịch"],
        answer: "<strong>Google dịch:</strong><br><br><a href='https://translate.google.com/?hl=vi&sl=auto&tl=vi&op=translate' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["xăng", "dầu", "giá xăng", "giá dầu"],
        answer: "<strong>Giá xăng dầu:</strong><br><br><a href='https://www.petrolimex.com.vn/index.html' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["thời tiết", "windy", "bão"],
        answer: "<strong>Bản đồ thời tiết:</strong><br><br><a href='https://www.windy.com' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["tra cứu hộ gia đình", "tra cứu mã số BHXH", "tra cứu BHXH", "tra cứu BHYT", "tra cứu thông tin hộ gia đình", "tra cứu bảo hiểm xã hội", "bhyt", "tra cứu bhyt"],
        answer: "<strong>Bảo hiểm:</strong><br><br><a href='https://baohiemxahoi.gov.vn/tracuu/Pages/tra-cuu-ho-gia-dinh.aspx' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["AdGuard AdBlocker", "chặn quảng cáo", "quảng cáo", "chặn qc"],
        answer: "<strong>Chặn quảng cáo:</strong><br><br><a href='https://chromewebstore.google.com/detail/adguard-adblocker/bgnkhhnnamicmpeenaelnjfhikgbkllg?hl=vi' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["cắt file PDF", "pdf"],
        answer: "<strong>Cắt file PDF:</strong><br><br><a href='https://smallpdf.com/vi/cat-pdf' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    },
    {
        keywords: ["pdf"],
        answer: "<strong>Smallpdf:</strong><br><br><a href='https://smallpdf.com/vi' target='_blank'>Nhấp nhẹ thôi kẻo ra</a>"
    }
];
//7. Hướng dẫn
const huongdan = [
    {
        keywords: ["canva", "powerpoint", "chuyển canva sang powerpoint", "tải canva pptx", "convert canva", "pptx", "tải canva", "chuyển canva", "lưu canva powerpoint"],
        answer: "<strong>Cách chuyển Canva sang PowerPoint (.pptx)</strong><br><br>" +
            "<strong>💻 Trên máy tính</strong><br>" +
            "1. Mở thiết kế bài thuyết trình của bạn trên Canva.com.<br>" +
            "2. Nhấp vào nút <strong>Chia sẻ</strong> ở góc trên bên phải màn hình.<br>" +
            "3. Chọn <strong>Tải xuống</strong>.<br>" +
            "4. Trong mục \"Loại tệp\", chọn <strong>Microsoft PowerPoint (.pptx)</strong>.<br>" +
            "5. (Tùy chọn) Nếu bạn chỉ muốn tải một vài slide, hãy nhấp vào mũi tên bên cạnh \"Chọn trang\" và bỏ chọn những slide không mong muốn, sau đó nhấn <strong>Done</strong>.<br>" +
            "6. Nhấn nút <strong>Tải xuống</strong> và đợi tệp được lưu về máy tính của bạn.<br><br>" +
            "<strong>📱 Trên điện thoại</strong><br>" +
            "1. Mở ứng dụng Canva và chọn thiết kế bạn muốn chuyển đổi.<br>" +
            "2. Nhấn vào biểu tượng mũi tên tải xuống hoặc nút <strong>Chia sẻ</strong> ở góc trên bên phải màn hình.<br>" +
            "3. Chọn <strong>Microsoft PowerPoint</strong> từ danh sách các tùy chọn.<br>" +
            "4. Nhấn <strong>Tải xuống</strong> và chờ quá trình hoàn tất.<br>" +
            "5. Sau khi tải xong, bạn có thể mở tệp .pptx bằng ứng dụng PowerPoint Mobile hoặc các ứng dụng văn phòng khác.<br><br>" +
            "<strong>⚠️ Lưu ý sau khi chuyển đổi</strong><br>" +
            "<strong>- Kiểm tra lại:</strong> Mở tệp .pptx trong PowerPoint để kiểm tra các hiệu ứng, font chữ và bố cục slide. Một số hiệu ứng phức tạp của Canva có thể bị loại bỏ hoặc thay đổi.<br>" +
            "<strong>- Sửa lỗi font chữ:</strong> Nếu font chữ không hiển thị đúng, hãy thử thay thế bằng một font chữ tương tự có trong PowerPoint.<br>" +
            "<strong>- Lưu file:</strong> Sau khi chỉnh sửa, hãy lưu lại file với định dạng .pptx để đảm bảo tương thích."
    }
];


