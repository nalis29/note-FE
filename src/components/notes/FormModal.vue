
<script setup lang="ts">

  import type { Note } from "@/types/note"
  import { computed, reactive, watch } from "vue"

  const props = defineProps({
    modelValue: Boolean,
    note: {
      type: Object as () => Note | null,
      default: null,
    },
  })

  const emit = defineEmits([ "update:modelValue", "submit" ])

  const isEdit = computed(() => !!props.note)

  const localForm = reactive({
    title: "",
    content: "",
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
    },
    { immediate: true }
  )

  const handleSubmit = () => {
    emit("submit", {
      title: localForm.title,
      content: localForm.content,
    })
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
        class="border border-(--primary) px-3 py-2 rounded w-full mb-2"
      />

      <textarea
        v-model="localForm.content"
        rows="5"
        placeholder="Content"
        class="border border-(--primary) px-3 py-2 rounded w-full mb-2"
      ></textarea>

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