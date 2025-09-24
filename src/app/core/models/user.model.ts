export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  techInterests: string[]; // ['Angular', 'React', 'Node.js']
  createdAt: Date;
  updatedAt: Date;
}
