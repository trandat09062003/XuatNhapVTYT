# Hệ Thống Quản Lý Xuất Nhập & Tồn Kho Vật Tư Tiêu Hao Y Tế

Hệ thống phần mềm web chuyên sâu phục vụ công tác quản trị, theo dõi nhập - xuất - tồn, bảo quản và cấp phát vật tư tiêu hao y tế (VTTHYT), hóa chất và sinh phẩm xét nghiệm trong bệnh viện. 

Hệ thống được thiết kế và chuẩn hóa 100% theo chu trình quy định tại **Quyết định số 651/QĐ-BVPN** của Bệnh viện quận Phú Nhuận.

---

## Kiến Trúc Hệ Thống (Architecture)

- **Frontend**: Single Page Application thuần HTML5, Modern CSS3 (Design System chuẩn y tế, Print CSS A4), JavaScript ES6.
- **Backend API**: **Python FastAPI** RESTful API hiệu năng cao, tự động sinh tài liệu OpenAPI / Swagger UI.
- **Database**: **SQLite** (`hospital_inventory.db`) lưu trữ quan hệ với 8 bảng dữ liệu chuẩn hóa, tự động seed danh mục vật tư & 15 khoa phòng theo quyết định.

---

## Các Phân Hệ & Chức Năng Chính

### 1. Chu Trình Nhập Kho Chuẩn 7 Bước (Mục 5.2 QĐ 651)
- **Bước 1**: Lập kế hoạch đặt hàng định kỳ (thực hiện từ ngày 1 - 5 hàng tháng căn cứ báo cáo NXT, số tồn và hợp đồng mua sắm trúng thầu).
- **Bước 2**: Đặt hàng Nhà cung cấp (thông báo số lượng, quy cách đóng gói theo phiếu đặt hàng, đối chiếu danh mục BHYT thanh toán).
- **Bước 3**: Nhận hàng và họp Hội đồng kiểm nhập (đối chiếu tên, ĐVT, số lô, HSD, tiêu chuẩn kỹ thuật, cảm quan bao bì và nhiệt độ bảo quản GSP). Hàng không đạt sẽ biệt trữ và hoàn trả.
- **Bước 4**: Lập Sổ kiểm nhập hàng hóa (3 bên Hội đồng kiểm nhập ký nhận).
- **Bước 5**: Kiểm tra hóa đơn tài chính & in Phiếu nhập kho (P. Tài chính Kế toán / Kế toán dược).
- **Bước 6**: Hoàn tất thủ tục nhập kho (Trưởng phòng VTTBYT & P. TCKT ký phê duyệt).
- **Bước 7**: Lập hồ sơ đề nghị thanh toán & tự động cập nhật Thẻ kho vào database.

### 2. Chu Trình Cấp Phát - Xuất Kho 6 Bước (Mục 5.4 QĐ 651)
- **Bước 1**: Khoa/phòng lập **Phiếu lĩnh VTTHYT (Mẫu 01)** theo nhu cầu/y lệnh, Trưởng khoa phê duyệt.
- **Bước 2**: Thủ kho kiểm tra đối chiếu tồn kho và xác nhận.
- **Bước 3**: Trưởng phòng VTTBYT kiểm tra tính hợp lệ và ký xét duyệt điện tử.
- **Bước 4**: Cấp phát theo **Nguyên tắc FEFO (First Expired First Out)** - thuật toán tự động ưu tiên xuất lô cận hạn nhất để tránh tồn đọng gây lãng phí, in **Chứng từ xuất kho (Mẫu 02)**.
- **Bước 5**: Giao nhận thực tế và ký xác nhận 2 bên trên chứng từ xuất kho.
- **Bước 6**: Tự động trừ tồn kho theo lô trong SQLite, cập nhật số liệu Thẻ kho và tự động bù vào cơ số **Tủ trực tại các Khoa**.

### 3. Giám Sát Điều Kiện Bảo Quản GSP (Mục 5.3)
Theo dõi các ngưỡng môi trường bảo quản:
- **Kho Thường**: 15°C – 25°C (tối đa 30°C), Độ ẩm tương đối $\le 70\%$.
- **Kho Mát**: 8°C – 15°C.
- **Kho Lạnh**: $\le 8°C$.
- **Tủ Lạnh Xét Nghiệm**: 2°C – 8°C (hóa chất sinh hóa, test kit...).
- Sắp xếp pallet hàng nặng phía dưới, giá kệ phía trên, có lối đi vận chuyển thông thoáng, phòng chống cháy nổ.
- Ghi nhật ký nhiệt ẩm kế lưu vào cơ sở dữ liệu.

### 4. Hệ Thống Biểu Mẫu In Ấn Chuẩn Khổ A4
Hỗ trợ xem trước và in ấn trực tiếp chuẩn mẫu văn bản hành chính bệnh viện:
- **Mẫu 01**: Phiếu lĩnh vật dụng y tế tiêu hao (Phụ lục Trang 9).
- **Mẫu 02**: Chứng từ xuất kho (Phụ lục Trang 10).
- **Mẫu 03**: Báo cáo sử dụng VTTHYT tháng / Dự trù VTTHYT tháng (Phụ lục Trang 11).
- **Biên bản Hội đồng kiểm nhập hàng hóa** (Mục 5.2 Bước 4).

### 5. Quản Lý Tủ Trực Khoa / Phòng
- Theo dõi định mức cơ số tủ trực tại các khoa (Cấp cứu, Nội thận lọc máu, Gây mê hồi sức, Xét nghiệm...).
- Cảnh báo chênh lệch và hỗ trợ lập nhanh phiếu lĩnh bù cơ số tủ trực.

---

## Cấu Trúc Mã Nguồn

```text
├── server.py             # Backend FastAPI RESTful Server & Phục vụ Web
├── database.py           # Quản lý cấu trúc Database SQLite & Seed dữ liệu
├── hospital_inventory.db # File cơ sở dữ liệu SQLite
├── index.html            # Giao diện chính hệ thống
├── styles.css            # Hệ thống CSS Design System y tế & Print CSS A4
├── app.js                # Frontend logic & API Client kết nối Backend
├── favicon.svg           # Biểu tượng Favicon
├── HUONG_DAN_SU_DUNG.md  # Tài liệu hướng dẫn vận hành chi tiết
└── README.md             # Giới thiệu tổng quan dự án
```

---

## Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu cầu môi trường
- Python 3.9+
- Các thư viện: `fastapi`, `uvicorn` (hoặc cài bằng `pip install fastapi uvicorn`)

### 2. Khởi chạy Server
Chạy lệnh sau tại thư mục dự án:
```bash
python -m uvicorn server:app --host 0.0.0.0 --port 8080 --reload
```

### 3. Truy cập hệ thống
- **Giao diện Web**: [http://localhost:8080](http://localhost:8080)
- **Tài liệu API (Swagger UI)**: [http://localhost:8080/docs](http://localhost:8080/docs)
- **Kiểm tra trạng thái hệ thống**: [http://localhost:8080/api/health](http://localhost:8080/api/health)
