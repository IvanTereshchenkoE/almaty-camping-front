import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useLocations } from '@/entities/location/model';
import { useAuthStore } from '@/entities/user/model';
import { useRevealOnScroll } from '@/shared/lib/use-reveal-on-scroll';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { LocationCard } from './location-card';
import { LocationDetailDialog } from './location-detail-dialog';
import { LocationForm } from '@/features/location-form/ui/LocationForm';
import { useDeleteLocation } from '@/entities/location/model';
import type { Location } from '@/shared/types';
import { useTranslation } from 'react-i18next';

export function HomeLocations() {
  const { t } = useTranslation('home');
  const { data: locations, isLoading } = useLocations();
  const { isAdmin } = useAuthStore();
  const deleteLocation = useDeleteLocation();
  const [selected, setSelected] = useState<Location | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const { ref: titleRef, isVisible: titleVisible } = useRevealOnScroll<HTMLDivElement>();

  const handleAdd = () => {
    setFormMode('create');
    setEditingId(undefined);
    setFormOpen(true);
  };

  const handleEdit = (id: string) => {
    setFormMode('edit');
    setEditingId(id);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingId(undefined);
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (confirm(t('locations.deleteConfirm'))) {
      await deleteLocation.mutateAsync(editingId);
      handleCloseForm();
    }
  };

  return (
    <section id="locations" className="py-20 md:py-28 bg-slate-50/60">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div
          ref={titleRef}
          className={cn(
            'text-center mb-12 md:mb-16 transition-all duration-500',
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          )}
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            {t('locations.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            {t('locations.subtitle')}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {locations?.map((loc, i) => (
              <LocationCard
                key={loc.id}
                location={loc}
                index={i}
                isVisible={true}
                onClick={() => setSelected(loc)}
                onEdit={isAdmin ? () => handleEdit(loc.id) : undefined}
              />
            ))}
            {isAdmin && (
              <button
                onClick={handleAdd}
                className={cn(
                  'group relative isolate w-full text-left overflow-hidden rounded-[28px]',
                  'border border-dashed border-slate-300 bg-white shadow-sm',
                  'transition-all duration-300 ease-out transform-gpu',
                  'hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_18px_50px_rgba(15,118,110,0.12)]',
                  'active:scale-[0.99]'
                )}
                style={{ transitionDelay: `${(locations?.length || 0) * 100}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600">
                    <Plus className="h-8 w-8" />
                  </div>
                </div>
                <div className="p-6 flex items-center justify-center">
                  <span className="text-sm font-medium text-slate-500 transition-colors group-hover:text-emerald-700">
                    {t('locations.addLocation')}
                  </span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      <LocationDetailDialog location={selected} onClose={() => setSelected(null)} />

      <Dialog open={formOpen} onOpenChange={(open) => !open && handleCloseForm()}>
        <DialogContent className="max-w-2xl max-h-[90svh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create' ? t('locations.form.createTitle') : t('locations.form.editTitle')}
            </DialogTitle>
          </DialogHeader>
          <LocationForm
            mode={formMode}
            locationId={editingId}
            onSuccess={handleCloseForm}
            onDelete={formMode === 'edit' ? handleDelete : undefined}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
