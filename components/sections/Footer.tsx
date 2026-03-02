"use client";

import { motion } from "framer-motion";

interface FooterProps {
  copyright?: string;
}

export default function Footer({ copyright }: FooterProps) {
  const defaultCopyright = `© ${new Date().getFullYear()} Business Name. All rights reserved.`;

  return (
    <footer className="py-12 bg-primary text-white/60 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container-custom flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="text-sm tracking-widest uppercase">
          {copyright || defaultCopyright}
        </div>

        <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em]">
          <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-secondary transition-colors">Cookies</a>
        </div>
      </motion.div>
    </footer>
  );
}
