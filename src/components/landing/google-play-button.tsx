import Image from "next/image";
import GooglePlay from "@/assets/google-play.svg"

const GooglePlayButton = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-white cursor-pointer rounded-lg px-4 md:px-4 py-2 md:py-1 hover:scale-105 transition-transform ease-in-out">
      <div className=" relative w-[140px] md:w-[145px] md:h-[42px] h-[40px]">
        <Image
          className=" object-contain"
          fill
          src={GooglePlay}
          alt="Google Play"
        />
      </div>
    </div>
  );
};

export default GooglePlayButton;
