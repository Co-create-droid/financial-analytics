from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from models import Customer, Transaction
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()

def init_db():
    Base.metadata.create_all(bind=engine)

def seed_data(db: Session):
    # Check if data already exists
    if db.query(Customer).count() > 0:
        print("Data already exists. Skipping seed.")
        return

    print("Seeding data...")
    
    customers = []
    for _ in range(20):
        customer = Customer(
            name=fake.name(),
            email=fake.unique.email(),
            city=fake.city(),
            state=fake.state()
        )
        customers.append(customer)
        db.add(customer)
    
    db.commit()
    
    # Refresh to get IDs
    for c in customers:
        db.refresh(c)

    categories = ['Food', 'Travel', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare']
    
    for _ in range(150):
        customer = random.choice(customers)
        transaction = Transaction(
            customer_id=customer.id,
            amount=round(random.uniform(10.0, 5000.0), 2),
            category=random.choice(categories),
            date=fake.date_between(start_date='-1y', end_date='today'),
            description=fake.sentence(nb_words=5)
        )
        db.add(transaction)
    
    db.commit()
    print("Data seeded successfully!")

if __name__ == "__main__":
    init_db()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
