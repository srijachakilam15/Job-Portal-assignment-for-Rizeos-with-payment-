import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface MatchScoreRequest {
  jobDescription: string;
  candidateBio: string;
  skills: string[];
}

interface MatchResult {
  score: number;
  matchedSkills: string[];
  reasoning: string;
  keywordMatches: number;
  skillMatches: number;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { jobDescription, candidateBio, skills }: MatchScoreRequest = await request.json();

    if (!jobDescription || !candidateBio) {
      return NextResponse.json(
        { error: 'Job description and candidate bio are required' },
        { status: 400 }
      );
    }

    // Try OpenAI first (if API key is available)
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
      try {
        const aiResult = await calculateAIMatchScore(jobDescription, candidateBio, skills);
        return NextResponse.json(aiResult);
      } catch (error) {
        console.error('OpenAI API error:', error);
        // Fall back to rule-based calculation
      }
    }

    // Rule-based calculation as fallback
    const result = calculateRuleBasedMatchScore(jobDescription, candidateBio, skills);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Match score calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate match score' },
      { status: 500 }
    );
  }
}

async function calculateAIMatchScore(
  jobDescription: string, 
  candidateBio: string, 
  skills: string[]
): Promise<MatchResult> {
  const { OpenAI } = require('openai');
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
    You are an AI recruiter analyzing job-candidate fit. Calculate a match score (0-100) between this job and candidate.

    JOB DESCRIPTION:
    ${jobDescription}

    CANDIDATE BIO:
    ${candidateBio}

    CANDIDATE SKILLS:
    ${skills.join(', ')}

    Analyze the match and respond with a JSON object containing:
    - score: number (0-100)
    - matchedSkills: array of skills that match
    - reasoning: string explaining the score
    - keywordMatches: number of relevant keywords found
    - skillMatches: number of skills that match

    Consider:
    1. Skill alignment
    2. Experience relevance
    3. Domain knowledge
    4. Career progression fit
    5. Cultural fit indicators

    Respond only with valid JSON.
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  try {
    return JSON.parse(content);
  } catch (parseError) {
    throw new Error('Invalid JSON response from OpenAI');
  }
}

function calculateRuleBasedMatchScore(
  jobDescription: string, 
  candidateBio: string, 
  skills: string[]
): MatchResult {
  const jobText = jobDescription.toLowerCase();
  const bioText = candidateBio.toLowerCase();
  
  // Extract keywords from job description
  const jobKeywords = extractKeywords(jobText);
  const bioKeywords = extractKeywords(bioText);
  
  // Calculate keyword matches
  const keywordMatches = jobKeywords.filter(keyword => 
    bioKeywords.includes(keyword)
  ).length;
  
  // Calculate skill matches
  const candidateSkills = skills.map(skill => skill.toLowerCase());
  const matchedSkills = candidateSkills.filter(skill => 
    jobText.includes(skill) || 
    bioText.includes(skill)
  );
  
  // Calculate experience level match
  const experienceLevels = ['junior', 'senior', 'lead', 'principal', 'entry', 'mid', 'experienced'];
  const jobExperience = experienceLevels.find(level => jobText.includes(level));
  const bioExperience = experienceLevels.find(level => bioText.includes(level));
  const experienceMatch = jobExperience === bioExperience ? 10 : 0;
  
  // Calculate domain match
  const domains = ['frontend', 'backend', 'fullstack', 'full-stack', 'devops', 'mobile', 'web', 'data', 'ml', 'ai'];
  const jobDomains = domains.filter(domain => jobText.includes(domain));
  const bioDomains = domains.filter(domain => bioText.includes(domain));
  const domainMatches = jobDomains.filter(domain => bioDomains.includes(domain)).length;
  
  // Calculate final score
  const keywordScore = Math.min((keywordMatches / Math.max(jobKeywords.length, 10)) * 40, 40);
  const skillScore = Math.min((matchedSkills.length / Math.max(candidateSkills.length, 1)) * 30, 30);
  const domainScore = Math.min(domainMatches * 10, 20);
  
  const totalScore = Math.min(Math.round(keywordScore + skillScore + experienceMatch + domainScore), 100);
  
  // Generate matched skills list
  const finalMatchedSkills = skills.filter(skill => 
    matchedSkills.includes(skill.toLowerCase())
  );
  
  // Generate reasoning
  const reasoning = generateDetailedReasoning(
    totalScore, 
    finalMatchedSkills.length, 
    skills.length, 
    keywordMatches,
    domainMatches
  );
  
  return {
    score: totalScore,
    matchedSkills: finalMatchedSkills,
    reasoning,
    keywordMatches,
    skillMatches: finalMatchedSkills.length
  };
}

function extractKeywords(text: string): string[] {
  // Remove common words and extract meaningful keywords
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall'];
  
  const words = text
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => 
      word.length > 2 && 
      !commonWords.includes(word) &&
      !word.match(/^\d+$/)
    );
    
  // Return unique keywords
  return [...new Set(words)];
}

function generateDetailedReasoning(
  score: number, 
  matchedSkillsCount: number, 
  totalSkills: number,
  keywordMatches: number,
  domainMatches: number
): string {
  let reasoning = '';
  
  if (score >= 80) {
    reasoning = `Excellent match! `;
  } else if (score >= 60) {
    reasoning = `Good match! `;
  } else if (score >= 40) {
    reasoning = `Moderate match. `;
  } else {
    reasoning = `Limited match currently. `;
  }
  
  reasoning += `You have ${matchedSkillsCount} of ${totalSkills} relevant skills (${Math.round((matchedSkillsCount/totalSkills)*100)}% skill match). `;
  
  if (keywordMatches > 5) {
    reasoning += `Strong keyword alignment with ${keywordMatches} matching terms. `;
  } else if (keywordMatches > 2) {
    reasoning += `Some keyword alignment with ${keywordMatches} matching terms. `;
  }
  
  if (domainMatches > 0) {
    reasoning += `Domain expertise alignment detected. `;
  }
  
  if (score >= 70) {
    reasoning += `Consider applying - you're a strong candidate for this role.`;
  } else if (score >= 50) {
    reasoning += `Consider highlighting your transferable skills and relevant experience.`;
  } else {
    reasoning += `This could be a growth opportunity. Consider developing more of the required skills.`;
  }
  
  return reasoning;
}
