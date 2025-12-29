'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useCalendarStore } from '@/lib/store/calendar-store';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useCategories } from '@/hooks/useCategories';

export function EventModal() {
  const {
    isEventModalOpen,
    closeEventModal,
    editingEvent,
  } = useCalendarStore();

  const { addEvent, updateEvent, deleteEvent } = useCalendarEvents();
  const { categories } = useCategories();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = !!editingEvent?.id;

  // Load editing event data
  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDescription(editingEvent.description || '');
      setStartDate(editingEvent.startDate);
      setEndDate(editingEvent.endDate);
      setCategoryId(editingEvent.categoryId);
      setNotes(editingEvent.notes || '');
    } else {
      // Reset form
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setCategoryId(categories[0]?.id || '');
      setNotes('');
    }
  }, [editingEvent, categories]);

  const handleSave = () => {
    if (!title || !startDate || !endDate || !categoryId) {
      alert('Please fill in all required fields');
      return;
    }

    if (startDate > endDate) {
      alert('End date must be after start date');
      return;
    }

    const eventData = {
      title,
      description,
      startDate,
      endDate,
      categoryId,
      notes,
    };

    if (isEditing) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }

    closeEventModal();
  };

  const handleDelete = () => {
    if (editingEvent?.id) {
      deleteEvent(editingEvent.id);
      closeEventModal();
    }
  };

  return (
    <>
      <Dialog open={isEventModalOpen} onOpenChange={closeEventModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Event' : 'Create Event'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            {isEditing && (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </Button>
            )}
            <Button variant="outline" onClick={closeEventModal}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
}
