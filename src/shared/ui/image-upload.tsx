import { useRef, useState } from 'react';
import { Button } from './button';
import { Upload, X, ImageIcon } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { api, API_BASE_URL } from '@/shared/api';

interface Props {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

const FALLBACK_IMAGE = 'https://placehold.co/400x300?text=No+Image';

export const ImageUpload = ({ value, onChange, className }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/upload', formData);
      onChange(data.url);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const resolvedValue = value?.startsWith('/api/upload/')
    ? `${API_BASE_URL}${value}`
    : value;

  const displayUrl = resolvedValue || FALLBACK_IMAGE;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden rounded-lg border bg-muted">
        <img
          src={displayUrl}
          alt="Preview"
          className="h-full w-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-white shadow hover:bg-destructive/90"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="mr-1 h-4 w-4" />
          {isUploading ? 'Загрузка...' : 'Загрузить'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange('')}
        >
          <ImageIcon className="mr-1 h-4 w-4" />
          По умолчанию
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};
