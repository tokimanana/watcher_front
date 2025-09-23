export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  platform: 'udemy' | 'coursera' | 'youtube' | 'freecodecamp' | 'edx';
  url: string;
  imageUrl: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  duration: string; // "4.5 hours"
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  technologies: string[];
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
}
