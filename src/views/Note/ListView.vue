<script setup>
  import { ref, reactive, onMounted, watch } from "vue";
  import { useNotesStore } from "@/stores/note";
  import { Pencil, Trash } from "lucide-vue-next";

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

  const saveNote = async () => {
    if (editNoteId.value) {
      await notesStore.updateNote(editNoteId.value, form);
    } else {
      await notesStore.addNote(form);
    }
    closeModal();
    editNoteId.value = null;
  };

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
    <div class="space-y-4">
      <div
        v-for="note in notesStore.filteredNotes(debouncedSearch, sort)"
        :key="note.id"
        class="bg-white p-4 rounded-lg shadow group cursor-pointer"
        @click="openDetailModal(note)"
      >
        <div class="flex justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold">{{ note.title }}</h3>
            <p class="text-sm text-gray-500">
              {{ new Date(note.createdAt).toLocaleDateString() }}
            </p>
          </div>

          <div class="flex gap-1">
            <button @click.stop="openEditModal(note)" class="text-(--secondary) cursor-pointer">
              <Pencil />
            </button>
            <button @click.stop="deleteNote(note)" class="text-(--danger) cursor-pointer">
              <Trash />
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- NOTE DETAIL -->
    <div
      v-if="detailModal"
      class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 class="text-2xl font-bold mb-2">{{ selectedNote.title }}</h2>

        <p class="text-gray-600 mb-4 whitespace-pre-line">
          {{ selectedNote.content }}
        </p>

        <div class="text-sm text-gray-500 mb-4">
          <p>
            <strong>Created:</strong> {{ new Date(selectedNote.createdAt).toLocaleString() }}
          </p>
          <p>
            <strong>Updated:</strong> {{ new Date(selectedNote.updatedAt).toLocaleString() }}
          </p>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button
            @click="closeModal"
            class="px-4 py-2 border rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>


    <!-- CREATE & UPDATE -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 class="text-xl font-bold mb-4 text-center text-(--secondary)">
          {{ editNoteId ? "Edit Note" : "Add Note" }}
        </h2>

        <input
          v-model="form.title"
          placeholder="Title"
          class="border border-(--primary) px-3 py-2 rounded w-full mb-2"
        />
        <textarea
          rows="5"
          v-model="form.content"
          placeholder="Content"
          class="border border-(--primary) px-3 py-2 rounded w-full mb-2"
        ></textarea>

        <div class="flex justify-end gap-2 mt-4">
          <button @click="closeModal" class="px-4 py-2 border cursor-pointer rounded">
            Cancel
          </button>
          <button
            @click="saveNote"
            class="px-4 py-2 bg-(--primary) cursor-pointer text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- DELETE CONFIRMATION -->
    <div
      v-if="deleteConfirmation"
      class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Are you sure you want to delete this note?</h2>

        <div class="flex justify-end gap-2 mt-4">
          <button @click="deleteConfirmation = false" class="px-4 py-2 border rounded">
            Cancel
          </button>
          <button @click="confirmDeleteNote" class="px-4 py-2 bg-(--danger) text-white rounded">
            Delete
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
