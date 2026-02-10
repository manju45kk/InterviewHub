import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

/* ======================
   GET – Get all auth users
====================== */
export async function GET() {
  try {
    const users = await sql`
      SELECT id, username, email, role, createdAt 
      FROM users 
      ORDER BY createdAt DESC
    `;
    return NextResponse.json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

/* ======================
   POST – Create auth user
====================== */
export async function POST(req) {
  try {
    const body = await req.json();
    const { username, email, password, role = "user" } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["admin", "user"].includes(role)) {
      return NextResponse.json(
        { message: "Role must be 'admin' or 'user'" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await sql`
      SELECT id FROM users WHERE username = ${username} OR email = ${email}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "Username or email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO users (username, email, password, role, createdAt)
      VALUES (${username}, ${email}, ${hashedPassword}, ${role}, NOW())
      RETURNING id, username, email, role, createdAt
    `;

    return NextResponse.json(result[0]);
  } catch (err) {
    console.error("Error creating user - Full error:", err);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    
    return NextResponse.json(
      { 
        message: "Failed to create user",
        error: err.message 
      },
      { status: 500 }
    );
  }
}

/* ======================
   PUT – Update user role
====================== */
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, role } = body;

    if (!id || !role) {
      return NextResponse.json(
        { message: "User ID and role are required" },
        { status: 400 }
      );
    }

    if (!["admin", "user"].includes(role)) {
      return NextResponse.json(
        { message: "Role must be 'admin' or 'user'" },
        { status: 400 }
      );
    }

    const result = await sql`
      UPDATE users 
      SET role = ${role}
      WHERE id = ${id}
      RETURNING id, username, email, role, createdAt
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}

/* ======================
   DELETE – Delete auth user
====================== */
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await sql`
      DELETE FROM users WHERE id = ${id}
    `;

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
