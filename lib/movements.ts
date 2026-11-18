import type { Movement } from "@/types/types";

const createdMovements = new Map<string, Movement[]>();

export function addMovement(userId: string, movement: Movement) {
  const list = createdMovements.get(userId) ?? [];
  list.unshift(movement);
  createdMovements.set(userId, list);
}

export function getCreatedMovements(userId: string): Movement[] {
  return createdMovements.get(userId) ?? [];
}
