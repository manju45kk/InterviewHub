import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

/* ================== GET ================== */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const skill = searchParams.get("skill");
    const concept = searchParams.get("concept");

    // ---- GET SKILLS ----
    if (type === "skills") {
      const rows = await sql`
        SELECT DISTINCT skill FROM questions
      `;

      return NextResponse.json({
        success: true,
        data: rows.map(r => r.skill),
      });
    }

    // ---- GET CONCEPTS ----
    if (type === "concepts" && skill) {
      const rows = await sql`
        SELECT DISTINCT concept
        FROM questions
        WHERE skill = ${skill}
      `;

      return NextResponse.json({
        success: true,
        data: rows.map(r => r.concept),
      });
    }

    // ---- GET QUESTIONS ----
    if (type === "questions" && skill && concept) {
      const rows = await sql`
        SELECT *
        FROM questions
        WHERE skill = ${skill}
          AND concept = ${concept}
      `;

      return NextResponse.json({
        success: true,
        count: rows.length,
        data: rows,
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

    // ---- BULK INSERT ----
    if (Array.isArray(body)) {
      await Promise.all(
        body.map((q, index) => {
          const { skill, concept, title, code, explanation, issinglequestionanswer } = q;

          if (!skill || !concept || !title || !explanation) {
            throw new Error(`Missing fields at index ${index}`);
          }

          return sql`
            INSERT INTO questions (skill, concept, title, code, explanation, issinglequestionanswer)
            VALUES (${skill}, ${concept}, ${title}, ${code}, ${explanation}, ${issinglequestionanswer})
          `;
        })
      );

      return NextResponse.json({
        success: true,
        message: "Bulk insert successful",
        count: body.length,
      });
    }

    // ---- SINGLE INSERT ----
    const { skill, concept, title, code, explanation, issinglequestionanswer } = body;

    if (!skill || !concept || !title || !explanation) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await sql`
      INSERT INTO questions (skill, concept, title, code, explanation, issinglequestionanswer )
      VALUES (${skill}, ${concept}, ${title}, ${code}, ${explanation}, ${issinglequestionanswer})
    `;

    return NextResponse.json({
      success: true,
      message: "Question added",
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

    const result = await sql`
      UPDATE questions
      SET skill = ${skill},
          concept = ${concept},
          title = ${title},
          code = ${code},
          explanation = ${explanation}
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Question updated",
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

    const result = await sql`
      DELETE FROM questions
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Question deleted",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
