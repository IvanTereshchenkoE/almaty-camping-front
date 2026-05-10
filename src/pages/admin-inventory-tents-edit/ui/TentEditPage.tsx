import { useParams } from 'react-router-dom';
import { TentForm } from '@/features/tent-form/ui/TentForm';

export const TentEditPage = () => {
  const { id } = useParams<{ id: string }>();
  return <TentForm mode="edit" tentId={id} />;
};
