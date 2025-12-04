"use client";

import { opacity, slideUp } from "@/anim";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const Features = () => {
  const featureOne = "Feature One";
  const featureTwo = "Feature Two";
  const featureThree = "Feature Three";

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
    <section className="relative -mt-20">
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
                src="/image/feature-one.png"
                alt="Feature One"
              />
            </div>
            <div ref={feature} className="flex flex-col items-start mt-8 px-4">
              <h4 className=" text-2xl font-semibold">
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
                className=" opacity-70 text-lg"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
                aliquid inventore consequatur totam nihil? Officia dolor iusto
                maxime labore corporis.
              </motion.p>
            </div>
          </motion.div>
          <motion.div style={{ y: y2 }} className=" w-full h-fit flex flex-col">
            <div className=" relative w-full h-192">
              <Image
                fill
                className=" object-contain"
                src="/image/feature-two.png"
                alt="Feature Two"
              />
            </div>
            <div ref={feature} className="flex flex-col items-start mt-8 px-4">
              <h4 className=" text-2xl font-semibold">
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
                className=" opacity-70 text-lg"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
                aliquid inventore consequatur totam nihil? Officia dolor iusto
                maxime labore corporis.
              </motion.p>
            </div>
          </motion.div>
          <motion.div style={{ y: y3 }} className=" w-full h-fit flex flex-col">
            <div className=" relative w-full h-192">
              <Image
                fill
                className=" object-contain"
                src="/image/feature-three.png"
                alt="Feature Three"
              />
            </div>
            <div ref={feature} className="flex flex-col items-start mt-8 px-4">
              <h4 className=" text-2xl font-semibold">
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
                className=" opacity-70 text-lg"
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
                aliquid inventore consequatur totam nihil? Officia dolor iusto
                maxime labore corporis.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
