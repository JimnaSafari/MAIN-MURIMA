import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Home, Building, Building2, MapPin, Truck, ShoppingBag, User, Settings, LogOut, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { useProfile } from "@/hooks/useProfile";
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const {
    user,
    signOut
  } = useAuth();
  const {
    data: profile
  } = useProfile();
  const navItems = [{
    href: "/",
    label: "Home",
    icon: Home
  }, {
    href: "/rentals",
    label: "House Rentals",
    icon: Building
  }, {
    href: "/office",
    label: "Office",
    icon: Building2
  }, {
    href: "/airbnb",
    label: "Airbnb Stays",
    icon: MapPin
  }, {
    href: "/movers",
    label: "Moving Services",
    icon: Truck
  }, {
    href: "/marketplace",
    label: "Marketplace",
    icon: ShoppingBag
  }, {
    href: "/about",
    label: "About Us",
    icon: User
  }, {
    href: "/contact",
    label: "Contact",
    icon: Building
  }];
  const isActive = (path: string) => location.pathname === path;
  return <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img src="/lovable-uploads/8e06edac-8894-46c3-9b37-ceaa1e503c5e.png" alt="Masskan Rima Logo" className="h-9 w-auto transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold text-blue-600">Masskan Rima</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => <Link key={item.href} to={item.href} className={`group relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(item.href) ? "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 shadow-sm border border-orange-200/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/80"}`}>
                <item.icon className={`h-4 w-4 transition-colors ${isActive(item.href) ? "text-orange-600" : "text-slate-500 group-hover:text-slate-700"}`} />
                <span className="font-medium">{item.label}</span>
                {isActive(item.href) && <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-orange-600 rounded-full"></div>}
              </Link>)}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || ""} />
                        <AvatarFallback>
                          {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {profile?.full_name && <p className="font-medium">{profile.full_name}</p>}
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </> : <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth">Register</Link>
                </Button>
              </>}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 mt-6">
                {navItems.map(item => <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>)}
                <hr className="my-4" />
                <div className="space-y-2">
                  {user ? <>
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                        <Link to="/profile" onClick={() => setIsOpen(false)}>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                        <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                          <Settings className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </> : <>
                      <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                        <Link to="/auth" onClick={() => setIsOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button size="sm" className="w-full" asChild>
                        <Link to="/auth" onClick={() => setIsOpen(false)}>
                          Register
                        </Link>
                      </Button>
                    </>}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>;
};
export default Navigation;
