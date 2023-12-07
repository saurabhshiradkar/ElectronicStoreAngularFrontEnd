import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/pages/home/home.component';
import { AboutComponent } from './components/pages/about/about.component';
import { LoginComponent } from './components/pages/login/login.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { FeatureComponent } from './components/pages/feature/feature.component';
import { CustomNavbarComponent } from './components/common/custom-navbar/custom-navbar.component';
import { AdminNavbarComponent } from './components/common/admin-navbar/admin-navbar.component';
import { CategoriesComponent } from './components/common/categories/categories.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { StoreModule } from '@ngrx/store'
import { authReducer } from './store/auth/auth.reducers';
import { DashboardComponent } from './components/user/dashboard/dashboard.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { HomeComponent as AdminHomeComponent  } from './components/admin/home/home.component';
import { AddProductComponent } from './components/admin/add-product/add-product.component';
import { ViewProductsComponent } from './components/admin/view-products/view-products.component';
import { AddCategoryComponent } from './components/admin/add-category/add-category.component';
import { ViewCategoriesComponent } from './components/admin/view-categories/view-categories.component';
import { ViewOrdersComponent } from './components/admin/view-orders/view-orders.component';
import { ViewUsersComponent } from './components/admin/view-users/view-users.component';
import { TablerIconsModule } from 'angular-tabler-icons';

import { 

  IconCamera, 
  IconHeart, 
  IconBrandGithub, 
  IconHomeCheck, 
  IconCirclePlus, 
  IconBuildingStore,
  IconCategoryFilled,
  IconFileDiff,
  IconUsersGroup,
  IconTruckDelivery,
  IconTruckReturn,
  IconLogout,
  IconScriptPlus,
  IconPlus,
  IconMinus,
  IconHttpDelete,
  IconTrash,
 
} from 'angular-tabler-icons/icons';
import { JwtInterceptor } from './services/jwtInterceptor';
import { SingleCategoryViewComponent } from './components/common/single-category-view/single-category-view.component';
import { categoryReducer } from './store/category/category.reducers';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { UserComponent } from './components/pages/user/user.component';
import { UserViewComponent } from './components/common/user-view/user-view.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LogoutComponent } from './components/admin/logout/logout.component';
import { StoreComponent } from './components/pages/store/store.component';
import { SingleProductCardComponent } from './components/common/single-product-card/single-product-card.component';
import { CategoriesViewComponent } from './components/common/categories-view/categories-view.component';
import { StoreCategoriesComponent } from './components/pages/store-categories/store-categories.component';
import { ViewProductComponent } from './components/pages/view-product/view-product.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { CartItemComponent } from './components/common/cart-item/cart-item.component';
import { cartReducer } from './store/cart/cart.reducers';
import { OrderViewModalComponent } from './components/common/order-view-modal/order-view-modal.component';
import { OrderHubComponent } from './components/common/order-hub/order-hub.component';
import { MyOrdersComponent } from './components/pages/my-orders/my-orders.component';
import { PaymentComponent } from './components/common/payment/payment.component';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';

const icons = {
  IconCamera,
  IconHeart,
  IconBrandGithub,
  IconHomeCheck,
  IconCirclePlus,
  IconBuildingStore,
  IconCategoryFilled,
  IconFileDiff,
  IconUsersGroup,
  IconTruckDelivery,
  IconTruckReturn,
  IconLogout,
  IconScriptPlus,
  IconPlus,
  IconMinus,
  IconHttpDelete,
  IconTrash
  

}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    SignupComponent,
    FeatureComponent,
    CustomNavbarComponent,
    AdminNavbarComponent,
    CategoriesComponent,
    DashboardComponent,
    AdminDashboardComponent,
    AdminHomeComponent,
    AddProductComponent,
    ViewProductsComponent,
    AddCategoryComponent,
    ViewCategoriesComponent,
    ViewOrdersComponent,
    ViewUsersComponent,
    SingleCategoryViewComponent,
    UserComponent,
    UserViewComponent,
    LogoutComponent,
    StoreComponent,
    SingleProductCardComponent,
    CategoriesViewComponent,
    StoreCategoriesComponent,
    ViewProductComponent,
    CartComponent,
    CartItemComponent,
    OrderViewModalComponent,
    OrderHubComponent,
    MyOrdersComponent,
    PaymentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(
      { 
        positionClass:'toast-top-center',
        progressBar:true,
        closeButton:true
      }),
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot(
      {
        auth : authReducer,
        cat : categoryReducer,
        cart : cartReducer,
      }
      ),
    TablerIconsModule.pick(icons),
    QuillModule.forRoot(),
    SweetAlert2Module.forRoot({

    }),
    InfiniteScrollModule,
    SocialLoginModule,
    GoogleSigninButtonModule

  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass : JwtInterceptor,
      multi:true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.GOOGLE_CLIENT_ID
            )
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
