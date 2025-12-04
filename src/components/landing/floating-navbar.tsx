"use client";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import AppStoreButton from "./app-store-button";
import GooglePlayButton from "./google-play-button";

export const FloatingNav = () => {
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(true);
  const [mobileOs, setMobileOs] = useState<"ios" | "android" | "unknown">(
    "unknown"
  );

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    if (/android/i.test(userAgent)) {
      setMobileOs("android");
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setMobileOs("ios");
    } else {
      setMobileOs("unknown");
    }
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex fixed top-2 2xl:top-4 w-full mx-auto px-3 xl:px-10 2xl:px-40 z-10"
        )}
      >
        <div className="w-full flex flex-row justify-between items-center">
          <Link href="/">
            <div className=" relative w-[152px] h-[42px] hover:scale-110 ease-in-out transition-all duration-200">
              <Image
                className=" object-contain"
                fill
                src="/images/logo.png"
                alt="Stakenet logo"
              />
            </div>
          </Link>

          <div className="flex flex-row gap-4">
            {(mobileOs === "ios" || mobileOs === "unknown") && (
              <AppStoreButton />
            )}
            {(mobileOs === "android" || mobileOs === "unknown") && (
              <GooglePlayButton />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
