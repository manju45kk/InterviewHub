import { NextResponse } from "next/server";
import Database from "better-sqlite3";

const db = new Database("questions.db");

/* ---------- INIT TABLE ---------- */
db.prepare(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    skill TEXT,
    concept TEXT,
    title TEXT,
    code TEXT,
    explanation TEXT
  )
`).run();

/* ================== GET ================== */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const skill = searchParams.get("skill");
    const concept = searchParams.get("concept");

    if (type === "skills") {
      const rows = db.prepare(
        "SELECT DISTINCT skill FROM questions"
      ).all();

      return NextResponse.json({ success: true, data: rows.map(r => r.skill) });
    }

    if (type === "concepts" && skill) {
      const rows = db.prepare(
        "SELECT DISTINCT concept FROM questions WHERE skill = ?"
      ).all(skill);

      return NextResponse.json({ success: true, data: rows.map(r => r.concept) });
    }

    if (type === "questions" && skill && concept) {
      const rows = db.prepare(
        "SELECT * FROM questions WHERE skill = ? AND concept = ?"
      ).all(skill, concept);

      return NextResponse.json({
        success: true,
        count: rows.length,
        data: rows
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid query" },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

/* ================== POST (ADD) ================== */
export async function POST(req) {
  try {
    const body = await req.json();

    /* ---- BULK INSERT (ARRAY PAYLOAD) ---- */
    if (Array.isArray(body)) {
      const insert = db.prepare(`
        INSERT INTO questions (skill, concept, title, code, explanation)
        VALUES (?, ?, ?, ?, ?)
      `);

      const trx = db.transaction((list) => {
        list.forEach((q, index) => {
          const { skill, concept, title, code, explanation } = q;

          if (!skill || !concept || !title || !code || !explanation) {
            throw new Error(`Missing fields in item at index ${index}`);
          }

          insert.run(skill, concept, title, code, explanation);
        });
      });

      trx(body);

      return NextResponse.json({
        success: true,
        message: "Bulk insert successful",
        count: body.length
      });
    }

    /* ---- SINGLE INSERT ---- */
    const { skill, concept, title, code, explanation } = body;

    if (!skill || !concept || !title || !code || !explanation) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    db.prepare(`
      INSERT INTO questions (skill, concept, title, code, explanation)
      VALUES (?, ?, ?, ?, ?)
    `).run(skill, concept, title, code, explanation);

    return NextResponse.json({
      success: true,
      message: "Question added"
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}


/* ================== PUT (UPDATE) ================== */
export async function PUT(req) {
  try {
    const { id, skill, concept, title, code, explanation } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const result = db.prepare(`
      UPDATE questions
      SET skill = ?, concept = ?, title = ?, code = ?, explanation = ?
      WHERE id = ?
    `).run(skill, concept, title, code, explanation, id);

    if (result.changes === 0) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Question updated"
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

/* ================== DELETE ================== */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const result = db.prepare(
      "DELETE FROM questions WHERE id = ?"
    ).run(id);

    if (result.changes === 0) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Question deleted"
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
