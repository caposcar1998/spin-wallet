import type { SavedContact } from "@/types/types";

const createdContacts: SavedContact[] = [];

export function addSavedContact(contact: SavedContact) {
  createdContacts.push(contact);
}

export function getCreatedContacts(): SavedContact[] {
  return createdContacts;
}
