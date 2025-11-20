<script setup>

  import { Pencil, Trash } from "lucide-vue-next";
  defineProps({
    note: {
      type: Object,
      required: true,
    },
  })

  const emit = defineEmits(["openDetail", "edit", "delete"])
</script>


<template>
  <div
    class="bg-white p-4 rounded-lg shadow group cursor-pointer"
    @click="emit('openDetail', note)"
  >
    <div class="flex justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold">{{ note.title }}</h3>
        <p class="text-sm text-gray-500">
          {{ new Date(note.createdAt).toLocaleDateString() }}
        </p>
      </div>

      <div class="flex gap-1">
        <button
          @click.stop="emit('edit', note)"
          class="text-(--secondary) cursor-pointer"
        >
          <Pencil />
        </button>

        <button
          @click.stop="emit('delete', note)"
          class="text-(--danger) cursor-pointer"
        >
          <Trash />
        </button>
      </div>
    </div>
  </div>
</template>