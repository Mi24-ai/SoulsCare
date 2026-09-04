export type TabType = 
  | 'companion' 
  | 'counseling' 
  | 'safespace' 
  | 'destress' 
  | 'insurance' 
  | 'vault' 
  | 'slidingscale';

export interface MoodLog {
  id: string;
  timestamp: string;
  emoji: string;
  label: string;
  score: number; // 1 to 5
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  suggestedExercise?: 'breathing' | 'grounding' | 'journal' | 'counseling';
}

export interface Counselor {
  id: string;
  name: string;
  title: string;
  licenseNumber: string; // SIPP / HIMPSI
  avatar: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  specializations: string[];
  education: string;
  approach: string;
  bio: string;
  standardPrice: number; // in IDR
  languages: string[];
  nextAvailable: string;
  availableSlots: string[];
  gender: 'Laki-laki' | 'Perempuan';
}

export interface SafeSpaceMessage {
  id: string;
  roomId: string;
  authorAlias: string;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  timestamp: string;
  likes: number;
  userLiked?: boolean;
  repliesCount: number;
}

export interface SafeSpaceRoom {
  id: string;
  name: string;
  description: string;
  tag: string;
  icon: string;
  activeMembers: number;
  color: string;
}

export interface InsurancePolicy {
  id: string;
  name: string;
  tagline: string;
  weeklyPrice: number;
  monthlyPrice: number;
  counselingCoverage: string;
  psychiatristMedCoverage: string;
  emergencyCrisisCoverage: string;
  claimLimitPerYear: number;
  features: string[];
  isPopular?: boolean;
  color: string;
}

export interface InsuranceClaim {
  id: string;
  policyName: string;
  category: 'Konsultasi Psikolog' | 'Resep Psikiater' | 'Darurat Krisis';
  amount: number;
  status: 'Pending Review' | 'Approved' | 'Disbursed';
  date: string;
  receiptNumber: string;
  notes: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  category: 'Konseling' | 'Self-Care Retreat' | 'Dana Darurat Jiwa' | 'Workshop Wellness';
  targetAmount: number;
  currentAmount: number;
  deadlineDate: string;
  roundUpEnabled: boolean;
  monthlyAutoDebit: number;
  interestBonusEarned: number;
  crossSubsidyMultiplier: number; // e.g. 1.1x match bonus
}

export interface SlidingScaleTier {
  id: string;
  tierName: string;
  discountPercentage: number;
  targetAudience: string;
  description: string;
  requiredProof: string;
  badgeColor: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  gratitude: string;
  content: string;
  aiReflection?: {
    summary: string;
    emotionalInsights: string[];
    affirmation: string;
    sentimentScore: number;
  };
}

export interface ActivityPlace {
  id: string;
  name: string;
  location: string;
  description: string;
  priceRange?: string;
  tags: string[];
}

export interface ActivityExercise {
  id: string;
  name: string;
  duration: string;
  description: string;
}

export type ActivityCategoryId = 'gym' | 'yoga' | 'jogging' | 'traveling' | 'kreatif';

export interface ActivityCategory {
  id: ActivityCategoryId;
  name: string;
  tagline: string;
  benefit: string;
  places: ActivityPlace[];
  exercises?: ActivityExercise[];
  tips: string[];
}

export interface Booking {
  id: string;
  counselorId: string;
  counselorName: string;
  counselorTitle: string;
  counselorAvatar: string;
  date: string;
  timeSlot: string;
  type: 'Video Call' | 'Private Chat' | 'Voice Call';
  originalPrice: number;
  finalPrice: number;
  discountApplied: number;
  subsidySource: string;
  status: 'Confirmed' | 'Completed' | 'In-Progress';
  consultationNotes?: string;
}