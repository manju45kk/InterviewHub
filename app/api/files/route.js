import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// Ensure this runs on the Node runtime so Buffer and binary bodies work correctly
export const runtime = "nodejs";

// For Vercel: Store files in database as base64, not filesystem
// This works on both local and Vercel deployments

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

    // Get file content
    const fileId = searchParams.get("id");
    if (fileId) {
      const rows = await sql`
        SELECT id, filename, originalname, filedata, uploadedat
        FROM files
        WHERE id = ${fileId}
      `;

      if (rows.length === 0) {
        return NextResponse.json(
          { success: false, message: "File not found" },
          { status: 404 }
        );
      }

      const file = rows[0];

      // file.filedata may be returned as Buffer/Uint8Array or as a base64 string
      let fileBuffer;
      let dataType = typeof file.filedata;
      try {
        if (typeof file.filedata === "string") {
          // stored as base64 string or hex - try base64 first
          try {
            fileBuffer = Buffer.from(file.filedata, "base64");
            if (fileBuffer.length === 0) throw new Error("empty after base64");
            dataType = "base64-string";
          } catch (e) {
            // fallback to binary string
            fileBuffer = Buffer.from(file.filedata, "binary");
            dataType = "binary-string";
          }
        } else if (file.filedata instanceof Uint8Array) {
          fileBuffer = Buffer.from(file.filedata);
          dataType = "uint8array";
        } else if (Buffer.isBuffer(file.filedata)) {
          fileBuffer = file.filedata;
          dataType = "buffer";
        } else {
          // fallback: try to coerce
          fileBuffer = Buffer.from(file.filedata || "", "binary");
          dataType = typeof file.filedata;
        }
      } catch (err) {
        console.error("Error converting filedata to buffer:", err);
        return NextResponse.json({ success: false, message: "Failed to decode file data", error: err.message }, { status: 500 });
      }

      // Debug mode: give metadata instead of binary
      if (searchParams.get("debug") === "1") {
        const head = fileBuffer.slice(0, 16).toString("hex");
        return NextResponse.json({
          success: true,
          id: file.id,
          originalname: file.originalname,
          uploadedat: file.uploadedat,
          dataType,
          bytes: fileBuffer.length,
          headHex: head,
        });
      }

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${file.originalname}"`,
          "Content-Length": String(fileBuffer.length),
          "Cache-Control": "public, max-age=3600",
        },
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

    // Validate file size (max 100MB for database storage on Vercel)
    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "File size exceeds 100MB limit" },
        { status: 400 }
      );
    }

    const originalName = file.name;
    const timestamp = Date.now();
    const filename = `${timestamp}-${originalName}`;

    // Convert file to Buffer and store binary in DB
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file info to database with binary data
    await sql`
      INSERT INTO files (filename, originalname, filedata, uploadedAt, uploadedBy)
      VALUES (${filename}, ${originalName}, ${buffer}, NOW(), ${uploadedBy})
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
