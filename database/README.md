# Database Setup Guide - Litein Municipal Board

## Overview
This folder contains all database scripts needed to set up and maintain the Litein Municipal Board system.

## Essential Files (Keep These)

### 1. **schema.sql** - Main Database Schema
   - Complete database structure
   - All tables, enums, indexes
   - Initial RLS policies
   - **Use this for fresh database setup**

### 2. **setup_complete.sql** - Complete Setup Script
   - Creates all tables
   - Adds missing columns and features
   - Sets up proper RLS policies for admin access
   - Seeds initial data
   - **Run this once to set up everything**

### 3. **seed_data.sql** - Sample Data
   - Test news articles
   - Sample activity logs
   - Demo users (optional)
   - **Run after schema setup for testing**

## Setup Instructions

### For Fresh Database:
```bash
# Step 1: Run the complete setup (includes schema + fixes + sample data)
Run: database/setup_complete.sql in Supabase SQL Editor

# Step 2: Create your admin user
Run: database/create_admin.sql (update email/password first)
```

### For Existing Database (Apply Fixes):
```bash
# If you already have tables but need fixes
Run: database/apply_fixes.sql
```

## File Categories

### Core Files (Essential - Keep)
- ✅ `schema.sql` - Base database structure
- ✅ `setup_complete.sql` - All-in-one setup script
- ✅ `seed_data.sql` - Sample data for testing
- ✅ `create_admin.sql` - Admin user creation
- ✅ `apply_fixes.sql` - Fixes for existing databases
- ✅ `README.md` - This file

### Migration Files (Optional - Keep for history)
- 📦 `migrations/` folder - Track database changes over time

### Development Files (Can be deleted after setup)
- ❌ All `check_*.sql` files - Temporary validation queries
- ❌ All `test_*.sql` files - Testing scripts
- ❌ All `update_*.sql` files - One-time updates (already in setup_complete.sql)
- ❌ All `insert_*.sql` files - Already in seed_data.sql
- ❌ All `add_*.sql` files - Already in setup_complete.sql
- ❌ All `fix_*.sql` files (except apply_fixes.sql) - Already consolidated
- ❌ All `sync_*.sql` files - One-time sync scripts
- ❌ `.md` files in database folder - Move to docs

## Quick Start

### Option 1: Brand New Database
1. Go to Supabase SQL Editor
2. Copy and paste contents of `setup_complete.sql`
3. Click Run
4. Update and run `create_admin.sql` with your admin credentials
5. Done! 🎉

### Option 2: Existing Database
1. Run `apply_fixes.sql` to update RLS policies and add missing features
2. Optionally run `seed_data.sql` for test data

## Maintenance

### Adding New Features
1. Update `schema.sql` with new table definitions
2. Add migration script to `migrations/` folder
3. Update `setup_complete.sql` to include new feature
4. Document changes in this README

### Backing Up
Before running any scripts, backup your database:
```sql
-- In Supabase Dashboard
-- Go to Database > Backups > Create Backup
```

## Support
For issues or questions, refer to the main project documentation.
