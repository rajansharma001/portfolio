import React from 'react';

export default function ProcessGrid() {
  const steps = [
    {
      num: '01',
      title: 'Analyze & Architect',
      desc: 'Defining system requirements, database schema design, and technical feasibility for scalable infrastructure.',
    },
    {
      num: '02',
      title: 'Backend Engineering',
      desc: 'Building secure REST APIs, authentication pipelines, and data ingestion services using Node.js & PostgreSQL.',
    },
    {
      num: '03',
      title: 'Frontend Integration',
      desc: 'Connecting server actions to Next.js clients, optimizing caching layers, and ensuring responsive UI/UX.',
    },
    {
      num: '04',
      title: 'Deploy & Scale',
      desc: 'CI/CD pipeline configuration, server provisioning, containerization, and post-launch monitoring.',
    },
  ];

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
