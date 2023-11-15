import { Injectable } from '@angular/core';
import { Category, CategoryPaginatedResponse } from '../models/category.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http : HttpClient) { }

  createCategory(category:Category){
    return this.http.post<Category>(`${environment.apiUrl}/categories`,category);
  }

  getCategories(){
    return this.http.get<CategoryPaginatedResponse>(`${environment.apiUrl}/categories?pageSize=${environment.MAX_PAGE_SIZE}`);
  }

  deleteCategory(categoryId : string){
    return this.http.delete(`${environment.apiUrl}/categories/${categoryId}`);
  }

  updateCategory(category : Category){
    return this.http.put<Category>(`${environment.apiUrl}/categories/${category.categoryId}`,category);
  }


}
