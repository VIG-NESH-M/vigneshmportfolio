#!/bin/bash

# Supabase Portfolio Setup Script
echo "🚀 Setting up Supabase for your portfolio..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local file"
    echo "⚠️  Please edit .env.local with your Supabase credentials"
else
    echo "✅ .env.local already exists"
fi

# Check if @supabase/supabase-js is installed
if ! npm list @supabase/supabase-js > /dev/null 2>&1; then
    echo "📦 Installing Supabase dependencies..."
    npm install @supabase/supabase-js @types/node
    echo "✅ Dependencies installed"
else
    echo "✅ Supabase dependencies already installed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a Supabase project at https://supabase.com"
echo "2. Update .env.local with your project credentials"
echo "3. Run the SQL migrations in your Supabase Dashboard:"
echo "   - supabase/migrations/001_initial_schema.sql"
echo "   - supabase/migrations/002_sample_data.sql"
echo "4. Create an admin user in Supabase Auth"
echo "5. Start using the Supabase hooks in your components!"
echo ""
echo "📖 See SUPABASE_SETUP.md for detailed instructions"
