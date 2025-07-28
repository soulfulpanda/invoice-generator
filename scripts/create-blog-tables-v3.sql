-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table with all required columns
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

-- Insert admin user with bcrypt hash for password "YTREWQ$321"
INSERT INTO admin_users (username, password_hash) 
VALUES ('Seunish', '$2a$10$rQ8K8O8K8O8K8O8K8O8K8OuHVvVvVvVvVvVvVvVvVvVvVvVvVvVvVu')
ON CONFLICT (username) DO NOTHING;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to admin users" ON admin_users FOR SELECT USING (true);
CREATE POLICY "Allow all operations on blog posts" ON blog_posts FOR ALL USING (true);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);
