import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  Briefcase,
  Users,
  TrendingUp,
  Star,
  MapPin,
  Building,
  Clock,
  ArrowRight,
  Zap,
  Globe,
  Shield,
} from 'lucide-react';

export default function Home() {
  const featuredJobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $160k',
      type: 'Full-time',
      featured: true,
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$100k - $140k',
      type: 'Full-time',
      featured: true,
    },
    {
      id: '3',
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'New York, NY',
      salary: '$80k - $120k',
      type: 'Full-time',
      featured: true,
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Matching',
      description: 'Our advanced AI analyzes your profile and matches you with the perfect opportunities.',
    },
    {
      icon: Globe,
      title: 'Web3 Integration',
      description: 'Verify your credentials with blockchain technology and earn NFT certificates.',
    },
    {
      icon: Users,
      title: 'Professional Network',
      description: 'Connect with industry professionals and build meaningful relationships.',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security and privacy measures.',
    },
  ];

  const stats = [
    { label: 'Active Jobs', value: '50,000+', icon: Briefcase },
    { label: 'Companies', value: '10,000+', icon: Building },
    { label: 'Professionals', value: '1M+', icon: Users },
    { label: 'Success Rate', value: '95%', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Job with{' '}
              <span className="text-yellow-300">AI & Web3</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              The next-generation job portal that uses artificial intelligence and blockchain 
              technology to connect you with perfect opportunities.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg p-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Job title, keywords, or company"
                    className="pl-10 border-0 text-gray-900 text-lg"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="City, state, or remote"
                    className="pl-10 border-0 text-gray-900 text-lg"
                  />
                </div>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                  <Search className="w-5 h-5 mr-2" />
                  Search Jobs
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Browse All Jobs
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Post a Job
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
            <p className="text-xl text-gray-600">Discover opportunities at leading companies</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription>{job.company}</CardDescription>
                      </div>
                    </div>
                    {job.featured && (
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {job.type}
                    </div>
                    <div className="text-green-600 font-semibold">{job.salary}</div>
                  </div>
                  <Button className="w-full mt-4">Apply Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/jobs">
                View All Jobs
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose JobPortal?</h2>
            <p className="text-xl text-gray-600">Advanced features that set us apart</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="mb-3">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have found their dream jobs through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="text-blue-600 bg-white hover:bg-gray-100">
              Get Started as Job Seeker
            </Button>
            <Button size="lg" className="bg-blue-700 hover:bg-blue-800">
              Post Jobs as Employer
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
