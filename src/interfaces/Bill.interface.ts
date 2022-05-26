export interface IBillUpdateReq {
  paid: boolean;
  id: number;
}

export interface IListBills {
  listUnpaid: boolean;
  per_page?: number;
  page?: number;
}
