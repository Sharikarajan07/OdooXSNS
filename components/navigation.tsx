"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Map, Calendar, Search, User, Compass } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Compass },
  { label: "My Trips", href: "/trips", icon: Map },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Search", href: "/search", icon: Search },
]

export function Navigation() {
  const pathname = usePathname()

  // Don't show navigation on the landing page/login page
  if (pathname === "/") return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Compass className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">GlobeTrotter</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/profile" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <span className="hidden text-sm font-medium sm:inline-block">John Doe</span>
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t bg-background md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 text-[10px] font-medium transition-colors hover:text-primary",
                pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
