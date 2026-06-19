import { redirect } from "next/navigation";

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || "http://localhost:5174";

export default function DashboardLayout() {
  redirect(PORTAL_URL);
}
