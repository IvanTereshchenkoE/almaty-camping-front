import { useParams } from 'react-router-dom';
import { AccessoryForm } from '@/features/accessory-form/ui/AccessoryForm';

export const AccessoryEditPage = () => {
  const { id } = useParams<{ id: string }>();
  return <AccessoryForm mode="edit" accessoryId={id} />;
};
