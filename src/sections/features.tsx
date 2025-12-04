"use client";

import { opacity, slideUp } from "@/anim";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const Features = () => {
  const featureOne = "Analyze Your Betslip";
  const featureTwo = "Instant Bet Slip Retrieval";
  const featureThree = "AI-Powered Match Predictions";

  const feature = useRef(null);
  const isInView = useInView(feature);

  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["40%", "-40%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["60%", "-60%"]);

  return (
    <section className="relative -mt-32 hidden lg:block">
      <div
        id="features"
        ref={targetRef}
        className=" relative h-[200vh] md:max-w-6xl mx-auto w-full"
      >
        <div className=" w-full grid grid-cols-1 md:grid-cols-3 gap-10 sticky top-0">
          <motion.div style={{ y }} className=" w-full h-fit flex flex-col">
            <div className=" relative w-full h-192">
              <Image
                fill
                className=" object-contain"
                src="/image/1.webp"
                alt="Feature One"
              />
            </div>
            <div ref={feature} className="flex flex-col items-start mt-8 px-4">
              <h4 className=" text-xl font-medium">
                {featureOne.split(" ").map((word, index) => {
                  return (
                    <span
                      key={index}
                      className=" relative overflow-hidden inline-flex mr-2"
                    >
                      <motion.span
                        variants={slideUp}
                        custom={index}
                        animate={isInView ? "open" : "closed"}
                        key={index}
                      >
                        {word}
                      </motion.span>
                    </span>
                  );
                })}
              </h4>
              <motion.p
                variants={opacity}
                animate={isInView ? "open" : "closed"}
                className="text-base text-muted-foreground"
              >
                Enter your booking code from any supported bookmaker to instantly
                retrieve and analyze your bet slip. Get comprehensive insights and
                predictions for all your selections in one place.
              </motion.p>
            </div>
          </motion.div>
          <motion.div style={{ y: y2 }} className=" w-full h-fit flex flex-col">
            <div className=" relative w-full h-192">
              <Image
                fill
                className=" object-contain"
                src="/image/3.webp"
                alt="Feature Two"
              />
            </div>
            <div ref={feature} className="flex flex-col items-start mt-8 px-4">
              <h4 className=" text-xl font-medium">
                {featureTwo.split(" ").map((word, index) => {
                  return (
                    <span
                      key={index}
                      className=" relative overflow-hidden inline-flex mr-2"
                    >
                      <motion.span
                        variants={slideUp}
                        custom={index}
                        animate={isInView ? "open" : "closed"}
                        key={index}
                      >
                        {word}
                      </motion.span>
                    </span>
                  );
                })}
              </h4>
              <motion.p
                variants={opacity}
                animate={isInView ? "open" : "closed"}
                className="text-base text-muted-foreground"
              >
                Seamlessly connect with popular bookmakers like Sportybet, Betway,
                and more. Your bet slips are retrieved instantly with all match
                details, odds, and selections perfectly organized.
              </motion.p>
            </div>
          </motion.div>
          <motion.div style={{ y: y3 }} className=" w-full h-fit flex flex-col">
            <div className=" relative w-full h-192">
              <Image
                fill
                className=" object-contain"
                src="/image/4.webp"
                alt="Feature Three"
              />
            </div>
            <div ref={feature} className="flex flex-col items-start mt-8 px-4">
              <h4 className=" text-xl font-medium">
                {featureThree.split(" ").map((word, index) => {
                  return (
                    <span
                      key={index}
                      className=" relative overflow-hidden inline-flex mr-2"
                    >
                      <motion.span
                        variants={slideUp}
                        custom={index}
                        animate={isInView ? "open" : "closed"}
                        key={index}
                      >
                        {word}
                      </motion.span>
                    </span>
                  );
                })}
              </h4>
              <motion.p
                variants={opacity}
                animate={isInView ? "open" : "closed"}
                className="text-base text-muted-foreground"
              >
                Get detailed match predictions powered by advanced AI analysis.
                View confidence levels, likely scores, and comprehensive statistics
                to make informed betting decisions with ease.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
