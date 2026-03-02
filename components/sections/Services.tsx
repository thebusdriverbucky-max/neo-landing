"use client";

import { motion } from "framer-motion";

interface ServicesProps {
  content: {
    title: string;
    items: { title: string; description: string; icon: string }[];
  };
}

export default function Services({ content }: ServicesProps) {
  return (
    <section id="services" className="section-padding bg-primary text-white">
      <div className="container-custom">
        <div className="text-center mb-20">
          <span className="text-secondary font-medium uppercase tracking-[0.3em] text-sm mb-4 block">
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl font-serif">
            {content.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {content.items.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-10 border border-white/10 rounded-2xl hover:bg-white/5 transition-colors group"
            >
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-2xl font-serif mb-4 text-secondary">
                {service.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
