"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bot, LogOut, Play, Home } from "lucide-react";
import Link from "next/link";
import { WorkflowDto } from "@/lib/types";
import { ModeToggle } from "../Modetoggle";

export function AdminDashboard() {
  const { user, signOut, getAllWorkflows, getAllAppointments } = useAuth();
  const [workflows, setWorkflows] = useState<WorkflowDto[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Workspace State
  const [loadingSheet, setLoadingSheet] = useState<string | null>(null);
  const [sheetView, setSheetView] = useState<{
    workflow: WorkflowDto;
    data: any[];
    url: string;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const wrkfls = await getAllWorkflows();
        setWorkflows(wrkfls.filter((w: WorkflowDto) => w.status === "Active"));

        const appts = await getAllAppointments();
        setAppointments(appts.data.appointments || []);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [getAllWorkflows]);

  // 🔹 Fetch workspace data
  const openSheetView = async (workflow: WorkflowDto) => {
    setLoadingSheet(workflow.id);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:5000/api/workflows/${workflow.id}/sheet`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setSheetView({
        workflow,
        data: data.data.fetchGooglesheetData || [],
        url: data.data.sheetUrl || "#",
      });
    } catch (err) {
      console.error(err);
      setSheetView({ workflow, data: [], url: "#" });
    } finally {
      setLoadingSheet(null);
    }
  };

  const closeSheetView = () => setSheetView(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="bg-primary rounded-xl p-2 group-hover:scale-105 transition-transform">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Ausbotics
                </span>
              </Link>
              <Button variant="ghost" size="sm">
                <Link href="/" className="flex items-center">
                  <Home className="h-4 w-4 mr-2" /> Home
                </Link>
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="rounded-md text-xs">
                Admin
              </Badge>
              <span className="hidden sm:inline text-sm text-muted-foreground truncate max-w-[150px]">
                Welcome, {user?.fullName || user?.email}
              </span>
              <ModeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor active workflows and appointments
          </p>
        </div>

        {sheetView ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button onClick={closeSheetView} variant="outline">
                &larr; Back
              </Button>
              <h2 className="text-xl font-bold">{sheetView.workflow.name}</h2>
              <a
                href={sheetView.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline"
              >
                Open Sheet in Google
              </a>
            </div>

            {loadingSheet ? (
              <p className="text-muted-foreground">Loading sheet...</p>
            ) : sheetView.data.length ? (
              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(sheetView.data[0]).map((col) => (
                          <TableHead key={col}>{col}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sheetView.data.map((row, idx) => (
                        <TableRow key={idx}>
                          {Object.values(row).map((val, i) => (
                            <TableCell key={i}>{val}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <p className="text-muted-foreground">No data available</p>
            )}
          </div>
        ) : (
          <Tabs defaultValue="workflows">
            <TabsList>
              <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
            </TabsList>

            <TabsContent value="workflows">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Play className="h-5 w-5 text-green-500" />
                    <span>Active Workflows</span>
                    <Badge variant="secondary">{workflows.length}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Currently running workflows in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {workflows.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No active workflows
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {workflows.map((workflow) => (
                        <div
                          key={workflow.id}
                          className="border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold">{workflow.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {workflow.description}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openSheetView(workflow)}
                            >
                              Workspace
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
