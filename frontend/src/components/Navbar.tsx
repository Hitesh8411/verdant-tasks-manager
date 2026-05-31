import { Leaf, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-4 z-40 px-4 sm:px-6">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-border/50 bg-white/70 px-4 py-2 shadow-soft backdrop-blur-md sm:px-6"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <div>
            <p className="font-heading text-lg font-bold leading-tight text-foreground">Verdant Tasks</p>
            {user && (
              <p className="text-xs text-muted-foreground">Welcome, {user.name}</p>
            )}
          </div>
        </div>

        {user && (
          <Button variant="ghost" onClick={logout} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        )}
      </nav>
    </header>
  );
}
