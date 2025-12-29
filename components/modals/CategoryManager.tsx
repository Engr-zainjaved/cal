'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useCalendarStore } from '@/lib/store/calendar-store';
import { useCategories } from '@/hooks/useCategories';
import { Pencil, Trash2, Plus } from 'lucide-react';

export function CategoryManager() {
  const {
    isCategoryManagerOpen,
    closeCategoryManager,
  } = useCalendarStore();

  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();

  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3B82F6');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newName) return;

    addCategory({ name: newName, color: newColor });
    setNewName('');
    setNewColor('#3B82F6');
  };

  const handleUpdate = (id: string, name: string, color: string) => {
    updateCategory(id, { name, color });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
    setDeleteConfirm(null);
  };

  return (
    <>
      <Dialog open={isCategoryManagerOpen} onOpenChange={closeCategoryManager}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Existing categories */}
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-2 p-2 rounded border"
                >
                  <div
                    className="h-6 w-6 rounded flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="flex-1">{category.name}</span>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingId(category.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {category.name !== 'Other' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirm(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add new category */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Add New Category</h3>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="newName">Name</Label>
                  <Input
                    id="newName"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Category name"
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <ColorPicker color={newColor} onChange={setNewColor} />
                </div>
                <Button onClick={handleAdd} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title="Delete Category"
        description="Events in this category will be moved to 'Other'. This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
      />
    </>
  );
}
