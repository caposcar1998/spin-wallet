"use client";

import { useEffect, useState } from "react";
import { getSavedContacts, saveContact } from "@/app/transactions/actions";
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

  const addContact = async (name: string, cuenta: string) => {
    const newContact = await saveContact(name, cuenta);
    setContacts((prev) => [...prev, newContact]);
    setContactId(String(newContact.id));
  };

  return { contacts, contact, contactId, setContactId, addContact };
}
