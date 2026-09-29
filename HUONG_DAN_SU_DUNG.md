# HƯỚNG DẪN VẬN HÀNH HỆ THỐNG QUẢN LÝ VẬT TƯ TIÊU HAO Y TẾ
**Căn cứ chuẩn: Quyết định số 651/QĐ-BVPN - Bệnh viện quận Phú Nhuận**

---

## 1. KHỞI CHẠY HỆ THỐNG
Hệ thống sử dụng máy chủ Backend **FastAPI** và cơ sở dữ liệu tập trung **SQLite**:
- **Khởi động server**:
  ```bash
  python -m uvicorn server:app --host 0.0.0.0 --port 8080 --reload
  ```
- **Địa chỉ giao diện**: [http://localhost:8080](http://localhost:8080)
- **Tài liệu API Swagger**: [http://localhost:8080/docs](http://localhost:8080/docs)
- **Cơ sở dữ liệu**: Lưu trữ tại tệp `hospital_inventory.db`.

---

## 2. CHU TRÌNH NHẬP KHO CHUẨN 7 BƯỚC (MỤC 5.2 QĐ 651)

| Bước | Tên Bước | Bộ Phận / Người Thực Hiện | Hướng Dẫn Thao Tác Trên Phần Mềm |
|:---:|---|---|---|
| **B1** | **Lập kế hoạch đặt hàng** | Bộ phận kho (Thủ kho) | Nhấn **"Khởi Tạo Quy Trình Nhập Kho Mới"**. Căn cứ báo cáo xuất nhập tồn hàng tháng (từ ngày 1-5 hàng tháng), số lượng tồn và hợp đồng trúng thầu để lên danh mục. |
| **B2** | **Đặt hàng NCC** | Thủ kho | Gửi Phiếu đặt hàng cho Nhà cung cấp trúng thầu qua Email/Văn bản. Kiểm tra danh mục VTTHYT được BHYT thanh toán. |
| **B3** | **Nhận hàng & Hội đồng kiểm nhập** | Thủ kho + Kế toán dược + HĐ kiểm nhập | Kiểm tra tên VTTHYT, tiêu chuẩn kỹ thuật, ĐVT, số đăng ký, số lượng, giá thầu, bao bì cảm quan, số lô, hạn dùng, nhiệt độ bảo quản GSP. Sản phẩm không đạt -> Biệt trữ. |
| **B4** | **Lập Sổ kiểm nhập hàng hóa** | Thủ kho & HĐ kiểm nhập | Mở modal **"Hội Đồng Kiểm Nhập"**, nhập ý kiến đánh giá, ký xác nhận của 3 thành viên: Trưởng P. VTTBYT + Kế toán dược + Thủ kho. |
| **B5** | **Kiểm tra hóa đơn** | P. Tài chính kế toán (Kế toán dược) | Kiểm tra tính hợp lệ của hóa đơn GTGT, đối chiếu gói thầu, tạo và in **Phiếu nhập kho**. |
| **B6** | **Hoàn tất thủ tục nhập kho** | P. VTTBYT + P. TCKT | Trưởng phòng VTTBYT và Trưởng phòng TCKT ký phê duyệt trên phiếu nhập kho. Lưu trữ hồ sơ 1 năm. |
| **B7** | **Lập đề nghị thanh toán** | Kế toán dược / P. TCKT | Lập bộ chứng từ thanh toán (Hóa đơn + Phiếu nhập kho + Sổ kiểm nhập + Phiếu đề nghị thanh toán). Hệ thống tự động **cộng dồn số lượng vào Thẻ kho SQLite** và theo dõi từng số Lô/HSD. |

---

## 3. CHU TRÌNH XUẤT KHO / CẤP PHÁT CHUẨN 6 BƯỚC (MỤC 5.4 QĐ 651)

| Bước | Tên Bước | Bộ Phận / Người Thực Hiện | Hướng Dẫn Thao Tác Trên Phần Mềm |
|:---:|---|---|---|
| **X1** | **Lập Phiếu lĩnh VTTHYT** | Khoa/Phòng (ĐD/KTV phụ trách) | Chọn menu **"Quy Trình Xuất Kho"** -> Nhấn **"Lập Phiếu Lĩnh Mới"** (Mẫu số 01). Nhập số lượng theo nhu cầu/y lệnh, Trưởng khoa ký duyệt. |
| **X2** | **Xác nhận phiếu lĩnh** | Thủ kho VTTBYT | Thủ kho kiểm tra tồn kho. Nếu thiếu hoặc sai danh mục, hệ thống sẽ cảnh báo gửi phản hồi cho Khoa điều chỉnh. |
| **X3** | **Xét duyệt phiếu lĩnh** | Trưởng phòng VTTBYT | Trưởng phòng VTTBYT kiểm tra tính hợp lệ và ký duyệt điện tử. |
| **X4** | **Cấp phát theo FEFO** | Thủ kho VTTBYT | Hệ thống tự động kích hoạt **Thuật toán FEFO (First Expired First Out)**: tự động chọn **Lô hàng cận hạn nhất** để xuất trước. In **Chứng từ xuất kho** (Mẫu số 02). |
| **X5** | **Giao nhận VTTHYT** | Thủ kho & ĐD Khoa nhận | Hai bên kiểm tra đối chiếu thực tế, đóng gói và ký xác nhận trên Chứng từ xuất kho. |
| **X6** | **Cập nhật Thẻ kho** | Thủ kho / Kế toán dược | Hệ thống tự động **trừ tồn kho trong Database SQLite**, ghi giảm thẻ kho và tự động bù cơ số vào **Tủ trực của Khoa**. |

---

## 4. QUẢN LÝ BẢO QUẢN KHO (TIÊU CHUẨN GSP - MỤC 5.3)
- **Kho Thường**: Duy trì 15°C – 25°C (tối đa 30°C), Độ ẩm ≤ 70% (Bơm tiêm, kim luồn, dây truyền dịch, băng thun...).
- **Kho Mát**: Duy trì 8°C – 15°C (Quả lọc thận High-flux Rexeed, Catheter lọc máu...).
- **Kho Lạnh**: Duy trì ≤ 8°C.
- **Tủ Lạnh Xét Nghiệm**: Duy trì 2°C – 8°C (Hóa chất sinh hóa, Test kit nhanh HBsAg/HIV...).
- **Cơ chế đo đạc**: Bảng giám sát thời gian thực kèm tính năng ghi **Nhật ký nhiệt ẩm kế** lưu trữ lịch sử kiểm tra vào database.

---

## 5. HỆ THỐNG BIỂU MẪU IN ẤN CHUẨN A4 THEO VĂN BẢN
Vào tab **"Biểu Mẫu Chuẩn Theo QĐ"** để xem và in trực tiếp theo khổ giấy hành chính:
1. **Mẫu 01**: Phiếu Lĩnh Vật Dụng Y Tế Tiêu Hao (Trang 9 - 4 chữ ký: Trưởng P. VTTBYT, Người phát, Người lĩnh, Trưởng khoa).
2. **Mẫu 02**: Chứng Từ Xuất Kho (Trang 10 - Người phát, Người lĩnh, Đại diện Phòng VTTBYT).
3. **Mẫu 03**: Báo Cáo Sử Dụng & Dự Trù Tháng (Trang 11 - Người báo cáo, Trưởng khoa/phòng).
4. **Biên bản Hội đồng kiểm nhập hàng hóa** (Mục 5.2 Bước 4).
