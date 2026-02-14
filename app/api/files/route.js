import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const runtime = "nodejs";

const FILES_DIR = join(process.cwd(), "public", "uploads");

// Ensure uploads directory exists
async function ensureUploadDir() {
  if (!existsSync(FILES_DIR)) {
    const { mkdir } = require("fs/promises");
    await mkdir(FILES_DIR, { recursive: true });
  }
}

/* ================== GET (LIST FILES) ================== */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action === "list") {
      const rows = await sql`
        SELECT id, filename, originalname, uploadedAt, uploadedBy
        FROM files
        ORDER BY uploadedAt DESC
      `;

      return NextResponse.json({
        success: true,
        data: rows,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (err) {
    console.error("GET /api/files error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

/* ================== POST (UPLOAD FILE) ================== */
export async function POST(req) {
  try {
    await ensureUploadDir();

    const formData = await req.formData();
    const file = formData.get("file");
    const uploadedBy = formData.get("uploadedBy") || "admin";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type (only PDF)
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, message: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 50MB limit" },
        { status: 400 }
      );
    }

    const originalName = file.name;
    const timestamp = Date.now();
    const filename = `${timestamp}-${originalName}`;
    const filepath = join(FILES_DIR, filename);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    // Save file info to database
    await sql`
      INSERT INTO files (filename, originalname, uploadedAt, uploadedBy)
      VALUES (${filename}, ${originalName}, NOW(), ${uploadedBy})
    `;

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        filename,
        originalname: originalName,
        size: file.size,
      },
    });
  } catch (err) {
    console.error("POST /api/files error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

/* ================== DELETE FILE ================== */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("id");

    if (!fileId) {
      return NextResponse.json(
        { success: false, message: "File ID is required" },
        { status: 400 }
      );
    }

    // Get file info
    const rows = await sql`
      SELECT filename FROM files WHERE id = ${fileId}
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "File not found" },
        { status: 404 }
      );
    }

    const filename = rows[0].filename;
    const filepath = join(FILES_DIR, filename);

    // Delete file from disk
    try {
      await unlink(filepath);
    } catch (err) {
      console.error("Failed to delete file from disk:", err);
      // Continue with database deletion anyway
    }

    // Delete from database
    await sql`
      DELETE FROM files WHERE id = ${fileId}
    `;

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (err) {
    console.error("DELETE /api/files error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
