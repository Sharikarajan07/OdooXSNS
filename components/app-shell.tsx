"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { cn } from "@/lib/utils"

interface AppShellProps {
    children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
    const pathname = usePathname()
    
    // Pages without sidebar margin (landing page, share pages)
    const isFullWidthPage = pathname === "/" || pathname.startsWith("/share/")

    return (
        <div className="flex min-h-screen">
            <Navigation />
            <main className={cn(
                "flex-1 transition-all duration-300",
                !isFullWidthPage && "md:ml-64",
                !isFullWidthPage && "pt-16 md:pt-0", // Account for mobile header
                !isFullWidthPage && "pb-16 md:pb-0"  // Account for mobile bottom nav
            )}>
                {children}
            </main>
        </div>
    )
}
