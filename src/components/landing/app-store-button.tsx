import AppStore from "@/assets/app-store.svg";
import Image from "next/image";

const AppStoreButton = () => {
  return (
    <div className="flex flex-col justify-center items-center bg-white cursor-pointer rounded-lg pl-4 pr-1 md:pr-0 md:pl-3 py-2 md:py-1 hover:scale-105 transition-transform ease-in-out">
      <div className=" relative w-[140px] md:w-[145px] md:h-[42px] h-[40px]">
        <Image
          className=" object-contain"
          fill
          src={AppStore}
          alt="Google Play"
        />
      </div>
    </div>
  );
};

export default AppStoreButton;
