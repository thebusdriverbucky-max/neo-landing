"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, MessageCircle } from "lucide-react";

interface ContactProps {
  content: {
    title: string;
    phone: string;
    email: string;
    address: string;
    workingHours: string;
    googleMapsUrl: string;
    whatsapp: string;
    instagram: string;
    facebook: string;
  };
}

export default function Contact({ content }: ContactProps) {
  const contactItems = [
    { icon: <Phone className="w-6 h-6" />, label: "Phone", value: content.phone, href: `tel:${content.phone}` },
    { icon: <Mail className="w-6 h-6" />, label: "Email", value: content.email, href: `mailto:${content.email}` },
    { icon: <MapPin className="w-6 h-6" />, label: "Address", value: content.address, href: content.googleMapsUrl || "#" },
    { icon: <Clock className="w-6 h-6" />, label: "Working Hours", value: content.workingHours, href: null },
  ];

  const socialLinks = [
    { icon: <MessageCircle className="w-6 h-6" />, href: content.whatsapp, label: "WhatsApp" },
    { icon: <Instagram className="w-6 h-6" />, href: content.instagram, label: "Instagram" },
    { icon: <Facebook className="w-6 h-6" />, href: content.facebook, label: "Facebook" },
  ].filter(link => link.href);

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-secondary font-medium uppercase tracking-[0.3em] text-sm mb-4 block"
          >
            Get In Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif text-primary"
          >
            {content.title}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {contactItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 hover:border-secondary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                {item.icon}
              </div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-foreground/40 mb-2">
                {item.label}
              </h3>
              {item.href ? (
                <a href={item.href} className="text-lg font-medium text-primary hover:text-secondary transition-colors">
                  {item.value}
                </a>
              ) : (
                <span className="text-lg font-medium text-primary">
                  {item.value}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {socialLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-20 flex flex-col items-center"
          >
            <h3 className="text-xs uppercase tracking-widest font-bold text-foreground/40 mb-8">
              Follow Us
            </h3>
            <div className="flex gap-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
