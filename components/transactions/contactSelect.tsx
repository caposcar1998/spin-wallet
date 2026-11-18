"use client";

import type { SavedContact } from "@/types/types";

interface ContactSelectProps {
  contacts: SavedContact[];
  value: string;
  onChange: (id: string) => void;
  testId?: string;
}

export function ContactSelect({ contacts, value, onChange, testId }: ContactSelectProps) {
  return (
    <select
      data-testid={testId}
      required
      name="Contacto"
      value={value}
      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none block w-full px-3.5 py-2.5 shadow-sm transition-shadow"
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Selecciona un contacto</option>
      {contacts.map((contact) => (
        <option key={contact.id} value={contact.id}>
          {contact.name}
        </option>
      ))}
      <option value="new">Nuevo contacto</option>
    </select>
  );
}
