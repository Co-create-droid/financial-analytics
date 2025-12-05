import requests
import os
import json
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

# Ollama Cloud Configuration
OLLAMA_ENDPOINT = os.getenv("OLLAMA_ENDPOINT", "http://localhost:11434/api/generate")
OLLAMA_API_KEY = os.getenv("OLLAMA_API_KEY", "")
MODEL_NAME = "gpt-oss:120b-cloud" 

SCHEMA_DESCRIPTION = """
Table: customers
Columns:
- id (Integer, Primary Key)
- name (String)
- email (String)
- city (String)
- state (String)

Table: transactions
Columns:
- id (Integer, Primary Key)
- customer_id (Integer, Foreign Key to customers.id)
- amount (Float)
- category (String)
- date (Date)
- description (String)
"""

def generate_sql(query: str, error_message: str = None) -> str:
    prompt = f"""
    You are an expert SQL data analyst. Your task is to generate a valid MySQL query based on the user's natural language request.
    
    Database Schema:
    {SCHEMA_DESCRIPTION}
    
    Rules:
    1. Return ONLY the raw SQL query. Do not include markdown formatting (like ```sql), explanations, or notes.
    2. Ensure the query is valid MySQL syntax.
    3. Use the table and column names exactly as provided in the schema.
    
    User Request: "{query}"
    """
    
    if error_message:
        prompt += f"\n\nPrevious attempt failed with error: {error_message}\nPlease fix the query and return only the corrected SQL."

    headers = {
        "Content-Type": "application/json"
    }
    if OLLAMA_API_KEY:
        headers["Authorization"] = f"Bearer {OLLAMA_API_KEY}"
    
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        print(f"Sending request to LLM: {OLLAMA_ENDPOINT} with model {MODEL_NAME}")
        response = requests.post(OLLAMA_ENDPOINT, headers=headers, json=payload)
        response.raise_for_status()
        
        try:
            result = response.json()
        except json.JSONDecodeError:
            print(f"Failed to decode JSON. Response text: {response.text[:200]}...")
            return ""

        sql = result.get("response", "").strip()
        
        # Clean up potential markdown code blocks if the LLM ignores instructions
        if sql.startswith("```sql"):
            sql = sql[6:]
        if sql.startswith("```"):
            sql = sql[3:]
        if sql.endswith("```"):
            sql = sql[:-3]
            
        return sql.strip()
    except Exception as e:
        print(f"LLM Generation Error: {e}")
        return ""

def execute_and_correct(db, user_query: str, max_retries: int = 3):
    current_sql = generate_sql(user_query)
    
    for attempt in range(max_retries):
        print(f"Attempt {attempt + 1}: Executing SQL: {current_sql}")
        try:
            result = db.execute(text(current_sql))
            rows = result.fetchall()
            columns = result.keys()
            return {"status": "success", "sql": current_sql, "data": [dict(zip(columns, row)) for row in rows]}
        except SQLAlchemyError as e:
            error_msg = str(e.__dict__['orig'])
            print(f"SQL Execution Error: {error_msg}")
            
            if attempt < max_retries - 1:
                print("Requesting self-correction from LLM...")
                current_sql = generate_sql(user_query, error_message=error_msg)
            else:
                return {"status": "error", "message": f"Failed after {max_retries} attempts. Last error: {error_msg}"}
                
    return {"status": "error", "message": "Unknown error"}
