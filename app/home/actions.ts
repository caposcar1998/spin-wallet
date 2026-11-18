import { apiGet } from "@/lib/api";
import { cacheLife, cacheTag } from "next/cache";

export interface Movement {
  id: number;
  description: string;
  amount: number;
  date: string;
  extra: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  balance: number;
  movements: Movement[];
}

export async function getUsers(): Promise<User[]> {
  const response = await apiGet("/users");
  const body = await response.json();
  return body.data;
}

export async function getUser(id: string): Promise<User> {
  "use cache";
  cacheLife("minutes");
  cacheTag("user");
  const response = await apiGet(`/user/${id}`);
  const body = await response.json();
  return body.data;
}
