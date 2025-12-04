"use client"

import stakenetLogo from "@/assets/stakenet-icon.png";
import AppStoreButton from "@/components/landing/app-store-button";
import GooglePlayButton from "@/components/landing/google-play-button";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import Image from "next/image";
import { useEffect, useState } from "react";

const Hero = () => {
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
    return (
        <section className="w-full pt-20">
            <div className=" max-w-6xl mx-auto w-full flex flex-col items-center z-50 relative">
                <div className=" size-14 md:size-20 relative">
                    <Image
                        className=" object-contain"
                        fill
                        src={stakenetLogo}
                        alt="Stakenet logo"
                    />
                </div>
                <h1 className=" mt-2 text-3xl md:text-5xl font-semibold text-white text-center leading-none tracking-tight">
                    10X Bet Winning Rate with <br />
                    <LineShadowText className="italic text-nowrap text-green-500" shadowColor={"white"}>
                        AI Powered Predictions
                    </LineShadowText>
                </h1>
                <p className=" text-sm md:text-base text-balance text-muted-foreground leading-tight text-center max-w-xl mt-2">
                    Upload your bet slips, get instant AI analysis, and access expert match predictions. Powered by real-time data and advanced ML and analytics.
                </p>
                <div className="flex flex-row gap-3 mt-4 md:mt-6">
                    {(mobileOs === "ios" || mobileOs === "unknown") && (
                        <AppStoreButton />
                    )}
                    {(mobileOs === "android" || mobileOs === "unknown") && (
                        <GooglePlayButton />
                    )}
                </div>
            </div>
        </section>
    )
}

export default Hero;