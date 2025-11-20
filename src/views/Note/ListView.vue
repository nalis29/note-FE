<script setup>
  import List from "@/components/notes/List.vue";
  import DetailModal from "@/components/notes/DetailModal.vue";
  import FormModal from "@/components/notes/FormModal.vue";
  import DeleteConfirmation from "@/components/common/DeleteConfirmation.vue";
  import { ref, reactive, onMounted, watch } from "vue";
  import { useNotesStore } from "@/stores/note";


  const notesStore = useNotesStore();
  const detailModal = ref(false);
  const showModal = ref(false); // for both create and update
  const deleteConfirmation = ref(false);
  const editNoteId = ref(null);
  const selectedNote = ref(null);

  const form = reactive({
    title: "",
    content: "",
  });

  const search = ref("");
  const debouncedSearch = ref("");
  const sort = ref("createdAt");

  let timeout = null;

  watch(search, (val) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      debouncedSearch.value = val;
    }, 500);
  });

  onMounted(() => {
    notesStore.fetchNotes();
  });

  const resetForm = () => {
    form.title = "";
    form.content = "";
  };


  // detail
  const openDetailModal = (note) => {
    selectedNote.value = note
    detailModal.value = true
  }

  // modal handling
  const openEditModal = (note) => {
    selectedNote.value = note; 
    editNoteId.value = note.id;
    form.title = note.title;
    form.content = note.content;
    showModal.value = true;
  };

  // for all modal and reset form, selectedNote
  const closeModal = () => {
    showModal.value = false;
    deleteConfirmation.value = false;
    detailModal.value = false;
    resetForm();
    editNoteId.value = null;
    selectedNote.value = null;
  };

  const handleSaveNote = async (payload) => {
    if (editNoteId.value) {
      await notesStore.updateNote(editNoteId.value, payload)
    } else {
      await notesStore.addNote(payload)
    }
    closeModal()
  }

  // open confirmation
  const deleteNote = async (note) => {
    selectedNote.value = note;
    deleteConfirmation.value = true;
  };

  // handleDelete
  const confirmDeleteNote = async () => {
    notesStore.deleteNote(selectedNote.value.id);
    closeModal();
  };

</script>


<template>
  <div class="p-4 max-w-5xl mx-auto my-10">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Notes</h1>
      <button
        @click="showModal = true"
        class="bg-(--primary) text-white px-4 py-2 rounded cursor-pointer"
      >
        Add New Note
      </button>
    </div>

    <!-- SEARCH AND SORT -->
    <div class="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2">
      <input
        v-model="search"
        placeholder="Search notes..."
        class="border border-(--primary) outline-none px-3 py-2 rounded w-full sm:w-1/3"
      />
      <select
        v-model="sort"
        class="border border-(--primary) px-3 py-2 rounded w-full sm:w-1/4 text-(--secondary)"
      >
        <option value="createdAt">Sort by Created At</option>
        <option value="title">Sort by Title</option>
      </select>
    </div>

    <!-- LIST OF NOTE -->
    <List
      :items="notesStore.filteredNotes(debouncedSearch, sort)"
      @openDetail="openDetailModal"
      @edit="openEditModal"
      @delete="deleteNote"
    />


    <!-- NOTE DETAIL -->
    <DetailModal
      v-model="detailModal"
      :note="selectedNote"
    />

    <!-- CREATE & UPDATE -->
    <FormModal
      v-model="showModal"
      :note="editNoteId ? selectedNote : null"
      @submit="handleSaveNote"
    />


    <!-- DELETE CONFIRMATION -->
    <DeleteConfirmation
      v-model="deleteConfirmation"
      title="Are you sure you want to delete this note?"
      message="This action cannot be undone."
      @confirm="confirmDeleteNote"
    />

  </div>
</template>
