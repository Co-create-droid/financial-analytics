/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";

import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { saveReport } from "@/lib/api";

interface ResultsTableProps {
  data: Record<string, any>[];
  sql: string;
  query?: string;
}

export function ResultsTable({ data, sql, query }: ResultsTableProps) {
  const [reportName, setReportName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-muted-foreground mt-8"
      >
        No results found.
      </motion.div>
    );
  }

  const columns = Object.keys(data[0]);

  const formatValue = (key: string, value: any) => {
    if (value === null || value === undefined) return "-";

    const keyLower = key.toLowerCase();

    // Currency formatting
    if (
      keyLower.includes("amount") ||
      keyLower.includes("price") ||
      keyLower.includes("balance") ||
      keyLower.includes("spent") ||
      keyLower.includes("cost") ||
      keyLower.includes("revenue") ||
      keyLower.includes("total")
    ) {
      // Check if it's actually a number before formatting
      const num = Number(value);
      if (!isNaN(num)) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num);
      }
    }

    // Date formatting
    if (keyLower.includes("date") || keyLower.includes("created_at")) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return new Intl.DateTimeFormat("en-US", {
          dateStyle: "medium",
        }).format(date);
      }
    }

    if (typeof value === "number" && !Number.isInteger(value)) {
      return value.toFixed(2);
    }

    return value;
  };

  const handleExportCSV = () => {
    const header = ["#", ...columns].join(",");
    const rows = data.map((row, index) =>
      [index + 1, ...columns.map((col) => JSON.stringify(row[col]))].join(",")
    );
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "financial_data.csv");
  };

  const handleSaveReport = async () => {
    if (!query || !reportName.trim()) return;
    setIsSaving(true);
    try {
      await saveReport(reportName, query);
      setIsDialogOpen(false);
      setReportName("");
    } catch (error) {
      console.error("Failed to save report", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6 w-full max-w-6xl mx-auto mt-8"
    >
      <Card className="overflow-hidden border-none shadow-xl bg-background/60 backdrop-blur-md">
        <CardHeader className="bg-muted/30 border-b border-border/50 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-foreground font-medium max-w-[60%]">
            <div className="p-1.5 bg-primary/10 rounded-md">
              <Code2 className="w-4 h-4 text-primary" />
            </div>
            <span className="truncate" title={query}>
              {query || "Query Results"}
            </span>
            <span
              className="text-xs text-muted-foreground font-mono ml-2 px-2 py-0.5 bg-muted rounded border border-border hidden lg:inline-block max-w-[200px] truncate"
              title={sql}
            >
              {sql}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>

            {query && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save Report
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Report</DialogTitle>
                    <DialogDescription>
                      Save this query to easily run it again later.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                        className="col-span-3"
                        placeholder="e.g., High Value Transactions"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleSaveReport}
                      disabled={isSaving || !reportName.trim()}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-primary w-24 text-center">
                    #
                  </TableHead>
                  {columns.map((col) => (
                    <TableHead
                      key={col}
                      className="font-semibold text-primary capitalize whitespace-nowrap"
                    >
                      {col.replace(/_/g, " ")}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, i) => (
                  <TableRow
                    key={i}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium text-center text-muted-foreground w-12">
                      {i + 1}
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell
                        key={`${i}-${col}`}
                        className="font-medium whitespace-nowrap"
                      >
                        {formatValue(col, row[col])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className="text-right text-xs text-muted-foreground">
        {data.length} result{data.length !== 1 ? "s" : ""} found
      </div>
    </motion.div>
  );
}
