import Image from "next/image";

const FeaturesMobile = () => {
    return (
        <section className=" w-full lg:hidden px-4 flex flex-col gap-8 pt-12 pb-20">
            <div>
                <div className=" relative w-full h-180">
                    <Image
                        fill
                        className=" object-contain"
                        src="/image/1.webp"
                        alt="Analyze your betslip"
                    />
                </div>
                <div className="mt-4 px-6">
                    <h4 className=" text-lg font-medium">Analyze Your Betslip</h4>
                    <p className=" text-sm text-muted-foreground text-balance">
                        Enter your booking code from any supported bookmaker to instantly retrieve and analyze your bet slip. Get comprehensive insights and predictions for all your selections in one place.
                    </p>
                </div>
            </div>
            <div>
                <div className=" relative w-full h-180">
                    <Image
                        fill
                        className=" object-contain"
                        src="/image/3.webp"
                        alt="Instant bet slip retrieval"
                    />
                </div>
                <div className="mt-4 px-6">
                    <h4 className=" text-lg font-medium">Instant Bet Slip Retrieval</h4>
                    <p className=" text-sm text-muted-foreground text-balance">
                        Seamlessly connect with popular bookmakers like Sportybet, Betway,
                        and more. Your bet slips are retrieved instantly with all match
                        details, odds, and selections perfectly organized.
                    </p>
                </div>
            </div>
            <div>
                <div className=" relative w-full h-180">
                    <Image
                        fill
                        className=" object-contain"
                        src="/image/4.webp"
                        alt="AI-Powered Match Predictions"
                    />
                </div>
                <div className="mt-4 px-6">
                    <h4 className=" text-lg font-medium">AI-Powered Match Predictions</h4>
                    <p className=" text-sm text-muted-foreground text-balance">
                        Get real-time match predictions based on advanced AI algorithms and historical data. Our system analyzes team performance, player statistics, and market trends to provide accurate and reliable predictions.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default FeaturesMobile;