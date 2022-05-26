export interface IProductFeedback {
  description: string;
  rating: number;
  productId: string;
}

export interface IUpdateProductFeedback extends IProductFeedback {
  id: string;
}
