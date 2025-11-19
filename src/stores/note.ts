import { defineStore } from "pinia";
import { api } from "../api/axios";
import type { Note } from "@/types/note";

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

export const useNotesStore = defineStore("notesStore", {
  state: (): NotesState => ({
    notes: [],
    loading: false,
    error: null,
  }),

  getters: {
    filteredNotes:
      (state) =>
      (search: string = "", sortBy: "createdAt" | "title" = "createdAt") => {
        let notes = [...state.notes];

        if (search) {
          const searchValue = search.toLowerCase();
          notes = notes.filter(
            (n) => n.title.toLowerCase().includes(searchValue) || n.content.toLowerCase().includes(searchValue)
          );
        }

        switch (sortBy) {
          case "title":
            notes.sort((a, b) => a.title.localeCompare(b.title));
            break

          case "createdAt":
            notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break

          default: 
            break
        }

        return notes;
      },
  },



  actions: {

    async fetchNotes() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get<Note[]>("/notes");
        this.notes = res.data;

      } catch (err: any) {
        this.error = err.message || "Failed to fetch notes";
        console.error(this.error);

      } finally {
        this.loading = false;
      }
    },


    async addNote(note: Partial<Note>) {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.post<Note>("/notes", note);
        this.notes = [...this.notes, res.data]
      } catch (err: any) {
        this.error = err.message || "Failed to add note";
        console.error(this.error);

      } finally {
        this.loading = false;
      }
    },


    async updateNote(id: number, updated: Partial<Note>) {
      this.loading = true;
      this.error = null;
      
      try {
        const res = await api.put<Note>(`/notes/${id}`, updated);
        const index = this.notes.findIndex(note => note.id === id);
        if (index !== -1) {
          this.notes[index] = { ...this.notes[index], ...res.data };
        }

      } catch (err: any) {
        this.error = err.message || "Failed to update note";
        console.error(this.error);

      } finally {
        this.loading = false;
      }
    },


    async deleteNote(id: number) {  
      this.loading = true;
      this.error = null;

      try {
        await api.delete(`/notes/${id}`);
        this.notes = this.notes.filter(note => note.id !== id);

      } catch (err: any) {
        this.error = err.message || "Failed to delete note";
        console.error(this.error);

      } finally {
        this.loading = false;
      }
    },
  },
});
