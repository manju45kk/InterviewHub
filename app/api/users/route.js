import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/* ======================
   GET – get users
====================== */
export async function GET() {
  const users = await sql`
    SELECT * FROM users
    ORDER BY id DESC
  `;

  return NextResponse.json({ users });
}

/* ======================
   POST – create user
====================== */
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, address } = body;

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO users (name, email, address)
      VALUES (${name}, ${email}, ${address})
      RETURNING id, name, email, address
    `;

    return NextResponse.json(result[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}

/* ======================
   PUT – update user
====================== */
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, name, email, address } = body;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE users
      SET name = ${name},
          email = ${email},
          address = ${address}
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User updated successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}

/* ======================
   DELETE – delete user
====================== */
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM users
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
