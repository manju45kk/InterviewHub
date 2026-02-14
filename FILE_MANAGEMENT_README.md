# 📁 File Management System Setup Guide

This guide will help you set up and use the new file management feature in InterviewHub.

## Features Added

✅ **Admin File Upload** - Upload PDF files from the admin dashboard  
✅ **File List View** - View all uploaded files in a dedicated page  
✅ **PDF Viewer** - View/read PDF files directly in the app  
✅ **Dark Mode Support** - PDF viewer respects your theme preference  
✅ **File Deletion** - Delete files from both admin and user views  
✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile  

---

## Setup Steps

### 1. Create Database Table

Run the SQL commands from `FILE_MANAGEMENT_SETUP.sql` in your Neon database:

```sql
CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL UNIQUE,
  originalname VARCHAR(255) NOT NULL,
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploadedBy VARCHAR(100) DEFAULT 'admin',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_files_uploadedat ON files(uploadedAt DESC);
CREATE INDEX IF NOT EXISTS idx_files_uploadedby ON files(uploadedBy);
```

### 2. Create Upload Directory

The app will automatically create the `/public/uploads` directory when you upload the first file. No manual setup needed!

### 3. Restart Your App

```bash
npm run dev
```

---

## How to Use

### For Admins - Uploading Files

1. Go to **Admin Dashboard**
2. Click on **File Management** card
3. In the "Upload PDF File" section, click **Choose PDF File**
4. Select a PDF file (max 50MB)
5. Files appear instantly in the "Uploaded Files" list

### For Users - Viewing Files

1. Click **My Files** in the sidebar
2. You'll see all uploaded PDF files as cards
3. Click on any file to view it
4. Use the PDF toolbar to:
   - Navigate pages
   - Zoom in/out
   - Search within PDF
   - Save/print the PDF

### File Deletion

- **From Admin**: Go to File Management → Click 🗑️ Delete on any file
- **From My Files**: Click 🗑️ Delete on the file card or in the PDF viewer

---

## File Storage

- **Location**: `/public/uploads/`
- **File Format**: PDF only
- **Max Size**: 50MB per file
- **Access**: Direct download via `/uploads/[filename]`

---

## Dark Mode PDF Viewer

The PDF viewer automatically applies a subtle inversion filter in dark mode to maintain readability while preserving colors. You can see this in:

```css
/* In CodePlayground.css */
body.dark .pdf-iframe {
  filter: invert(1) hue-rotate(180deg);
}
```

---

## API Endpoints

### GET - List Files
```
GET /api/files?action=list
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "filename": "1707000000000-document.pdf",
      "originalname": "document.pdf",
      "uploadedat": "2024-02-04T10:00:00Z",
      "uploadedby": "admin"
    }
  ]
}
```

### POST - Upload File
```
POST /api/files
Content-Type: multipart/form-data

file: [PDF file]
uploadedBy: "admin"
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "1707000000000-document.pdf",
    "originalname": "document.pdf",
    "size": 2048576
  }
}
```

### DELETE - Delete File
```
DELETE /api/files?id=1
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## Troubleshooting

### Issue: "Cannot POST /api/files"
- Make sure Node.js runtime is enabled: `export const runtime = "nodejs";`
- Restart your app: `npm run dev`

### Issue: File upload fails
- Check file is a valid PDF
- Verify file size is under 50MB
- Check browser console for error messages
- Ensure `/public/uploads` directory exists (will be created auto)

### Issue: PDF doesn't display
- Browser might not support PDF iframe
- Try downloading the PDF instead
- Check CORS settings if using remote storage

### Issue: Dark mode PDF looks strange
- This is normal! The inversion filter preserves functionality
- You can disable it by removing the filter from CSS if preferred

---

## Security Notes

⚠️ **Current Implementation:**
- Admin-only file uploads (controlled by session check)
- Files stored in `/public/uploads` (publicly accessible)
- No encryption or special security measures

💡 **Future Enhancements:**
- User role-based access control
- File encryption
- Virus scanning (e.g., ClamAV)
- Usage quotas per user
- File versioning/history
- Document watermarking

---

## File Structure

```
app/
├── api/
│   └── files/
│       └── route.js          (File upload/delete/list endpoints)
├── myfiles/
│   ├── page.js               (My Files view with PDF viewer)
│   └── myfiles.css           (Styles for My Files)
└── admin/
    └── page.js               (Updated with file upload section)

public/
└── uploads/                  (PDF files stored here)
    └── [timestamp]-[name].pdf

FILE_MANAGEMENT_SETUP.sql    (Database setup instructions)
```

---

## Next Steps

1. ✅ Run the SQL setup command
2. ✅ Restart your app
3. ✅ Go to Admin → File Management
4. ✅ Upload a test PDF
5. ✅ Visit My Files to view it
6. ✅ Test dark mode toggle

Enjoy your new file management system! 🎉
