# 📁 File Management System Setup Guide

This guide will help you set up and use the new file management feature in InterviewHub.

## Features Added

✅ **Admin File Upload** - Upload PDF files from the admin dashboard  
✅ **File List View** - View all uploaded files inside Admin dashboard  
✅ **PDF Viewer** - View/read PDF files directly in new window  
✅ **Dark Mode Support** - Works with your theme preference  
✅ **File Deletion** - Delete files from admin panel  
✅ **Vercel Compatible** - Files stored in database (not filesystem)  
✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile  

---

## Setup Steps

### 1. Update Database Table

Run the SQL commands from `FILE_MANAGEMENT_SETUP.sql` in your Neon database:

**If creating new table:**
```sql
CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL UNIQUE,
  originalname VARCHAR(255) NOT NULL,
  filedata BYTEA NOT NULL,
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploadedBy VARCHAR(100) DEFAULT 'admin',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**If migrating from old table (add filedata column):**
```sql
ALTER TABLE files ADD COLUMN filedata BYTEA NOT NULL DEFAULT '';
```

### 2. Restart Your App

```bash
npm run dev
```

### 3. Test File Upload

- Go to **Admin Dashboard** → **File Management**
- Upload a PDF file (max 10MB)
- Go to **My Files** to view it

---

## How to Use

### For Admins - Uploading Files

1. Go to **Admin Dashboard**
2. Click on **File Management** card
3. In the "Upload PDF File" section, click **Choose PDF File**
4. Select a PDF file (max 10MB)
5. Files appear instantly in the list

### View Uploaded Files

1. In Admin Dashboard, click **My Files** card
2. You'll see all uploaded PDF files
3. Click **👁️ View** to open any PDF in a new window
4. Use browser's PDF toolbar to navigate, zoom, search, save

### For Regular Users

- Regular users cannot access the admin panel
- Only admins can manage files through the admin dashboard

---

## File Storage

- **Location**: Neon PostgreSQL Database
- **Storage Method**: Base64 encoded BYTEA column
- **File Format**: PDF only
- **Max Size**: 100MB per file
- **Access**: Via `/api/files?id={fileId}` endpoint
- **Advantages**: Works on Vercel, no filesystem issues, scalable

---

## Dark Mode PDF Viewer

PDFs open in your browser's native PDF viewer, which automatically adjusts to your system's dark mode settings. No special styling needed.

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

### GET - Download/View File
```
GET /api/files?id=1
```

**Response:** PDF file as binary data with proper headers

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

### Issue: "Admin" link not showing in sidebar
- Make sure your user account has `role: "admin"` in the database
- Check that you're logged in
- Verify the session data includes the role

### Issue: File upload fails on Vercel
- ✅ Fixed! Files are now stored in the database, not the filesystem
- Check max file size is under 10MB
- Verify your database has the `filedata` column

### Issue: "Cannot find column filedata"
- Run the ALTER TABLE migration to add the column
- Or delete and recreate the files table

### Issue: Cannot connect to database
- Check your Neon DB connection string is correct
- Verify `process.env.DATABASE_URL` is set
- Test connection from your local machine first

### Issue: Old files lost after migration
- Old filesystem files are still in `/public/uploads` locally
- You need to manually migrate them to database by re-uploading or converting them

---

## Security Notes

⚠️ **Current Implementation:**
- Admin-only file uploads (controlled by session check)
- Files stored in database with timestamp prefixes to prevent collisions
- Base64 encoding prevents direct file access
- Database access requires valid session

💡 **Future Enhancements:**
- User role-based access control
- File permissions/sharing per user
- Virus scanning before upload
- Usage quotas per admin
- File versioning/history
- Audit logging for file operations

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
