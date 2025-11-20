<script setup lang="ts">

  import { ref } from "vue";
  import { z } from "zod";
  import { useAuthStore } from "@/stores/auth";
  import { useRouter } from "vue-router";

  const authStore = useAuthStore();
  const router = useRouter();


  const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().nonempty("Password is required"),
    confirmPassword: z.string().nonempty("Confirm password is required"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


  // -- form data --
  const username = ref("");
  const password = ref("");
  const confirmPassword = ref("");
  const isLoading = ref(false);

  const errors = ref({
    username: "",
    password: "",
    confirmPassword: "",
    shared: "",
  });


  const register = async () => {
    errors.value = { username: "", password: "", confirmPassword: "", shared: "" };

    const result = registerSchema.safeParse({
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });

    if (!result.success) {
      result.error.issues.forEach((err) => {
        const field = err.path[0];
        if (typeof field === "string" && field in errors.value) {
          (errors.value as any)[field] = err.message;
        }
      });
      return;
    }

    isLoading.value = true;

    try {
      await authStore.register({
        username: username.value,
        password: password.value,
      });

      username.value = "";
      password.value = "";
      confirmPassword.value = "";

      router.push("/login");

    } catch (err) {
      errors.value.shared = authStore.error || "Registration failed";
    } finally {
      isLoading.value = false;
    }
  };
</script>


<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-sm bg-white shadow-lg rounded-xl p-6">
      <h2 class="text-2xl font-semibold text-center mb-6">Register</h2>

      <form @submit.prevent="register" class="space-y-4">
        <!-- Username -->
        <div>
          <label class="block text-sm mb-1">Username</label>
          <input
            type="text"
            v-model="username"
            placeholder="Enter your username"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
          />
          <p v-if="errors.username" class="text-(--danger) text-sm mt-1">
            {{ errors.username }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm mb-1">Password</label>
          <input
            type="password"
            v-model="password"
            placeholder="Enter your password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
          />
          <p v-if="errors.password" class="text-(--danger) text-sm mt-1">
            {{ errors.password }}
          </p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm mb-1">Confirm Password</label>
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="Confirm password"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
          />
          <p v-if="errors.confirmPassword" class="text-(--danger) text-sm mt-1">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <p v-if="errors.shared" class="text-(--danger) text-sm text-left">
          {{ errors.shared }}
        </p>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full mt-4 py-2 bg-(--primary) text-white rounded-lg hover:cursor-pointer transition"
        >
          {{ isLoading ? "Registering..." : "Register" }}
        </button>
      </form>
    </div>
  </div>
</template>
