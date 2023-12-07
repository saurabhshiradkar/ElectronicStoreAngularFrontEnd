import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {


  adminMenus = [
    {
      title:'Home',
      link:'/admin/home',
      icon:'home-check',
      cssClass:''
    },
    {
      title:'Add Product',
      link:'/admin/add-product',
      icon:'circle-plus',
      cssClass:''
    },
    {
      title:'View Products',
      link:'/admin/view-products',
      icon:'building-store',
      cssClass:''
    },
    {
      title:'Add Category',
      link:'/admin/add-category',
      icon:'file-diff',
      cssClass:''
    },
    {
      title:'View Categories',
      link:'/admin/view-categories',
      icon:'category-filled',
      cssClass:''
    },
    {
      title:'View Users',
      link:'/admin/users',
      icon:'users-group',
      cssClass:''
    },
    {
      title:'View Orders',
      link:'/admin/orders',
      icon:'truck-delivery',
      cssClass:''
    },
    {
      title:'My Orders',
      link:'/my/orders',
      icon:'truck-return',
      cssClass:''
    },
    {
      title:'Logout',
      link:'/admin/logout',
      icon:'logout',
      cssClass:'',
    },
  ]



}
