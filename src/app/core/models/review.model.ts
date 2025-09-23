import { Course } from "./course.model";
import { User } from "./user.model";

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number; // 1-5
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  helpful: number; // helpful votes count
  createdAt: Date;
  updatedAt: Date;
  // Virtual fields (populated by joins)
  user?: User;
  course?: Course;
}
