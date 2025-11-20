<script setup>
  import Item from './Item.vue';

  defineProps({
    items: {
      type: Array,
      default: () => []
    }
  })

  const emit = defineEmits(["openDetail", "edit", "delete"])
</script>


<template>
  <div class="space-y-4">
    <Item
      v-for="n in items"
      :key="n.id"
      :note="n"
      @openDetail="emit('openDetail', $event)"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
    />
  </div>
</template>