from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.database import get_db
from app.models.user import User
from app.models.report import Report
from app.models.audit import AuditLog
from app.schemas.report import ReportOut, ReportGenerate
from app.security.auth import get_current_user
from app.security.guardrails import scan_for_prompt_injection, mask_pii
from app.agents.workflow import run_report_generation_workflow

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/generate", response_model=ReportOut, status_code=status.HTTP_202_ACCEPTED)
def generate_report(
    report_in: ReportGenerate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. RUN SECURITY GUARDRAILS (Prompt Injection Classifier & Jailbreaks)
    topic_raw = report_in.topic
    is_malicious, alert_msg = scan_for_prompt_injection(topic_raw)
    
    if is_malicious:
        # Create an Audit log for security event tracking
        audit_log = AuditLog(
            user_id=current_user.id,
            action="prompt_injection_blocked",
            status="blocked",
            details=f"Topic input: '{topic_raw}'. Blocked reason: {alert_msg}"
        )
        db.add(audit_log)
        db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Security Violation: {alert_msg}"
        )
        
    # 2. RUN PII DATA MASKING
    sanitized_topic = mask_pii(topic_raw)
    
    # 3. INITIALIZE REPORT ENTRY IN DB
    report_id = str(uuid.uuid4())
    title_placeholder = report_in.title or f"Research Report: {sanitized_topic[:40]}"
    if len(title_placeholder) > 100:
        title_placeholder = title_placeholder[:97] + "..."
        
    new_report = Report(
        id=report_id,
        title=title_placeholder,
        topic=sanitized_topic,
        status="pending",
        user_id=current_user.id
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    # 4. DISPATCH SEQUENTIAL MULTI-AGENT WORKFLOW TO BACKGROUND
    background_tasks.add_task(
        run_report_generation_workflow,
        db=db,
        user_id=current_user.id,
        topic=sanitized_topic,
        report_id=report_id
    )
    
    # Log successful start
    audit_log = AuditLog(
        user_id=current_user.id,
        action="start_generation",
        status="success",
        details=f"Dispatched report generation background worker task. Report ID: {report_id}."
    )
    db.add(audit_log)
    db.commit()
    
    return new_report

@router.get("", response_model=List[ReportOut])
def list_reports(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Admins see all reports, users see their own
    if current_user.role == "admin":
        return db.query(Report).order_by(Report.created_at.desc()).all()
    return db.query(Report).filter(Report.user_id == current_user.id).order_by(Report.created_at.desc()).all()

@router.get("/{id}", response_model=ReportOut)
def get_report_details(id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    report = db.query(Report).filter(Report.id == id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
        
    # User ownership boundaries (Viewer checks)
    if current_user.role != "admin" and report.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden. You do not own this report."
        )
        
    return report

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    report = db.query(Report).filter(Report.id == id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
        
    if current_user.role != "admin" and report.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden. You are not allowed to delete this report."
        )
        
    db.delete(report)
    db.commit()
    
    audit_log = AuditLog(
        user_id=current_user.id,
        action="delete_report",
        status="success",
        details=f"Deleted report ID: {id}."
    )
    db.add(audit_log)
    db.commit()
    
    return None
