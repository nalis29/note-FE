<script setup>
  const props = defineProps({
    modelValue: Boolean,
    title: {
      type: String,
      default: "Are you sure you want to delete this?",
    },
    message: {
      type: String,
      default: "",
    },
  })

  const emit = defineEmits(["update:modelValue", "confirm"])

  const confirm = () => {
    emit("confirm")
    emit("update:modelValue", false)
  }
</script>


<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
      <h2 class="text-xl font-bold mb-4">
        {{ title }}
      </h2>

      <p v-if="message" class="text-gray-600">
        {{ message }}
      </p>

      <div class="flex justify-end gap-2 mt-6">
        <button
          @click="$emit('update:modelValue', false)"
          class="px-4 py-2 border rounded"
        >
          Cancel
        </button>

        <button
          @click="confirm"
          class="px-4 py-2 bg-(--danger) text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
