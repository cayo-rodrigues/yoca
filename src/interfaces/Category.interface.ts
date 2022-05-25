export interface ICreateCategory {
  name: string;
}

export interface IUpdateCategory {
  id: string;
  updateData: IUpdateCategoryData;
}

export interface IUpdateCategoryData {
  name?: string;
}

export interface IListCategories {
  per_page?: number;
  page?: number;
}
