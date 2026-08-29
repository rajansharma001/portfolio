"use client";

import React, { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(15);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    'Connecting to MongoDB Atlas Cluster...',
    'Loading 16 Production Systems & Blueprints...',
    'Fetching Technical Matrix & Engineering Journal...',
    'System Ready.',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 150);

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 300);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#080c14',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        color: '#ffffff',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Terminal Header */}
        <div
          style={{
            border: '1px solid #243048',
            borderRadius: '6px',
            background: '#0e1422',
            padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.05em' }}>
              RAJAN SHARMA // INITIALIZING
            </span>
          </div>

          <div style={{ fontSize: '13px', lineHeight: '1.8', minHeight: '80px', marginBottom: '1.5rem' }}>
            {steps.slice(0, stepIndex + 1).map((step, idx) => (
              <div key={idx} style={{ color: idx === stepIndex ? '#60a5fa' : '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#3b82f6' }}>▸</span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '4px', background: '#1e293b', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(progress, 100)}%`,
                  background: 'linear-gradient(90deg, #2563eb, #60a5fa)',
                  transition: 'width 0.2s ease-out',
                }}
              />
            </div>
            <span style={{ fontSize: '12px', color: '#94a3b8', width: '38px', textAlign: 'right' }}>
              {Math.min(progress, 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
