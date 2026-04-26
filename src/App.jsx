import React, { useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import { analytics } from './firebaseConfig';
import { logEvent } from 'firebase/analytics';

function App() {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'app_open', { purpose: 'voter_saathi_init' });
    }
  }, []);

  return (
    <div className="app-container" role="main" aria-label="Voter-saathi Election Assistant">
      <header className="header" role="banner">
        <h1>Voter-saathi</h1>
        <p>Your Hyper-Localized Election Assistant 🇮🇳</p>
      </header>
      <ChatWindow />
    </div>
  );
}

export default App;
