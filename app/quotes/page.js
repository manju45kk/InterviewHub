"use client";
import { useEffect, useState } from "react";
import "./quotes.css";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [newQuote, setNewQuote] = useState("");

  const fetchQuotes = async () => {
    const res = await fetch("/api/quotes");
    const data = await res.json();
    setQuotes(data);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const addQuote = async () => {
    if (!newQuote) return;

    await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newQuote }),
    });

    setNewQuote("");
    fetchQuotes();
  };

  const editQuote = async (id) => {
    const updatedText = prompt("Edit quote:");
    if (!updatedText) return;

    await fetch("/api/quotes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, text: updatedText }),
    });

    fetchQuotes();
  };

  const deleteQuote = async (id) => {
    await fetch("/api/quotes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchQuotes();
  };

  return (
    <div className="quotes-container">
      <h2 className="quotes-title">Quotes CRUD App</h2>

      <div className="quote-input-wrapper">
        <input
          className="quote-input"
          placeholder="Write a new quote..."
          value={newQuote}
          onChange={(e) => setNewQuote(e.target.value)}
        />
        <button className="btn btn-add" onClick={addQuote}>
          Add
        </button>
      </div>

      <ul className="quotes-list">
        {quotes.map((q) => (
          <li key={q.id} className="quote-item">
            <div>
              <div className="quote-text">"{q.text}"</div>
              <div className="quote-author">— {q.author}</div>
            </div>

            <div className="quote-actions">
              <button className="btn btn-edit" onClick={() => editQuote(q.id)}>
                Edit
              </button>
              <button
                className="btn btn-delete"
                onClick={() => deleteQuote(q.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
