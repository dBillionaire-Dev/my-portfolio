'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between transition-opacity">
        <Link href="/">
          <img
            src="/logo.png"             
            alt="Ebenezer Portfolio"
            className="w-15 h-12 hover:opacity-80 transition-opacity"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={`nav-link ${pathname === link.href ? 'text-primary' : ''}`}>
                {link.label}
              </span>
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
              <Link href="/admin">
                <span className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Admin
                </span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <span />
            </Link>
          )}
        </nav>

        {/* Mobile Menu Placeholder - keeping it simple*/}
        <div className="md:hidden">
          <Link href="/contact">
            <Button size="sm" variant="outline">Let's Talk</Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
