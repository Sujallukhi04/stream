import React from "react";
import { Link, useLocation } from "react-router";
import { Bell, Home, Ship, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import useAuthUser from "@/hook/useAuthUser";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const navigationItems = [
    {
      path: "/",
      icon: Home,
      label: "Home",
    },
    {
      path: "/friends",
      icon: Users,
      label: "Friends",
    },
    {
      path: "/notifications",
      icon: Bell,
      label: "Notifications",
    },
  ];

  return (
    <aside className="w-64 bg-background border-r border-border hidden lg:flex flex-col h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-3.5">
        <Link to="/" className="flex items-center gap-2.5">
          <Ship className="w-7 h-7 text-primary" />
          <span className="text-2xl font-bold font-mono bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent tracking-wider">
            Stream
          </span>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <Button
              key={item.path}
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start gap-3 px-3 h-10"
              asChild
            >
              <Link to={item.path}>
                <Icon className="w-5 h-5 text-muted-foreground" />
                <span>{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="mt-auto">
        <Separator />
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={authUser?.profilePic} alt="User Avatar" />
              <AvatarFallback>
                {authUser?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {authUser?.fullName || "User"}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-green-600 font-medium">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
