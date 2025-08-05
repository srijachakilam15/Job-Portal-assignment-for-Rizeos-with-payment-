JobPortal - Job & Networking Platform

A comprehensive full-stack job and networking platform built with Next.js, featuring AI-powered job matching, Web3 integration, real-time messaging, and more.

Features

- User Authentication: Secure registration and login for job seekers and employers
- Job Management: Post, search, and apply for jobs with advanced filtering
- Professional Networking: Connect with other professionals and build your network
- Real-time Messaging: Chat with connections and potential employers
- AI-Powered Matching: Get personalized job recommendations using OpenAI
##  Tech Stack
#Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Radix UI Components
- Framer Motion (animations)
- React Hook Form + Zod (forms & validation)

#Backend
- Next.js API Routes
- MongoDB with Mongoose
- NextAuth.js (authentication)
- Socket.io (real-time features)


 Installation

Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud instance)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd job-portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/job-portal

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# OpenAI
OPENAI_API_KEY=your-openai-api-key-here

### 4. Database Setup
Ensure MongoDB is running locally or update the `MONGODB_URI` to point to your MongoDB instance.

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.









- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Radix UI for accessible component primitives
- OpenAI for AI capabilities
- MongoDB for the database solution
