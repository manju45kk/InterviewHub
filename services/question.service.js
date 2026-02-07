import { toastBus } from "../utils";

const API_URL = "/api/questions";

export async function createQuestion(payload) {

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    toastBus.emit(data.message || "Failed to save question", "error");
    throw new Error(data.message || "Failed to save question");
  }

  toastBus.emit("Simple question saved successfully");
  return data;
}

export async function createBulkQuestions(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    toastBus.emit(data.message || "Bulk upload failed", "error");
    throw new Error(data.message || "Bulk upload failed");
  }

  toastBus.emit(`Saved ${data.count} questions`);
  return data;
}
