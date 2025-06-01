import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://api.jsoneditoronline.org/v2/docs/91d987f45890499f8cb443be8bb3af29/data';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
};

// Async thunk to fetch notes
export const fetchNotes = createAsyncThunk('notes/fetchNotes', async () => {
  const response = await axios.get(API_URL);
  return response.data.notes;
});

// Async thunk to add a new note
export const addNote = createAsyncThunk('notes/addNote', async (newNoteData: { title: string; content: string }, { getState }) => {
  const state = getState() as { notes: NotesState };
  const currentNotes = state.notes.notes;
  
  const noteWithId = {
    id: currentNotes.length + 1,
    title: newNoteData.title,
    content: newNoteData.content,
    createdAt: new Date().toISOString()
  };

  const updatedNotes = [...currentNotes, noteWithId];
  await axios.put(API_URL, { notes: updatedNotes });
  return updatedNotes;
});

// Async thunk to update an existing note
export const updateNote = createAsyncThunk('notes/updateNote', async (updatedNote: Note, { getState }) => {
  const state = getState() as { notes: NotesState };
  const currentNotes = state.notes.notes;

  const updatedNotes = currentNotes.map(note =>
    note.id === updatedNote.id ? updatedNote : note
  );

  await axios.put(API_URL, { notes: updatedNotes });
  return updatedNotes;
});

// Async thunk to delete a note
export const deleteNote = createAsyncThunk('notes/deleteNote', async (noteId: number, { getState }) => {
    const state = getState() as { notes: NotesState };
    const currentNotes = state.notes.notes;

    const updatedNotes = currentNotes.filter(note => note.id !== noteId);
    await axios.put(API_URL, { notes: updatedNotes });
    return updatedNotes;
});

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Notes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notes';
      })
      // Add Note
      .addCase(addNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNote.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(addNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add note';
      })
       // Update Note
       .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update note';
      })
      // Delete Note
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete note';
      });
  },
});

export default notesSlice.reducer; 