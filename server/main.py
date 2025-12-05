from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from llm import execute_and_correct
import uvicorn

app = FastAPI(title="Financial Analyst Tool")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

class QueryRequest(BaseModel):
    query: str

@app.post("/ask")
def ask_question(request: QueryRequest, db: Session = Depends(get_db)):
    """
    Endpoint to ask a natural language question about the financial data.
    """
    if not request.query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    result = execute_and_correct(db, request.query)
    
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
        
    return result

@app.get("/dashboard")
def get_dashboard_data(db: Session = Depends(get_db)):
    """
    Endpoint to get summary metrics for the dashboard.
    """
    from sqlalchemy import func
    from models import Transaction

    # Total Volume
    total_volume = db.query(func.sum(Transaction.amount)).scalar() or 0
    
    # Total Count
    total_count = db.query(func.count(Transaction.id)).scalar() or 0
    
    # Average Amount
    avg_amount = db.query(func.avg(Transaction.amount)).scalar() or 0
    
    # Spending by Category
    category_data = db.query(
        Transaction.category, 
        func.sum(Transaction.amount).label("total")
    ).group_by(Transaction.category).all()
    
    # Daily Trend (Last 30 days)
    daily_data = db.query(
        Transaction.date,
        func.sum(Transaction.amount).label("total")
    ).group_by(Transaction.date).order_by(Transaction.date).all()

    return {
        "summary": {
            "total_volume": total_volume,
            "total_count": total_count,
            "avg_amount": avg_amount
        },
        "by_category": [{"name": c[0], "value": c[1]} for c in category_data],
        "daily_trend": [{"date": d[0].isoformat(), "amount": d[1]} for d in daily_data]
    }

# Reporting Endpoints
class ReportCreate(BaseModel):
    name: str
    query: str

@app.post("/reports")
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    from models import SavedReport
    from datetime import datetime
    
    db_report = SavedReport(name=report.name, query=report.query, created_at=datetime.now())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@app.get("/reports")
def get_reports(db: Session = Depends(get_db)):
    from models import SavedReport
    return db.query(SavedReport).order_by(SavedReport.created_at.desc()).all()

@app.delete("/reports/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    from models import SavedReport
    
    report = db.query(SavedReport).filter(SavedReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    db.delete(report)
    db.commit()
    return {"message": "Report deleted"}


@app.on_event("startup")
def startup_event():
    from database import engine, Base
    from models import SavedReport
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
