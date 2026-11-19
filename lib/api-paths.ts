export const USERS_PATH = "/users";
export const SAVED_CONTACTS_PATH = "/saved-contacts";

export function userPath(id: string | number): string {
  return `/user/${id}`;
}

export function userMovementsPath(id: string | number): string {
  return `/user/${id}/movements`;
}
