# JobPortal - Job & Networking Platform

A comprehensive full-stack job and networking platform built with Next.js, featuring AI-powered job matching, Web3 integration, real-time messaging, and more.

## 🚀 Features

### Core Features
- **User Authentication**: Secure registration and login for job seekers and employers
- **Job Management**: Post, search, and apply for jobs with advanced filtering
- **Professional Networking**: Connect with other professionals and build your network
- **Real-time Messaging**: Chat with connections and potential employers
- **AI-Powered Matching**: Get personalized job recommendations using OpenAI

### Advanced Features
- **Web3 Integration**: Blockchain-based credential verification and NFT certificates
- **Payment Processing**: Stripe integration for subscriptions and job posting fees
- **File Management**: Cloudinary integration for resume and portfolio uploads
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Socket.io for live notifications and messaging

## 🛠️ Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Radix UI Components
- Framer Motion (animations)
- React Hook Form + Zod (forms & validation)

### Backend
- Next.js API Routes
- MongoDB with Mongoose
- NextAuth.js (authentication)
- Socket.io (real-time features)

### Integrations
- **AI**: OpenAI GPT for job matching and content generation
- **Web3**: Ethers.js for blockchain interactions
- **Payments**: Stripe for payment processing
- **Storage**: Cloudinary for file uploads
- **Email**: (To be configured based on preference)

## 📦 Installation

### Prerequisites
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

# Stripe (Optional - for payments)
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Cloudinary (Optional - for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Web3 (Optional - for blockchain features)
ALCHEMY_API_URL=your-alchemy-api-url
PRIVATE_KEY=your-private-key-for-smart-contracts

# Socket.io (Optional - for real-time features)
SOCKET_SERVER_URL=http://localhost:3001
```

### 4. Database Setup
Ensure MongoDB is running locally or update the `MONGODB_URI` to point to your MongoDB instance.

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
job-portal/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── jobs/          # Job-related endpoints
│   │   │   ├── messages/      # Messaging endpoints
│   │   │   └── ai/            # AI integration endpoints
│   │   ├── auth/              # Authentication pages
│   │   ├── jobs/              # Job-related pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── ui/                # Base UI components
│   │   ├── layout/            # Layout components
│   │   └── jobs/              # Job-specific components
│   ├── lib/                   # Utilities and configurations
│   ├── models/                # MongoDB models
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
└── package.json
```

## 🔑 Key API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User login (handled by NextAuth)

### Jobs
- `GET /api/jobs` - Get jobs with filtering and pagination
- `POST /api/jobs` - Create new job (employers only)
- `GET /api/jobs/[id]` - Get single job details
- `POST /api/jobs/[id]/apply` - Apply to a job

### AI Features
- `POST /api/ai/job-recommendations` - Get AI-powered job recommendations

### Messaging
- `GET /api/messages` - Get conversations
- `POST /api/messages` - Send message

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application can be deployed on any platform that supports Node.js applications:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS (EC2, Elastic Beanstalk)
- Google Cloud Platform

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@jobportal.com or create an issue in the GitHub repository.

## 🎯 Roadmap

- [ ] Video calling integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Advanced Web3 features (DAO governance)
- [ ] Multi-language support
- [ ] Advanced AI features (resume parsing, skill assessment)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Radix UI for accessible component primitives
- OpenAI for AI capabilities
- MongoDB for the database solution
