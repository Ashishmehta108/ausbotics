"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GoogleSheetDialog() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSheet, setLoadingSheet] = useState<string | null>(null);
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);
  const [sheetData, setSheetData] = useState<Record<string, any[]>>({});
  const [sheetLinks, setSheetLinks] = useState<Record<string, string | null>>(
    {}
  );

  // Fetch workflows
  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("http://localhost:5000/api/workflows", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log(data.data);
        setWorkflows(data.data.workflows || []);
      } catch (err) {
        console.error("Error fetching workflows:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkflows();
  }, []);

  // Fetch sheet for a workflow
  const fetchSheet = async (workflowId: string) => {
    if (expandedWorkflow === workflowId) {
      // collapse if clicked again
      setExpandedWorkflow(null);
      return;
    }

    setExpandedWorkflow(workflowId);
    setLoadingSheet(workflowId);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:5000/api/workflows/${workflowId}/sheet`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      setSheetData((prev) => ({
        ...prev,
        [workflowId]: data.data.fetchGooglesheetData || [],
      }));

      setSheetLinks((prev) => ({
        ...prev,
        [workflowId]: data.data.sheetUrl || null,
      }));
    } catch (err) {
      console.error("Error fetching sheet:", err);
      setSheetData((prev) => ({ ...prev, [workflowId]: [] }));
      setSheetLinks((prev) => ({ ...prev, [workflowId]: null }));
    } finally {
      setLoadingSheet(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Workflows</h1>

      {loading ? (
        <p>Loading workflows...</p>
      ) : workflows.length === 0 ? (
        <p>No workflows found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id} className="shadow">
              <CardHeader>
                <CardTitle>{workflow.name}</CardTitle>
              </CardHeader>

              <CardContent>
                <p>{workflow.description}</p>
              </CardContent>

              <CardFooter className="flex flex-col items-start gap-2">
                <Button
                  type="button"
                  onClick={() => fetchSheet(workflow.id)}
                  disabled={loadingSheet === workflow.id}
                  size="sm"
                >
                  {loadingSheet === workflow.id && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2 inline-block" />
                  )}
                  {expandedWorkflow === workflow.id
                    ? "Hide Sheet"
                    : "View Sheet"}
                </Button>

                {/* Inline sheet view */}
                {expandedWorkflow === workflow.id && (
                  <div className="w-full mt-4 p-3 border rounded bg-muted">
                    {sheetLinks[workflow.id] && (
                      <p className="mb-2 text-sm">
                        Google Sheet URL:{" "}
                        <a
                          href={sheetLinks[workflow.id] || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {sheetLinks[workflow.id]}
                        </a>
                      </p>
                    )}

                    {loadingSheet === workflow.id ? (
                      <p>Loading sheet data...</p>
                    ) : sheetData[workflow.id] &&
                      sheetData[workflow.id].length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm">
                          <thead>
                            <tr>
                              {Object.keys(sheetData[workflow.id][0] || {}).map(
                                (key) => (
                                  <th
                                    key={key}
                                    className="border px-2 py-1 bg-gray-100 text-left"
                                  >
                                    {key}
                                  </th>
                                )
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {sheetData[workflow.id].map((row, i) => (
                              <tr key={i}>
                                {Object.values(row).map((value, j) => (
                                  <td key={j} className="border px-2 py-1">
                                    {value as string}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No sheet data found.
                      </p>
                    )}
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
