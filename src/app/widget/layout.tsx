'use client';

import { RootProvider } from 'fumadocs-ui/provider/next';
import { useEffect } from 'react';
import '../global.css';
import './widget.css';

export default function WidgetLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('dark');
    html.classList.add('light');
    
    try {
      localStorage.setItem('theme', 'light');
    } catch (_) {}
  }, []);

  return (
    <div className="widget-container light" style={{ background: 'transparent', margin: 0, padding: 0, minHeight: '100vh' }}>
      <RootProvider>
        {children}
      </RootProvider>
    </div>
  );
}

