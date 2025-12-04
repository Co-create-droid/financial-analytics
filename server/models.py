from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    email = Column(String(100), unique=True, index=True)
    city = Column(String(50))
    state = Column(String(50))

    transactions = relationship("Transaction", back_populates="customer")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    amount = Column(Float)
    category = Column(String(50)) # e.g., 'Food', 'Travel', 'Utilities'
    date = Column(Date)
    description = Column(String(200))

    customer = relationship("Customer", back_populates="transactions")

class SavedReport(Base):
    __tablename__ = "saved_reports"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True)
    query = Column(String(500))
    created_at = Column(Date)
