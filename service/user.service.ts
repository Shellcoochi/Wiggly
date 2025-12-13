import { http } from "@/lib/http";
import { User } from "./types";

export const UserService = {
  getProfile() {
    return http.get<User>("/user/profile");
  },

  updateProfile(payload: Partial<User>) {
    return http.post<User>("/user/update", payload);
  },
};
