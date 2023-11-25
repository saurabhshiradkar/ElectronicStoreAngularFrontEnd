import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';
import { setCategoryData } from 'src/app/store/category/category.actions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-categories-view',
  templateUrl: './categories-view.component.html',
  styleUrls: ['./categories-view.component.css']
})
export class CategoriesViewComponent implements OnInit {

  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private catStore: Store<{ cat: Category[] }>,
  ) { }

  ngOnInit(): void {
    this.catStore.select('cat').subscribe({

      next: (categories) => {
        if (categories.length > 0) {
          console.log('Categories already there...');
          this.categories = categories;
        }
        else {
          console.log('No Categories.... Loading from Server');
          this.categoryService.getCategories().subscribe({
            next: (categories) => {
              // Update categoryCoverImage for each category
              this.categories = categories.content.map(category => {
                if (!category.coverImage.includes('http') && !category.coverImage.startsWith('data')) {
                  category.coverImage = `${environment.apiUrl}/categories/image/${category.categoryId}`;
                }
                return category;
              });
              this.catStore.dispatch(setCategoryData({ categories: this.categories }))
            }
          });
        }
      }
    });
  }

}
