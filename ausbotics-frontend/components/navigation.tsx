"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sun, Moon } from "lucide-react";
import { Bot, Menu, X } from "@/components/simple-icons";
import { useAuth } from "@/contexts/auth-context";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { ModeToggle } from "./Modetoggle";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [bgStyle, setBgStyle] = React.useState<{ width: number; left: number }>(
    { width: 0, left: 0 }
  );

  const { user, isLoading, hasWorkflowSubscriptions } = useAuth();
  const { theme, setTheme } = useTheme();

  const isDashboard = pathname.startsWith("/dashboard");

  // Marketing nav items
  const marketingNavItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How It Works" },

    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  // Dashboard nav items
  const dashboardNavItems = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/workflows", label: "Workflows" },
    { href: "/dashboard/appointments", label: "Appointments" },
    { href: "/dashboard/settings", label: "Settings" },
  ];

  const navItems = isDashboard ? dashboardNavItems : marketingNavItems;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md shadow-sm dark:shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={isDashboard ? "/dashboard" : "/"}
            className="flex items-center gap-2"
          >
            <div className="bg-primary rounded-lg p-2 shadow-sm">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Ausbotics</span>
          </Link>

          <div
            className="hidden md:flex items-center gap-6 relative"
            ref={navRef}
          >
            <motion.div
              className="absolute top-0 h-full bg-zinc-200/70 dark:bg-zinc-700/50 rounded-md pointer-events-none z-0"
              style={{ width: bgStyle.width, left: bgStyle.left }}
              transition={{
                type: "tween",
                ease: "easeOut",
                duration: 0.35,
              }}
            />
            <NavigationMenu>
              <NavigationMenuList className="flex gap-6 relative z-10">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <NavigationMenuItem key={item.href}>
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={clsx(
                            "px-3 py-2 rounded-md transition-colors",
                            isActive
                              ? "text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 font-medium"
                              : "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground"
                          )}
                        >
                          {item.label}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <ModeToggle />

            {!isLoading &&
              (user ? (
                <>
                  {!isDashboard && (
                    <>
                      <Button asChild variant="ghost">
                        <Link href="/demo">See Demo</Link>
                      </Button>
                      <Button asChild variant="ghost">
                        <Link href="/book">Book Schedule</Link>
                      </Button>
                      {true && (
                        <Button asChild variant="ghost">
                          <Link href="/dashboard">Dashboard</Link>
                        </Button>
                      )}
                    </>
                  )}
                  <ProfileDropdown />
                </>
              ) : (
                !isDashboard && (
                  <>
                    <Button asChild variant="ghost">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link href="/demo">See Demo</Link>
                    </Button>
                    <Button asChild variant="ghost">
                      <Link href="/book">Book Schedule</Link>
                    </Button>
                  </>
                )
              ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>

            {/* Theme Toggle Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "block px-3 py-2 rounded-md transition-colors",
                    pathname === item.href
                      ? "text-primary font-medium"
                      : "text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Auth Buttons (Mobile) */}
              {!isLoading &&
                (user ? (
                  <>
                    {!isDashboard && (
                      <>
                        <Button className="w-full" asChild variant="ghost">
                          <Link href="/demo">See Demo</Link>
                        </Button>
                        {true && (
                          <Button className="w-full" asChild variant="ghost">
                            <Link href="/dashboard">Dashboard</Link>
                          </Button>
                        )}
                      </>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">
                        Welcome, {user.fullName || user.email}
                      </span>
                      <ProfileDropdown />
                    </div>
                  </>
                ) : (
                  !isDashboard && (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                      <Button className="w-full" asChild variant="ghost">
                        <Link href="/demo">See Demo</Link>
                      </Button>
                      <Button className="w-full" asChild variant="ghost">
                        <Link href="/book">Book Schedule</Link>
                      </Button>
                    </>
                  )
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
