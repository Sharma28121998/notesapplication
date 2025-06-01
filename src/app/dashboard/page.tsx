'use client';

import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchNotes, addNote, updateNote, deleteNote } from '../../store/slices/notesSlice';
import { useRouter } from 'next/navigation';
import NoteModal from '../components/NoteModal';
import Button from '../components/Button';
import { clearUser } from '@/store/slices/userSlice';

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

  const { notes, loading, error: notesError } = useSelector((state: RootState) => state.notes);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotes());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (notesError) {
      setPageError(notesError);
    }
  }, [notesError]);

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
      dispatch(deleteNote(selectedNote.id));
      setIsModalOpen(false);
      setSelectedNote(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalMode === 'edit') {
      dispatch(updateNote(newNote as Note));
    } else {
      dispatch(addNote({ title: newNote.title, content: newNote.content }));
    }

    setIsModalOpen(false);
    setNewNote({ id: 0, title: '', content: '', createdAt: '' });
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
    dispatch(clearUser());
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