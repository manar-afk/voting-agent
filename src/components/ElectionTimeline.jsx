import React from 'react';

const TIMELINE_STAGES = [
  { id: 1, title: 'Notification', desc: 'Election dates are officially announced by the ECI.' },
  { id: 2, title: 'Nomination', desc: 'Candidates file their papers to contest the election.' },
  { id: 3, title: 'Scrutiny', desc: 'The ECI checks all candidate papers for validity.' },
  { id: 4, title: 'Campaigning', desc: 'Candidates present their manifestos to the public.' },
  { id: 5, title: 'Silence Period', desc: '48 hours before voting: No campaigning allowed. (Time to think!)' },
  { id: 6, title: 'Poll Day', desc: 'Citizens cast their votes at the polling booth.' },
  { id: 7, title: 'Counting', desc: 'Votes are counted and results are declared.' }
];

export default function ElectionTimeline() {
  return (
    <div className="timeline-container" aria-label="Election Process Timeline">
      <h3 className="timeline-header">The Democratic Journey</h3>
      <div className="timeline">
        {TIMELINE_STAGES.map((stage, index) => (
          <div key={stage.id} className="timeline-item">
            <div className="timeline-node">
              <span className="node-number">{stage.id}</span>
            </div>
            <div className="timeline-content">
              <h4>{stage.title}</h4>
              <p>{stage.desc}</p>
            </div>
            {index < TIMELINE_STAGES.length - 1 && <div className="timeline-line"></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
