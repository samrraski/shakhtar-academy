import { redirect } from "next/navigation";

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:5173";

export default function AdminLayout() {
  redirect(ADMIN_URL);
}
