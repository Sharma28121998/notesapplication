'use client';

import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import { useRouter } from 'next/navigation';
import NoteModal from '../components/NoteModal';
import Button from '../components/Button';
import axios from 'axios';

const API_URL = 'https://api.jsoneditoronline.org/v2/docs/91d987f45890499f8cb443be8bb3af29/data';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

const Dashboard = () => {
  const [pageError, setPageError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState({
    id: 0,
    title: '',
    content: '',
    createdAt: ''
  });
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(userData);
    setIsAuthenticated(user.isAuthenticated);
  }, [router]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setNotes(response.data.notes);
      setPageError('');
    } catch (error) {
      setPageError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated]);

  const handleEdit = (note: Note) => {
    setNewNote(note);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (note: Note) => {
    setSelectedNote(note);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedNote) {
      try {
        setLoading(true);
        const updatedNotes = notes.filter(note => note.id !== selectedNote.id);
        await axios.put(API_URL, { notes: updatedNotes });
        setNotes(updatedNotes);
        setIsModalOpen(false);
        setSelectedNote(null);
        setPageError('');
      } catch (error) {
        setPageError('Failed to delete note');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      if (modalMode === 'edit') {
        const updatedNotes = notes.map(note =>
          note.id === newNote.id ? newNote : note
        );
        await axios.put(API_URL, { notes: updatedNotes });
        setNotes(updatedNotes);
      } else {
        const noteWithId = {
          ...newNote,
          id: notes.length + 1,
          createdAt: new Date().toISOString()
        };
        const updatedNotes = [...notes, noteWithId];
        await axios.put(API_URL, { notes: updatedNotes });
        setNotes(updatedNotes);
      }
      setIsModalOpen(false);
      setNewNote({ id: 0, title: '', content: '', createdAt: '' });
      setPageError('');
    } catch (error) {
      setPageError(modalMode === 'edit' ? 'Failed to update note' : 'Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
    setNewNote({ id: 0, title: '', content: '', createdAt: '' });
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewNote(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Notes</h1>
        <div className={styles.headerButtons}>
          <Button 
            variant="primary"
            onClick={() => {
              setModalMode('add');
              setNewNote({ id: 0, title: '', content: '', createdAt: '' });
              setIsModalOpen(true);
            }}
          >
            Add New
          </Button>
          <Button 
            variant="danger"
            size="small"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      <NoteModal
        isOpen={isModalOpen}
        mode={modalMode}
        note={modalMode === 'delete' ? selectedNote : newNote}
        onClose={handleCancel}
        onSubmit={handleSubmit}
        onConfirm={confirmDelete}
        onNoteChange={handleNoteChange}
      />

      {pageError ? (
        <div className={styles.errorContainer}>
          <h1 className={styles.errorText}>Error: {pageError}</h1>
        </div>
      ) : loading ? (
        <div className={styles.notesLoadingContainer}>
          <h1 className={styles.loadingText}>Loading Notes...</h1>
        </div>
      ) : (
        <div className={styles.notesList}>
          {notes.map((note) => (
            <div key={note.id} className={styles.noteCard}>
              <h2 className={styles.noteTitle}>{note.title}</h2>
              <div 
                className={styles.noteContent}
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
              <div className={styles.separator}></div>
              <div className={styles.noteFooter}>
                <Button 
                  variant="secondary"
                  size="small"
                  onClick={() => handleEdit(note)}
                >
                  Edit
                </Button>
                <div className={styles.dateAndDelete}>
                  <p className={styles.noteDate}>
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                  <Button 
                    variant="danger"
                    size="small"
                    onClick={() => handleDelete(note)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 