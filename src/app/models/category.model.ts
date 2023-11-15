export class Category{
    constructor(
        public categoryId: string,
        public title: string,
        public description: string,
        public coverImage: string,
    ){}
}

export interface CategoryPaginatedResponse{
    content : Category[];
    lastPage: boolean;
    pageNumber : number;
    pageSize : number;
    totalElements : number;
    totalPages : number;

}