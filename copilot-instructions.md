<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Job & Networking Portal - Copilot Instructions

This is a comprehensive full-stack Job & Networking Portal similar to LinkedIn/Upwork with the following key features:

## Tech Stack
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, Radix UI, Framer Motion
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: NextAuth.js with JWT
- **Web3**: Ethers.js, Web3.js for blockchain integration
- **AI**: OpenAI GPT for job matching and content generation
- **Real-time**: Socket.io for chat and notifications
- **Payment**: Stripe for payment processing
- **File Upload**: Cloudinary for media management

## Core Features
1. **User Management**: Authentication, profiles, role-based access
2. **Job Portal**: Job posting, searching, applications, matching
3. **Networking**: Professional connections, messaging, groups
4. **Web3 Integration**: NFT credentials, blockchain verification
5. **AI Features**: Smart job matching, content generation, skill assessment
6. **Real-time**: Chat system, video calls, live notifications
7. **Payment System**: Subscription plans, job posting fees, freelance payments
8. **Analytics**: User activity tracking, job market insights

## Architecture Guidelines
- Follow Next.js 15 App Router patterns
- Use TypeScript strictly with proper type definitions
- Implement responsive design with Tailwind CSS
- Use Radix UI for accessible UI components
- Follow REST API design principles for API routes
- Implement proper error handling and validation
- Use middleware for authentication and authorization
- Follow security best practices for Web3 integration

## Code Style
- Use functional components with React hooks
- Implement proper loading states and error boundaries
- Use Zod for schema validation
- Follow clean code principles with proper separation of concerns
- Write comprehensive JSDoc comments for complex functions
- Use meaningful variable and function names
- Implement proper TypeScript interfaces and types
