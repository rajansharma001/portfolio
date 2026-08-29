import React from 'react';

export default function Marquee() {
  const stack = [
    'NEXT.JS',
    'REACT',
    'TYPESCRIPT',
    'NODE.JS',
    'EXPRESS',
    'POSTGRESQL',
    'MONGODB',
    'TAILWIND CSS',
  ];

  return (
    <div className="marquee-wrapper">
      <div className="marquee">
        {stack.map((item, idx) => (
          <span key={`m1-${idx}`}>{item}</span>
        ))}
        {stack.map((item, idx) => (
          <span key={`m2-${idx}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
