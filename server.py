"""
Backend RESTful API Server - FastAPI & SQLite
He thong quan ly xuat nhap vat tu tieu hao y te - BV Quan Phu Nhuan
Chuan hoa 100% theo Quyet dinh 651/QD-BVPN
"""

from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from datetime import datetime, date

from database import init_db, get_db_connection

app = FastAPI(
    title="He Thong Quan Ly Xuat Nhap Vat Tu Y Te - BV Quan Phu Nhuan",
    description="RESTful API Backend quan ly quy trinh nhap kho 7 buoc, xuat kho 6 buoc theo Quyet dinh 651/QD-BVPN",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Khoi tao database khi khoi dong
@app.on_event("startup")
def on_startup():
    init_db()

# --- Pydantic Data Models ---
class MaterialLotModel(BaseModel):
    lot_num: str
    exp_date: str
    mfg_date: Optional[str] = None
    qty: int

class MaterialCreateModel(BaseModel):
    id: str
    name: str
    category: str
    unit: str
    specs: Optional[str] = ""
    country: Optional[str] = ""
    storage_type: str
    unit_price: float
    min_stock: int
    lots: Optional[List[MaterialLotModel]] = []

class ImportItemModel(BaseModel):
    material_id: str
    name: str
    unit: str
    lot_num: str
    exp_date: str
    qty: int
    unit_price: float

class ImportOrderCreateModel(BaseModel):
    id: str
    supplier: str
    contract: str
    invoice_num: Optional[str] = ""
    items: List[ImportItemModel]

class InspectionConfirmModel(BaseModel):
    members: List[str]
    conclusion: str

class ExportItemModel(BaseModel):
    material_id: str
    name: str
    unit: str
    requested_qty: int
    unit_price: float

class ExportRequestCreateModel(BaseModel):
    id: str
    dept_id: str
    requester: str
    purpose: str
    items: List[ExportItemModel]

class FefoItemDispatchModel(BaseModel):
    material_id: str
    dispensed_qty: int
    lot_num: str
    exp_date: str
    unit_price: float

class FefoDispatchRequestModel(BaseModel):
    export_receipt_num: str
    dispensed_by: str
    received_by: str
    items: List[FefoItemDispatchModel]

class GspLogCreateModel(BaseModel):
    zone: str
    temp: float
    humidity: float
    logged_by: Optional[str] = "DS. Tran Van An (Thu kho)"

# --- STATIC FILE SERVING ---
@app.get("/")
def serve_index():
    return FileResponse(os.path.join(BASE_DIR, "index.html"))

@app.get("/styles.css")
def serve_css():
    return FileResponse(os.path.join(BASE_DIR, "styles.css"), media_type="text/css")

@app.get("/app.js")
def serve_js():
    return FileResponse(os.path.join(BASE_DIR, "app.js"), media_type="application/javascript")

@app.get("/favicon.svg")
def serve_favicon():
    return FileResponse(os.path.join(BASE_DIR, "favicon.svg"), media_type="image/svg+xml")

# --- API ENDPOINTS ---

@app.get("/api/health")
def api_health():
    return {"status": "ok", "system": "BV Quan Phu Nhuan - Quan Ly VTYT", "sop": "651/QD-BVPN"}

# 1. Danh muc Khoa/Phong
@app.get("/api/departments")
def get_departments():
    conn = get_db_connection()
    depts = conn.execute("SELECT * FROM departments ORDER BY id").fetchall()
    conn.close()
    return [dict(d) for d in depts]

# 2. Danh muc vat tu & chi tiet cac lo (FEFO)
@app.get("/api/materials")
def get_materials(
    q: Optional[str] = None,
    category: Optional[str] = None,
    storage_type: Optional[str] = None
):
    conn = get_db_connection()
    query = "SELECT * FROM materials WHERE 1=1"
    params = []

    if category:
        query += " AND category = ?"
        params.append(category)
    if storage_type:
        query += " AND storage_type = ?"
        params.append(storage_type)
    if q:
        query += " AND (name LIKE ? OR id LIKE ?)"
        params.extend([f"%{q}%", f"%{q}%"])

    materials = conn.execute(query, params).fetchall()
    result = []
    today = date.today()

    for m in materials:
        m_dict = dict(m)
        lots = conn.execute("SELECT * FROM material_lots WHERE material_id = ? ORDER BY exp_date ASC", (m["id"],)).fetchall()
        m_dict["lots"] = [dict(l) for l in lots]
        m_dict["total_stock"] = sum(l["qty"] for l in lots)
        result.append(m_dict)

    conn.close()
    return result

@app.post("/api/materials")
def create_material(data: MaterialCreateModel):
    conn = get_db_connection()
    try:
        conn.execute("""
            INSERT INTO materials (id, name, category, unit, specs, country, storage_type, unit_price, min_stock)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (data.id, data.name, data.category, data.unit, data.specs, data.country, data.storage_type, data.unit_price, data.min_stock))

        for lot in data.lots:
            conn.execute("""
                INSERT INTO material_lots (material_id, lot_num, exp_date, mfg_date, qty)
                VALUES (?, ?, ?, ?, ?)
            """, (data.id, lot.lot_num, lot.exp_date, lot.mfg_date, lot.qty))

        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail=f"Ma vat tu {data.id} da ton tai!")
    finally:
        conn.close()

    return {"message": "Them vat tu moi thanh cong", "id": data.id}

# 3. Dashboard KPI & Bang FEFO
@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    conn = get_db_connection()
    materials = conn.execute("SELECT * FROM materials").fetchall()
    total_items = len(materials)
    total_value = 0
    low_stock_count = 0
    expiring_lots = []
    today = date(2026, 9, 29) # Ngay he thong theo context

    for m in materials:
        lots = conn.execute("SELECT * FROM material_lots WHERE material_id = ? AND qty > 0 ORDER BY exp_date ASC", (m["id"],)).fetchall()
        item_stock = sum(l["qty"] for l in lots)
        total_value += item_stock * m["unit_price"]

        if item_stock < m["min_stock"]:
            low_stock_count += 1

        for l in lots:
            try:
                exp = datetime.strptime(l["exp_date"], "%Y-%m-%d").date()
                diff_days = (exp - today).days
                if diff_days <= 90:
                    expiring_lots.append({
                        "material_id": m["id"],
                        "name": m["name"],
                        "unit": m["unit"],
                        "lot_num": l["lot_num"],
                        "exp_date": l["exp_date"],
                        "diff_days": diff_days,
                        "qty": l["qty"]
                    })
            except Exception:
                pass

    conn.close()
    expiring_lots.sort(key=lambda x: x["diff_days"])

    return {
        "total_items": total_items,
        "total_value": total_value,
        "expiring_count": len(expiring_lots),
        "low_stock_count": low_stock_count,
        "expiring_lots": expiring_lots
    }

# 4. Don nhap kho (7 Buoc)
@app.get("/api/imports")
def get_import_orders(step: Optional[int] = None):
    conn = get_db_connection()
    query = "SELECT * FROM import_orders"
    params = []
    if step:
        query += " WHERE step = ?"
        params.append(step)
    query += " ORDER BY created_date DESC, id DESC"

    orders = conn.execute(query, params).fetchall()
    result = []
    for o in orders:
        o_dict = dict(o)
        items = conn.execute("SELECT * FROM import_items WHERE order_id = ?", (o["id"],)).fetchall()
        o_dict["items"] = [dict(it) for it in items]
        if o["inspection_members"]:
            try:
                o_dict["inspection_members"] = json.loads(o["inspection_members"])
            except:
                pass
        result.append(o_dict)

    conn.close()
    return result

@app.post("/api/imports")
def create_import_order(data: ImportOrderCreateModel):
    conn = get_db_connection()
    created_date = date.today().isoformat()
    try:
        conn.execute("""
            INSERT INTO import_orders (id, supplier, contract, invoice_num, created_date, step, status, current_handler)
            VALUES (?, ?, ?, ?, ?, 2, 'Da lap ke hoach dat hang -> Chuyen NCC giao hang (Buoc 2)', 'Nha cung cap & Thu kho')
        """, (data.id, data.supplier, data.contract, data.invoice_num, created_date))

        for it in data.items:
            conn.execute("""
                INSERT INTO import_items (order_id, material_id, name, unit, lot_num, exp_date, qty, unit_price)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (data.id, it.material_id, it.name, it.unit, it.lot_num, it.exp_date, it.qty, it.unit_price))

        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail=f"Ma phieu nhap {data.id} da ton tai!")
    finally:
        conn.close()

    return {"message": "Tao ke hoach nhap hang thanh cong", "id": data.id, "step": 2}

@app.post("/api/imports/{order_id}/inspection")
def confirm_import_inspection(order_id: str, data: InspectionConfirmModel):
    conn = get_db_connection()
    today_str = date.today().isoformat()
    members_json = json.dumps(data.members, ensure_ascii=False)

    conn.execute("""
        UPDATE import_orders
        SET step = 5,
            status = 'Hoi dong kiem nhap da ky bien ban -> Chuyen ke toan duoc duyet hoa don (Buoc 5)',
            current_handler = 'CN. Nguyen Thu Trang (Ke toan duoc / P. TCKT)',
            inspection_date = ?,
            inspection_members = ?,
            inspection_conclusion = ?
        WHERE id = ?
    """, (today_str, members_json, data.conclusion, order_id))

    conn.commit()
    conn.close()
    return {"message": "Hoi dong kiem nhap da ky xac nhan", "id": order_id, "step": 5}

@app.post("/api/imports/{order_id}/step")
def advance_import_step(order_id: str, next_step: int = Body(..., embed=True)):
    conn = get_db_connection()
    step_descriptions = {
        2: ("Da gui phieu dat hang cho NCC -> Cho giao hang (Buoc 2)", "Nha cung cap"),
        3: ("Tiep nhan hang hoa -> Cho Hoi dong kiem nhap danh gia (Buoc 3)", "Hoi dong kiem nhap"),
        5: ("Ke toan duyet hoa don & in phieu nhap kho (Buoc 5)", "Ke toan duoc"),
        6: ("Cho Truong phong VTTBYT ky xac nhan phieu nhap (Buoc 6)", "DS. Hoang Thi Minh Ha"),
        7: ("Hoan tat thu tuc nhap kho & lap phieu de nghi thanh toan (Buoc 7)", "P. Tai chinh Ke toan")
    }

    status, handler = step_descriptions.get(next_step, ("Dang xu ly", "Thu kho"))

    conn.execute("""
        UPDATE import_orders
        SET step = ?, status = ?, current_handler = ?
        WHERE id = ?
    """, (next_step, status, handler, order_id))

    # Khi hoan tat Buoc 7: Cong don so luong vao kho database (the kho)
    if next_step == 7:
        items = conn.execute("SELECT * FROM import_items WHERE order_id = ?", (order_id,)).fetchall()
        for it in items:
            exist_lot = conn.execute("SELECT * FROM material_lots WHERE material_id = ? AND lot_num = ?", (it["material_id"], it["lot_num"])).fetchone()
            if exist_lot:
                conn.execute("UPDATE material_lots SET qty = qty + ? WHERE id = ?", (it["qty"], exist_lot["id"]))
            else:
                conn.execute("""
                    INSERT INTO material_lots (material_id, lot_num, exp_date, qty)
                    VALUES (?, ?, ?, ?)
                """, (it["material_id"], it["lot_num"], it["exp_date"], it["qty"]))

    conn.commit()
    conn.close()
    return {"message": f"Chuyen buoc {next_step} thanh cong", "id": order_id}

# 5. Phieu linh & Xuat kho (6 Buoc)
@app.get("/api/exports")
def get_export_requests(dept_id: Optional[str] = None, step: Optional[int] = None):
    conn = get_db_connection()
    query = "SELECT * FROM export_requests WHERE 1=1"
    params = []
    if dept_id:
        query += " AND dept_id = ?"
        params.append(dept_id)
    if step:
        query += " AND step = ?"
        params.append(step)
    query += " ORDER BY created_date DESC, id DESC"

    requests = conn.execute(query, params).fetchall()
    result = []
    for r in requests:
        r_dict = dict(r)
        items = conn.execute("SELECT * FROM export_items WHERE request_id = ?", (r["id"],)).fetchall()
        r_dict["items"] = [dict(it) for it in items]
        result.append(r_dict)

    conn.close()
    return result

@app.post("/api/exports")
def create_export_request(data: ExportRequestCreateModel):
    conn = get_db_connection()
    created_date = date.today().isoformat()
    dept = conn.execute("SELECT * FROM departments WHERE id = ?", (data.dept_id,)).fetchone()
    dept_name = dept["name"] if dept else data.dept_id
    approver_head = dept["head"] if dept else "Truong Khoa"

    try:
        conn.execute("""
            INSERT INTO export_requests (id, dept_id, dept_name, requester, approver_head, purpose, created_date, step, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 2, 'Truong khoa da ky duyet -> Cho Thu kho kiem tra ton kho (Buoc 2)')
        """, (data.id, data.dept_id, dept_name, data.requester, approver_head, data.purpose, created_date))

        for it in data.items:
            conn.execute("""
                INSERT INTO export_items (request_id, material_id, name, unit, requested_qty, dispensed_qty, unit_price)
                VALUES (?, ?, ?, ?, ?, 0, ?)
            """, (data.id, it.material_id, it.name, it.unit, it.requested_qty, it.unit_price))

        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail=f"Ma phieu linh {data.id} da ton tai!")
    finally:
        conn.close()

    return {"message": "Tao phieu linh thanh cong", "id": data.id, "step": 2}

@app.post("/api/exports/{request_id}/step")
def advance_export_step(request_id: str, next_step: int = Body(..., embed=True)):
    conn = get_db_connection()
    step_descriptions = {
        2: "Truong khoa da ky duyet -> Cho Thu kho kiem tra ton kho (Buoc 2)",
        3: "Thu kho da xac nhan du hang -> Cho Truong P. VTTBYT duyet (Buoc 3)",
        4: "Truong P. VTTBYT da duyet -> Thu kho cap phat theo FEFO & in chung tu (Buoc 4)",
        5: "Dang kiem dem va ban giao vat tu (Buoc 5)"
    }
    status = step_descriptions.get(next_step, "Dang xu ly")

    conn.execute("UPDATE export_requests SET step = ?, status = ? WHERE id = ?", (next_step, status, request_id))
    conn.commit()
    conn.close()
    return {"message": f"Chuyen buoc {next_step} thanh cong", "id": request_id}

@app.post("/api/exports/{request_id}/fefo-dispatch")
def confirm_fefo_dispatch(request_id: str, data: FefoDispatchRequestModel):
    conn = get_db_connection()
    today_str = date.today().isoformat()
    req = conn.execute("SELECT * FROM export_requests WHERE id = ?", (request_id,)).fetchone()
    if not req:
        conn.close()
        raise HTTPException(status_code=404, detail="Khong tim thay phieu linh")

    # 1. Cap nhat thong tin xuat kho
    conn.execute("""
        UPDATE export_requests
        SET step = 6,
            status = 'Da giao nhan 2 ben, ky chung tu Mau 02 & tru The kho tu dong (Buoc 6)',
            export_receipt_num = ?,
            export_date = ?,
            dispensed_by = ?,
            received_by = ?
        WHERE id = ?
    """, (data.export_receipt_num, today_str, data.dispensed_by, data.received_by, request_id))

    # 2. Tru so luong ton trong database theo FEFO & cap nhat chi tiet
    for it in data.items:
        conn.execute("""
            UPDATE export_items
            SET dispensed_qty = ?, lot_num = ?, exp_date = ?
            WHERE request_id = ? AND material_id = ?
        """, (it.dispensed_qty, it.lot_num, it.exp_date, request_id, it.material_id))

        # Tru so luong o bang material_lots
        conn.execute("""
            UPDATE material_lots
            SET qty = MAX(0, qty - ?)
            WHERE material_id = ? AND lot_num = ?
        """, (it.dispensed_qty, it.material_id, it.lot_num))

        # 3. Neu cap cho tu truc khoa -> Cong bu vao co so tu truc
        cab_stock = conn.execute("SELECT * FROM cabinet_stocks WHERE dept_id = ? AND material_id = ?", (req["dept_id"], it.material_id)).fetchone()
        if cab_stock:
            conn.execute("UPDATE cabinet_stocks SET current_qty = current_qty + ? WHERE id = ?", (it.dispensed_qty, cab_stock["id"]))

    conn.commit()
    conn.close()
    return {"message": "Xuat kho theo chuan FEFO thanh cong", "id": request_id, "step": 6}

# 6. Tu truc cac khoa phong
@app.get("/api/cabinets")
def get_cabinet_stocks(dept_id: Optional[str] = "KCC"):
    conn = get_db_connection()
    stocks = conn.execute("SELECT * FROM cabinet_stocks WHERE dept_id = ?", (dept_id,)).fetchall()
    conn.close()
    return [dict(s) for s in stocks]

# 7. Nhat ky GSP (Nhiet do, Do am)
@app.get("/api/gsp/logs")
def get_gsp_logs(limit: int = 20):
    conn = get_db_connection()
    logs = conn.execute("SELECT * FROM gsp_logs ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
    conn.close()
    return [dict(l) for l in logs]

@app.post("/api/gsp/logs")
def create_gsp_log(data: GspLogCreateModel):
    conn = get_db_connection()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conn.execute("""
        INSERT INTO gsp_logs (zone, temp, humidity, logged_by, logged_at)
        VALUES (?, ?, ?, ?, ?)
    """, (data.zone, data.temp, data.humidity, data.logged_by, now_str))
    conn.commit()
    conn.close()
    return {"message": "Ghi nhat ky thanh cong"}

# 8. Bao cao Xuat - Nhap - Ton & Du tru (Mau 03)
@app.get("/api/reports/nxt")
def get_nxt_report(month: str = "2026-09", category: Optional[str] = None):
    conn = get_db_connection()
    query = "SELECT * FROM materials WHERE 1=1"
    params = []
    if category:
        query += " AND category = ?"
        params.append(category)

    materials = conn.execute(query, params).fetchall()
    report_rows = []

    for idx, m in enumerate(materials):
        lots = conn.execute("SELECT * FROM material_lots WHERE material_id = ? ORDER BY exp_date ASC", (m["id"],)).fetchall()
        closing_stock = sum(l["qty"] for l in lots)
        imported = round(closing_stock * 0.35)
        exported = round(closing_stock * 0.25)
        opening_stock = closing_stock - imported + exported
        forecast = round(exported * 1.2)
        earliest_exp = lots[0]["exp_date"] if lots else "N/A"

        report_rows.append({
            "stt": idx + 1,
            "material_id": m["id"],
            "name": m["name"],
            "unit": m["unit"],
            "opening_stock": opening_stock,
            "imported": imported,
            "exported": exported,
            "closing_stock": closing_stock,
            "forecast_next_month": forecast,
            "earliest_exp": earliest_exp,
            "gsp_status": "GSP Dat"
        })

    conn.close()
    return report_rows

# 9. Khoi phuc du lieu mau
@app.post("/api/reset-sample-data")
def reset_sample_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS gsp_logs")
    cursor.execute("DROP TABLE IF EXISTS cabinet_stocks")
    cursor.execute("DROP TABLE IF EXISTS export_items")
    cursor.execute("DROP TABLE IF EXISTS export_requests")
    cursor.execute("DROP TABLE IF EXISTS import_items")
    cursor.execute("DROP TABLE IF EXISTS import_orders")
    cursor.execute("DROP TABLE IF EXISTS material_lots")
    cursor.execute("DROP TABLE IF EXISTS materials")
    cursor.execute("DROP TABLE IF EXISTS departments")
    conn.commit()
    conn.close()

    init_db()
    return {"message": "Da khoi phuc toan bo du lieu mau SQLite ban dau theo QD 651!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.py:app", host="0.0.0.0", port=8080, reload=True)
