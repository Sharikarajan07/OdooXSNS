"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Map, Calendar, Search, User, Compass, Settings, LogOut, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: Compass },
    { label: "My Trips", href: "/trips", icon: Map },
    { label: "Calendar", href: "/calendar", icon: Calendar },
    { label: "Search", href: "/search", icon: Search },
]

export function Navigation() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, logout, isAuthenticated } = useAuth()

    // Don't show navigation on the landing page/login page or share pages
    if (pathname === "/" || pathname.startsWith("/share/")) return null

    const handleLogout = () => {
        logout()
        router.push("/")
    }

    const userInitials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2)
        : 'JT'

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-6 md:gap-10">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <div className="bg-primary/10 p-1.5 rounded-lg">
                            <Compass className="h-6 w-6 text-primary" />
                        </div>
                        <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            GlobeTrotter
                        </span>
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
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 outline-none">
                                <Avatar className="h-8 w-8 border-2 border-primary/20">
                                    <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="hidden text-sm font-medium sm:inline-block">
                                    {user?.name || "John Traveler"}
                                </span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">{user?.name || "John Traveler"}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email || "demo@globetrotter.com"}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/profile" className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/admin" className="cursor-pointer">
                                    <Shield className="mr-2 h-4 w-4" />
                                    Admin Dashboard
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                                "flex flex-col items-center gap-1 text-[10px] font-medium transition-colors hover:text-primary px-3 py-2",
                                pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground",
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    )
                })}
                <Link
                    href="/profile"
                    className={cn(
                        "flex flex-col items-center gap-1 text-[10px] font-medium transition-colors hover:text-primary px-3 py-2",
                        pathname === "/profile" ? "text-primary" : "text-muted-foreground",
                    )}
                >
                    <User className="h-5 w-5" />
                    Profile
                </Link>
            </nav>
        </header>
    )
}
