import Product from "../models/Product.model";

export interface IProductFeedback {
  description?: string;
  rating?: number;
  product?: Product;
}
