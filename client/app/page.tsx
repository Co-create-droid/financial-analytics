'use client'
import { useState, useEffect } from "react";
import { QueryInput } from "@/components/query-input";
import { ResultsTable } from "@/components/results-table";
import { ErrorDisplay } from "@/components/error-display";
import { SavedReports } from "@/components/saved-reports";
import { askQuestion, QueryResponse } from "@/lib/api";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState("");
  
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q');

  useEffect(() => {
    if (queryParam) {
      handleSearch(queryParam);
    }
  }, [queryParam]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setCurrentQuery(query);

    try {
      const result = await askQuestion(query);
      if (result.status === "success") {
        setResponse(result);
      } else {
        setError(result.message || "An unknown error occurred.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Financial Analyst.</p>
        </div>
        <SavedReports onRunReport={handleSearch} />
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <QueryInput onSearch={handleSearch} isLoading={isLoading} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {error && <ErrorDisplay message={error} />}
        
        {response && (
          <ResultsTable data={response.data} sql={response.sql} query={currentQuery} />
        )}
      </motion.div>
    </div>
  );
}
