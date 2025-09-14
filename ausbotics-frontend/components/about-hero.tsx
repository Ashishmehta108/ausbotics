"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function AboutHero() {
  return (
    <section className="relative py-20 lg:py-32 bg-background overflow-hidden">
      {/* Decorative background shapes */}
      <motion.div
        className="absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Bringing the Power of{" "}
            <span className="text-primary">AI Automation</span> to Everyone
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            At Ausbotics, we're on a mission to bring the power of AI automation
            to everyone—from growing startups to everyday businesses. We believe
            technology should make life easier, not harder.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              size="lg"
              asChild
              className=" transition-transform"
            >
              <Link href="/demo" className="inline-flex items-center gap-2">
                See Our Technology in Action
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
