
<script setup lang="ts">

import type { Note } from '@/types/note'

  const props = defineProps({
    modelValue: Boolean,
    note: {
      type: Object as () => Note | null,
      default: null,
    },
  })

  const emit = defineEmits(["update:modelValue"])

  const formatDate = (d: string | Date) => {
    return new Date(d).toLocaleString()
  }
</script>


<template>
  <div
    v-if="modelValue && note"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
      <h2 class="text-2xl font-bold mb-2">
        {{ note.title }}
      </h2>

      <p class="text-gray-600 mb-4 whitespace-pre-line">
        {{ note.content }}
      </p>

      <div class="text-sm text-gray-500 mb-4">
        <p>
          <strong>Created:</strong>
          {{ formatDate(note.createdAt) }}
        </p>
        <p>
          <strong>Updated:</strong>
          {{ formatDate(note.updatedAt) }}
        </p>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <button
          @click="$emit('update:modelValue', false)"
          class="px-4 py-2 border rounded"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>