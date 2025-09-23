import { Injectable } from "@angular/core";
import { MockDataService } from "./mock-data.service";

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private mockData: MockDataService) {}

  getCourses(page: number = 1, limit: number = 12) {
    // Will switch between mock and real API based on environment
    return this.mockData.getCourses(page, limit);
  }

  getCourseById(id: string) {
    return this.mockData.getCourseById(id);
  }

  searchCourses(query: string, filters?: any) {
    return this.mockData.searchCourses(query, filters);
  }
}
