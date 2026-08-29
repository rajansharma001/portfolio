import React from 'react';

export default function ProcessGrid() {
  const steps = [
    {
      num: '01.',
      title: 'Analyze',
      desc: 'Deconstructing operational requirements into technical specifications and data schemas.',
    },
    {
      num: '02.',
      title: 'Architect',
      desc: 'Designing modular APIs, choosing database structures, and setting up scalable frontend layouts.',
    },
    {
      num: '03.',
      title: 'Develop',
      desc: 'Writing type-safe, performant code backed by robust state management and security protocols.',
    },
    {
      num: '04.',
      title: 'Deploy',
      desc: 'Continuous deployment, performance optimization, server hardening, and documentation.',
    },
  ];

  return (
    <section className="section container reveal">
      <div className="section-header">
        <span className="section-num">04</span>
        <h2 className="section-title">Engineering Methodology</h2>
      </div>

      <div className="process-grid">
        {steps.map((step, idx) => (
          <div key={idx} className="process-card">
            <span className="process-num">{step.num}</span>
            <h4>{step.title}</h4>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
