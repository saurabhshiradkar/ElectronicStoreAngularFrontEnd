import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { AboutComponent } from './components/pages/about/about.component';
import { FeatureComponent } from './components/pages/feature/feature.component';
import { LoginComponent } from './components/pages/login/login.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { CategoriesComponent } from './components/common/categories/categories.component';
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { normalUserGuard } from './guards/normal-user.guard';

//ADMIN IMPORTS
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { adminUserGuard } from './guards/admin-user.guard';
import { HomeComponent as AdminHomeComponent } from "./components/admin/home/home.component";
import { AddProductComponent } from './components/admin/add-product/add-product.component';
import { ViewProductsComponent } from './components/admin/view-products/view-products.component';
import { AddCategoryComponent } from './components/admin/add-category/add-category.component';
import { ViewCategoriesComponent } from './components/admin/view-categories/view-categories.component';
import { ViewOrdersComponent } from './components/admin/view-orders/view-orders.component';
import { ViewUsersComponent } from './components/admin/view-users/view-users.component';
import { UserComponent } from './components/pages/user/user.component';
import { LogoutComponent } from './components/admin/logout/logout.component';
import { StoreComponent } from './components/pages/store/store.component';
import { StoreCategoriesComponent } from './components/pages/store-categories/store-categories.component';
import { ViewProductComponent } from './components/pages/view-product/view-product.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { MyOrdersComponent } from './components/pages/my-orders/my-orders.component';

const routes: Routes = [

  // COMMON ROUTES
  {
    path:'home',
    component: HomeComponent,
    title:'Home: Electronic Store'
  },
  {
    path:'store',
    component: StoreComponent,
    title:'Store'
  },
  {
    path:'store/:categoryId/:categoryTitle',
    component: StoreCategoriesComponent,
  },
  {
    path:'categories',
    component: CategoriesComponent,
    title:'Categories: Electronic Store'
  },
  {
    path:'product/:productId',
    component: ViewProductComponent,
  },
  {
    path:'cart',
    component: CartComponent,
    title:'Cart: Electronic Store'
  },
  {
    path:'about',
    component: AboutComponent,
  },
  {
    path:'features',
    component: FeatureComponent,
    title:'Features: Electronic Store'
  },
  {
    path:'login',
    component: LoginComponent,
    title:'Login: Electronic Store'
  },
  {
    path:'signup',
    component: SignupComponent,
    title:'Signup: Electronic Store'
  },



  {
    path:'user',
    component: DashboardComponent,
    title:'User Dashboard: Electronic Store',
    canActivate:[normalUserGuard],
  },

  
  {
    path:'profile',
    component:UserComponent,
    title:'User : Electronic Store',
    canActivate:[normalUserGuard],
  },

  {
    path:'my/orders',
    component:MyOrdersComponent,
    title:'User : Electronic Store',
    canActivate:[normalUserGuard],
  },



  {
    path:'admin',
    component: AdminDashboardComponent,
    title:'Admin Dashboard',
    canActivate:[adminUserGuard],
    children:[
      {
        path:'home',
        component: AdminHomeComponent,
        title:'Admin Dashboard'
      },
      {
        path:'add-product',
        component: AddProductComponent,
        title:'Add Product'
      },
      {
        path:'view-products',
        component: ViewProductsComponent,
        title:'View Products'
      },
      {
        path:'add-category',
        component: AddCategoryComponent,
        title:'Add Category'
      },
      {
        path:'view-categories',
        component: ViewCategoriesComponent,
        title:'View Categories'
      },
      {
        path:'orders',
        component: ViewOrdersComponent,
        title:'Orders'
      },
      {
        path:'users',
        component: ViewUsersComponent,
        title:'Users'
      },
      {
        path:'logout',
        component: LogoutComponent,
        title:'Logout'
      },
    ]
  },
  {
    path:'',
    redirectTo:'home',
    pathMatch:'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
