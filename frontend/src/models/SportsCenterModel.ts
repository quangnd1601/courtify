export interface ISportsCenter {
  _id: string;
  owner_id: {
    _id: string;
    name: string;
    email: string;
  } | string;
  sport_id: {
    _id: string;
    name: string;
  } | string;
  name: string;
  address: string;
  location?: string;
  description?: string;
  thumbnail?: string;
  gallery?: string[];
  pricing?: {
    start_time: string;
    end_time: string;
    price: number;
    _id?: string;
  }[];
  rating_avg: number;
  review_count: number;
  status: "active" | "inactive";
  booking_count: number;
  created_at: string;
  updated_at: string;
}
