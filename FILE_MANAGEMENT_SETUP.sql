-- =====================================================
-- FILE MANAGEMENT SYSTEM - DATABASE SETUP
-- =====================================================
-- Run this SQL command in your Neon database to create the files table
-- Updated for Vercel: Files stored as base64 in database
-- =====================================================

CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL UNIQUE,
  originalname VARCHAR(255) NOT NULL,
  filedata BYTEA NOT NULL,
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploadedBy VARCHAR(100) DEFAULT 'admin',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_files_uploadedat ON files(uploadedAt DESC);
CREATE INDEX IF NOT EXISTS idx_files_uploadedby ON files(uploadedBy);

-- =====================================================
-- IF YOU ALREADY HAVE THE OLD TABLE, RUN THIS MIGRATION:
-- =====================================================
-- ALTER TABLE files ADD COLUMN filedata BYTEA;

-- =====================================================
-- VERIFY THE TABLE WAS CREATED
-- =====================================================
-- Run this query to verify:
-- SELECT id, filename, originalname, uploadedAt, uploadedBy FROM files;
