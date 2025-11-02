# 💰 BudgetBuddy

A clean, full-stack app that helps users **track income and expenses** through a simple, interactive dashboard.  
Users can sign up, log in, and manage transactions with ease — all wrapped in a smooth, chocolate-orange theme with animated money rain on the homepage.

---

[Link to view project](https://web-production-cff1c.up.railway.app/)

![screenshot](/public/img/Screenshot%202025-11-02%20at%208.22.00 AM.png)

## 🚀 How It’s Made

**Tech Stack**
- HTML, CSS (Frontend)
- Node.js, Express (Server)
- MongoDB, Mongoose (Database)
- EJS (Templating Engine)
- Passport.js (Authentication)
- Railway (Deployment)

**How It Works**
- Users can register and log in using email and password (secured with bcrypt).  
- Once authenticated, each user can:
  - Add transactions (income or expense)
  - Include amount, category, date, and optional notes
  - View recent entries in a live-updating table
  - Delete transactions when needed  
- A sticky header, compact account card, and rich layout make the experience feel professional yet inviting.  
- The home page features a smooth **money-rain animation** with dollar signs.

---

## 🧠 Lessons Learned

Building BudgetBuddy strengthened my understanding of full-stack architecture — from database modeling to secure authentication and UI polish.  
I learned how to:
- Integrate **Passport.js** local strategy with hashed password storage  
- Structure routes for **protected access** using middleware  
- Deploy a full-stack app with environment variables and persistent sessions  
- Implement **CSS animations** without relying on JavaScript  
- Keep styling consistent across EJS templates using shared color variables and typography

---

## ⚡ Optimizations

- Unified fall-and-drift animation into one efficient keyframe for the dollar rain  
- Added accessibility handling with `prefers-reduced-motion` for reduced animation preference  
- Reduced repeated CSS selectors, normalized color codes, and refined form input spacing  
- Sticky header and sidebar for a tighter layout across desktop and mobile  
- Lightweight session handling and reduced unnecessary database writes  

---
