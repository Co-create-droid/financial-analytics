# Financial Analyst AI

Financial Analyst AI is an intelligent dashboard that allows users to query financial data using natural language. It leverages a local Large Language Model (LLM) to convert English questions into SQL queries, executes them against a database, and presents the results in an interactive UI.

## Features

-   **Natural Language Querying**: Ask questions like "Show me the top 5 customers by spending" or "What is the total transaction volume for last month?"
-   **Interactive Dashboard**: Visualize key metrics and trends with dynamic charts.
-   **Data Visualization**: Automatically formatted tables with currency and date support.
-   **Reporting**: Save frequently used queries as reports and export results to CSV.
-   **Dark Mode**: A sleek, professional dark mode interface.

## Architecture

The project follows a modern client-server architecture:

-   **Frontend**: Built with [Next.js](https://nextjs.org/) (React), utilizing Tailwind CSS and `shadcn/ui` for a premium user experience.
-   **Backend**: Powered by [FastAPI](https://fastapi.tiangolo.com/) (Python), handling API requests and database interactions.
-   **Database**: [MySQL](https://www.mysql.com/) for structured data storage.
-   **AI Engine**: [Ollama](https://ollama.com/) running a local LLM (e.g., `gpt-oss:120b-cloud`) for text-to-SQL generation.

## Prerequisites

Ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [Python](https://www.python.org/) (v3.10 or higher)
-   [Docker](https://www.docker.com/) (for running MySQL)
-   [Ollama](https://ollama.com/) (running locally)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd financial-analytics
```

### 2. Database Setup

Start the MySQL database using Docker:

```bash
cd server
docker-compose up -d
```

### 3. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Seed the database with sample data:

```bash
python seed.py
```

Start the backend server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### 4. Frontend Setup

Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage

1.  Open your browser and navigate to `http://localhost:3000`.
2.  In the search bar, type a question about your data (e.g., "How many transactions were made in healthcare?").
3.  View the results in the table or explore the **Analytics** tab for visual insights.
4.  Save interesting queries using the **Save Report** button.

## Project Structure

```
financial-analytics/
├── client/                 # Next.js Frontend
│   ├── app/                # App Router pages
│   ├── components/         # React components
│   └── lib/                # Utility functions and API client
├── server/                 # FastAPI Backend
│   ├── main.py             # API entry point
│   ├── models.py           # SQLAlchemy database models
│   ├── llm.py              # LLM integration logic
│   └── seed.py             # Database seeding script
└── README.md               # Project documentation
```

## License

[MIT](LICENSE)
