-- =====================================================
-- FILE MANAGEMENT SYSTEM - DATABASE SETUP
-- =====================================================
-- Run this SQL command in your Neon database to create the files table
-- =====================================================

CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL UNIQUE,
  originalname VARCHAR(255) NOT NULL,
  uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploadedBy VARCHAR(100) DEFAULT 'admin',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_files_uploadedat ON files(uploadedAt DESC);
CREATE INDEX IF NOT EXISTS idx_files_uploadedby ON files(uploadedBy);

-- =====================================================
-- VERIFY THE TABLE WAS CREATED
-- =====================================================
-- Run this query to verify:
-- SELECT * FROM files;
