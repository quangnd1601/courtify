// Định nghĩa kiểu dữ liệu User
export interface IUser {
  _id: string;
  name: string;
  phone: string;
  email: string;
  role: "admin" | "user" | "owner";
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  avatar_url: string;
}
