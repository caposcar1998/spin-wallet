import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useContacts } from "./useContacts";
import { getSavedContacts } from "@/app/transactions/actions";

vi.mock("@/app/transactions/actions", () => ({
  getSavedContacts: vi.fn(),
}));

const mockGetSavedContacts = vi.mocked(getSavedContacts);

const seed = [
  { id: 1, name: "hector", email: "hector@example.com" },
  { id: 2, name: "salmay", email: "salmay@example.com" },
];

describe("useContacts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSavedContacts.mockResolvedValue(seed);
  });

  it("loads the saved contacts on mount", async () => {
    const { result } = renderHook(() => useContacts());

    expect(result.current.contacts).toEqual([]);
    await waitFor(() => expect(result.current.contacts).toEqual(seed));
  });

  it("falls back to an empty list when the fetch fails", async () => {
    mockGetSavedContacts.mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useContacts());

    await waitFor(() => expect(mockGetSavedContacts).toHaveBeenCalled());
    expect(result.current.contacts).toEqual([]);
  });

  it("derives contact name from the selected id", async () => {
    const { result } = renderHook(() => useContacts());
    await waitFor(() => expect(result.current.contacts).toHaveLength(2));

    expect(result.current.contact).toBe("");

    act(() => result.current.setContactId("1"));
    expect(result.current.contact).toBe("hector");

    act(() => result.current.setContactId("2"));
    expect(result.current.contact).toBe("salmay");
  });

  it("returns empty contact for an unknown id", async () => {
    const { result } = renderHook(() => useContacts());
    await waitFor(() => expect(result.current.contacts).toHaveLength(2));

    act(() => result.current.setContactId("999"));
    expect(result.current.contact).toBe("");
  });

  it("addContact appends the contact and selects it", async () => {
    const { result } = renderHook(() => useContacts());
    await waitFor(() => expect(result.current.contacts).toHaveLength(2));

    act(() => result.current.addContact("nuevo", "nuevo@example.com"));

    expect(result.current.contacts).toHaveLength(3);
    const created = result.current.contacts[2];
    expect(created.name).toBe("nuevo");
    expect(created.email).toBe("nuevo@example.com");
    expect(result.current.contactId).toBe(String(created.id));
    expect(result.current.contact).toBe("nuevo");
  });
});
