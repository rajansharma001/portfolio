import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="container site-footer">
      <div>
        <strong>RAJAN SHARMA</strong> — FULL-STACK ENGINEER
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="/blog" style={{ textDecoration: 'underline' }}>
          Journal
        </Link>
        <span>&copy; {new Date().getFullYear()} • KATHMANDU, NEPAL</span>
      </div>
      <div>
        <a href="#header">Back To Top &uarr;</a>
      </div>
    </footer>
  );
}
