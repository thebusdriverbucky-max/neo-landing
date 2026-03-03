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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"
        }`}
    >
      <div className="container-custom flex items-center justify-between px-4 md:px-6">
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
          className="md:hidden text-primary p-2 -mr-2"
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
            className={`absolute top-full left-0 right-0 shadow-xl p-6 md:hidden border-t border-black/5 ${isScrolled ? "bg-white" : "bg-white/80 backdrop-blur-lg"
              }`}
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
