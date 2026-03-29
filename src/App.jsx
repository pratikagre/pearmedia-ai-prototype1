import React, { useState } from 'react';
import Navbar from './components/Navbar';
import WorkflowText from './components/WorkflowText';
import WorkflowImage from './components/WorkflowImage';

function App() {
  const [activeTab, setActiveTab] = useState('text');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main>
        {activeTab === 'text' && <WorkflowText />}
        {activeTab === 'image' && <WorkflowImage />}
      </main>

      <footer className="mt-auto py-6 text-center text-sm text-gray-400">
        <p>Built for Pear Media Lab | Integrates UI/UX, NLP & GenAI</p>
      </footer>
    </div>
  );
}

export default App;
