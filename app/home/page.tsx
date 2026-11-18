"use server";

import { getSession } from "@/lib/session";
import { getUser } from "./actions";
import UserData from "@/components/home/userData";
import Movements from "@/components/home/movements";

export default async function Home() {
  const session = await getSession();
  const user = session ? await getUser(session) : null;
  return (
    <div>
      <UserData />
      <div className="h-4"></div>
      <Movements />
    </div>
  );
}
