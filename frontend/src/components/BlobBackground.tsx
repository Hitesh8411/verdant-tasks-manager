interface BlobBackgroundProps {
  variant?: 1 | 2 | 3;
  className?: string;
  color?: 'moss' | 'clay' | 'sand';
}

const colorMap = {
  moss: 'bg-primary/20',
  clay: 'bg-secondary/20',
  sand: 'bg-accent/40',
};

const shapeMap = {
  1: 'blob-shape-1',
  2: 'blob-shape-2',
  3: 'blob-shape-3',
};

export function BlobBackground({ variant = 1, className = '', color = 'moss' }: BlobBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute blur-3xl ${colorMap[color]} ${shapeMap[variant]} ${className}`}
    />
  );
}
