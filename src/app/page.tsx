import getCurrentSession from "@/server/auth/sessions";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await getCurrentSession();

  if (!user) {
    return redirect("/sign-in");
  }

  return redirect("/shop");
}
