import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BlobBackground } from '../components/BlobBackground';
import { Button } from '../components/Button';
import { ErrorAlert } from '../components/ErrorAlert';
import { Input } from '../components/Input';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function RegisterPage() {
  const { user, isInitializing, error, register, clearError } = useAuth();
  const [name, setName] = useState('');
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
      await register(name, email, password);
    } catch {
      /* error handled in context */
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12">
      <BlobBackground variant={2} color="sand" className="left-[-8%] bottom-[15%] h-64 w-64" />
      <BlobBackground variant={3} color="moss" className="right-[-8%] top-[8%] h-72 w-72" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary shadow-float">
            <Sprout className="h-8 w-8 text-secondary-foreground" aria-hidden="true" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-foreground">Start growing</h1>
          <p className="mt-2 text-muted-foreground">Create your account in a moment</p>
        </div>

        <div className="card-surface rounded-[2rem] rounded-br-[4rem] p-8">
          {error && (
            <div className="mb-6">
              <ErrorAlert message={error} onDismiss={clearError} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              required
            />
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
              placeholder="At least 6 characters"
              autoComplete="new-password"
              minLength={6}
              required
            />
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
