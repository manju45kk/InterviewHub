import { NextResponse } from "next/server";

// In-memory store (resets on server restart)
let quotes = [];

// CREATE (POST)
export async function POST(req) {
  const body = await req.json();

  const newQuote = {
    id: Date.now(),
    text: body.text,
    author: body.author || "Unknown",
  };

  quotes.push(newQuote);
  return NextResponse.json(newQuote);
}

// READ (GET)
export async function GET() {
  // If empty, fetch free quotes
  if (quotes.length === 0) {
    const res = await fetch("https://dummyjson.com/quotes?limit=5");
    const data = await res.json();

    quotes = data.quotes.map((q) => ({
      id: q.id,
      text: q.quote,
      author: q.author,
    }));
  }

  return NextResponse.json(quotes);
}

// UPDATE (PUT)
export async function PUT(req) {
  const body = await req.json();

  quotes = quotes.map((q) =>
    q.id === body.id ? { ...q, text: body.text } : q
  );

  return NextResponse.json({ success: true });
}

// DELETE (DELETE)
export async function DELETE(req) {
  const { id } = await req.json();

  quotes = quotes.filter((q) => q.id !== id);

  return NextResponse.json({ success: true });
}
