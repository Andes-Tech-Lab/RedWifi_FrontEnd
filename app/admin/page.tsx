import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";

export const metadata: Metadata = { title: "Admin · Chinkana WiFi", robots: { index: false } };

export default function Page() {
  return <AdminApp />;
}
