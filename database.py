"""
Database Management Module - SQLite Database
He thong quan ly xuat nhap vat tu tieu hao y te - BV Quan Phu Nhuan
Chuan hoa theo Quyet dinh 651/QD-BVPN
"""

import sqlite3
import os
import json
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hospital_inventory.db")

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Bang danh muc khoa phong
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS departments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        head TEXT NOT NULL
    )
    """)

    # Bang danh muc vat tu y te
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS materials (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        unit TEXT NOT NULL,
        specs TEXT,
        country TEXT,
        storage_type TEXT NOT NULL,
        unit_price REAL NOT NULL,
        min_stock INTEGER NOT NULL DEFAULT 0
    )
    """)

    # Bang chi tiet cac lo hang (Lots) theo doi FEFO
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS material_lots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        material_id TEXT NOT NULL,
        lot_num TEXT NOT NULL,
        exp_date TEXT NOT NULL,
        mfg_date TEXT,
        qty INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (material_id) REFERENCES materials (id) ON DELETE CASCADE
    )
    """)

    # Bang don nhap kho (7 buoc)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS import_orders (
        id TEXT PRIMARY KEY,
        supplier TEXT NOT NULL,
        contract TEXT NOT NULL,
        invoice_num TEXT,
        created_date TEXT NOT NULL,
        step INTEGER NOT NULL DEFAULT 1,
        status TEXT NOT NULL,
        current_handler TEXT,
        inspection_date TEXT,
        inspection_members TEXT,
        inspection_conclusion TEXT
    )
    """)

    # Chi tiet mat hang trong don nhap
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS import_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT NOT NULL,
        material_id TEXT NOT NULL,
        name TEXT NOT NULL,
        unit TEXT NOT NULL,
        lot_num TEXT,
        exp_date TEXT,
        qty INTEGER NOT NULL,
        unit_price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES import_orders (id) ON DELETE CASCADE
    )
    """)

    # Bang phieu linh & xuat kho (6 buoc)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS export_requests (
        id TEXT PRIMARY KEY,
        dept_id TEXT NOT NULL,
        dept_name TEXT NOT NULL,
        requester TEXT NOT NULL,
        approver_head TEXT,
        purpose TEXT,
        created_date TEXT NOT NULL,
        step INTEGER NOT NULL DEFAULT 1,
        status TEXT NOT NULL,
        export_receipt_num TEXT,
        export_date TEXT,
        dispensed_by TEXT,
        received_by TEXT,
        FOREIGN KEY (dept_id) REFERENCES departments (id)
    )
    """)

    # Chi tiet mat hang xuat kho
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS export_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id TEXT NOT NULL,
        material_id TEXT NOT NULL,
        name TEXT NOT NULL,
        unit TEXT NOT NULL,
        requested_qty INTEGER NOT NULL,
        dispensed_qty INTEGER NOT NULL DEFAULT 0,
        lot_num TEXT,
        exp_date TEXT,
        unit_price REAL NOT NULL,
        FOREIGN KEY (request_id) REFERENCES export_requests (id) ON DELETE CASCADE
    )
    """)

    # Bang co so tu truc tai cac khoa
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cabinet_stocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dept_id TEXT NOT NULL,
        material_id TEXT NOT NULL,
        name TEXT NOT NULL,
        unit TEXT NOT NULL,
        standard_qty INTEGER NOT NULL,
        current_qty INTEGER NOT NULL,
        min_lot_exp TEXT,
        FOREIGN KEY (dept_id) REFERENCES departments (id),
        FOREIGN KEY (material_id) REFERENCES materials (id)
    )
    """)

    # Bang nhat ky nhiet do do am GSP
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS gsp_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone TEXT NOT NULL,
        temp REAL NOT NULL,
        humidity REAL NOT NULL,
        logged_by TEXT,
        logged_at TEXT NOT NULL
    )
    """)

    conn.commit()

    # Nap du lieu mac dinh neu khoi tao lan dau
    seed_initial_data(cursor, conn)
    conn.close()

def seed_initial_data(cursor, conn):
    cursor.execute("SELECT COUNT(*) FROM departments")
    if cursor.fetchone()[0] == 0:
        depts = [
            ("KCC", "Khoa Cấp cứu", "BS.CKI Nguyễn Văn Hùng"),
            ("KNT", "Khoa Nội thận lọc máu", "BS.CKII Trần Minh Tuấn"),
            ("KGMHS", "Khoa Gây mê hồi sức", "BS.CKI Phạm Đình Toàn"),
            ("KXN", "Khoa Xét nghiệm", "BS.CKI Đặng Thị Hồng"),
            ("KKB", "Khoa Khám bệnh", "BS. Đỗ Thị Thu"),
            ("KNTH", "Khoa Nội tổng hợp", "BS.CKI Vũ Quang Vinh"),
            ("KNGTH", "Khoa Ngoại tổng hợp", "BS.CKII Lê Văn Nam"),
            ("KSAN", "Khoa Sản", "BS.CKI Phan Thị Cúc"),
            ("KNHI", "Khoa Nhi", "BS.CKI Trịnh Thanh Thủy"),
            ("KMAT", "Khoa Mắt", "BS.CKI Hoàng Văn Bình"),
            ("KTMH", "Khoa Tai mũi họng", "BS. Vũ Thị Tuyết"),
            ("KRHM", "Khoa Răng hàm mặt", "BS. Đinh Trọng Nhân"),
            ("KYHCT", "Khoa Y học cổ truyền", "BS. Hoàng Văn Toàn"),
            ("KKTYC", "Khoa Khám theo yêu cầu", "BS. Mai Thị Ánh"),
            ("KPTTM", "Khoa Phẫu thuật tạo hình thẩm mỹ", "BS.CKI Lê Bảo An")
        ]
        cursor.executemany("INSERT INTO departments (id, name, head) VALUES (?, ?, ?)", depts)

    cursor.execute("SELECT COUNT(*) FROM materials")
    if cursor.fetchone()[0] == 0:
        materials = [
            ("VT001", "Bơm tiêm dùng một lần 5ml/cc có kim 23G", "VTTH", "Cây", "Vô trùng, nòng trong suốt", "Việt Nam (Vinahankook)", "PHONG", 1250.0, 2000),
            ("VT002", "Kim luồn tĩnh mạch an toàn 20G (Hồng)", "VTTH", "Cái", "Polyurethane có van tiêm phụ", "Mỹ (BD Insyte)", "PHONG", 14500.0, 600),
            ("VT003", "Dây truyền dịch có kim 20G kèm bầu đếm giọt", "VTTH", "Dây", "20 giọt/ml, có màng lọc 15 micron", "Đức (B.Braun)", "PHONG", 8500.0, 1000),
            ("VT004", "Găng tay y tế khám bệnh có bột cỡ M", "VTTH", "Hộp 50 đôi", "Cao su tự nhiên latex co giãn", "Việt Nam (VRP)", "PHONG", 85000.0, 150),
            ("VT005", "Băng thun y tế 3 móc 10cm x 5.5m", "DUNGVIEN", "Cuộn", "Độ co dãn cao, thoáng khí", "Việt Nam (Bảo Thạch)", "PHONG", 12000.0, 300),
            ("VT006", "Quả lọc thận nhân tạo sợi rỗng High-Flux Rexeed-15UC", "VTTH", "Quả", "Màng Polysulfone 1.5m2", "Nhật Bản (Asahi Kasei)", "MAT", 420000.0, 250),
            ("VT007", "Catheter lọc máu 2 nòng tạm thời 11.5Fr x 15cm", "VTTH", "Bộ", "Gồm catheter, kim dẫn đường, dao", "Thụy Điển (Gambro)", "MAT", 380000.0, 50),
            ("VT008", "Hóa chất xét nghiệm Glucose GOD-PAP Cobas 8000", "HOACHAT", "Hộp 4x250ml", "Dùng máy sinh hóa tự động", "Thụy Sỹ (Roche)", "TULANH", 1850000.0, 20),
            ("VT009", "Kit test nhanh kháng nguyên bề mặt Viêm Gan B (HBsAg)", "SINHPHAM", "Hộp 30 test", "Độ nhạy 99.8%", "Hàn Quốc (SD Bioline)", "TULANH", 450000.0, 40),
            ("VT010", "Chỉ phẫu thuật tự tiêu tổng hợp Vicryl 3/0", "VTTH", "Tép (Hộp 36 tép)", "Polyglactin 910 vô trùng", "Mỹ (Ethicon - J&J)", "PHONG", 82000.0, 120)
        ]
        cursor.executemany("INSERT INTO materials VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", materials)

        lots = [
            ("VT001", "LOT-24E12", "2026-10-15", "2024-05-10", 850),
            ("VT001", "LOT-25B03", "2027-02-28", "2025-02-01", 2500),
            ("VT002", "LOT-KL20-09", "2026-10-25", "2024-09-01", 180),
            ("VT002", "LOT-KL20-11", "2027-05-30", "2025-05-01", 800),
            ("VT003", "LOT-TD-2408", "2026-11-10", "2024-08-10", 450),
            ("VT003", "LOT-TD-2501", "2027-08-15", "2025-01-10", 1200),
            ("VT004", "LOT-GT-25A", "2028-01-20", "2025-01-10", 220),
            ("VT005", "LOT-BT-0924", "2026-10-05", "2024-09-01", 95),
            ("VT006", "LOT-RX-24L08", "2026-11-20", "2024-11-01", 85),
            ("VT006", "LOT-RX-25C15", "2027-09-30", "2025-03-01", 320),
            ("VT007", "LOT-CT-2502", "2027-06-15", "2025-02-10", 75),
            ("VT008", "LOT-GLU-24K", "2026-10-30", "2024-10-15", 8),
            ("VT008", "LOT-GLU-25D", "2027-04-30", "2025-04-01", 25),
            ("VT009", "LOT-HBS-2501", "2027-01-15", "2025-01-05", 65),
            ("VT010", "LOT-VIC-2409", "2026-12-05", "2024-09-10", 45),
            ("VT010", "LOT-VIC-2504", "2028-04-20", "2025-04-01", 150)
        ]
        cursor.executemany("INSERT INTO material_lots (material_id, lot_num, exp_date, mfg_date, qty) VALUES (?, ?, ?, ?, ?)", lots)

    cursor.execute("SELECT COUNT(*) FROM import_orders")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO import_orders VALUES (
            'NK-2026-0901', 'Công ty CP Dược & Thiết Bị Y Tế Trung Ương 1 (CPC1)', 'HĐ-15/2026/VTTBYT-BVPN',
            '0018429', '2026-09-02', 7, 'Đã hoàn tất nhập kho & đề nghị thanh toán',
            'CN. Nguyễn Thu Trang (Kế toán dược)', '2026-09-03',
            '["DS. Hoàng Thị Minh Hà (Trưởng P. VTTBYT)", "CN. Nguyễn Thu Trang (Kế toán dược)", "DS. Trần Văn An (Thủ kho)"]',
            'Hàng nguyên đai nguyên kiện, cảm quan đạt chuẩn, số lô và HSD đúng hợp đồng. Đồng ý nhập kho.'
        )
        """)
        cursor.execute("""
        INSERT INTO import_items (order_id, material_id, name, unit, lot_num, exp_date, qty, unit_price)
        VALUES ('NK-2026-0901', 'VT001', 'Bơm tiêm dùng một lần 5ml/cc có kim 23G', 'Cây', 'LOT-25B03', '2027-02-28', 2500, 1250),
               ('NK-2026-0901', 'VT002', 'Kim luồn tĩnh mạch an toàn 20G (Hồng)', 'Cái', 'LOT-KL20-11', '2027-05-30', 800, 14500)
        """)

        cursor.execute("""
        INSERT INTO import_orders (id, supplier, contract, invoice_num, created_date, step, status, current_handler)
        VALUES ('NK-2026-0902', 'Công ty TNHH Thiết Bị Y Tế Asahi Kasei VN', 'HĐ-22/2026/VT-THAN-BVPN', '0009231', '2026-09-18', 3, 'Chờ Hội đồng kiểm nhập đánh giá chất lượng (Bước 3)', 'Hội đồng kiểm nhập')
        """)
        cursor.execute("""
        INSERT INTO import_items (order_id, material_id, name, unit, lot_num, exp_date, qty, unit_price)
        VALUES ('NK-2026-0902', 'VT006', 'Quả lọc thận nhân tạo sợi rỗng High-Flux Rexeed-15UC', 'Quả', 'LOT-RX-25C15', '2027-09-30', 320, 420000)
        """)

    cursor.execute("SELECT COUNT(*) FROM export_requests")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
        INSERT INTO export_requests VALUES (
            'PL-2026-0901', 'KCC', 'Khoa Cấp cứu', 'ĐD. Lê Thị Mai', 'BS.CKI Nguyễn Văn Hùng',
            'Bù cơ số tủ trực cấp cứu khoa tháng 09/2026', '2026-09-08', 6,
            'Đã giao nhận & Cập nhật thẻ kho hoàn tất', 'XK-0901/VTTBYT', '2026-09-08',
            'DS. Trần Văn An (Thủ kho)', 'ĐD. Lê Thị Mai (ĐD Khoa Cấp Cứu)'
        )
        """)
        cursor.execute("""
        INSERT INTO export_items (request_id, material_id, name, unit, requested_qty, dispensed_qty, lot_num, exp_date, unit_price)
        VALUES ('PL-2026-0901', 'VT001', 'Bơm tiêm dùng một lần 5ml/cc có kim 23G', 'Cây', 400, 400, 'LOT-24E12', '2026-10-15', 1250),
               ('PL-2026-0901', 'VT002', 'Kim luồn tĩnh mạch an toàn 20G (Hồng)', 'Cái', 100, 100, 'LOT-KL20-09', '2026-10-25', 14500)
        """)

        cursor.execute("""
        INSERT INTO export_requests (id, dept_id, dept_name, requester, approver_head, purpose, created_date, step, status)
        VALUES ('PL-2026-0902', 'KNT', 'Khoa Nội thận lọc máu', 'ĐD. Vũ Bích Ngọc', 'BS.CKII Trần Minh Tuấn', 'Theo y lệnh chạy thận chu kỳ', '2026-09-27', 3, 'Chờ Trưởng P. VTTBYT xét duyệt phiếu lĩnh (Bước 3)')
        """)
        cursor.execute("""
        INSERT INTO export_items (request_id, material_id, name, unit, requested_qty, dispensed_qty, lot_num, exp_date, unit_price)
        VALUES ('PL-2026-0902', 'VT006', 'Quả lọc thận nhân tạo sợi rỗng High-Flux Rexeed-15UC', 'Quả', 50, 0, '', '', 420000),
               ('PL-2026-0902', 'VT003', 'Dây truyền dịch có kim 20G kèm bầu đếm giọt', 'Dây', 80, 0, '', '', 8500)
        """)

    cursor.execute("SELECT COUNT(*) FROM cabinet_stocks")
    if cursor.fetchone()[0] == 0:
        cabinets = [
            ("KCC", "VT001", "Bơm tiêm dùng một lần 5ml/cc có kim 23G", "Cây", 500, 380, "2026-10-15"),
            ("KCC", "VT002", "Kim luồn tĩnh mạch an toàn 20G (Hồng)", "Cái", 150, 110, "2026-10-25"),
            ("KCC", "VT003", "Dây truyền dịch có kim 20G kèm bầu đếm giọt", "Dây", 200, 140, "2026-11-10"),
            ("KCC", "VT005", "Băng thun y tế 3 móc 10cm x 5.5m", "Cuộn", 80, 35, "2026-10-05"),
            ("KNT", "VT006", "Quả lọc thận nhân tạo sợi rỗng High-Flux Rexeed-15UC", "Quả", 60, 18, "2026-11-20"),
            ("KNT", "VT007", "Catheter lọc máu 2 nòng tạm thời 11.5Fr x 15cm", "Bộ", 20, 12, "2027-06-15"),
            ("KNT", "VT001", "Bơm tiêm dùng một lần 5ml/cc có kim 23G", "Cây", 300, 210, "2026-10-15")
        ]
        cursor.executemany("INSERT INTO cabinet_stocks (dept_id, material_id, name, unit, standard_qty, current_qty, min_lot_exp) VALUES (?, ?, ?, ?, ?, ?, ?)", cabinets)

    conn.commit()
