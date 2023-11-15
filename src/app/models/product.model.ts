import { Category } from "./category.model";

// product.model.ts
export class Product {
  constructor(
    public productId: String = '',
    public title: string = '',
    public description: string = '',
    public quantity: number = 0.00,
    public price: number = 0.00,
    public discountedPrice: number = 0.00,
    public live: boolean = false,
    public stock: boolean = false,
    public category: Category = new Category('', '', '', ''),// Allow an instance of Category
    // public productImageName: string,
  ){}
}