'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import {
  Bookmark,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Users,
  ExternalLink,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MatchScore from './MatchScore';

interface JobCardProps {
  job: {
    _id: string;
    title: string;
    description: string;
    company: {
      name: string;
      logo?: string;
      size?: string;
    };
    location: {
      city?: string;
      state?: string;
      country?: string;
      remote: boolean;
      hybrid: boolean;
    };
    salary?: {
      min?: number;
      max?: number;
      currency: string;
      period: string;
    };
    jobType: string;
    experience: string;
    skills: Array<{
      name: string;
      required: boolean;
    }>;
    createdAt: string;
    featured?: boolean;
    urgent?: boolean;
    views?: number;
  };
  onSave?: (jobId: string) => void;
  saved?: boolean;
  showMatchScore?: boolean;
  userProfile?: {
    bio?: string;
    skills?: string[];
  };
}

export default function JobCard({ 
  job, 
  onSave, 
  saved = false, 
  showMatchScore = false, 
  userProfile 
}: JobCardProps) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(saved);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    // Check if user has already applied to this job
    checkApplicationStatus();
  }, [job._id, session]);

  const checkApplicationStatus = async () => {
    if (!session?.user) return;
    
    try {
      const response = await fetch(`/api/jobs/${job._id}/application-status`);
      if (response.ok) {
        const data = await response.json();
        setHasApplied(data.hasApplied);
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleApply = async () => {
    if (!session?.user) {
      // Redirect to login
      window.location.href = '/auth/signin';
      return;
    }

    setIsApplying(true);
    try {
      const response = await fetch(`/api/jobs/${job._id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setHasApplied(true);
        // Show success message
        alert('Application submitted successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      alert('Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(job._id);
  };

  const formatSalary = () => {
    if (!job.salary?.min && !job.salary?.max) return null;
    
    const { min, max, currency, period } = job.salary;
    const formatAmount = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    if (min && max) {
      return `${formatAmount(min)} - ${formatAmount(max)} per ${period}`;
    } else if (min) {
      return `From ${formatAmount(min)} per ${period}`;
    } else if (max) {
      return `Up to ${formatAmount(max)} per ${period}`;
    }
    return null;
  };

  const formatLocation = () => {
    const { city, state, country, remote, hybrid } = job.location;
    let location = '';
    
    if (city) location += city;
    if (state) location += (location ? ', ' : '') + state;
    if (country && !state) location += (location ? ', ' : '') + country;
    
    if (remote) {
      location = location ? `${location} (Remote)` : 'Remote';
    } else if (hybrid) {
      location = location ? `${location} (Hybrid)` : 'Hybrid';
    }
    
    return location || 'Location not specified';
  };

  return (
    <Card className={`group hover:shadow-lg transition-shadow duration-200 ${
      job.featured ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {job.company.logo ? (
              <img
                src={job.company.logo}
                alt={`${job.company.name} logo`}
                className="w-12 h-12 object-cover rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-gray-500" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  <Link href={`/jobs/${job._id}`}>
                    {job.title}
                  </Link>
                </h3>
                {job.featured && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Featured
                  </span>
                )}
                {job.urgent && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Urgent
                  </span>
                )}
              </div>
              <p className="text-gray-600 font-medium">{job.company.name}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {formatLocation()}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                </div>
                {job.views && (
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {job.views} views
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className={`transition-colors ${
              isSaved ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        {/* Match Score for Job Seekers */}
        {showMatchScore && userProfile && session?.user?.role === 'jobseeker' && (
          <MatchScore
            jobDescription={job.description}
            candidateBio={userProfile.bio || ''}
            skills={userProfile.skills || []}
            className="mb-4"
          />
        )}

        <p className="text-gray-700 text-sm line-clamp-3 mb-3">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded">
            {job.jobType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded">
            {job.experience.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          {job.company.size && (
            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded">
              {job.company.size} employees
            </span>
          )}
        </div>

        {job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {job.skills.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-1 rounded ${
                  skill.required
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {skill.name}
              </span>
            ))}
            {job.skills.length > 5 && (
              <span className="text-xs text-gray-500">
                +{job.skills.length - 5} more
              </span>
            )}
          </div>
        )}

        {formatSalary() && (
          <div className="flex items-center text-sm text-gray-700">
            <DollarSign className="w-4 h-4 mr-1 text-green-600" />
            {formatSalary()}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/jobs/${job._id}`}>
            View Details
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </Button>
        
        {hasApplied ? (
          <Button size="sm" disabled variant="outline">
            <Check className="w-4 h-4 mr-2" />
            Applied
          </Button>
        ) : (
          <Button 
            size="sm" 
            onClick={handleApply}
            disabled={isApplying}
          >
            {isApplying ? 'Applying...' : 'Apply Now'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
