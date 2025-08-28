#!/bin/bash

echo "🚀 Setting up Supabase Authentication for Portfolio Admin"
echo "========================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Checking environment variables...${NC}"

if [ -f ".env.local" ]; then
    source .env.local
    if [ -n "$VITE_SUPABASE_URL" ] && [ -n "$VITE_SUPABASE_ANON_KEY" ]; then
        echo -e "${GREEN}✅ Environment variables found${NC}"
        echo "   - VITE_SUPABASE_URL: ${VITE_SUPABASE_URL}"
        echo "   - VITE_SUPABASE_ANON_KEY: ${VITE_SUPABASE_ANON_KEY:0:20}..."
    else
        echo -e "${RED}❌ Environment variables missing${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ .env.local file not found${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 2: Database Setup Instructions${NC}"
echo "You need to run the following steps in your Supabase Dashboard:"
echo ""
echo -e "${YELLOW}1. Go to: ${VITE_SUPABASE_URL%/}/project/default/sql${NC}"
echo ""
echo -e "${YELLOW}2. Copy and paste the contents of:${NC}"
echo "   📄 supabase/migrations/001_initial_schema.sql"
echo "   📄 supabase/migrations/002_sample_data.sql"
echo ""
echo -e "${YELLOW}3. Run each migration file in the SQL Editor${NC}"
echo ""

echo -e "${BLUE}Step 3: Create Admin User${NC}"
echo "After running the migrations, create an admin user:"
echo ""
echo -e "${YELLOW}Option A - Via Supabase Dashboard:${NC}"
echo "1. Go to: ${VITE_SUPABASE_URL%/}/project/default/auth/users"
echo "2. Click 'Add User'"
echo "3. Email: ${VITE_ADMIN_EMAIL:-your-admin@email.com}"
echo "4. Password: [choose a secure password]"
echo "5. Click 'Create User'"
echo ""

echo -e "${YELLOW}Option B - Via SQL (after creating user in Auth):${NC}"
echo "Run this SQL to link the user to admin_users table:"
echo ""
echo "INSERT INTO admin_users (user_id, email, created_at)"
echo "VALUES ("
echo "  '[USER_UUID_FROM_AUTH_USERS]',"
echo "  '${VITE_ADMIN_EMAIL:-your-admin@email.com}',"
echo "  NOW()"
echo ");"
echo ""

echo -e "${BLUE}Step 4: Test Login${NC}"
echo "1. Start your development server: npm run dev"
echo "2. Navigate to the admin section"
echo "3. Use the credentials you created above"
echo ""

echo -e "${GREEN}🎯 Quick Links:${NC}"
echo "📊 Supabase Dashboard: ${VITE_SUPABASE_URL%/}/project/default"
echo "👥 Auth Users: ${VITE_SUPABASE_URL%/}/project/default/auth/users"
echo "🗄️ Database: ${VITE_SUPABASE_URL%/}/project/default/editor"
echo "📝 SQL Editor: ${VITE_SUPABASE_URL%/}/project/default/sql"
echo ""

echo -e "${YELLOW}📋 Troubleshooting:${NC}"
echo "• If login fails: Check that migrations are run AND admin user exists"
echo "• If 'Invalid credentials': Verify email/password in Supabase Auth"
echo "• If 'Not admin': Run the admin_users INSERT SQL above"
echo ""

read -p "Press Enter to continue..."
