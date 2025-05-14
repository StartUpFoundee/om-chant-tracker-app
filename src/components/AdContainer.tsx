
import { cn } from "@/lib/utils";

interface AdContainerProps {
  position: 'top' | 'middle' | 'bottom';
  className?: string;
}

export function AdContainer({ position, className }: AdContainerProps) {
  return (
    <div 
      className={cn(
        "w-full bg-secondary/50 rounded-lg border border-dashed border-border flex items-center justify-center p-4",
        position === 'top' ? 'mt-0 mb-6' : 
        position === 'middle' ? 'my-6' : 
        'mt-6 mb-0',
        className
      )}
    >
      <div className="text-center">
        <p className="text-muted-foreground text-sm">Advertisement</p>
        <p className="text-xs text-muted-foreground/70">
          Place your ad here ({position} position)
        </p>
      </div>
    </div>
  );
}
