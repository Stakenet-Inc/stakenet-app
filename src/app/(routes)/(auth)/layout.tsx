import DarkVeil from "@/components/common/dark-veil";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  if (user) redirect("/analyze");

  return (
    <div className=" relative w-full h-screen">
      <aside className=" absolute w-full h-full">
        <DarkVeil hueShift={70} noiseIntensity={0.02} />
      </aside>
      {children}
    </div>
  );
}
