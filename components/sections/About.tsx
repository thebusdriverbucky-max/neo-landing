"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface AboutProps {
  content: {
    title: string;
    text: string;
    image: string;
    stats: { value: string; label: string }[];
  };
}

export default function About({ content }: AboutProps) {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            src={content.image || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80"}
            alt={content.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 border-[20px] border-white/10 pointer-events-none" />
        </motion.div>

        {/* Text Side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-secondary font-medium uppercase tracking-[0.3em] text-sm mb-4 block">
            Our Story
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-8 text-primary">
            {content.title}
          </h2>
          <p className="text-lg text-foreground/80 leading-relaxed mb-12 whitespace-pre-line">
            {content.text}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8">
            {content.stats.map((stat, index) => (
              <div key={index} className="text-center lg:text-left">
                <div className="text-3xl font-serif text-secondary mb-1">
                  {stat.value}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-foreground/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
