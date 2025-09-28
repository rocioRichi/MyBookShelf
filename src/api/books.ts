import { api } from "./https";
import type { Book } from "../types";

export async function fetchBooks(
  page = 1,
  limit = 10,
  filters: { title?: string; author?: string } = {},
  sort: { field?: "title" | "published" | "stock"; order?: "asc" | "desc" } = {}
) {
  const qs = new URLSearchParams({
    _page: String(page),
    _limit: String(limit),
  });

  if (filters.title) qs.set("title_like", filters.title);
  if (filters.author) qs.set("author_like", filters.author);

  if (sort.field) {
    qs.set("_sort", sort.field);
    qs.set("_order", sort.order || "asc");
  }

  const { data, headers } = await api<Book[]>(`/books?${qs.toString()}`);
  const total = Number(headers.get("x-total-count") || "0");
  return { data, total };
}

export async function getBook(id: number) {
  const { data } = await api<Book>(`/books/${id}`);
  return data;
}
export async function createBook(book: Book) {
  const { data } = await api<Book>("/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return data;
}
export async function updateBook(id: number, book: Book) {
  const { data } = await api<Book>(`/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return data;
}
export async function deleteBook(id: number) {
  await api<void>(`/books/${id}`, { method: "DELETE" });
}
