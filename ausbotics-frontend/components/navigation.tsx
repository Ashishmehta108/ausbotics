"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Bot } from "@/components/simple-icons"
import { useAuth } from "@/contexts/auth-context"
import { ProfileDropdown } from "@/components/profile-dropdown"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isLoading, hasWorkflowSubscriptions } = useAuth()

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ]

  const showDashboard = user && hasWorkflowSubscriptions()

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary rounded-lg p-2">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Ausbotics</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!isLoading && (
              <>
                {user ? (
                  // Show profile dropdown when user is signed in
                  <>
                    <Button asChild>
                      <Link href="/demo">See Demo</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/book">Book Schedule</Link>
                    </Button>
                    {showDashboard && (
                      <Button asChild className="bg-blue-600 hover:bg-blue-700">
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                    )}
                    <ProfileDropdown />
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/demo">See Demo</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/book">Book Schedule</Link>
                    </Button>
                    
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                {!isLoading && (
                  <>
                    {user ? (
                      // Mobile signed-in state
                      <>
                        <Button className="w-full" asChild>
                          <Link href="/demo">See Demo</Link>
                        </Button>
                        {showDashboard && (
                          <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                            <Link href="/dashboard">Dashboard</Link>
                          </Button>
                        )}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm text-muted-foreground">Welcome, {user.fullName || user.email}</span>
                          <ProfileDropdown />
                        </div>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button variant="outline" className="w-full bg-transparent" asChild>
                          <Link href="/signup">Sign Up</Link>
                        </Button>
                        <Button className="w-full" asChild>
                          <Link href="/demo">See Demo</Link>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
