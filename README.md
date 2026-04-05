# 📝 Blog App

A full-stack Blog Application built using modern web technologies. This app allows users to create, read, update, and delete blog posts with role-based access and authentication.

---

##  Live Demo

 Deployment Link: https://blog-app-scwd.vercel.app/signup  

---

## GitHub Repository

 GitHub Link: https://github.com/ainaali408/blog-app  

---

## Features

- User Authentication (Signup/Login)
- Role-based Access (Admin, Author, Viewer)
- Create, Edit, Delete Blog Posts
- Comment System
- AI-based Summary Generation
- Responsive UI

---

## AI Integration

- Used AI to generate blog summaries
- Optimized API usage by:
  - Generating summary only once
  - Storing summaries in database
  - Reducing unnecessary token usage

---

## Tech Stack

**Frontend:**
- Next.js
- Tailwind CSS

**Database:**
- Supabase

**Other Tools:**
- Cursor IDE (AI-assisted development)
- Git & GitHub
- Vercel (Deployment)

---

## Authentication Flow

- Users can sign up and log in
- Role-based permissions:
  - **Admin:** Manage all posts and comments
  - **Author:** Create and manage own posts
  - **Viewer:** View and comment on posts

---

## Bug Fix Example

**Issue:** Folder rename (`Lib` → `lib`) not reflecting in GitHub  
**Fix:**
```bash
git mv Lib temp
git mv temp lib
git commit -m "Rename folder"
git push
