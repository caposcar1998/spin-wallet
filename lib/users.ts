import { apiGet } from "@/lib/api";
import { roundMoney } from "@/lib/format";
import { getCreatedMovements } from "@/lib/movements";
import { cacheLife, cacheTag } from "next/cache";
import type { Movement, User } from "@/types/types";

export async function getUser(id: string): Promise<User> {
  "use cache";
  cacheLife("minutes");
  cacheTag("user");
  const response = await apiGet(`/user/${id}`);
  if (process.env.FAKE_ERROR_LOGIN === "true") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  const body = await response.json();
  const created = getCreatedMovements(id);
  return {
    ...body.data,
    balance: roundMoney(
      body.data.balance -
        created
          .filter((m) => m.status === "completed")
          .reduce((sum, m) => sum + m.amount, 0),
    ),
  };
}

export async function getUsers(): Promise<User[]> {
  if (process.env.FAKE_ERROR_LOGIN === "true") {
    return [];
  }
  const response = await apiGet("/users");
  const body = await response.json();
  return body.data;
}

export async function getMovements(id: string): Promise<Movement[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("user");
  const response = await apiGet(`/user/${id}/movements`);
  const body = await response.json();
  return [...getCreatedMovements(id), ...(body.data ?? [])];
}
