/**
 * QUẢN LÝ VẬT TƯ TIÊU HAO Y TẾ - BỆNH VIỆN QUẬN PHÚ NHUẬN
 * Chuẩn hóa 100% quy trình Nhập (7 bước) & Xuất (6 bước) theo Quyết định số 651/QĐ-BVPN
 */

// --- DANH MỤC KHOA PHÒNG THEO QUYẾT ĐỊNH 651 ---
const HOSPITAL_DEPTS = [
  { id: "KCC", name: "Khoa Cấp cứu", head: "BS.CKI Nguyễn Văn Hùng" },
  { id: "KNT", name: "Khoa Nội thận lọc máu", head: "BS.CKII Trần Minh Tuấn" },
  { id: "KGMHS", name: "Khoa Gây mê hồi sức", head: "BS.CKI Phạm Đình Toàn" },
  { id: "KXN", name: "Khoa Xét nghiệm", head: "BS.CKI Đặng Thị Hồng" },
  { id: "KKB", name: "Khoa Khám bệnh", head: "BS. Đỗ Thị Thu" },
  { id: "KNTH", name: "Khoa Nội tổng hợp", head: "BS.CKI Vũ Quang Vinh" },
  { id: "KNGTH", name: "Khoa Ngoại tổng hợp", head: "BS.CKII Lê Văn Nam" },
  { id: "KSAN", name: "Khoa Sản", head: "BS.CKI Phan Thị Cúc" },
  { id: "KNHI", name: "Khoa Nhi", head: "BS.CKI Trịnh Thanh Thủy" },
  { id: "KMAT", name: "Khoa Mắt", head: "BS.CKI Hoàng Văn Bình" },
  { id: "KTMH", name: "Khoa Tai mũi họng", head: "BS. Vũ Thị Tuyết" },
  { id: "KRHM", name: "Khoa Răng hàm mặt", head: "BS. Đinh Trọng Nhân" },
  { id: "KYHCT", name: "Khoa Y học cổ truyền", head: "BS. Hoàng Văn Toàn" },
  { id: "KKTYC", name: "Khoa Khám theo yêu cầu", head: "BS. Mai Thị Ánh" },
  { id: "KPTTM", name: "Khoa Phẫu thuật tạo hình thẩm mỹ", head: "BS.CKI Lê Bảo An" }
];

// --- DỮ LIỆU MẪU BAN ĐẦU ---
const DEFAULT_CATALOG = [
  {
    id: "VT001",
    name: "Bơm tiêm dùng một lần 5ml/cc có kim 23G",
    category: "VTTH",
    unit: "Cây",
    specs: "Vô trùng, đóng gói vỉ riêng, nòng nhựa trong suốt",
    country: "Việt Nam (Vinahankook)",
    storageType: "PHONG", // 15-25°C
    unitPrice: 1250,
    minStock: 2000,
    lots: [
      { lotNum: "LOT-24E12", expDate: "2026-10-15", qty: 850, mfgDate: "2024-05-10" },
      { lotNum: "LOT-25B03", expDate: "2027-02-28", qty: 2500, mfgDate: "2025-02-01" }
    ]
  },
  {
    id: "VT002",
    name: "Kim luồn tĩnh mạch an toàn 20G (Hồng)",
    category: "VTTH",
    unit: "Cái",
    specs: "Polyurethane, có van tiêm phụ, kim sắc nhọn 3 góc",
    country: "Mỹ (BD Insyte)",
    storageType: "PHONG",
    unitPrice: 14500,
    minStock: 600,
    lots: [
      { lotNum: "LOT-KL20-09", expDate: "2026-10-25", qty: 180, mfgDate: "2024-09-01" },
      { lotNum: "LOT-KL20-11", expDate: "2027-05-30", qty: 800, mfgDate: "2025-05-01" }
    ]
  },
  {
    id: "VT003",
    name: "Dây truyền dịch có kim 20G kèm bầu đếm giọt",
    category: "VTTH",
    unit: "Dây",
    specs: "20 giọt/ml, có màng lọc 15 micron, khóa lăn trơn chu",
    country: "Đức (B.Braun)",
    storageType: "PHONG",
    unitPrice: 8500,
    minStock: 1000,
    lots: [
      { lotNum: "LOT-TD-2408", expDate: "2026-11-10", qty: 450, mfgDate: "2024-08-10" },
      { lotNum: "LOT-TD-2501", expDate: "2027-08-15", qty: 1200, mfgDate: "2025-01-10" }
    ]
  },
  {
    id: "VT004",
    name: "Găng tay y tế khám bệnh có bột cỡ M",
    category: "VTTH",
    unit: "Hộp 50 đôi",
    specs: "Cao su tự nhiên latex, độ co giãn cao, nhám đầu ngón",
    country: "Việt Nam (VRP)",
    storageType: "PHONG",
    unitPrice: 85000,
    minStock: 150,
    lots: [
      { lotNum: "LOT-GT-25A", expDate: "2028-01-20", qty: 220, mfgDate: "2025-01-10" }
    ]
  },
  {
    id: "VT005",
    name: "Băng thun y tế 3 móc 10cm x 5.5m",
    category: "DUNGVIEN",
    unit: "Cuộn",
    specs: "Độ co dãn cao, thoáng khí, không gây kích ứng da",
    country: "Việt Nam (Bảo Thạch)",
    storageType: "PHONG",
    unitPrice: 12000,
    minStock: 300,
    lots: [
      { lotNum: "LOT-BT-0924", expDate: "2026-10-05", qty: 95, mfgDate: "2024-09-01" } // cận date < 10 ngày để test FEFO alert
    ]
  },
  {
    id: "VT006",
    name: "Quả lọc thận nhân tạo sợi rỗng High-Flux Rexeed-15UC",
    category: "VTTH",
    unit: "Quả",
    specs: "Màng Polysulfone diện tích 1.5m2, hệ số siêu lọc cao",
    country: "Nhật Bản (Asahi Kasei)",
    storageType: "MAT", // 8-15°C
    unitPrice: 420000,
    minStock: 250,
    lots: [
      { lotNum: "LOT-RX-24L08", expDate: "2026-11-20", qty: 85, mfgDate: "2024-11-01" },
      { lotNum: "LOT-RX-25C15", expDate: "2027-09-30", qty: 320, mfgDate: "2025-03-01" }
    ]
  },
  {
    id: "VT007",
    name: "Catheter lọc máu 2 nòng tạm thời 11.5Fr x 15cm",
    category: "VTTH",
    unit: "Bộ",
    specs: "Gồm catheter, kim chọc dẫn đường, dao mổ, nong",
    country: "Thụy Điển (Gambro)",
    storageType: "MAT",
    unitPrice: 380000,
    minStock: 50,
    lots: [
      { lotNum: "LOT-CT-2502", expDate: "2027-06-15", qty: 75, mfgDate: "2025-02-10" }
    ]
  },
  {
    id: "VT008",
    name: "Hóa chất xét nghiệm Glucose GOD-PAP Cobas 8000",
    category: "HOACHAT",
    unit: "Hộp 4x250ml",
    specs: "Định lượng glucose huyết tương, dùng máy sinh hóa tự động",
    country: "Thụy Sỹ (Roche)",
    storageType: "TULANH", // 2-8°C
    unitPrice: 1850000,
    minStock: 20,
    lots: [
      { lotNum: "LOT-GLU-24K", expDate: "2026-10-30", qty: 8, mfgDate: "2024-10-15" },
      { lotNum: "LOT-GLU-25D", expDate: "2027-04-30", qty: 25, mfgDate: "2025-04-01" }
    ]
  },
  {
    id: "VT009",
    name: "Kit test nhanh kháng nguyên bề mặt Viêm Gan B (HBsAg)",
    category: "SINHPHAM",
    unit: "Hộp 30 test",
    specs: "Độ nhạy 99.8%, phát hiện kháng nguyên HBsAg trong huyết thanh",
    country: "Hàn Quốc (SD Bioline)",
    storageType: "TULANH",
    unitPrice: 450000,
    minStock: 40,
    lots: [
      { lotNum: "LOT-HBS-2501", expDate: "2027-01-15", qty: 65, mfgDate: "2025-01-05" }
    ]
  },
  {
    id: "VT010",
    name: "Chỉ phẫu thuật tự tiêu tổng hợp Vicryl 3/0 kim tròn 26mm",
    category: "VTTH",
    unit: "Tép (Hộp 36 tép)",
    specs: "Polyglactin 910 vô trùng, giữ lực căng mô 28-35 ngày",
    country: "Mỹ (Ethicon - J&J)",
    storageType: "PHONG",
    unitPrice: 82000,
    minStock: 120,
    lots: [
      { lotNum: "LOT-VIC-2409", expDate: "2026-12-05", qty: 45, mfgDate: "2024-09-10" },
      { lotNum: "LOT-VIC-2504", expDate: "2028-04-20", qty: 150, mfgDate: "2025-04-01" }
    ]
  }
];

// --- DỮ LIỆU ĐƠN NHẬP KHO BAN ĐẦU (7 BƯỚC) ---
const DEFAULT_IMPORT_DOCS = [
  {
    id: "NK-2026-0901",
    supplier: "Công ty CP Dược & Thiết Bị Y Tế Trung Ương 1 (CPC1)",
    contract: "HĐ-15/2026/VTTBYT-BVPN",
    invoiceNum: "0018429",
    createdDate: "2026-09-02",
    step: 7, // Hoàn tất 7 bước
    status: "Đã hoàn tất nhập kho & đề nghị thanh toán",
    currentHandler: "CN. Nguyễn Thu Trang (Kế toán dược)",
    items: [
      { itemId: "VT001", name: "Bơm tiêm dùng một lần 5ml/cc có kim 23G", unit: "Cây", lotNum: "LOT-25B03", expDate: "2027-02-28", qty: 2500, unitPrice: 1250 },
      { itemId: "VT002", name: "Kim luồn tĩnh mạch an toàn 20G (Hồng)", unit: "Cái", lotNum: "LOT-KL20-11", expDate: "2027-05-30", qty: 800, unitPrice: 14500 }
    ],
    inspectionData: {
      date: "2026-09-03",
      members: ["DS. Hoàng Thị Minh Hà (Trưởng P. VTTBYT)", "CN. Nguyễn Thu Trang (Kế toán dược)", "DS. Trần Văn An (Thủ kho)"],
      conclusion: "Hàng nguyên đai nguyên kiện, cảm quan đạt chuẩn, số lô và HSD đúng hợp đồng. Đồng ý nhập kho."
    }
  },
  {
    id: "NK-2026-0902",
    supplier: "Công ty TNHH Thiết Bị Y Tế Asahi Kasei VN",
    contract: "HĐ-22/2026/VT-THAN-BVPN",
    invoiceNum: "0009231",
    createdDate: "2026-09-18",
    step: 3, // Bước 3: Đang trong bước Hội đồng kiểm nhập
    status: "Chờ Hội đồng kiểm nhập đánh giá chất lượng (Bước 3)",
    currentHandler: "Hội đồng kiểm nhập (Thủ kho + Kế toán + VTTBYT)",
    items: [
      { itemId: "VT006", name: "Quả lọc thận nhân tạo sợi rỗng High-Flux Rexeed-15UC", unit: "Quả", lotNum: "LOT-RX-25C15", expDate: "2027-09-30", qty: 320, unitPrice: 420000 }
    ]
  },
  {
    id: "NK-2026-0903",
    supplier: "Công ty Thiết Bị & Hóa Chất Roche Việt Nam",
    contract: "HĐ-05/2026/XN-BVPN",
    invoiceNum: "0034112",
    createdDate: "2026-09-25",
    step: 5, // Bước 5: Kế toán kiểm tra hóa đơn
    status: "Kế toán kiểm tra hóa đơn & in phiếu nhập (Bước 5)",
    currentHandler: "CN. Nguyễn Thu Trang (Kế toán dược)",
    items: [
      { itemId: "VT008", name: "Hóa chất xét nghiệm Glucose GOD-PAP Cobas 8000", unit: "Hộp 4x250ml", lotNum: "LOT-GLU-25D", expDate: "2027-04-30", qty: 25, unitPrice: 1850000 }
    ],
    inspectionData: {
      date: "2026-09-26",
      members: ["DS. Hoàng Thị Minh Hà", "CN. Nguyễn Thu Trang", "DS. Trần Văn An"],
      conclusion: "Nhiệt độ thùng lạnh vận chuyển duy trì 4.5°C đạt chuẩn 2-8°C. Tem niêm phong nguyên vẹn. Đạt tiêu chuẩn nhập kho."
    }
  }
];

// --- DỮ LIỆU PHIẾU LĨNH & XUẤT KHO BAN ĐẦU (6 BƯỚC) ---
const DEFAULT_EXPORT_DOCS = [
  {
    id: "PL-2026-0901",
    deptId: "KCC",
    deptName: "Khoa Cấp cứu",
    requester: "ĐD. Lê Thị Mai",
    approverHead: "BS.CKI Nguyễn Văn Hùng",
    purpose: "Bù cơ số tủ trực cấp cứu khoa tháng 09/2026",
    createdDate: "2026-09-08",
    step: 6, // Đã hoàn tất 6 bước & xuất kho
    status: "Đã giao nhận & Cập nhật thẻ kho hoàn tất",
    items: [
      { itemId: "VT001", name: "Bơm tiêm dùng một lần 5ml/cc có kim 23G", unit: "Cây", requestedQty: 400, dispensedQty: 400, lotNum: "LOT-24E12", expDate: "2026-10-15", unitPrice: 1250 },
      { itemId: "VT002", name: "Kim luồn tĩnh mạch an toàn 20G (Hồng)", unit: "Cái", requestedQty: 100, dispensedQty: 100, lotNum: "LOT-KL20-09", expDate: "2026-10-25", unitPrice: 14500 }
    ],
    exportReceiptNum: "XK-0901/VTTBYT",
    exportDate: "2026-09-08",
    dispensedBy: "DS. Trần Văn An (Thủ kho)",
    receivedBy: "ĐD. Lê Thị Mai (ĐD Khoa Cấp Cứu)"
  },
  {
    id: "PL-2026-0902",
    deptId: "KNT",
    deptName: "Khoa Nội thận lọc máu",
    requester: "ĐD. Vũ Bích Ngọc",
    approverHead: "BS.CKII Trần Minh Tuấn",
    purpose: "Theo y lệnh chạy thận chu kỳ cho bệnh nhân",
    createdDate: "2026-09-27",
    step: 3, // Bước 3: Chờ Trưởng P. VTTBYT duyệt
    status: "Chờ Trưởng P. VTTBYT xét duyệt phiếu lĩnh (Bước 3)",
    items: [
      { itemId: "VT006", name: "Quả lọc thận nhân tạo sợi rỗng High-Flux Rexeed-15UC", unit: "Quả", requestedQty: 50, dispensedQty: 0, lotNum: "", expDate: "", unitPrice: 420000 },
      { itemId: "VT003", name: "Dây truyền dịch có kim 20G kèm bầu đếm giọt", unit: "Dây", requestedQty: 80, dispensedQty: 0, lotNum: "", expDate: "", unitPrice: 8500 }
    ]
  },
  {
    id: "PL-2026-0903",
    deptId: "KXN",
    deptName: "Khoa Xét nghiệm",
    requester: "KTV. Phạm Hải Đăng",
    approverHead: "BS.CKI Đặng Thị Hồng",
    purpose: "Hóa chất phục vụ công tác xét nghiệm sinh hóa",
    createdDate: "2026-09-28",
    step: 4, // Bước 4: Thủ kho chuẩn bị xuất theo FEFO
    status: "Thủ kho chuẩn bị cấp phát theo FEFO & in chứng từ (Bước 4)",
    items: [
      { itemId: "VT008", name: "Hóa chất xét nghiệm Glucose GOD-PAP Cobas 8000", unit: "Hộp 4x250ml", requestedQty: 5, dispensedQty: 5, lotNum: "LOT-GLU-24K", expDate: "2026-10-30", unitPrice: 1850000 },
      { itemId: "VT009", name: "Kit test nhanh kháng nguyên bề mặt Viêm Gan B (HBsAg)", unit: "Hộp 30 test", requestedQty: 10, dispensedQty: 10, lotNum: "LOT-HBS-2501", expDate: "2027-01-15", unitPrice: 450000 }
    ]
  }
];

// --- DỮ LIỆU TỦ TRỰC TẠI CÁC KHOA PHÒNG ---
const DEFAULT_CABINETS = {
  "KCC": [
    { itemId: "VT001", name: "Bơm tiêm dùng một lần 5ml/cc có kim 23G", unit: "Cây", standardQty: 500, currentQty: 380, minLotExp: "2026-10-15" },
    { itemId: "VT002", name: "Kim luồn tĩnh mạch an toàn 20G (Hồng)", unit: "Cái", standardQty: 150, currentQty: 110, minLotExp: "2026-10-25" },
    { itemId: "VT003", name: "Dây truyền dịch có kim 20G kèm bầu đếm giọt", unit: "Dây", standardQty: 200, currentQty: 140, minLotExp: "2026-11-10" },
    { itemId: "VT005", name: "Băng thun y tế 3 móc 10cm x 5.5m", unit: "Cuộn", standardQty: 80, currentQty: 35, minLotExp: "2026-10-05" }
  ],
  "KNT": [
    { itemId: "VT006", name: "Quả lọc thận nhân tạo sợi rỗng High-Flux Rexeed-15UC", unit: "Quả", standardQty: 60, currentQty: 18, minLotExp: "2026-11-20" },
    { itemId: "VT007", name: "Catheter lọc máu 2 nòng tạm thời 11.5Fr x 15cm", unit: "Bộ", standardQty: 20, currentQty: 12, minLotExp: "2027-06-15" },
    { itemId: "VT001", name: "Bơm tiêm dùng một lần 5ml/cc có kim 23G", unit: "Cây", standardQty: 300, currentQty: 210, minLotExp: "2026-10-15" }
  ],
  "KGMHS": [
    { itemId: "VT010", name: "Chỉ phẫu thuật tự tiêu tổng hợp Vicryl 3/0", unit: "Tép", standardQty: 60, currentQty: 38, minLotExp: "2026-12-05" },
    { itemId: "VT002", name: "Kim luồn tĩnh mạch an toàn 20G (Hồng)", unit: "Cái", standardQty: 100, currentQty: 75, minLotExp: "2026-10-25" },
    { itemId: "VT004", name: "Găng tay y tế khám bệnh có bột cỡ M", unit: "Hộp", standardQty: 40, currentQty: 30, minLotExp: "2028-01-20" }
  ],
  "KXN": [
    { itemId: "VT008", name: "Hóa chất xét nghiệm Glucose GOD-PAP Cobas 8000", unit: "Hộp", standardQty: 10, currentQty: 4, minLotExp: "2026-10-30" },
    { itemId: "VT009", name: "Kit test nhanh kháng nguyên bề mặt Viêm Gan B (HBsAg)", unit: "Hộp", standardQty: 15, currentQty: 8, minLotExp: "2027-01-15" }
  ]
};

// --- APP STATE & LOCAL STORAGE ---
class MedicalInventoryApp {
  constructor() {
    this.currentRole = "thukho";
    this.currentTab = "dashboard";
    this.activePrintTemplate = "phieulinh";
    this.selectedCabinetDept = "KCC";
    this.activeInspectingDocId = null;
    this.activeFefoAllocDocId = null;

    this.initData();
    this.bindEvents();
    this.renderAll();
    this.startGspSensors();
  }

  initData() {
    if (!localStorage.getItem("BVPN_CATALOG")) {
      this.resetSampleData();
    } else {
      this.catalog = JSON.parse(localStorage.getItem("BVPN_CATALOG"));
      this.importDocs = JSON.parse(localStorage.getItem("BVPN_IMPORT_DOCS"));
      this.exportDocs = JSON.parse(localStorage.getItem("BVPN_EXPORT_DOCS"));
      this.cabinets = JSON.parse(localStorage.getItem("BVPN_CABINETS"));
    }
  }

  resetSampleData() {
    this.catalog = JSON.parse(JSON.stringify(DEFAULT_CATALOG));
    this.importDocs = JSON.parse(JSON.stringify(DEFAULT_IMPORT_DOCS));
    this.exportDocs = JSON.parse(JSON.stringify(DEFAULT_EXPORT_DOCS));
    this.cabinets = JSON.parse(JSON.stringify(DEFAULT_CABINETS));
    this.saveData();
    this.showToast("Đã khôi phục dữ liệu mẫu chuẩn BV quận Phú Nhuận!", "success");
  }

  saveData() {
    localStorage.setItem("BVPN_CATALOG", JSON.stringify(this.catalog));
    localStorage.setItem("BVPN_IMPORT_DOCS", JSON.stringify(this.importDocs));
    localStorage.setItem("BVPN_EXPORT_DOCS", JSON.stringify(this.exportDocs));
    localStorage.setItem("BVPN_CABINETS", JSON.stringify(this.cabinets));
  }

  // --- BIND UI EVENTS ---
  bindEvents() {
    // Navigation Tabs
    document.querySelectorAll(".nav-item").forEach(btn => {
      btn.addEventListener("click", () => {
        this.switchTab(btn.dataset.tab);
      });
    });

    // User Role Switcher
    const roleSelect = document.getElementById("userRoleSelect");
    if (roleSelect) {
      roleSelect.addEventListener("change", (e) => {
        this.currentRole = e.target.value;
        this.updateRoleDisplay();
      });
    }

    // Reset Sample Data Button
    document.getElementById("btnSampleReset")?.addEventListener("click", () => {
      if (confirm("Khôi phục lại toàn bộ dữ liệu mẫu ban đầu theo QĐ 651?")) {
        this.resetSampleData();
        this.renderAll();
      }
    });

    // Quick Action button in Topbar
    document.getElementById("btnQuickAction")?.addEventListener("click", () => {
      if (this.currentRole === "dieuduong") {
        this.openExportModal();
      } else {
        this.openImportModal();
      }
    });

    // Global Search
    document.getElementById("globalSearchInput")?.addEventListener("input", (e) => {
      this.handleGlobalSearch(e.target.value);
    });

    // Catalog Filter Events
    document.getElementById("itemSearchQuery")?.addEventListener("input", () => this.renderCatalog());
    document.getElementById("itemFilterCategory")?.addEventListener("change", () => this.renderCatalog());
    document.getElementById("itemFilterStorage")?.addEventListener("change", () => this.renderCatalog());
    document.getElementById("itemFilterStockStatus")?.addEventListener("change", () => this.renderCatalog());

    // Import Tab Filter & Actions
    document.getElementById("importFilterStep")?.addEventListener("change", () => this.renderImportTable());
    document.getElementById("btnCreateImportRequest")?.addEventListener("click", () => this.openImportModal());
    document.getElementById("btnAddImportRow")?.addEventListener("click", () => this.addImportItemRow());
    document.getElementById("btnSaveImportDoc")?.addEventListener("click", () => this.saveImportDoc());
    document.getElementById("btnConfirmInspection")?.addEventListener("click", () => this.confirmInspection());

    // Export Tab Filter & Actions
    document.getElementById("exportFilterStatus")?.addEventListener("change", () => this.renderExportTable());
    document.getElementById("exportFilterDept")?.addEventListener("change", () => this.renderExportTable());
    document.getElementById("btnCreateExportRequest")?.addEventListener("click", () => this.openExportModal());
    document.getElementById("btnAddExportRow")?.addEventListener("click", () => this.addExportItemRow());
    document.getElementById("btnSaveExportRequest")?.addEventListener("click", () => this.saveExportRequest());
    document.getElementById("btnConfirmFefoDispatch")?.addEventListener("click", () => this.confirmFefoDispatch());
    document.getElementById("btnPrintExpDocFromModal")?.addEventListener("click", () => {
      closeModal("modalFefoAllocation");
      this.switchTab("bieumau");
      this.switchPrintTemplate("chungtuxuat");
    });

    // Cabinet Dept Filter
    document.getElementById("deptSelectFilter")?.addEventListener("change", (e) => {
      this.selectedCabinetDept = e.target.value;
      this.renderCabinet();
    });

    // GSP Log Modal
    document.getElementById("btnLogTemp")?.addEventListener("click", () => {
      openModal("modalTempLog");
    });
    document.getElementById("btnSaveTempLog")?.addEventListener("click", () => {
      const zone = document.getElementById("logZoneSelect").value;
      const t = document.getElementById("logTempInput").value;
      const h = document.getElementById("logHumInput").value;
      document.getElementById(`temp-${zone}`).textContent = t;
      document.getElementById(`hum-${zone}`).textContent = h;
      closeModal("modalTempLog");
      this.showToast(`Đã lưu nhật ký nhiệt ẩm kế: ${t}°C - ${h}%`, "success");
    });

    // Print Template Switchers
    document.querySelectorAll(".tpl-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tpl-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.switchPrintTemplate(btn.dataset.tpl);
      });
    });

    // Report Actions
    document.getElementById("btnGenerateReport")?.addEventListener("click", () => this.renderReport());
    document.getElementById("btnPreviewReportForm")?.addEventListener("click", () => {
      this.switchTab("bieumau");
      this.switchPrintTemplate("baocaodutru");
    });
  }

  // --- TAB NAVIGATION ---
  switchTab(tabId) {
    this.currentTab = tabId;
    document.querySelectorAll(".nav-item").forEach(b => {
      b.classList.toggle("active", b.dataset.tab === tabId);
    });
    document.querySelectorAll(".tab-pane").forEach(p => {
      p.classList.toggle("active", p.id === `tab-${tabId}`);
    });

    const titleMap = {
      dashboard: "Tổng quan Kho Vật tư Y tế",
      nhapkho: "Quy trình Nhập kho Vật tư Tiêu hao (7 Bước Chuẩn)",
      xuatkho: "Quy trình Cấp phát - Xuất kho cho Khoa/Phòng (6 Bước)",
      danhmuc: "Danh mục Vật tư Tiêu hao, Hóa chất & Theo dõi Lô/HSD",
      tutruc: "Quản lý Cơ số Tủ trực Vật tư tại các Khoa Phòng",
      baoquan: "Giám sát Môi trường & Điều kiện Bảo quản Kho GSP",
      bieumau: "Hệ thống Biểu mẫu In ấn Chuẩn (Theo QĐ 651/QĐ-BVPN)",
      baocao: "Báo cáo Xuất - Nhập - Tồn & Dự trù Vật tư Định kỳ"
    };
    const descMap = {
      dashboard: "Theo dõi luân chuyển, hạn dùng FEFO và kiểm soát quy trình nhập - xuất theo quy định 651/QĐ-BVPN",
      nhapkho: "Chu trình 7 bước khép kín: Lập KH -> Đặt hàng -> HĐ kiểm nhập -> Sổ kiểm nhập -> Kế toán duyệt -> Hoàn tất -> Đề nghị thanh toán",
      xuatkho: "Chu trình 6 bước khép kín: Phiếu lĩnh Mẫu 01 -> Thủ kho xác nhận -> Trưởng phòng VTTBYT duyệt -> Cấp phát FEFO -> Giao nhận -> Trừ kho",
      danhmuc: "Quản lý chi tiết từng mã vật tư, điều kiện bảo quản GSP, ngưỡng tồn an toàn và số lô trúng thầu",
      tutruc: "Theo dõi tồn thực tế, bù cơ số tủ trực và hoàn trả theo Mục II & Mục 5.3 QĐ 651",
      baoquan: "Quy chuẩn nhiệt độ phòng (15-25°C), kho mát (8-15°C), kho lạnh (≤8°C), tủ lạnh (2-8°C), độ ẩm ≤70%",
      bieumau: "Biểu mẫu 01 (Phiếu lĩnh), Biểu mẫu 02 (Chứng từ xuất kho), Biểu mẫu 03 (Báo cáo & Dự trù tháng)",
      baocao: "Báo cáo xuất - nhập - tồn định kỳ từ ngày 1-5 hàng tháng làm căn cứ lập kế hoạch đặt hàng"
    };

    document.getElementById("pageTitle").textContent = titleMap[tabId] || "Quản Lý VTYT";
    document.getElementById("pageDesc").textContent = descMap[tabId] || "";

    // Refresh dynamic contents
    if (tabId === "dashboard") this.renderDashboard();
    if (tabId === "nhapkho") this.renderImportTable();
    if (tabId === "xuatkho") this.renderExportTable();
    if (tabId === "danhmuc") this.renderCatalog();
    if (tabId === "tutruc") this.renderCabinet();
    if (tabId === "bieumau") this.renderPrintTemplate();
    if (tabId === "baocao") this.renderReport();
  }

  // --- ROLE LOGIC ---
  updateRoleDisplay() {
    const roleMap = {
      thukho: { dept: "Kho Tổng VTTBYT", actionLabel: "Lập Đơn Nhập Hàng" },
      truongphong: { dept: "Phòng Vật tư TBYT", actionLabel: "Duyệt Phiếu Lĩnh / Nhập" },
      dieuduong: { dept: "Khoa Cấp cứu / Điều trị", actionLabel: "Lập Phiếu Lĩnh VTTH" },
      ketoan: { dept: "Phòng Tài chính Kế toán", actionLabel: "Kiểm Tra Hóa Đơn" },
      banggiamdoc: { dept: "Ban Giám Đốc", actionLabel: "Xem Báo Cáo" }
    };
    const r = roleMap[this.currentRole] || roleMap.thukho;
    document.getElementById("roleCurrentDept").innerHTML = `<i class="fa-solid fa-building-user"></i> Bộ phận: <b>${r.dept}</b>`;
    document.getElementById("quickActionLabel").textContent = r.actionLabel;
    this.renderAll();
    this.showToast(`Đã chuyển sang vai trò: ${document.getElementById("userRoleSelect").selectedOptions[0].text}`, "info");
  }

  // --- RENDER ALL SECTIONS ---
  renderAll() {
    this.populateDeptsSelects();
    this.renderDashboard();
    this.renderImportTable();
    this.renderExportTable();
    this.renderCatalog();
    this.renderCabinet();
    this.renderPrintTemplate();
    this.renderReport();
  }

  populateDeptsSelects() {
    const expSelect = document.getElementById("expDeptSelect");
    const filterDept = document.getElementById("exportFilterDept");
    const cabinetDept = document.getElementById("deptSelectFilter");
    const repDept = document.getElementById("reportDept");

    const deptOptionsHtml = HOSPITAL_DEPTS.map(d => `<option value="${d.id}">${d.name} (${d.head})</option>`).join("");
    if (expSelect) expSelect.innerHTML = deptOptionsHtml;
    if (cabinetDept) cabinetDept.innerHTML = HOSPITAL_DEPTS.slice(0, 5).map(d => `<option value="${d.id}">${d.name}</option>`).join("");
    if (filterDept) filterDept.innerHTML = `<option value="">Tất cả khoa phòng</option>` + deptOptionsHtml;
    if (repDept) repDept.innerHTML = `<option value="ALL">Toàn Bệnh Viện (Kho Tổng VTTBYT)</option>` + deptOptionsHtml;
  }

  // --- DASHBOARD CALCULATIONS & RENDERING ---
  renderDashboard() {
    const today = new Date("2026-09-29");
    let totalItems = this.catalog.length;
    let totalStockValue = 0;
    let expiringLots = [];
    let lowStockCount = 0;

    this.catalog.forEach(item => {
      const itemTotalQty = item.lots.reduce((acc, l) => acc + l.qty, 0);
      totalStockValue += itemTotalQty * item.unitPrice;

      if (itemTotalQty < item.minStock) {
        lowStockCount++;
      }

      item.lots.forEach(lot => {
        if (lot.qty > 0) {
          const exp = new Date(lot.expDate);
          const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
          if (diffDays <= 90) {
            expiringLots.push({
              itemId: item.id,
              itemName: item.name,
              specs: item.specs,
              unit: item.unit,
              lotNum: lot.lotNum,
              expDate: lot.expDate,
              diffDays: diffDays,
              qty: lot.qty
            });
          }
        }
      });
    });

    // Update KPI Counters
    document.getElementById("kpiTotalItems").textContent = totalItems;
    document.getElementById("kpiTotalValue").textContent = totalStockValue.toLocaleString("vi-VN") + " đ";
    document.getElementById("kpiExpiringCount").textContent = expiringLots.length;
    document.getElementById("kpiLowStockCount").textContent = lowStockCount;

    // Render FEFO Priority Table (Sorted earliest exp first)
    expiringLots.sort((a, b) => a.diffDays - b.diffDays);
    const fefoBody = document.getElementById("fefoTableBody");
    if (fefoBody) {
      if (expiringLots.length === 0) {
        fefoBody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted">Tất cả các lô hàng hiện tại đều còn hạn an toàn (> 90 ngày).</td></tr>`;
      } else {
        fefoBody.innerHTML = expiringLots.map(e => {
          let pillClass = "safe";
          let alertText = "Cảnh báo sớm (<90 ngày)";
          let actionText = "Theo dõi xuất bình thường";

          if (e.diffDays <= 30) {
            pillClass = "urgent";
            alertText = "CỰC KỲ KHẨN CẤP (<30 ngày)";
            actionText = "ƯU TIÊN XUẤT NGAY cho khoa dùng nhiều";
          } else if (e.diffDays <= 60) {
            pillClass = "warn";
            alertText = "Cận hạn (<60 ngày)";
            actionText = "Ghim ưu tiên cấp phát FEFO";
          }

          return `
            <tr>
              <td><code>${e.itemId}</code></td>
              <td><b>${e.itemName}</b></td>
              <td>${e.unit}</td>
              <td><span class="fefo-pill ${pillClass}">${e.lotNum}</span></td>
              <td><b>${this.formatDate(e.expDate)}</b></td>
              <td><b class="${e.diffDays <= 30 ? 'text-danger' : 'text-warning'}">${e.diffDays} ngày</b></td>
              <td><b>${e.qty.toLocaleString()}</b> ${e.unit}</td>
              <td><span class="badge ${e.diffDays <= 30 ? 'badge-danger' : 'badge-warning'}">${alertText}</span></td>
              <td><span class="text-xs font-semibold text-primary"><i class="fa-solid fa-bolt"></i> ${actionText}</span></td>
            </tr>
          `;
        }).join("");
      }
    }

    // Render Quick Workflow Status Table
    const dashWfBody = document.getElementById("dashWorkflowTableBody");
    if (dashWfBody) {
      const activeImports = this.importDocs.filter(d => d.step < 7).map(d => ({
        id: d.id,
        type: "Nhập kho (7 Bước)",
        dept: d.supplier,
        step: `Bước ${d.step}/7`,
        status: d.status,
        action: `<button class="btn btn-sm btn-outline" onclick="app.viewImportWorkflow('${d.id}')">Xem/Xử lý</button>`
      }));

      const activeExports = this.exportDocs.filter(d => d.step < 6).map(d => ({
        id: d.id,
        type: "Cấp phát xuất kho (6 Bước)",
        dept: d.deptName,
        step: `Bước ${d.step}/6`,
        status: d.status,
        action: `<button class="btn btn-sm btn-outline" onclick="app.viewExportWorkflow('${d.id}')">Xem/Xử lý</button>`
      }));

      const allActive = [...activeImports, ...activeExports];
      if (allActive.length === 0) {
        dashWfBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">Hiện không có phiếu nào đang chờ xử lý.</td></tr>`;
      } else {
        dashWfBody.innerHTML = allActive.map(row => `
          <tr>
            <td><b>${row.id}</b></td>
            <td><span class="badge ${row.type.includes('Nhập') ? 'badge-info' : 'badge-primary'}">${row.type}</span></td>
            <td>${row.dept}</td>
            <td><span class="badge badge-warning">${row.step}</span></td>
            <td>${row.status}</td>
            <td>${row.action}</td>
          </tr>
        `).join("");
      }
    }

    // Render GSP List in Dashboard Card
    const gspList = document.getElementById("dashGspList");
    if (gspList) {
      gspList.innerHTML = `
        <div class="gsp-item">
          <div class="gsp-name"><i class="fa-solid fa-warehouse text-primary"></i> Kho Thường (15-25°C)</div>
          <div class="gsp-val"><span id="dash-t-amb">22.4</span>°C | <span id="dash-h-amb">62</span>%</div>
        </div>
        <div class="gsp-item">
          <div class="gsp-name"><i class="fa-solid fa-fan text-info"></i> Kho Mát (8-15°C)</div>
          <div class="gsp-val"><span id="dash-t-cool">11.8</span>°C | <span id="dash-h-cool">58</span>%</div>
        </div>
        <div class="gsp-item">
          <div class="gsp-name"><i class="fa-solid fa-snowflake text-primary"></i> Kho Lạnh (&le;8°C)</div>
          <div class="gsp-val"><span id="dash-t-cold">5.5</span>°C | <span id="dash-h-cold">55</span>%</div>
        </div>
        <div class="gsp-item">
          <div class="gsp-name"><i class="fa-solid fa-vial-circle-check text-purple"></i> Tủ Lạnh Hóa Chất (2-8°C)</div>
          <div class="gsp-val"><span id="dash-t-fridge">4.2</span>°C | <span id="dash-h-fridge">48</span>%</div>
        </div>
      `;
    }
  }

  // --- QUY TRÌNH NHẬP KHO (7 BƯỚC) ---
  renderImportTable() {
    const filterStep = document.getElementById("importFilterStep")?.value || "";
    const tbody = document.getElementById("importTableBody");
    if (!tbody) return;

    let list = this.importDocs;
    if (filterStep) {
      list = list.filter(d => d.step.toString() === filterStep);
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted">Không tìm thấy phiếu nhập nào phù hợp bộ lọc.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(doc => {
      const totalAmount = doc.items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
      let stepBadge = `<span class="badge ${doc.step === 7 ? 'badge-success' : 'badge-warning'}">Bước ${doc.step}/7: ${this.getImportStepName(doc.step)}</span>`;

      let actionButtons = "";
      if (doc.step === 1) {
        actionButtons = `<button class="btn btn-sm btn-primary" onclick="app.advanceImportStep('${doc.id}', 2)"><i class="fa-solid fa-paper-plane"></i> Gửi NCC (B2)</button>`;
      } else if (doc.step === 2) {
        actionButtons = `<button class="btn btn-sm btn-primary" onclick="app.openInspectionModal('${doc.id}')"><i class="fa-solid fa-users-viewfinder"></i> Họp HĐ Kiểm Nhập (B3)</button>`;
      } else if (doc.step === 3) {
        actionButtons = `<button class="btn btn-sm btn-primary" onclick="app.openInspectionModal('${doc.id}')"><i class="fa-solid fa-signature"></i> Ký Sổ Kiểm Nhập (B4)</button>`;
      } else if (doc.step === 4) {
        actionButtons = `<button class="btn btn-sm btn-info" onclick="app.advanceImportStep('${doc.id}', 5)"><i class="fa-solid fa-file-invoice"></i> Kế toán duyệt HĐ (B5)</button>`;
      } else if (doc.step === 5) {
        actionButtons = `<button class="btn btn-sm btn-success" onclick="app.advanceImportStep('${doc.id}', 6)"><i class="fa-solid fa-check"></i> Trưởng P. VTTBYT ký (B6)</button>`;
      } else if (doc.step === 6) {
        actionButtons = `<button class="btn btn-sm btn-primary" onclick="app.advanceImportStep('${doc.id}', 7)"><i class="fa-solid fa-receipt"></i> Đề Nghị TT (B7)</button>`;
      } else {
        actionButtons = `<button class="btn btn-sm btn-outline" onclick="app.viewImportDetail('${doc.id}')"><i class="fa-solid fa-eye"></i> Xem chứng từ</button>`;
      }

      return `
        <tr>
          <td><b>${doc.id}</b></td>
          <td><b>${doc.supplier}</b></td>
          <td><span class="text-xs">${doc.contract}</span></td>
          <td>${this.formatDate(doc.createdDate)}</td>
          <td>${doc.items.length} mặt hàng</td>
          <td><b>${totalAmount.toLocaleString()} đ</b></td>
          <td>${stepBadge}</td>
          <td><span class="text-xs text-muted">${doc.currentHandler}</span></td>
          <td>${actionButtons}</td>
        </tr>
      `;
    }).join("");
  }

  getImportStepName(step) {
    const names = {
      1: "Lập KH đặt hàng",
      2: "Đặt hàng NCC",
      3: "HĐ Kiểm nhập nhận hàng",
      4: "Lập Sổ kiểm nhập",
      5: "Kiểm tra hóa đơn & in phiếu",
      6: "Trưởng P. VTTBYT duyệt",
      7: "Hoàn tất & Đề nghị thanh toán"
    };
    return names[step] || "";
  }

  openImportModal() {
    const nextNum = "NK-2026-" + String(this.importDocs.length + 1).padStart(4, "0");
    document.getElementById("impDocNum").value = nextNum;
    document.getElementById("impSupplier").value = "";
    document.getElementById("impContract").value = "HĐ-2026/VTTBYT-BVPN";
    document.getElementById("impInvoiceNum").value = "";

    const tbody = document.getElementById("importItemsTableBody");
    tbody.innerHTML = "";
    this.addImportItemRow();
    openModal("modalImportWorkflow");
  }

  addImportItemRow() {
    const tbody = document.getElementById("importItemsTableBody");
    const rowId = "imp-row-" + Date.now() + Math.random().toString(36).substr(2, 4);

    const catalogOptions = this.catalog.map(c => `<option value="${c.id}" data-unit="${c.unit}" data-price="${c.unitPrice}">${c.name} (${c.unit})</option>`).join("");

    const tr = document.createElement("tr");
    tr.id = rowId;
    tr.innerHTML = `
      <td>
        <select class="form-select form-select-sm imp-item-select" onchange="app.onImportItemChange('${rowId}', this)">
          ${catalogOptions}
        </select>
      </td>
      <td><input type="text" class="form-control form-control-sm imp-unit" value="${this.catalog[0].unit}" readonly></td>
      <td><input type="text" class="form-control form-control-sm imp-lot" value="LOT-2026A" placeholder="Số Lô"></td>
      <td><input type="date" class="form-control form-control-sm imp-exp" value="2027-12-31"></td>
      <td><input type="number" class="form-control form-control-sm imp-qty" value="500" min="1"></td>
      <td><input type="number" class="form-control form-control-sm imp-price" value="${this.catalog[0].unitPrice}"></td>
      <td><button class="btn btn-sm btn-outline text-danger" onclick="document.getElementById('${rowId}').remove()">&times;</button></td>
    `;
    tbody.appendChild(tr);
  }

  onImportItemChange(rowId, selectElem) {
    const row = document.getElementById(rowId);
    const selected = selectElem.selectedOptions[0];
    row.querySelector(".imp-unit").value = selected.dataset.unit || "";
    row.querySelector(".imp-price").value = selected.dataset.price || 0;
  }

  saveImportDoc() {
    const id = document.getElementById("impDocNum").value;
    const supplier = document.getElementById("impSupplier").value.trim();
    const contract = document.getElementById("impContract").value.trim();
    const invoiceNum = document.getElementById("impInvoiceNum").value.trim();

    if (!supplier) {
      alert("Vui lòng nhập tên Nhà cung cấp trúng thầu!");
      return;
    }

    const rows = document.querySelectorAll("#importItemsTableBody tr");
    if (rows.length === 0) {
      alert("Vui lòng chọn ít nhất 1 mặt hàng nhập!");
      return;
    }

    const items = [];
    rows.forEach(r => {
      const select = r.querySelector(".imp-item-select");
      const itemId = select.value;
      const itemName = select.selectedOptions[0].textContent.split(" (")[0];
      const unit = r.querySelector(".imp-unit").value;
      const lotNum = r.querySelector(".imp-lot").value.trim();
      const expDate = r.querySelector(".imp-exp").value;
      const qty = parseInt(r.querySelector(".imp-qty").value) || 0;
      const unitPrice = parseFloat(r.querySelector(".imp-price").value) || 0;

      items.push({ itemId, name: itemName, unit, lotNum, expDate, qty, unitPrice });
    });

    const newDoc = {
      id,
      supplier,
      contract,
      invoiceNum,
      createdDate: new Date().toISOString().split("T")[0],
      step: 2, // Chuyển sang Bước 2: Đặt hàng
      status: "Đã lập kế hoạch đặt hàng -> Chuyển NCC giao hàng (Bước 2)",
      currentHandler: "Thủ kho & NCC",
      items
    };

    this.importDocs.unshift(newDoc);
    this.saveData();
    closeModal("modalImportWorkflow");
    this.renderImportTable();
    this.renderDashboard();
    this.showToast(`Đã tạo đơn nhập ${id} thành công (Bước 1 -> Bước 2)!`, "success");
  }

  openInspectionModal(docId) {
    this.activeInspectingDocId = docId;
    const doc = this.importDocs.find(d => d.id === docId);
    if (!doc) return;

    const tbody = document.getElementById("inspectItemsTableBody");
    tbody.innerHTML = doc.items.map(item => `
      <tr>
        <td><b>${item.name}</b><br><small class="text-muted">ĐVT: ${item.unit}</small></td>
        <td><b>${item.lotNum}</b><br><span class="text-xs text-primary">HSD: ${this.formatDate(item.expDate)}</span></td>
        <td>${item.qty.toLocaleString()}</td>
        <td><input type="number" class="form-control form-control-sm" value="${item.qty}" style="width: 90px"></td>
        <td><span class="badge badge-success"><i class="fa-solid fa-check"></i> Nguyên vẹn tem nhãn</span></td>
        <td><span class="badge badge-success"><i class="fa-solid fa-temperature-arrow-down"></i> Đạt chuẩn GSP</span></td>
        <td><span class="text-success font-bold"><i class="fa-solid fa-circle-check"></i> Đạt chuẩn nhập</span></td>
      </tr>
    `).join("");

    openModal("modalInspection");
  }

  confirmInspection() {
    if (!this.activeInspectingDocId) return;
    const doc = this.importDocs.find(d => d.id === this.activeInspectingDocId);
    if (!doc) return;

    const m1 = document.getElementById("inspectMember1").value;
    const m2 = document.getElementById("inspectMember2").value;
    const m3 = document.getElementById("inspectMember3").value;
    const conclusion = document.getElementById("inspectConclusion").value;

    doc.inspectionData = {
      date: new Date().toISOString().split("T")[0],
      members: [m1, m2, m3],
      conclusion: conclusion
    };

    // Bước 3 & 4: Hội đồng ký xong -> Chuyển sang Bước 5 (Kế toán duyệt hóa đơn)
    doc.step = 5;
    doc.status = "Đã ký biên bản HĐ kiểm nhập -> Chuyển kế toán dược kiểm tra hóa đơn (Bước 5)";
    doc.currentHandler = "CN. Nguyễn Thu Trang (Kế toán dược / P. TCKT)";

    this.saveData();
    closeModal("modalInspection");
    this.renderImportTable();
    this.renderDashboard();
    this.showToast(`Hội đồng kiểm nhập đã ký biên bản cho phiếu ${doc.id}! Đã chuyển Bước 5.`, "success");
  }

  advanceImportStep(docId, nextStep) {
    const doc = this.importDocs.find(d => d.id === docId);
    if (!doc) return;

    doc.step = nextStep;
    if (nextStep === 2) {
      doc.status = "Đã gửi phiếu đặt hàng cho NCC -> Chờ giao hàng (Bước 2)";
      doc.currentHandler = "Nhà cung cấp & Thủ kho";
    } else if (nextStep === 5) {
      doc.status = "Kế toán duyệt hóa đơn & in phiếu nhập kho (Bước 5)";
      doc.currentHandler = "Kế toán dược";
    } else if (nextStep === 6) {
      doc.status = "Chờ Trưởng phòng VTTBYT ký xác nhận phiếu nhập (Bước 6)";
      doc.currentHandler = "DS. Hoàng Thị Minh Hà (Trưởng P. VTTBYT)";
    } else if (nextStep === 7) {
      doc.status = "Hoàn tất thủ tục nhập kho & lập phiếu đề nghị thanh toán (Bước 7)";
      doc.currentHandler = "Phòng Tài chính Kế toán (Lưu trữ hồ sơ)";

      // CẬP NHẬT KHO THỰC TẾ: Tăng số lượng trong catalog theo số lô
      doc.items.forEach(impItem => {
        const catItem = this.catalog.find(c => c.id === impItem.itemId);
        if (catItem) {
          const existLot = catItem.lots.find(l => l.lotNum === impItem.lotNum);
          if (existLot) {
            existLot.qty += impItem.qty;
          } else {
            catItem.lots.push({
              lotNum: impItem.lotNum,
              expDate: impItem.expDate,
              qty: impItem.qty,
              mfgDate: doc.createdDate
            });
          }
        }
      });
      this.showToast(`Đã nhập kho thành công! Số lượng vật tư và thẻ kho đã được cộng tự động.`, "success");
    }

    this.saveData();
    this.renderImportTable();
    this.renderCatalog();
    this.renderDashboard();
  }

  viewImportWorkflow(docId) {
    this.switchTab("nhapkho");
    const doc = this.importDocs.find(d => d.id === docId);
    if (doc) {
      if (doc.step === 3 || doc.step === 4) {
        this.openInspectionModal(docId);
      } else {
        alert(`Phiếu ${doc.id}\nTrạng thái: ${doc.status}\nNgười phụ trách: ${doc.currentHandler}`);
      }
    }
  }

  viewImportDetail(docId) {
    const doc = this.importDocs.find(d => d.id === docId);
    if (!doc) return;
    alert(`CHI TIẾT PHIẾU NHẬP KHO: ${doc.id}\nNhà cung cấp: ${doc.supplier}\nHợp đồng: ${doc.contract}\nSố HĐ GTGT: ${doc.invoiceNum || 'Chưa cập nhật'}\nSố mặt hàng: ${doc.items.length}\nTrạng thái: Hoàn tất 7 bước quy trình QĐ 651`);
  }

  // --- QUY TRÌNH XUẤT KHO / CẤP PHÁT (6 BƯỚC) ---
  renderExportTable() {
    const filterStatus = document.getElementById("exportFilterStatus")?.value || "";
    const filterDept = document.getElementById("exportFilterDept")?.value || "";
    const tbody = document.getElementById("exportTableBody");
    if (!tbody) return;

    let list = this.exportDocs;
    if (filterStatus) {
      list = list.filter(d => d.step.toString() === filterStatus);
    }
    if (filterDept) {
      list = list.filter(d => d.deptId === filterDept);
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">Không có phiếu lĩnh nào thỏa mãn điều kiện.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(doc => {
      let stepBadge = `<span class="badge ${doc.step === 6 ? 'badge-success' : 'badge-primary'}">Bước ${doc.step}/6: ${this.getExportStepName(doc.step)}</span>`;

      let actionButtons = "";
      if (doc.step === 1) {
        actionButtons = `<button class="btn btn-sm btn-primary" onclick="app.advanceExportStep('${doc.id}', 2)"><i class="fa-solid fa-signature"></i> Trưởng khoa ký duyệt</button>`;
      } else if (doc.step === 2) {
        actionButtons = `<button class="btn btn-sm btn-info" onclick="app.advanceExportStep('${doc.id}', 3)"><i class="fa-solid fa-boxes-stacked"></i> Thủ kho xác nhận tồn (B2)</button>`;
      } else if (doc.step === 3) {
        actionButtons = `<button class="btn btn-sm btn-success" onclick="app.advanceExportStep('${doc.id}', 4)"><i class="fa-solid fa-stamp"></i> Trưởng P. VTTBYT duyệt (B3)</button>`;
      } else if (doc.step === 4) {
        actionButtons = `<button class="btn btn-sm btn-primary" onclick="app.openFefoAllocationModal('${doc.id}')"><i class="fa-solid fa-box-open"></i> Soạn hàng FEFO & In CT (B4)</button>`;
      } else if (doc.step === 5) {
        actionButtons = `<button class="btn btn-sm btn-success" onclick="app.openFefoAllocationModal('${doc.id}')"><i class="fa-solid fa-file-signature"></i> Ký giao nhận 2 bên (B5)</button>`;
      } else {
        actionButtons = `<button class="btn btn-sm btn-outline" onclick="app.previewExportDocs('${doc.id}')"><i class="fa-solid fa-print"></i> Xem/In Mẫu 01 & 02</button>`;
      }

      return `
        <tr>
          <td><b>${doc.id}</b></td>
          <td><b>${doc.deptName}</b></td>
          <td>${doc.requester}</td>
          <td>${this.formatDate(doc.createdDate)}</td>
          <td>${doc.items.length} mặt hàng</td>
          <td>${stepBadge}</td>
          <td><span class="text-xs text-muted">${doc.status}</span></td>
          <td>${actionButtons}</td>
        </tr>
      `;
    }).join("");
  }

  getExportStepName(step) {
    const names = {
      1: "Khoa lập phiếu lĩnh Mẫu 01",
      2: "Thủ kho xác nhận tồn kho",
      3: "Trưởng P. VTTBYT xét duyệt",
      4: "Cấp phát theo FEFO & In CT",
      5: "Giao nhận & Ký chứng từ",
      6: "Cập nhật Thẻ kho hoàn tất"
    };
    return names[step] || "";
  }

  openExportModal() {
    const nextNum = "PL-2026-" + String(this.exportDocs.length + 1).padStart(4, "0");
    document.getElementById("expDocNum").value = nextNum;

    const tbody = document.getElementById("exportItemsTableBody");
    tbody.innerHTML = "";
    this.addExportItemRow();
    openModal("modalExportWorkflow");
  }

  addExportItemRow() {
    const tbody = document.getElementById("exportItemsTableBody");
    const rowId = "exp-row-" + Date.now() + Math.random().toString(36).substr(2, 4);

    const catalogOptions = this.catalog.map(c => {
      const totalStock = c.lots.reduce((acc, l) => acc + l.qty, 0);
      return `<option value="${c.id}" data-unit="${c.unit}" data-stock="${totalStock}">${c.name} (Tồn: ${totalStock} ${c.unit})</option>`;
    }).join("");

    const firstItem = this.catalog[0];
    const firstStock = firstItem.lots.reduce((acc, l) => acc + l.qty, 0);

    const tr = document.createElement("tr");
    tr.id = rowId;
    tr.innerHTML = `
      <td>
        <select class="form-select form-select-sm exp-item-select" onchange="app.onExportItemChange('${rowId}', this)">
          ${catalogOptions}
        </select>
      </td>
      <td><input type="text" class="form-control form-control-sm exp-unit" value="${firstItem.unit}" readonly></td>
      <td><input type="text" class="form-control form-control-sm exp-stock" value="${firstStock}" readonly></td>
      <td><input type="number" class="form-control form-control-sm exp-qty" value="50" min="1" max="${firstStock}"></td>
      <td><button class="btn btn-sm btn-outline text-danger" onclick="document.getElementById('${rowId}').remove()">&times;</button></td>
    `;
    tbody.appendChild(tr);
  }

  onExportItemChange(rowId, selectElem) {
    const row = document.getElementById(rowId);
    const selected = selectElem.selectedOptions[0];
    const unit = selected.dataset.unit || "";
    const stock = selected.dataset.stock || 0;
    row.querySelector(".exp-unit").value = unit;
    row.querySelector(".exp-stock").value = stock;
    const qtyInput = row.querySelector(".exp-qty");
    qtyInput.max = stock;
  }

  saveExportRequest() {
    const id = document.getElementById("expDocNum").value;
    const deptId = document.getElementById("expDeptSelect").value;
    const dept = HOSPITAL_DEPTS.find(d => d.id === deptId);
    const requester = document.getElementById("expRequester").value.trim();
    const purposeText = document.getElementById("expPurpose").selectedOptions[0].text;

    const rows = document.querySelectorAll("#exportItemsTableBody tr");
    if (rows.length === 0) {
      alert("Vui lòng chọn ít nhất 1 mặt hàng cần lĩnh!");
      return;
    }

    const items = [];
    let hasStockError = false;

    rows.forEach(r => {
      const select = r.querySelector(".exp-item-select");
      const itemId = select.value;
      const catItem = this.catalog.find(c => c.id === itemId);
      const reqQty = parseInt(r.querySelector(".exp-qty").value) || 0;
      const curStock = parseInt(r.querySelector(".exp-stock").value) || 0;

      if (reqQty <= 0) {
        alert("Số lượng yêu cầu phải lớn hơn 0!");
        hasStockError = true;
        return;
      }
      if (reqQty > curStock) {
        alert(`Mặt hàng ${catItem.name} chỉ còn tồn ${curStock}, không đủ để lĩnh ${reqQty}!`);
        hasStockError = true;
        return;
      }

      items.push({
        itemId,
        name: catItem.name,
        unit: catItem.unit,
        requestedQty: reqQty,
        dispensedQty: 0,
        lotNum: "",
        expDate: "",
        unitPrice: catItem.unitPrice
      });
    });

    if (hasStockError) return;

    const newExportDoc = {
      id,
      deptId,
      deptName: dept ? dept.name : "Khoa yêu cầu",
      requester,
      approverHead: dept ? dept.head : "Trưởng Khoa",
      purpose: purposeText,
      createdDate: new Date().toISOString().split("T")[0],
      step: 2, // Tự động chuyển qua Bước 2: Chờ Thủ kho xác nhận
      status: "Trưởng khoa đã ký duyệt -> Chờ Thủ kho xác nhận tồn (Bước 2)",
      items
    };

    this.exportDocs.unshift(newExportDoc);
    this.saveData();
    closeModal("modalExportWorkflow");
    this.renderExportTable();
    this.renderDashboard();
    this.showToast(`Đã gửi Phiếu lĩnh ${id} thành công! Chuyển thủ kho xác nhận tồn.`, "success");
  }

  advanceExportStep(docId, nextStep) {
    const doc = this.exportDocs.find(d => d.id === docId);
    if (!doc) return;

    doc.step = nextStep;
    if (nextStep === 2) {
      doc.status = "Trưởng khoa đã ký duyệt -> Chờ Thủ kho kiểm tra tồn kho (Bước 2)";
    } else if (nextStep === 3) {
      doc.status = "Thủ kho đã xác nhận đủ hàng -> Chờ Trưởng P. VTTBYT duyệt (Bước 3)";
    } else if (nextStep === 4) {
      doc.status = "Trưởng P. VTTBYT đã duyệt -> Thủ kho cấp phát theo FEFO & in CT (Bước 4)";
      // Tự động mở modal FEFO Allocation
      this.openFefoAllocationModal(docId);
      return;
    }

    this.saveData();
    this.renderExportTable();
    this.renderDashboard();
  }

  // Thuật toán cấp phát FEFO (First Expired First Out)
  openFefoAllocationModal(docId) {
    this.activeFefoAllocDocId = docId;
    const doc = this.exportDocs.find(d => d.id === docId);
    if (!doc) return;

    document.getElementById("fefoAllocTitle").textContent = `Phiếu lĩnh số: ${doc.id}`;
    document.getElementById("fefoAllocDept").innerHTML = `Đơn vị nhận: <b>${doc.deptName}</b> | Người lĩnh: <b>${doc.requester}</b>`;

    let totalAmount = 0;
    const tbody = document.getElementById("fefoAllocItemsTableBody");

    // Xử lý tự động phân bổ FEFO từng mặt hàng
    tbody.innerHTML = doc.items.map(item => {
      const catItem = this.catalog.find(c => c.id === item.itemId);
      // Lấy danh sách lô có tồn > 0, sắp xếp theo hạn sử dụng sớm nhất (FEFO)
      const sortedLots = catItem.lots.filter(l => l.qty > 0).sort((a, b) => new Date(a.expDate) - new Date(b.expDate));
      
      const bestLot = sortedLots[0] || { lotNum: "HẾT_HÀNG", expDate: "N/A", qty: 0 };
      item.lotNum = bestLot.lotNum;
      item.expDate = bestLot.expDate;
      item.dispensedQty = Math.min(item.requestedQty, bestLot.qty);

      const itemTotal = item.dispensedQty * item.unitPrice;
      totalAmount += itemTotal;

      return `
        <tr>
          <td><b>${item.name}</b></td>
          <td>${item.unit}</td>
          <td><b>${item.requestedQty}</b></td>
          <td><span class="fefo-pill urgent"><i class="fa-solid fa-barcode"></i> ${item.lotNum}</span></td>
          <td><b class="text-danger">${this.formatDate(item.expDate)}</b> (Gần nhất)</td>
          <td><b class="text-success">${item.dispensedQty}</b></td>
          <td>${item.unitPrice.toLocaleString()} đ</td>
          <td><b>${itemTotal.toLocaleString()} đ</b></td>
        </tr>
      `;
    }).join("");

    document.getElementById("fefoTotalAmount").textContent = totalAmount.toLocaleString("vi-VN") + " đ";
    openModal("modalFefoAllocation");
  }

  confirmFefoDispatch() {
    if (!this.activeFefoAllocDocId) return;
    const doc = this.exportDocs.find(d => d.id === this.activeFefoAllocDocId);
    if (!doc) return;

    doc.step = 6; // Hoàn tất 6 bước
    doc.exportReceiptNum = "XK-" + doc.id.replace("PL-", "") + "/VTTBYT";
    doc.exportDate = new Date().toISOString().split("T")[0];
    doc.status = "Đã giao nhận 2 bên, ký chứng từ Mẫu 02 & trừ Thẻ kho tự động (Bước 6)";
    doc.dispensedBy = "DS. Trần Văn An (Thủ kho)";
    doc.receivedBy = `${doc.requester} (${doc.deptName})`;

    // TRỪ KHO THỰC TẾ THEO NGUYÊN TẮC FEFO:
    doc.items.forEach(expItem => {
      const catItem = this.catalog.find(c => c.id === expItem.itemId);
      if (catItem) {
        const lot = catItem.lots.find(l => l.lotNum === expItem.lotNum);
        if (lot) {
          lot.qty = Math.max(0, lot.qty - expItem.dispensedQty);
        }
      }

      // Nếu cấp cho tủ trực của khoa -> Tự động bù tồn vào tủ trực khoa
      if (this.cabinets[doc.deptId]) {
        const cabItem = this.cabinets[doc.deptId].find(ci => ci.itemId === expItem.itemId);
        if (cabItem) {
          cabItem.currentQty += expItem.dispensedQty;
        }
      }
    });

    this.saveData();
    closeModal("modalFefoAllocation");
    this.renderExportTable();
    this.renderCatalog();
    this.renderCabinet();
    this.renderDashboard();
    this.showToast(`Đã xuất kho thành công phiếu ${doc.id}! Thẻ kho và cơ số tủ trực đã cập nhật.`, "success");
  }

  viewExportWorkflow(docId) {
    this.switchTab("xuatkho");
    const doc = this.exportDocs.find(d => d.id === docId);
    if (doc) {
      if (doc.step === 4 || doc.step === 5) {
        this.openFefoAllocationModal(docId);
      } else {
        alert(`Phiếu lĩnh: ${doc.id}\nĐơn vị: ${doc.deptName}\nTrạng thái: ${doc.status}`);
      }
    }
  }

  previewExportDocs(docId) {
    this.switchTab("bieumau");
    this.switchPrintTemplate("phieulinh");
  }

  // --- QUẢN LÝ DANH MỤC VẬT TƯ & LÔ HẠN ---
  renderCatalog() {
    const q = (document.getElementById("itemSearchQuery")?.value || "").toLowerCase().trim();
    const cat = document.getElementById("itemFilterCategory")?.value || "";
    const storage = document.getElementById("itemFilterStorage")?.value || "";
    const stockStatus = document.getElementById("itemFilterStockStatus")?.value || "";
    const tbody = document.getElementById("catalogTableBody");
    if (!tbody) return;

    const today = new Date("2026-09-29");

    let list = this.catalog.filter(item => {
      if (q && !item.name.toLowerCase().includes(q) && !item.id.toLowerCase().includes(q)) {
        return false;
      }
      if (cat && item.category !== cat) return false;
      if (storage && item.storageType !== storage) return false;

      const totalStock = item.lots.reduce((acc, l) => acc + l.qty, 0);
      if (stockStatus === "LOW" && totalStock >= item.minStock) return false;
      if (stockStatus === "GOOD" && totalStock < item.minStock) return false;

      if (stockStatus === "FEFO") {
        const hasExpiring = item.lots.some(l => {
          const diff = Math.ceil((new Date(l.expDate) - today) / (1000 * 60 * 60 * 24));
          return diff <= 90 && l.qty > 0;
        });
        if (!hasExpiring) return false;
      }

      return true;
    });

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" class="text-center py-4 text-muted">Không tìm thấy vật tư nào thỏa điều kiện tìm kiếm.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(item => {
      const totalStock = item.lots.reduce((acc, l) => acc + l.qty, 0);
      const isLow = totalStock < item.minStock;

      // Tìm lô cận hạn nhất
      const validLots = item.lots.filter(l => l.qty > 0).sort((a, b) => new Date(a.expDate) - new Date(b.expDate));
      const earliestLot = validLots[0];

      let earliestLotHtml = '<span class="text-muted">Hết hàng</span>';
      if (earliestLot) {
        const diff = Math.ceil((new Date(earliestLot.expDate) - today) / (1000 * 60 * 60 * 24));
        let pill = "safe";
        if (diff <= 30) pill = "urgent";
        else if (diff <= 90) pill = "warn";

        earliestLotHtml = `
          <div>
            <span class="fefo-pill ${pill}">${earliestLot.lotNum}</span>
            <small class="d-block text-xs">HSD: <b>${this.formatDate(earliestLot.expDate)}</b> (${diff} ngày)</small>
          </div>
        `;
      }

      const storageBadges = {
        PHONG: '<span class="storage-badge"><i class="fa-solid fa-temperature-half"></i> Phòng (15-25°C)</span>',
        MAT: '<span class="storage-badge cold"><i class="fa-solid fa-fan"></i> Mát (8-15°C)</span>',
        LANH: '<span class="storage-badge cold"><i class="fa-solid fa-snowflake"></i> Lạnh (≤8°C)</span>',
        TULANH: '<span class="storage-badge fridge"><i class="fa-solid fa-vial"></i> Tủ lạnh (2-8°C)</span>'
      };

      return `
        <tr>
          <td><code>${item.id}</code></td>
          <td>
            <b>${item.name}</b>
            <div class="text-xs text-muted">${item.specs} | Xuất xứ: ${item.country}</div>
          </td>
          <td><span class="badge badge-info">${item.category}</span></td>
          <td>${item.unit}</td>
          <td>${storageBadges[item.storageType] || item.storageType}</td>
          <td>
            <b class="${isLow ? 'text-danger font-bold' : ''}">${totalStock.toLocaleString()}</b> ${item.unit}
            ${isLow ? '<span class="badge badge-danger text-xs ml-1"><i class="fa-solid fa-triangle-exclamation"></i> Dưới ĐM</span>' : ''}
          </td>
          <td>${item.minStock.toLocaleString()}</td>
          <td>${earliestLotHtml}</td>
          <td>${item.unitPrice.toLocaleString()} đ</td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="app.viewItemLots('${item.id}')" title="Xem danh sách các lô hàng">
              <i class="fa-solid fa-layer-group"></i> Lô (${item.lots.length})
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  viewItemLots(itemId) {
    const item = this.catalog.find(c => c.id === itemId);
    if (!item) return;

    let lotDetails = item.lots.map(l => `• Lô: ${l.lotNum} | HSD: ${this.formatDate(l.expDate)} | Tồn: ${l.qty} ${item.unit}`).join("\n");
    alert(`DANH SÁCH LÔ HÀNG - ${item.name}\n\nQuy cách bảo quản: ${item.storageType}\nĐịnh mức tồn an toàn: ${item.minStock} ${item.unit}\n\n${lotDetails}`);
  }

  // --- TỦ TRỰC CÁC KHOA PHÒNG ---
  renderCabinet() {
    const deptId = this.selectedCabinetDept;
    const dept = HOSPITAL_DEPTS.find(d => d.id === deptId);
    const titleElem = document.getElementById("cabinetDeptTitle");
    const countElem = document.getElementById("cabinetItemCount");
    const tbody = document.getElementById("cabinetTableBody");

    if (titleElem && dept) {
      titleElem.innerHTML = `<i class="fa-solid fa-kit-medical text-primary"></i> Cơ số Tủ trực ${dept.name} (Phụ trách: ${dept.head})`;
    }

    const items = this.cabinets[deptId] || [];
    if (countElem) countElem.textContent = `${items.length} mặt hàng`;

    if (!tbody) return;
    if (items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted">Khoa này chưa thiết lập danh mục cơ số tủ trực.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(item => {
      const diff = item.currentQty - item.standardQty;
      const isDeficit = diff < 0;
      const deficitQty = Math.abs(diff);

      return `
        <tr>
          <td><code>${item.itemId}</code></td>
          <td><b>${item.name}</b></td>
          <td>${item.unit}</td>
          <td><b>${item.standardQty}</b></td>
          <td><b class="${isDeficit ? 'text-danger' : 'text-success'}">${item.currentQty}</b></td>
          <td>
            <span class="badge ${isDeficit ? 'badge-danger' : 'badge-success'}">
              ${isDeficit ? `Thiếu -${deficitQty}` : 'Đủ định mức'}
            </span>
          </td>
          <td>${isDeficit ? '<span class="text-danger font-semibold"><i class="fa-solid fa-triangle-exclamation"></i> Cần lĩnh bù</span>' : '<span class="text-success"><i class="fa-solid fa-circle-check"></i> Ổn định</span>'}</td>
          <td><span class="text-primary font-mono">${this.formatDate(item.minLotExp)}</span></td>
          <td>
            ${isDeficit ? `<button class="btn btn-sm btn-primary" onclick="app.quickRequestRestock('${deptId}', '${item.itemId}', ${deficitQty})"><i class="fa-solid fa-hand-holding-medical"></i> Lập phiếu bù ${deficitQty} ${item.unit}</button>` : '<span class="text-muted text-xs">Đã đủ cơ số</span>'}
          </td>
        </tr>
      `;
    }).join("");
  }

  quickRequestRestock(deptId, itemId, qty) {
    this.openExportModal();
    const deptSelect = document.getElementById("expDeptSelect");
    if (deptSelect) deptSelect.value = deptId;
    const qtyInput = document.querySelector("#exportItemsTableBody .exp-qty");
    if (qtyInput) qtyInput.value = qty;
  }

  // --- BIỂU MẪU IN ẤN CHUẨN THEO QUYẾT ĐỊNH 651/QĐ-BVPN ---
  switchPrintTemplate(tplName) {
    this.activePrintTemplate = tplName;
    this.renderPrintTemplate();
  }

  renderPrintTemplate() {
    const container = document.getElementById("printSheetArea");
    if (!container) return;

    if (this.activePrintTemplate === "phieulinh") {
      // MẪU 01: PHIẾU LĨNH VẬT DỤNG Y TẾ TIÊU HAO (TRANG 9 / QĐ 651)
      const sampleExport = this.exportDocs[0] || {};
      const items = sampleExport.items || [
        { name: "Bơm tiêm dùng 1 lần 5ml/cc có kim 23G", unit: "Cây", requestedQty: 400, dispensedQty: 400 },
        { name: "Kim luồn tĩnh mạch an toàn 20G (Hồng)", unit: "Cái", requestedQty: 100, dispensedQty: 100 },
        { name: "Dây truyền dịch có kim 20G", unit: "Dây", requestedQty: 150, dispensedQty: 150 }
      ];

      container.innerHTML = `
        <div class="form-header-row">
          <div class="form-header-left">
            <p>SỞ Y TẾ TP. HỒ CHÍ MINH</p>
            <p class="unit-name">BỆNH VIỆN QUẬN PHÚ NHUẬN</p>
            <p style="margin-top: 4px;">Khoa: <b>${sampleExport.deptName || 'Khoa Cấp Cứu'}</b></p>
          </div>
          <div class="form-header-right">
            <p>MS: .....................</p>
            <p>Số: <b>${sampleExport.id || 'PL-2026-0901'}</b></p>
          </div>
        </div>

        <div class="form-title-block">
          <h2>PHIẾU LĨNH VẬT DỤNG Y TẾ TIÊU HAO</h2>
          <div class="form-meta-date">Ngày 29 tháng 09 năm 2026</div>
        </div>

        <table class="print-table">
          <thead>
            <tr>
              <th width="8%" rowspan="2">Số TT</th>
              <th width="15%" rowspan="2">Mã</th>
              <th width="40%" rowspan="2">Tên vật dụng y tế tiêu hao</th>
              <th width="12%" rowspan="2">Đơn vị</th>
              <th colspan="2">Số lượng</th>
              <th width="15%" rowspan="2">Ghi chú</th>
            </tr>
            <tr>
              <th width="12%">Yêu cầu</th>
              <th width="12%">Phát</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((it, idx) => `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td style="text-align: center;">${it.itemId || 'VT00' + (idx+1)}</td>
                <td><b>${it.name}</b></td>
                <td style="text-align: center;">${it.unit}</td>
                <td style="text-align: center;">${it.requestedQty}</td>
                <td style="text-align: center;">${it.dispensedQty || it.requestedQty}</td>
                <td>${it.lotNum ? 'Lô: ' + it.lotNum : ''}</td>
              </tr>
            `).join("")}
            <tr>
              <td style="text-align: center;">4</td><td></td><td></td><td></td><td></td><td></td><td></td>
            </tr>
            <tr>
              <td style="text-align: center;">5</td><td></td><td></td><td></td><td></td><td></td><td></td>
            </tr>
          </tbody>
        </table>

        <div style="text-align: right; font-style: italic; margin-bottom: 10px;">
          Ngày 29 tháng 09 năm 2026
        </div>

        <div class="signature-row">
          <div class="sig-col">
            <div class="sig-title">TRƯỞNG P.VTTBYT</div>
            <div class="sig-sub">(ký, ghi rõ họ tên)</div>
            <div class="sig-space"></div>
            <div class="sig-name">DS. Hoàng Thị Minh Hà</div>
          </div>
          <div class="sig-col">
            <div class="sig-title">NGƯỜI PHÁT</div>
            <div class="sig-sub">(ký, ghi rõ họ tên)</div>
            <div class="sig-space"></div>
            <div class="sig-name">DS. Trần Văn An</div>
          </div>
          <div class="sig-col">
            <div class="sig-title">NGƯỜI LĨNH</div>
            <div class="sig-sub">(ký, ghi rõ họ tên)</div>
            <div class="sig-space"></div>
            <div class="sig-name">${sampleExport.requester || 'ĐD. Lê Thị Mai'}</div>
          </div>
          <div class="sig-col">
            <div class="sig-title">TRƯỞNG KHOA</div>
            <div class="sig-sub">(ký, ghi rõ họ tên)</div>
            <div class="sig-space"></div>
            <div class="sig-name">${sampleExport.approverHead || 'BS.CKI Nguyễn Văn Hùng'}</div>
          </div>
        </div>
      `;
    } else if (this.activePrintTemplate === "chungtuxuat") {
      // MẪU 02: CHỨNG TỪ XUẤT KHO (TRANG 10 / QĐ 651)
      const sampleExport = this.exportDocs[0] || {};
      const items = sampleExport.items || [];
      const total = items.reduce((s, it) => s + (it.dispensedQty * it.unitPrice), 0);

      container.innerHTML = `
        <div class="form-header-row">
          <div class="form-header-left">
            <p class="unit-name">BỆNH VIỆN QUẬN PHÚ NHUẬN</p>
          </div>
          <div class="form-header-right">
            <p><b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b></p>
            <p class="nation-moto">Độc lập - Tự do - Hạnh phúc</p>
          </div>
        </div>

        <div class="form-title-block">
          <h2>CHỨNG TỪ XUẤT KHO</h2>
        </div>

        <table class="form-info-table">
          <tr>
            <td width="55%">Số chứng từ: <b>${sampleExport.exportReceiptNum || 'XK-0901/VTTBYT'}</b></td>
            <td>Ngày chứng từ: <b>${sampleExport.exportDate || '29/09/2026'}</b></td>
          </tr>
          <tr>
            <td>Hình thức xuất: <b>Xuất cấp phát cho khoa phòng theo quy chuẩn FEFO</b></td>
            <td>Kho xuất: <b>Kho Tổng Vật Tư Y Tế</b></td>
          </tr>
          <tr>
            <td colspan="2">Phòng nhận: <b>${sampleExport.deptName || 'Khoa Cấp Cứu'}</b></td>
          </tr>
        </table>

        <table class="print-table">
          <thead>
            <tr>
              <th width="7%">STT</th>
              <th width="14%">Mã hàng</th>
              <th width="38%">Tên mặt hàng</th>
              <th width="11%">Đơn vị tính</th>
              <th width="10%">Số lượng</th>
              <th width="10%">Đơn giá</th>
              <th width="10%">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((it, idx) => `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td style="text-align: center;">${it.itemId || 'VT00' + (idx+1)}</td>
                <td><b>${it.name}</b><br><small>Lô: ${it.lotNum || 'LOT-24E12'} - HSD: ${it.expDate || '15/10/2026'}</small></td>
                <td style="text-align: center;">${it.unit}</td>
                <td style="text-align: center;"><b>${it.dispensedQty || it.requestedQty}</b></td>
                <td style="text-align: right;">${(it.unitPrice || 0).toLocaleString()}</td>
                <td style="text-align: right;"><b>${((it.dispensedQty || it.requestedQty) * (it.unitPrice || 0)).toLocaleString()}</b></td>
              </tr>
            `).join("")}
            <tr>
              <td colspan="6" style="text-align: right; font-weight: bold;">TỔNG THÀNH TIỀN:</td>
              <td style="text-align: right; font-weight: bold; color: #000;">${total.toLocaleString()} đ</td>
            </tr>
          </tbody>
        </table>

        <div style="text-align: right; font-style: italic; margin-bottom: 10px;">
          Ngày 29 tháng 09 năm 2026
        </div>

        <div class="signature-row">
          <div class="sig-col">
            <div class="sig-title">Người phát</div>
            <div class="sig-sub">(ký, ghi rõ họ tên)</div>
            <div class="sig-space"></div>
            <div class="sig-name">DS. Trần Văn An</div>
          </div>
          <div class="sig-col">
            <div class="sig-title">Người lĩnh</div>
            <div class="sig-sub">(ký, ghi rõ họ tên)</div>
            <div class="sig-space"></div>
            <div class="sig-name">${sampleExport.requester || 'ĐD. Lê Thị Mai'}</div>
          </div>
          <div class="sig-col">
            <div class="sig-title">Phòng Vật tư, thiết bị y tế</div>
            <div class="sig-sub">(ký, ghi rõ họ tên)</div>
            <div class="sig-space"></div>
            <div class="sig-name">DS. Hoàng Thị Minh Hà</div>
          </div>
        </div>
      `;
    } else if (this.activePrintTemplate === "baocaodutru") {
      // MẪU 03: BÁO CÁO SỬ DỤNG VTTHYT THÁNG / DỰ TRÙ THÁNG (TRANG 11 / QĐ 651)
      const list = this.catalog.slice(0, 8);

      container.innerHTML = `
        <div class="form-header-row">
          <div class="form-header-left">
            <p class="unit-name">BỆNH VIỆN QUẬN PHÚ NHUẬN</p>
            <p>KHOA: <b>KHO TỔNG VẬT TƯ THIẾT BỊ Y TẾ</b></p>
          </div>
        </div>

        <div class="form-title-block">
          <h2>BÁO CÁO SỬ DỤNG VTTHYT THÁNG 09/2026</h2>
          <h2>DỰ TRÙ VTTHYT THÁNG 10/2026</h2>
        </div>

        <table class="print-table">
          <thead>
            <tr>
              <th width="28%">TÊN VTTHYT</th>
              <th width="8%">ĐƠN VỊ</th>
              <th width="9%">TỒN ĐẦU</th>
              <th width="8%">NHẬP</th>
              <th width="8%">XUẤT</th>
              <th width="9%">TỒN CUỐI</th>
              <th width="9%">DỰ TRÙ</th>
              <th width="12%">HẠN SỬ DỤNG</th>
              <th width="9%">GHI CHÚ</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(it => {
              const curStock = it.lots.reduce((acc, l) => acc + l.qty, 0);
              const earliestLot = it.lots[0] || { expDate: "2027-12-31" };
              return `
                <tr>
                  <td><b>${it.name}</b></td>
                  <td style="text-align: center;">${it.unit}</td>
                  <td style="text-align: center;">${curStock - 200}</td>
                  <td style="text-align: center;">500</td>
                  <td style="text-align: center;">300</td>
                  <td style="text-align: center;"><b>${curStock}</b></td>
                  <td style="text-align: center;"><b>${Math.round(curStock * 0.4)}</b></td>
                  <td style="text-align: center;">${this.formatDate(earliestLot.expDate)}</td>
                  <td>Đạt chuẩn GSP</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>

        <div class="signature-row" style="margin-top: 40px;">
          <div class="sig-col">
            <div class="sig-title">Người báo cáo</div>
            <div class="sig-sub">(ký, ghi rõ họ tên)</div>
            <div class="sig-space"></div>
            <div class="sig-name">DS. Trần Văn An (Thủ kho)</div>
          </div>
          <div class="sig-col">
            <div class="sig-title">Trưởng Khoa / Trưởng Phòng</div>
            <div class="sig-sub">(ký, ghi rõ họ tên)</div>
            <div class="sig-space"></div>
            <div class="sig-name">DS. Hoàng Thị Minh Hà</div>
          </div>
        </div>
      `;
    } else {
      // BIÊN BẢN HỘI ĐỒNG KIỂM NHẬP (BƯỚC 3-4 THEO MỤC 5.2 QĐ 651)
      const sampleImport = this.importDocs[0] || {};
      const insp = sampleImport.inspectionData || {
        date: "2026-09-03",
        members: ["DS. Hoàng Thị Minh Hà (Trưởng P. VTTBYT)", "CN. Nguyễn Thu Trang (Kế toán dược)", "DS. Trần Văn An (Thủ kho)"],
        conclusion: "Hàng nguyên đai nguyên kiện, cảm quan bao bì đạt chuẩn, đủ số lượng hóa đơn, hạn dùng đạt > 80%."
      };

      container.innerHTML = `
        <div class="form-header-row">
          <div class="form-header-left">
            <p>SỞ Y TẾ TP. HỒ CHÍ MINH</p>
            <p class="unit-name">BỆNH VIỆN QUẬN PHÚ NHUẬN</p>
            <p><b>HỘI ĐỒNG KIỂM NHẬP VTYT</b></p>
          </div>
          <div class="form-header-right">
            <p><b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b></p>
            <p class="nation-moto">Độc lập - Tự do - Hạnh phúc</p>
          </div>
        </div>

        <div class="form-title-block">
          <h2>BIÊN BẢN KIỂM NHẬP HÀNG HÓA VẬT TƯ TIÊU HAO Y TẾ</h2>
          <div class="form-meta-date">Căn cứ theo Mục 5.2 - Quyết định số 651/QĐ-BVPN</div>
        </div>

        <p>Hôm nay, ngày 29/09/2026, tại Kho Vật tư Bệnh viện quận Phú Nhuận, Hội đồng kiểm nhập gồm các thành viên:</p>
        <ol style="margin-left: 20px; line-height: 1.8;">
          <li><b>${insp.members[0]}</b> - Đại diện Ban Giám Đốc / Trưởng P. VTTBYT (Chủ tịch HĐ)</li>
          <li><b>${insp.members[1]}</b> - Kế toán dược / P. TCKT (Thành viên)</li>
          <li><b>${insp.members[2]}</b> - Thủ kho VTTBYT (Thành viên)</li>
        </ol>

        <p style="margin-top: 10px;">Đã tiến hành kiểm tra, đối chiếu lô hàng nhập từ <b>${sampleImport.supplier || 'Công ty CP CPC1'}</b> theo Hợp đồng: <b>${sampleImport.contract}</b>, Hóa đơn số: <b>${sampleImport.invoiceNum}</b>.</p>

        <table class="print-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên VTTHYT</th>
              <th>ĐVT</th>
              <th>Số Lô</th>
              <th>HSD</th>
              <th>SL Hóa đơn</th>
              <th>SL Thực nhận</th>
              <th>Cảm quan & GSP</th>
            </tr>
          </thead>
          <tbody>
            ${(sampleImport.items || []).map((it, idx) => `
              <tr>
                <td style="text-align: center;">${idx+1}</td>
                <td><b>${it.name}</b></td>
                <td style="text-align: center;">${it.unit}</td>
                <td style="text-align: center;">${it.lotNum}</td>
                <td style="text-align: center;">${this.formatDate(it.expDate)}</td>
                <td style="text-align: center;">${it.qty}</td>
                <td style="text-align: center;"><b>${it.qty}</b></td>
                <td style="text-align: center;">Đạt chuẩn</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <p><b>Kết luận của Hội đồng kiểm nhập:</b> ${insp.conclusion}</p>

        <div class="signature-row" style="margin-top: 30px;">
          <div class="sig-col">
            <div class="sig-title">Thủ kho</div>
            <div class="sig-space"></div>
            <div class="sig-name">DS. Trần Văn An</div>
          </div>
          <div class="sig-col">
            <div class="sig-title">Kế toán dược</div>
            <div class="sig-space"></div>
            <div class="sig-name">CN. Nguyễn Thu Trang</div>
          </div>
          <div class="sig-col">
            <div class="sig-title">Trưởng P. VTTBYT</div>
            <div class="sig-space"></div>
            <div class="sig-name">DS. Hoàng Thị Minh Hà</div>
          </div>
        </div>
      `;
    }
  }

  // --- BÁO CÁO XUẤT - NHẬP - TỒN & DỰ TRÙ ---
  renderReport() {
    const month = document.getElementById("reportMonth")?.value || "2026-09";
    const dept = document.getElementById("reportDept")?.value || "ALL";
    const cat = document.getElementById("reportCategory")?.value || "";
    const tbody = document.getElementById("nxtReportTableBody");
    const countElem = document.getElementById("reportRecordCount");
    if (!tbody) return;

    let list = this.catalog;
    if (cat) {
      list = list.filter(c => c.category === cat);
    }

    if (countElem) countElem.textContent = `${list.length} dòng dữ liệu`;

    tbody.innerHTML = list.map((item, idx) => {
      const curStock = item.lots.reduce((acc, l) => acc + l.qty, 0);
      const imported = Math.round(curStock * 0.35);
      const exported = Math.round(curStock * 0.25);
      const openingStock = curStock - imported + exported;
      const forecastNextMonth = Math.round(exported * 1.2);
      const earliestLot = item.lots[0] || { expDate: "2027-12-31" };

      return `
        <tr>
          <td>${idx + 1}</td>
          <td><code>${item.id}</code></td>
          <td><b>${item.name}</b></td>
          <td>${item.unit}</td>
          <td>${openingStock.toLocaleString()}</td>
          <td class="text-primary font-bold">+${imported.toLocaleString()}</td>
          <td class="text-warning font-bold">-${exported.toLocaleString()}</td>
          <td><b class="text-success text-base">${curStock.toLocaleString()}</b></td>
          <td><b class="text-info">${forecastNextMonth.toLocaleString()}</b></td>
          <td><span class="fefo-pill safe">${this.formatDate(earliestLot.expDate)}</span></td>
          <td><span class="badge badge-success">GSP Đạt</span></td>
        </tr>
      `;
    }).join("");
  }

  // --- SENSOR SIMULATION (GSP CONDITIONS) ---
  startGspSensors() {
    setInterval(() => {
      // Add subtle micro fluctuations within standard limits
      const randAmb = (22.0 + (Math.random() * 0.8)).toFixed(1);
      const randHum = Math.round(61 + Math.random() * 3);
      const elAmb = document.getElementById("temp-ambient");
      const elHum = document.getElementById("hum-ambient");
      if (elAmb) elAmb.textContent = randAmb;
      if (elHum) elHum.textContent = randHum;

      const dAmb = document.getElementById("dash-t-amb");
      const dHum = document.getElementById("dash-h-amb");
      if (dAmb) dAmb.textContent = randAmb;
      if (dHum) dHum.textContent = randHum;
    }, 6000);
  }

  // --- SEARCH UTILS ---
  handleGlobalSearch(query) {
    if (!query) return;
    const q = query.toLowerCase().trim();
    // Switch to catalog or relevant tab
    if (this.currentTab !== "danhmuc") {
      this.switchTab("danhmuc");
    }
    const searchInput = document.getElementById("itemSearchQuery");
    if (searchInput) {
      searchInput.value = query;
      this.renderCatalog();
    }
  }

  // --- TOAST NOTIFICATIONS ---
  showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon = type === "success" ? "circle-check" : type === "warning" ? "triangle-exclamation" : "circle-info";
    toast.innerHTML = `<i class="fa-solid fa-${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  formatDate(dateStr) {
    if (!dateStr || dateStr === "N/A") return "N/A";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }
}

// Modal helper functions
function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add("show");
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove("show");
}

// Initialize on DOM load
let app = null;
document.addEventListener("DOMContentLoaded", () => {
  app = new MedicalInventoryApp();
});
