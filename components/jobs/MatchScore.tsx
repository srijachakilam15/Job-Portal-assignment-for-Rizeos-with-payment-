'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Sparkles } from 'lucide-react';

interface MatchScoreProps {
  jobDescription: string;
  candidateBio: string;
  skills: string[];
  className?: string;
}

interface MatchResult {
  score: number;
  matchedSkills: string[];
  reasoning: string;
}

export default function MatchScore({ jobDescription, candidateBio, skills, className = '' }: MatchScoreProps) {
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateMatchScore();
  }, [jobDescription, candidateBio, skills]);

  const calculateMatchScore = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/match-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          candidateBio,
          skills,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMatchResult(result);
      } else {
        // Fallback to client-side calculation if API fails
        const fallbackResult = calculateFallbackScore();
        setMatchResult(fallbackResult);
      }
    } catch (error) {
      console.error('Error calculating match score:', error);
      // Fallback to client-side calculation
      const fallbackResult = calculateFallbackScore();
      setMatchResult(fallbackResult);
    } finally {
      setLoading(false);
    }
  };

  const calculateFallbackScore = (): MatchResult => {
    const jobWords = jobDescription.toLowerCase().split(/\W+/).filter(word => word.length > 2);
    const bioWords = candidateBio.toLowerCase().split(/\W+/).filter(word => word.length > 2);
    
    // Calculate skill matches
    const jobSkills = skills.map(skill => skill.toLowerCase());
    const matchedSkills = jobSkills.filter(skill => 
      jobDescription.toLowerCase().includes(skill) || 
      bioWords.some(word => word.includes(skill) || skill.includes(word))
    );

    // Calculate text similarity (simple approach)
    const commonWords = jobWords.filter(word => bioWords.includes(word));
    const textSimilarity = Math.min((commonWords.length / Math.max(jobWords.length, bioWords.length)) * 100, 50);
    
    // Calculate skill match score
    const skillScore = (matchedSkills.length / Math.max(jobSkills.length, 1)) * 50;
    
    // Combine scores
    const totalScore = Math.min(Math.round(textSimilarity + skillScore), 100);

    return {
      score: totalScore,
      matchedSkills: matchedSkills.map(skill => 
        skills.find(s => s.toLowerCase() === skill) || skill
      ),
      reasoning: generateReasoning(totalScore, matchedSkills.length, skills.length)
    };
  };

  const generateReasoning = (score: number, matchedCount: number, totalSkills: number): string => {
    if (score >= 80) {
      return `Excellent match! You have ${matchedCount} of the key skills and your background aligns well with the role.`;
    } else if (score >= 60) {
      return `Good match! You have ${matchedCount} relevant skills. Consider highlighting your transferable experience.`;
    } else if (score >= 40) {
      return `Moderate match. You have ${matchedCount} relevant skills. This could be a growth opportunity.`;
    } else {
      return `Limited match currently. Consider developing more of the required skills for better alignment.`;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className={`p-4 border rounded-lg bg-gray-50 ${className}`}>
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="w-4 h-4 text-gray-400 animate-pulse" />
          <span className="text-sm text-gray-500">Calculating AI match score...</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gray-400 h-2 rounded-full animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!matchResult) {
    return null;
  }

  return (
    <div className={`p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-gray-900">AI Match Score</span>
        </div>
        <div className={`text-2xl font-bold ${getScoreColor(matchResult.score)}`}>
          {matchResult.score}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(matchResult.score)}`}
            style={{ width: `${matchResult.score}%` }}
          ></div>
        </div>
      </div>

      {/* Reasoning */}
      <p className="text-sm text-gray-600 mb-3">
        {matchResult.reasoning}
      </p>

      {/* Matched Skills */}
      {matchResult.matchedSkills.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">
            Matched Skills ({matchResult.matchedSkills.length}):
          </p>
          <div className="flex flex-wrap gap-1">
            {matchResult.matchedSkills.slice(0, 5).map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-green-100 text-green-800"
              >
                {skill}
              </Badge>
            ))}
            {matchResult.matchedSkills.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{matchResult.matchedSkills.length - 5} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
