export interface IGeneralFeedback {
  description?: string;
  rating?: number;
}

export interface IUpdateGeneralFeedback extends IGeneralFeedback {
  id: string;
}
