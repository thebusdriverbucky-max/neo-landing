"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";

interface BookingFormProps {
  content: {
    title: string;
    subtitle: string;
    showDateField: boolean;
    buttonText: string;
  };
}

export default function BookingForm({ content }: BookingFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <section id="booking" className="section-padding bg-secondary/10">
      <div className="container-custom max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-10 md:p-16 rounded-3xl shadow-2xl border border-secondary/20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-primary mb-4">
              {content.title}
            </h2>
            <p className="text-foreground/60">
              {content.subtitle}
            </p>
          </div>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="text-5xl mb-6">✨</div>
              <h3 className="text-2xl font-serif text-primary mb-2">Thank You!</h3>
              <p className="text-foreground/60">We will contact you shortly.</p>
              <Button 
                variant="outline" 
                className="mt-8"
                onClick={() => setStatus("idle")}
              >
                Send Another Request
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-medium text-foreground/60 ml-1">Name</label>
                  <input
                    required
                    name="name"
                    type="text"
                    className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-medium text-foreground/60 ml-1">Email</label>
                  <input
                    required
                    name="email"
                    type="email"
                    className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-medium text-foreground/60 ml-1">Phone</label>
                  <input
                    required
                    name="phone"
                    type="tel"
                    className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                    placeholder="+1 234 567 890"
                  />
                </div>
                {content.showDateField && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-medium text-foreground/60 ml-1">Preferred Date</label>
                    <input
                      required
                      name="date"
                      type="date"
                      className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-medium text-foreground/60 ml-1">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all resize-none"
                  placeholder="Tell us more about your request..."
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full py-5"
                  variant="primary"
                >
                  {status === "loading" ? "Sending..." : content.buttonText}
                </Button>
                {status === "error" && (
                  <p className="text-red-500 text-sm mt-4 text-center">
                    Something went wrong. Please try again.
                  </p>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
