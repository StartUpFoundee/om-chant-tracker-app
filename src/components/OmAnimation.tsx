
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface OmAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  withParticles?: boolean;
  className?: string;
}

export function OmAnimation({ 
  size = 'md', 
  withParticles = true,
  className
}: OmAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create particles
  useEffect(() => {
    if (!withParticles || !containerRef.current) return;
    
    const container = containerRef.current;
    const particleCount = size === 'lg' ? 15 : size === 'md' ? 10 : 5;
    
    const particles: HTMLDivElement[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      const size = Math.random() * 8 + 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Position randomly around the Om symbol
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 50 + 50;
      const x = Math.cos(angle) * distance + 50;
      const y = Math.sin(angle) * distance + 50;
      
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;
      
      // Add animation with random duration
      const duration = Math.random() * 10 + 10;
      particle.style.animation = `float ${duration}s ease-in-out infinite`;
      particle.style.animationDelay = `-${Math.random() * duration}s`;
      
      container.appendChild(particle);
      particles.push(particle);
    }
    
    return () => {
      particles.forEach(p => p.remove());
    };
  }, [size, withParticles]);

  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl'
  };
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative flex items-center justify-center p-8",
        className
      )}
    >
      <div className={cn(
        "om-symbol animate-pulse-gentle text-spiritual-gold",
        sizeClasses[size]
      )}>
        ॐ
      </div>
    </div>
  );
}
