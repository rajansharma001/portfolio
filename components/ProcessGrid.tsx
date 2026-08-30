import React from 'react';
import { PortfolioSettings, DEFAULT_PROCESS_STEPS } from '@/lib/types';

interface ProcessGridProps {
  settings?: PortfolioSettings | null;
}

export default function ProcessGrid({ settings }: ProcessGridProps) {
  const steps = settings?.processSteps && settings.processSteps.length > 0 
    ? settings.processSteps 
    : DEFAULT_PROCESS_STEPS;

  return (
    <section id="process" className="section container reveal">
      <div className="section-header">
        <span className="section-num">04</span>
        <h2 className="section-title">Engineering Methodology</h2>
      </div>

      <div className="process-grid">
        {steps.map((step) => (
          <div key={step.num} className="process-card">
            <span className="process-num">{step.num}.</span>
            <h4>{step.title}</h4>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
