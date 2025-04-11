'use client';

import React, { createContext, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Contexte pour gérer l'état de l'accordéon
type AccordionContextType = {
  activeItem: string | null;
  setActiveItem: (value: string | null) => void;
  collapsible: boolean;
};

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

// Hook pour utiliser le contexte de l'accordéon
const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordion doit être utilisé à l\'intérieur d\'un Accordion');
  }
  return context;
};

// Composant Accordion principal
interface AccordionProps {
  type: 'single' | 'multiple';
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function CustomAccordion({ type, collapsible = false, className, children }: AccordionProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  return (
    <AccordionContext.Provider value={{ activeItem, setActiveItem, collapsible }}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// Composant AccordionItem
interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function CustomAccordionItem({ value, className, children }: AccordionItemProps) {
  return (
    <div className={cn('mb-4', className)} data-value={value}>
      {children}
    </div>
  );
}

// Composant AccordionTrigger
interface AccordionTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export function CustomAccordionTrigger({ className, children }: AccordionTriggerProps) {
  const { activeItem, setActiveItem, collapsible } = useAccordion();
  const itemValue = (children as any)?.props?.['data-value'] || '';

  const handleClick = () => {
    if (activeItem === itemValue) {
      if (collapsible) {
        setActiveItem(null);
      }
    } else {
      setActiveItem(itemValue);
    }
  };

  const isOpen = activeItem === itemValue;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex w-full items-center justify-between rounded-md py-4 text-left text-sm font-medium transition-all outline-none',
        className
      )}
      aria-expanded={isOpen}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-5 w-5 shrink-0 transition-transform duration-300',
          isOpen && 'rotate-180'
        )}
      />
    </button>
  );
}

// Composant AccordionContent
interface AccordionContentProps {
  className?: string;
  children: React.ReactNode;
}

export function CustomAccordionContent({ className, children }: AccordionContentProps) {
  const { activeItem } = useAccordion();
  const itemValue = (children as any)?.props?.['data-value'] || '';
  const isOpen = activeItem === itemValue;

  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-300',
        isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
        className
      )}
    >
      {isOpen && <div className={cn('pt-2 pb-6')}>{children}</div>}
    </div>
  );
}
