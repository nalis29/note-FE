import { defineStore } from "pinia";
import { api } from "../api/axios";
import type { User } from "@/types/auth";


interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("authStore", {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem("note_token"),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {

    async login(username: string, password: string) {

      this.loading = true;
      this.error = null;

      try {
        const res = await api.post("/auth/login", { username, password });
        if (!res.data || !res.data.token) {
          this.error = res.data?.message || "Login failed";
          throw new Error(this.error ?? "Login failed");
        }

        this.token = res.data.token;
        this.user = res.data.user;

        if (this.token) {
          localStorage.setItem("note_token", this.token);
        }

      } catch (err: any) {
        this.error = err.response.data || "Login failed";
        throw err;

      } finally {
        this.loading = false;
      }
    },


    async register(payload: { username: string; password: string }) {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.post("/auth/register", payload);

        if (!res.data) {
          this.error = res.data?.message || "Registration failed";
          throw new Error(this.error ?? "Registration failed");
        }

        this.user = res.data;

      } catch (err: any) {
        this.error = err.response?.data || "Registration failed";
        throw err;
      } finally {
        this.loading = false;
      }
    },


    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("note_token");
    },
  },
});
