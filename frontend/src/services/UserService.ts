import config from "../config/config.js";
import { IUser } from "../models/UserModel.js";

const mockUsers: IUser[] = [
  {
    _id: "mock1",
    name: "Mock Admin (DB Offline)",
    phone: "0999999999",
    email: "mock_admin@gmail.com",
    role: "admin",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    avatar_url: "",
  },
];

const handleFetch = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(
        data.message || `Lỗi từ hệ thống (HTTP ${response.status})`,
      );
    }
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("NETWORK_ERROR");
    }
    throw error;
  }
};

const UserService = {
  getAll: async (): Promise<IUser[]> => {
    try {
      const data = await handleFetch(`${config.BASE_URL}/users`);
      return data.users;
    } catch (error) {
      if ((error as Error).message === "NETWORK_ERROR") {
        console.warn(
          "Mất kết nối với Backend, sử dụng dữ liệu mẫu (Mock Data)",
        );
        return mockUsers;
      }
      throw error;
    }
  },

  getOne: async (id: string): Promise<IUser> => {
    try {
      const data = await handleFetch(`${config.BASE_URL}/users/${id}`);
      return data.user;
    } catch (error) {
      if ((error as Error).message === "NETWORK_ERROR") {
        console.warn(
          "Mất kết nối với Backend, sử dụng dữ liệu mẫu (Mock Data)",
        );
        const user = mockUsers.find((u) => u._id === id);
        if (!user)
          throw new Error("Không tìm thấy người dùng trong dữ liệu mẫu");
        return user;
      }
      throw error;
    }
  },

  create: async (
    user: Partial<IUser> & { password: string },
  ): Promise<IUser> => {
    try {
      const data = await handleFetch(`${config.BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      return data.user;
    } catch (error) {
      if ((error as Error).message === "NETWORK_ERROR") {
        console.warn(
          "Mất kết nối với Backend, sử dụng dữ liệu mẫu (Mock Data)",
        );
        const newUser = {
          ...user,
          _id: "mock_" + Math.random().toString(36).substring(2, 9),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as IUser;
        mockUsers.push(newUser);
        return newUser;
      }
      throw error;
    }
  },

  update: async (id: string, user: Partial<IUser>): Promise<IUser> => {
    try {
      const data = await handleFetch(`${config.BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      return data.user;
    } catch (error) {
      if ((error as Error).message === "NETWORK_ERROR") {
        console.warn(
          "Mất kết nối với Backend, sử dụng dữ liệu mẫu (Mock Data)",
        );
        const index = mockUsers.findIndex((u) => u._id === id);
        if (index === -1)
          throw new Error("Không tìm thấy người dùng trong dữ liệu mẫu");
        mockUsers[index] = {
          ...mockUsers[index],
          ...user,
          updated_at: new Date().toISOString(),
        } as IUser;
        return mockUsers[index]!;
      }
      throw error;
    }
  },

  remove: async (id: string): Promise<void> => {
    try {
      await handleFetch(`${config.BASE_URL}/users/delete/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      if ((error as Error).message === "NETWORK_ERROR") {
        console.warn("Mất kết nối với Backend");
        const index = mockUsers.findIndex((u) => u._id === id);
        if (index !== -1) mockUsers.splice(index, 1);
        return;
      }
      throw error;
    }
  },
};

export default UserService;
