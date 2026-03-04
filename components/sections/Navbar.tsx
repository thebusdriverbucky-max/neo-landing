"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  content: {
    logoText?: string;
    logoImageUrl?: string;
    links: string[];
  };
}

export default function Navbar({ content }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full max-w-[100vw] overflow-x-clip z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
        ? "bg-white/90 backdrop-blur-md py-4 shadow-sm"
        : "bg-white/90 backdrop-blur-md py-4 shadow-sm md:bg-transparent md:py-6 md:shadow-none"
        }`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-8 md:px-12">
        <Link href="/" className="text-2xl font-serif font-bold tracking-tighter text-primary flex items-center">
          {content.logoImageUrl ? (
            <div className="relative h-8 md:h-10 w-auto aspect-[3/1]">
              <Image
                src={content.logoImageUrl}
                alt="Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          ) : (
            content.logoText || "LOGO"
          )}
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {content.links.map((link) => (
            <Link
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm uppercase tracking-widest font-medium hover:text-secondary transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full shadow-xl p-6 md:hidden border-t border-black/5 bg-white/95 backdrop-blur-md"
          >
            <div className="flex flex-col gap-4">
              {content.links.map((link) => (
                <Link
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-lg font-medium text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}