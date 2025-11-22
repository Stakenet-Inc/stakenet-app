import localFont from "next/font/local";

const neuePower = localFont({
  src: [{ path: "../../fonts/neue-power.ttf" }],
  variable: "--font-neuePower",
});
const archivo = localFont({
  src: [{ path: "../../fonts/archivo.ttf" }],
  variable: "--font-archivo",
});

export { archivo, neuePower };

