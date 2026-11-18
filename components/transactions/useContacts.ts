"use client";

import { useEffect, useState } from "react";
import { getSavedContacts } from "@/app/transactions/actions";
import type { SavedContact } from "@/types/types";

export function useContacts() {
  const [contacts, setContacts] = useState<SavedContact[]>([]);
  const [contactId, setContactId] = useState("");

  useEffect(() => {
    getSavedContacts()
      .then(setContacts)
      .catch(() => setContacts([]));
  }, []);

  const contact = contacts.find((c) => String(c.id) === contactId)?.name ?? "";

  const addContact = (name: string, cuenta: string) => {
    const newContact: SavedContact = { id: Date.now(), name, email: cuenta };
    setContacts((prev) => [...prev, newContact]);
    setContactId(String(newContact.id));
  };

  return { contacts, contact, contactId, setContactId, addContact };
}
