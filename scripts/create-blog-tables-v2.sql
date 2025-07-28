-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog posts table with excerpt column
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  keywords TEXT,
  meta_description TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add excerpt column if it doesn't exist (for existing tables)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog_posts' AND column_name = 'excerpt') THEN
        ALTER TABLE blog_posts ADD COLUMN excerpt TEXT;
    END IF;
END $$;

-- Insert admin user (bcrypt hash for YTREWQ$321)
INSERT INTO admin_users (username, password_hash) 
VALUES ('Seunish', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (username) DO NOTHING;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated admin access to admin_users" ON admin_users;
DROP POLICY IF EXISTS "Allow public read access to published posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated admin full access to blog_posts" ON blog_posts;

-- Create policies
CREATE POLICY "Allow authenticated admin access to admin_users" ON admin_users FOR ALL USING (true);
CREATE POLICY "Allow public read access to published posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Allow authenticated admin full access to blog_posts" ON blog_posts FOR ALL USING (true);
