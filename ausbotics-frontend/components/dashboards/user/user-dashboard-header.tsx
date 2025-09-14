import { Bot, LogOut } from "@/components/simple-icons";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Home, Link } from "lucide-react";

export default function UserDashboardHeader() {
    const { signOut, user } = useAuth()
    return (<header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-primary rounded-lg p-2">
                            <Bot className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold">Ausbotics</span>
                    </Link>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/">
                            <Home className="h-4 w-4 mr-2" />
                            Home
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">
                        Welcome, {user?.fullName || user?.email}
                    </span>
                    <Button variant="outline" size="sm" onClick={signOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    </header>)
}