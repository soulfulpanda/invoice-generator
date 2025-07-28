-- Create blog_posts table with all necessary columns
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  published BOOLEAN DEFAULT false,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Create index on published status for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Insert sample blog post if table is empty
INSERT INTO blog_posts (title, slug, content, excerpt, published, meta_title, meta_description)
SELECT 
  'Welcome to Our Blog',
  'welcome-to-our-blog',
  '# Welcome to Our Blog

This is your first blog post! You can edit or delete this post from the admin dashboard.

## Getting Started

To manage your blog:

1. Visit `/admin-dash` to access the admin dashboard
2. Login with your credentials
3. Create, edit, and publish blog posts
4. View your published posts at `/blog`

## Features

- **WYSIWYG Editor**: Write posts with a rich markdown editor
- **SEO Optimization**: Add meta titles and descriptions
- **Draft System**: Save drafts before publishing
- **Responsive Design**: Looks great on all devices

Happy blogging!',
  'Welcome to your new blog! Learn how to get started with creating and managing blog posts.',
  true,
  'Welcome to Our Blog - Getting Started Guide',
  'Learn how to use the blog management system to create and publish your first blog post.'
WHERE NOT EXISTS (SELECT 1 FROM blog_posts);
