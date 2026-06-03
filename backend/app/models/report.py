import uuid
from sqlalchemy import Column, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    topic = Column(String(555), nullable=False)
    status = Column(String(50), default="pending")  # pending, planning, researching, writing, reviewing, verifying, completed, failed
    content = Column(Text, nullable=True)
    pdf_url = Column(String(500), nullable=True)
    docx_url = Column(String(500), nullable=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="reports")
    sources = relationship("Source", back_populates="report", cascade="all, delete-orphan")
    evaluation = relationship("Evaluation", uselist=False, back_populates="report", cascade="all, delete-orphan")

class Source(Base):
    __tablename__ = "sources"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    report_id = Column(String(36), ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    url = Column(String(2000), nullable=True)
    content = Column(Text, nullable=True)
    credibility_score = Column(Float, default=0.8)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    report = relationship("Report", back_populates="sources")
