<script setup>
  import { ref } from "vue";
  import { z } from "zod";

  const loginSchema = z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    // TODO: to sync with the signup logic
  });


  // -- formdata ---
  const username = ref("");
  const password = ref("");
  const isLoading = ref(false);

  const errors = ref({
    username: "",
    password: "",
    shared: ""
  });

  const login = async () => {
    errors.value = { username: "", password: "", shared: "" };

    const result = loginSchema.safeParse({
      username: username.value,
      password: password.value,
    });

    if (!result.success) {
      result.error.issues.forEach((err) => {
        errors.value[err.path[0]] = err.message;
      });
      return;
    }

    isLoading.value = true;

    try {
      alert("Login successful!");
    } finally {
      isLoading.value = false;
    }
  };

</script>


<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-sm bg-white shadow-lg rounded-xl p-6">

      <h2 class="text-2xl font-semibold text-center mb-6">
        Login
      </h2>

      <form @submit.prevent="login" class="space-y-4">
        
        <!-- Username -->
        <div>
          <label class="block text-sm mb-1">Username</label>
          <input
            type="text"
            v-model="username"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
            placeholder="Enter your username"
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
            class="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
            placeholder="Enter your password"
          />
          <p v-if="errors.password" class="text-(--danger) text-sm mt-1">
            {{ errors.password }}
          </p>
        </div>

        <p v-if="errors.shared" class="text-(--danger) text-sm text-center">
          {{ errors.shared }}
        </p>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full mt-4 py-2 bg-(--primary) text-white rounded-lg hover:cursor-pointer transition"
        >
          {{ isLoading ? "Logging in..." : "Login" }}
        </button>

      </form>
    </div>
  </div>
</template>