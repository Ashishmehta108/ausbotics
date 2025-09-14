"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Bot, Menu, X } from "@/components/simple-icons";
import { useAuth } from "@/contexts/auth-context";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const navRef = React.useRef<HTMLDivElement>(null);
  const [bgStyle, setBgStyle] = React.useState<{ width: number; left: number }>(
    {
      width: 0,
      left: 0,
    }
  );

  const { user, isLoading, hasWorkflowSubscriptions } = useAuth();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  const showDashboard = user && hasWorkflowSubscriptions();
 
  const zincHover = "text-foreground";

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Ausbotics</span>
          </Link>

          <div
            className="hidden md:flex items-center gap-6 relative"
            ref={navRef}
          >
            <motion.div
              className="absolute top-0 h-full bg-zinc-200 dark:bg-zinc-800 rounded-md pointer-events-none z-0"
              style={{ width: bgStyle.width, left: bgStyle.left }}
              transition={{
                type: "tween",
                ease: "easeOut",
                duration: 0.35,
              }}
            />

            <NavigationMenu>
              <NavigationMenuList className="flex gap-6 relative z-10">
                {navItems.map((item, index) => (
                  <NavigationMenuItem key={item.href}>
                    <div
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="relative z-10"
                    >
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={clsx(
                            navigationMenuTriggerStyle(),
                            "px-3 py-2 rounded-md bg-transparent dark:hover:bg-zinc-800 hover:zinc-200"
                          )}
                        >
                          {item.label}
                        </NavigationMenuLink>
                      </Link>
                    </div>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoading &&
              (user ? (
                <>
                  <Button
                    asChild
                    className="bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Link href="/demo">See Demo</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Link href="/book">Book Schedule</Link>
                  </Button>
                  {showDashboard && (
                    <Button
                      asChild
                      className="bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  )}
                  <ProfileDropdown />
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    asChild
                    className="hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                  <Button
                    asChild
                    className="hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Link href="/demo">See Demo</Link>
                  </Button>
                  <Button
                    asChild
                    className="hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Link href="/book">Book Schedule</Link>
                  </Button>
                </>
              ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
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
                  className="block px-3 py-2 rounded-md text-muted-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Auth Buttons (Mobile) */}
              {!isLoading &&
                (user ? (
                  <>
                    <Button
                      className="w-full bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                      asChild
                    >
                      <Link href="/demo">See Demo</Link>
                    </Button>
                    {showDashboard && (
                      <Button
                        className="w-full bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                        asChild
                      >
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">
                        Welcome, {user.fullName || user.email}
                      </span>
                      <ProfileDropdown />
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                      asChild
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                      asChild
                    >
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                    <Button
                      className="w-full bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                      asChild
                    >
                      <Link href="/demo">See Demo</Link>
                    </Button>
                    <Button
                      className="w-full bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                      asChild
                    >
                      <Link href="/book">Book Schedule</Link>
                    </Button>
                  </>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
