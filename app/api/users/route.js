import db from "@/lib/db";

/* ======================
   Get – Get user
====================== */
export async function GET() {
  const users = db.prepare("SELECT * FROM users").all();
  return Response.json({ users });
}

/* ======================
   Create – create user
====================== */

export async function POST(req) {
  try {
    const body = await req.json();

    const stmt = db.prepare(
      "INSERT INTO users (name, email, address) VALUES (?, ?, ?)"
    );

    const result = stmt.run(body.name, body.email, body.address);

    return Response.json({
      id: result.lastInsertRowid,
      name: body.name,
      email: body.email,
      address: body.address,
    });
  }
  catch (err) {
    console.log(err)
  }
}

/* ======================
   UPDATE – update user
====================== */

export async function PUT(req) {
  const body = await req.json();

  const stmt = db.prepare(
    `
    UPDATE users
    SET name = ?, email = ?, address = ?
    WHERE id = ?
    `
  );

  stmt.run(
    body.name,
    body.email,
    body.address,
    body.id
  );

  return Response.json({
    message: "User updated successfully",
  });
}

/* ======================
   DELETE – delete user
====================== */
export async function DELETE(req) {
  const { id } = await req.json();

  const stmt = db.prepare(
    "DELETE FROM users WHERE id = ?"
  );

  stmt.run(id);

  return Response.json({
    message: "User deleted successfully",
  });
}