import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BlobBackground } from '../components/BlobBackground';
import { Button } from '../components/Button';
import { ErrorAlert } from '../components/ErrorAlert';
import { Input } from '../components/Input';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function LoginPage() {
  const { user, isInitializing, error, login, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isInitializing) {
    return <LoadingSpinner fullScreen message="Checking your session..." />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch {
      /* error handled in context */
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12">
      <BlobBackground variant={1} color="moss" className="left-[-10%] top-[10%] h-72 w-72" />
      <BlobBackground variant={2} color="clay" className="bottom-[5%] right-[-5%] h-80 w-80" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-soft">
            <Leaf className="h-8 w-8 text-primary-foreground" aria-hidden="true" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to tend your tasks</p>
        </div>

        <div className="card-surface rounded-[2rem] rounded-tl-[4rem] p-8">
          {error && (
            <div className="mb-6">
              <ErrorAlert message={error} onDismiss={clearError} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              required
            />
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
