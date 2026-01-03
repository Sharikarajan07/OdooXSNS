"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { 
    Map, Calendar, Search, User, Compass, Settings, LogOut, Shield, Plane, 
    ChevronLeft, ChevronRight, Plus, Home, LayoutDashboard, FolderOpen,
    Bell, HelpCircle, Menu, X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const mainNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Trips", href: "/trips", icon: Map },
    { label: "Calendar", href: "/calendar", icon: Calendar },
    { label: "Explore", href: "/search", icon: Search },
]

const secondaryNavItems = [
    { label: "Profile", href: "/profile", icon: User },
    { label: "Admin", href: "/admin", icon: Shield },
]

export function Navigation() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout } = useAuth()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    // Don't show navigation on the landing page/login page or share pages
    if (pathname === "/" || pathname.startsWith("/share/")) return null

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    const userInitials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2)
        : 'JT'

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={cn(
                "flex items-center gap-3 px-4 py-6 border-b border-blue-100/50",
                isCollapsed && "justify-center px-2"
            )}>
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                        <Plane className="h-5 w-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <span className="font-bold text-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            GlobeTrotter
                        </span>
                    )}
                </Link>
            </div>

            {/* New Trip Button */}
            <div className={cn("px-4 py-4", isCollapsed && "px-2")}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                asChild 
                                className={cn(
                                    "w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25",
                                    isCollapsed ? "px-2" : "px-4"
                                )}
                            >
                                <Link href="/trips/new" className="flex items-center gap-2">
                                    <Plus className="h-5 w-5" />
                                    {!isCollapsed && <span>New Trip</span>}
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        {isCollapsed && (
                            <TooltipContent side="right">
                                <p>New Trip</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                <p className={cn(
                    "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3",
                    isCollapsed && "hidden"
                )}>
                    Menu
                </p>
                <TooltipProvider>
                    {mainNavItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                            isActive 
                                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-blue-500/25" 
                                                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
                                            isCollapsed && "justify-center px-2"
                                        )}
                                    >
                                        <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-white")} />
                                        {!isCollapsed && <span>{item.label}</span>}
                                    </Link>
                                </TooltipTrigger>
                                {isCollapsed && (
                                    <TooltipContent side="right">
                                        <p>{item.label}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        )
                    })}
                </TooltipProvider>

                <div className={cn("pt-6", isCollapsed && "pt-4")}>
                    <p className={cn(
                        "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3",
                        isCollapsed && "hidden"
                    )}>
                        Settings
                    </p>
                    <TooltipProvider>
                        {secondaryNavItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Tooltip key={item.href}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                                isActive 
                                                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-blue-500/25" 
                                                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
                                                isCollapsed && "justify-center px-2"
                                            )}
                                        >
                                            <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-white")} />
                                            {!isCollapsed && <span>{item.label}</span>}
                                        </Link>
                                    </TooltipTrigger>
                                    {isCollapsed && (
                                        <TooltipContent side="right">
                                            <p>{item.label}</p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            )
                        })}
                    </TooltipProvider>
                </div>
            </nav>

            {/* User Profile Section */}
            <div className={cn(
                "border-t border-blue-100/50 p-4",
                isCollapsed && "p-2"
            )}>
                <div className={cn(
                    "flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors cursor-pointer",
                    isCollapsed && "justify-center p-2"
                )}>
                    <Avatar className="h-10 w-10 ring-2 ring-blue-200 ring-offset-2">
                        <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} />
                        <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm font-semibold">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                                {user?.name || "John Traveler"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email || "demo@globetrotter.com"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Logout Button */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={handleLogout}
                                className={cn(
                                    "mt-3 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors",
                                    isCollapsed && "justify-center px-2"
                                )}
                            >
                                <LogOut className="h-5 w-5" />
                                {!isCollapsed && <span>Logout</span>}
                            </button>
                        </TooltipTrigger>
                        {isCollapsed && (
                            <TooltipContent side="right">
                                <p>Logout</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:flex absolute -right-3 top-20 bg-white border border-blue-100 rounded-full p-1.5 shadow-lg hover:bg-blue-50 transition-colors"
            >
                {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                ) : (
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                )}
            </button>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={cn(
                "hidden md:flex fixed left-0 top-0 bottom-0 z-40 flex-col bg-white border-r border-blue-100/50 transition-all duration-300",
                isCollapsed ? "w-20" : "w-64"
            )}>
                <SidebarContent />
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-blue-100/50 flex items-center justify-between px-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/25">
                        <Plane className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-lg bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        GlobeTrotter
                    </span>
                </Link>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                    {isMobileOpen ? (
                        <X className="h-6 w-6 text-gray-600" />
                    ) : (
                        <Menu className="h-6 w-6 text-gray-600" />
                    )}
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div 
                    className="md:hidden fixed inset-0 z-40 bg-black/50"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={cn(
                "md:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-white border-r border-blue-100/50 transition-transform duration-300",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SidebarContent />
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white border-t border-blue-100/50 flex items-center justify-around px-2">
                {mainNavItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-[10px] font-medium transition-colors",
                                isActive 
                                    ? "text-blue-600 bg-blue-50" 
                                    : "text-gray-500 hover:text-blue-500"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>
        </>
    )
}
