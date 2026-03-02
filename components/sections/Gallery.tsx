"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface GalleryProps {
  content: {
    title: string;
    images: string[];
  };
}

export default function Gallery({ content }: GalleryProps) {
  // Fallback images if none provided
  const displayImages = content.images.length > 0 ? content.images : [
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80",
  ];

  return (
    <section id="gallery" className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-20">
          <span className="text-secondary font-medium uppercase tracking-[0.3em] text-sm mb-4 block">
            Visual Experience
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary">
            {content.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayImages.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-lg"
            >
              <Image
                src={img}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
