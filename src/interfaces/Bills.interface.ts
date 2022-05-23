export interface BillUpdateReq {
  paid: boolean;
  id: number;
}

export interface IListBills {
  listUnpaid: boolean;
}
