"use client";

import { useEffect, useState } from "react";
import { getReports, deleteReport, SavedReport } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FileText, Trash2, Play } from "lucide-react";

interface SavedReportsProps {
  onRunReport: (query: string) => void;
}

export function SavedReports({ onRunReport }: SavedReportsProps) {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReports();
    }
  }, [isOpen]);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await deleteReport(id);
      fetchReports();
    } catch (error) {
      console.error("Failed to delete report", error);
    }
  };

  const handleRun = (query: string) => {
    onRunReport(query);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Saved Reports
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Saved Reports</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-4">
          <div className="space-y-4">
            {reports.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No saved reports yet.
              </p>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
                  onClick={() => handleRun(report.query)}
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-none">{report.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {report.query}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDelete(e, report.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
