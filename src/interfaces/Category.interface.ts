import Category from "../models/Category.model";

export interface CreateCategoryServiceParams {
  name: string;
}

export interface UpdateCategoryServiceParams {
  id: string;
  updateData: UpdateCategoryData;
}

export interface UpdateCategoryData {
  name?: string;
}
