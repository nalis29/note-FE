<script setup lang="ts">
  import { reactive, computed, watch } from "vue"
  import { z } from "zod"
  import type { Note } from "@/types/note"

  const props = defineProps({
    modelValue: Boolean,
    note: {
      type: Object as () => Note | null,
      default: null,
    },
  })

  const emit = defineEmits(["update:modelValue", "submit"])

  const isEdit = computed(() => !!props.note)

  const localForm = reactive({
    title: "",
    content: "",
  })

  const errors = reactive<{ title?: string; content?: string }>({})

  const noteSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().optional(),
  })

  watch(
    () => props.note,
    (note) => {
      if (note) {
        localForm.title = note.title
        localForm.content = note.content
      } else {
        localForm.title = ""
        localForm.content = ""
      }

      errors.title = undefined
      errors.content = undefined
    },
    { immediate: true }
  )

  const handleSubmit = () => {

    errors.title = undefined
    errors.content = undefined

    const result = noteSchema.safeParse(localForm)

    if (!result.success) {
      result.error.issues.forEach((err) => {
        if (err.path[0] === "title") errors.title = err.message
        if (err.path[0] === "content") errors.content = err.message
      })
      return
    }

    emit("submit", result.data)
    emit("update:modelValue", false)
  }

</script>



<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
      <h2 class="text-xl font-bold mb-4 text-center text-(--secondary)">
        {{ isEdit ? "Edit Note" : "Add Note" }}
      </h2>

      <input
        v-model="localForm.title"
        placeholder="Title"
        class="border border-(--primary) px-3 py-2 rounded w-full mb-1"
      />
      <p v-if="errors.title" class="text-(--danger) text-sm mb-2">
        {{ errors.title }}
      </p>

      <textarea
        v-model="localForm.content"
        rows="5"
        placeholder="Content"
        class="border border-(--primary) px-3 py-2 rounded w-full mb-1"
      ></textarea>
      <p v-if="errors.content" class="text-(--danger) text-sm mb-2">
        {{ errors.content }}
      </p>

      <div class="flex justify-end gap-2 mt-4">
        <button
          @click="$emit('update:modelValue', false)"
          class="px-4 py-2 border cursor-pointer rounded"
        >
          Cancel
        </button>

        <button
          @click="handleSubmit"
          class="px-4 py-2 bg-(--primary) text-white cursor-pointer rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>