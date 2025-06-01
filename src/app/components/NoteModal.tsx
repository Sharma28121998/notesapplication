import React from 'react';
import styles from './NoteModal.module.css';
import Modal from './Modal';
import Button from './Button';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

interface NoteModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'delete';
  note: Note | null;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  onConfirm?: () => void;
  onNoteChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const NoteModal = ({
  isOpen,
  mode,
  note,
  onClose,
  onSubmit,
  onConfirm,
  onNoteChange
}: NoteModalProps) => {
  const isDeleteMode = mode === 'delete';
  const title = isDeleteMode 
    ? 'Are you sure you want to delete this note?'
    : mode === 'edit' 
      ? 'Edit Note' 
      : 'Add New Note';

  return (
    <Modal 
      isOpen={isOpen} 
      title={title}
      onClose={onClose}
    >
      {isDeleteMode ? (
        // Delete mode content
        <>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={note?.title || ''}
              disabled
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={note?.content || ''}
              disabled
            />
          </div>
          <div className={styles.modalButtons}>
            <Button 
              variant="grey"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              variant="danger"
              onClick={onConfirm}
            >
              Delete
            </Button>
          </div>
        </>
      ) : (
        // Add/Edit mode content
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={note?.title || ''}
              onChange={onNoteChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={note?.content || ''}
              onChange={onNoteChange}
              required
            />
          </div>
          <div className={styles.modalButtons}>
            <Button 
              variant="grey"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              type="submit"
            >
              {mode === 'edit' ? 'Update' : 'Submit'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default NoteModal; 