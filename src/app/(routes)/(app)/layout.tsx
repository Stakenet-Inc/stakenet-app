import { Navbar } from "@/components/common/navbar";
import { Sidebar } from "@/components/common/sidebar";
import { getServerSession } from "@/lib/get-session";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession();
  const user = session?.user;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Navbar />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
