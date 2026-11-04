"use client";

import type { Person } from "@/types";

export function PersonSelector({
  people,
  value,
  onChange,
  disabled = false
}: {
  people: Person[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="person-picker">
      <span>Browsing as</span>
      <select aria-label="Browsing as" value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}>
        {people.map((person) => <option value={person._id} key={person._id}>{person.name}</option>)}
      </select>
    </label>
  );
}
