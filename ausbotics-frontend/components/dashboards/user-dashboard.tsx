"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { Bot, LogOut, Home, Loader2 } from "lucide-react";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ModeToggle } from "../Modetoggle";
import { EmptyDashboard } from "@/components/dashboards/emptyDashboard";

export function UserDashboard() {
  const { user, signOut, getAllWorkflows } = useAuth();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any | null>(null);
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [sheetLink, setSheetLink] = useState<string | null>(null);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [loadingWorkflows, setLoadingWorkflows] = useState(true);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setLoadingWorkflows(true);
        const allWorkflows = await getAllWorkflows();
        setWorkflows(allWorkflows || []);
      } catch (err) {
        console.error("Error fetching workflows:", err);
      } finally {
        setLoadingWorkflows(false);
      }
    };
    fetchWorkflows();
  }, [getAllWorkflows]);

  const fetchSheet = async (workflowId: string) => {
    setSelectedWorkflow(workflows.find((w) => w.id === workflowId) || null);
    setLoadingSheet(true);
    setSheetData([]);
    setSheetLink(null);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:5000/api/workflows/${workflowId}/sheet`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setSheetData(data.data.fetchGooglesheetData || []);
      setSheetLink(data.data.sheetUrl || null);
    } catch (err) {
      console.error("Error fetching sheet:", err);
    } finally {
      setLoadingSheet(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="bg-primary rounded-xl p-2 transition-transform group-hover:scale-105">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Ausbotics
                </span>
              </Link>
              <nav className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/" className="flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                </Button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="default" className="rounded-md text-xs">
                User
              </Badge>
              <span className="hidden sm:inline text-sm text-muted-foreground truncate max-w-[150px]">
                Welcome, {user?.fullName || user?.email}
              </span>
              <ModeToggle />
              <Button
                variant="default"
                size="sm"
                onClick={signOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" /> <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">User Dashboard</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            View all your workflows
          </p>
        </div>

        {/* Workflows */}
        {loadingWorkflows ? (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <Skeleton className="h-5 w-32 bg-zinc-100 dark:bg-zinc-800" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-8 w-32 bg-zinc-100 dark:bg-zinc-800" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : workflows.length === 0 ? (
          <EmptyDashboard />
        ) : (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {workflows.map((workflow) => (
              <Card
                key={workflow.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    {workflow.description || "No description available"}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    type="button"
                    onClick={() => fetchSheet(workflow.id)}
                    disabled={
                      loadingSheet && selectedWorkflow?.id === workflow.id
                    }
                    size="sm"
                  >
                    {loadingSheet && selectedWorkflow?.id === workflow.id && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2 inline-block" />
                    )}
                    View Workspace
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Inline Sheet Viewer */}
        {selectedWorkflow && (
          <div className="mt-12 border border-border rounded-xl p-6 bg-card shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">
              {selectedWorkflow?.name || "Workflow Sheet Data"}
            </h2>

            {loadingSheet ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sheetData.length === 0 ? (
              <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
                No data available for this workflow.
              </div>
            ) : (
              <div className="overflow-x-auto mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(sheetData[0]).map((key) => (
                        <TableHead key={key}>{key}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sheetData.map((row, idx) => (
                      <TableRow
                        key={idx}
                        className="hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        {Object.values(row).map((value, i) => (
                          <TableCell key={i}>{String(value)}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {sheetLink && (
              <div className="mt-4">
                <Button
                  asChild
                  variant="link"
                  size="sm"
                  className="text-zinc-500 dark:text-zinc-400"
                >
                  <a href={sheetLink} target="_blank" rel="noopener noreferrer">
                    Open Full Sheet
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
