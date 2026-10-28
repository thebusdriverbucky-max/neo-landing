"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { isOptimizableImage } from "@/lib/remote-images";

interface GalleryProps {
  content: {
    title: string;
    images: string[];
  };
}

export default function Gallery({ content }: GalleryProps) {
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
          {content.images.map((img, index) => (
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
                unoptimized={!isOptimizableImage(img)}
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
