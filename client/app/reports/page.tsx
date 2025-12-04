"use client";

import { useEffect, useState } from "react";
import { getReports, deleteReport, SavedReport } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Trash2, Play, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const router = useRouter();

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

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
    // Redirect to home with query param (requires updating home page to handle this)
    // For now, we'll just copy to clipboard or show a toast, 
    // but ideally we'd navigate to /?q=...
    // Let's implement a simple navigation for now
    const encodedQuery = encodeURIComponent(query);
    router.push(`/?q=${encodedQuery}`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Saved Reports</h1>
        <p className="text-muted-foreground">Manage and run your saved queries.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No saved reports found. Save a query from the dashboard to see it here.
          </div>
        ) : (
          reports.map((report) => (
            <Card 
              key={report.id} 
              className="cursor-pointer hover:bg-accent/50 transition-colors group relative overflow-hidden"
              onClick={() => handleRun(report.query)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  {report.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {report.query}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.created_at).toLocaleDateString()}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                    onClick={(e) => handleDelete(e, report.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
