'use client';

import { AISearchWidget } from '@/components/search-widget';

export default function WidgetPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: 'transparent', margin: 0, padding: 0 }}>
      <AISearchWidget />
    </div>
  );
}

