"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface QueryInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export function QueryInput({ onSearch, isLoading }: QueryInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto"
    >
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Ask about your data (e.g., 'Show me transactions over $500')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 pr-12 py-6 text-lg rounded-full shadow-lg border-transparent focus-visible:ring-2 focus-visible:ring-primary/50 bg-background/80 backdrop-blur-sm transition-all hover:shadow-xl"
          disabled={isLoading}
        />
        <div className="absolute right-2">
          <Button
            type="submit"
            size="icon"
            className="rounded-full w-10 h-10"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </motion.form>
  );
}
