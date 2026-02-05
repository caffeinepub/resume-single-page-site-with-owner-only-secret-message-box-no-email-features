import { useEffect, useRef, useState, type ReactNode } from 'react';

interface SectionProps {
  id: string;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Section({ id, title, children, className = '' }: SectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`py-16 px-6 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {title && (
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4 relative inline-block">
            {title}
            <span className="absolute -bottom-2 left-0 w-20 h-1 bg-gold rounded-full"></span>
          </h2>
        </div>
      )}
      {children}
    </section>
  );
}
