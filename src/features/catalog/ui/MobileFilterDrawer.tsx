import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Dialog, DialogOverlay } from '@/shared/ui/dialog';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const MobileFilterDrawer = ({ open, onClose, title = 'Фильтры', footer, children }: Props) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogPrimitive.Portal>
        <DialogOverlay className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 md:hidden" />
        <DialogPrimitive.Content
          className="fixed bottom-0 left-0 right-0 top-auto z-50 h-[85svh] w-full translate-x-0 translate-y-0 rounded-t-[28px] border-0 bg-white p-0 shadow-2xl outline-none md:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
        >
          <div className="flex h-full flex-col">
            {/* Drag handle */}
            <div className="flex items-center justify-center pt-3 pb-1">
              <div className="h-1.5 w-10 rounded-full bg-slate-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3">
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              <DialogPrimitive.Close
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </DialogPrimitive.Close>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 py-2">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="sticky bottom-0 border-t bg-white/90 p-4 backdrop-blur">
                {footer}
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
};
