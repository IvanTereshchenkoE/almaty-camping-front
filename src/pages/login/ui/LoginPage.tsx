import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/entities/user/model';
import { authApi } from '@/entities/user/api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ROUTES } from '@/shared/config';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

export const LoginPage = () => {
  const { t } = useTranslation(['auth', 'seo']);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      setAuth(data.user, data.access_token);
      if (data.user.role === 'ADMIN') {
        navigate(ROUTES.ADMIN);
      } else {
        navigate(ROUTES.HOME);
      }
    } catch (err: any) {
      if (err.response?.data?.message === 'Client login is not allowed') {
        setError(t('auth:login.clientNotAllowed'));
      } else {
        setError(t('auth:login.invalidCredentials'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('seo:login.title')}</title>
        <meta name="description" content={t('seo:login.description')} />
      </Helmet>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>{t('auth:login.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth:login.email')}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth:login.password')}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('auth:login.loading') : t('auth:login.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
