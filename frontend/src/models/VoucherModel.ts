export interface IVoucher {
  _id: string;
  owner_id: string;
  sport_center_id: string;
  code: string;
  description?: string;
  discount_percent: number;
  max_discount: number;
  min_order: number;
  start_date: string;
  end_date: string;
  usage_limit: number;
  used_count: number;
  status: "active" | "inactive" | "expired";
  created_at?: string;
  updated_at?: string;
}
