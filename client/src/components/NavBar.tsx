import React from "react";
import { Link, useLocation } from "react-router";
import { Bell, LogOut, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuthUser from "@/hook/useAuthUser";
import useLogout from "@/hook/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-30 h-15.5 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="p-3.5">
              <Link to="/" className="flex items-center gap-2.5">
                <Ship className="w-7 h-7 text-primary" />
                <span className="text-2xl font-bold font-mono bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent tracking-wider">
                  Stream
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* Notifications Button */}
            <Button variant="ghost" size="icon" asChild>
              <Link to="/notifications">
                <Bell className="h-6 w-6 text-muted-foreground" />
                <span className="sr-only">Notifications</span>
              </Link>
            </Button>

            {/* User Avatar */}
            <Avatar className="w-9 h-9">
              <AvatarImage src={authUser?.profilePic} alt="User Avatar" />
              <AvatarFallback>
                {authUser?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={logoutMutation}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-6 w-6" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
