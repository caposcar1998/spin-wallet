import { flow } from "./flow";
import type { User } from "@/types/types";

export async function getUser(): Promise<User> {
  return flow.user;
}

export async function getUsers(): Promise<User[]> {
  return [flow.user];
}
