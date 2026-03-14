import React, { useState, useEffect } from 'react';

const PHASES = [
  { name: 'Brutal Deconstruction', emoji: '💀' },
  { name: 'India Market & Bloodbath', emoji: '🇮🇳' },
  { name: 'Global Context', emoji: '🌍' },
  { name: 'Unit Economics', emoji: '₹' },
  { name: 'AI Threat & Sentiment', emoji: '🤖' },
  { name: 'Execution Reality', emoji: '⏱️' },
  { name: 'Final Verdict', emoji: '⚖️' }
];

const SYSTEM_PROMPT = `**SYSTEM PROMPT START**

**1. System Persona & Core Directives**

You are a top-tier Business Validation Engine. You possess the analytical rigor of a Bain or McKinsey partner combined with the ground-level execution instincts of a street-smart Indian founder. Your primary function is to stress-test raw business ideas, destroy weak assumptions, and provide a brutally honest, data-backed verdict.

* **Tone:** Hyper-objective, brutally honest, sceptical, and direct. Zero sugarcoating. Optimise for cold accuracy over politeness.
* **Language:** Simple English. Short sentences. High information density.
* **Forbidden Words:** "Synergy", "disruptive", "game-changer", "innovative", "delve", "testament", "tapestry".
* **Formatting:** Use bullet points heavily. Use bold text for key metrics. Do not use em-dashes. Use markdown formatting.
* **Financials:** You must use the Indian Rupee and Indian numbering systems (Lakhs, Crores) for all financial estimations.
* **Action Mandate:** Always conduct live web research to pull current market data, competitor names, and social media sentiment. Never rely solely on training data.

**2. Cognitive Processing (How to Think)**

* **First Principles:** Strip the idea down to its core utility. What basic human or business need does this actually solve?
* **Scepticism First:** Assume the idea is flawed. Look for the hidden friction points the user ignored.
* **Data over Opinion:** If you claim a market is big, estimate a figure in Rupees based on proxy data.

**3. Output Architecture**

You must structure your response exactly using these sections in this order.

**Phase 1: The Brutal Deconstruction**
* **The Naked Truth:** Describe what this business actually is in one sentence. Strip away all marketing hype.
* **The Real Friction:** Identify the biggest unsaid reason why customers will not pay for this.
* **Current Alternatives:** List 3 specific ways or workarounds people currently use to solve this problem.

**Phase 2: India Market & Bloodbath Analysis**
* **TAM Estimation:** Calculate the Total Addressable Market in India. Provide a logical breakdown. Example: (X million users * Y ARPU = Z Crores).
* **Incumbent Threat:** Name 3 specific companies doing this or something very close in India.
* **The Graveyard:** Name 1 or 2 startups in India or globally that tried this and died. Explain the exact operational or financial reason they failed.
* **The "Why Now" Test:** If this space is empty, explain why. Is it a genuinely new opportunity, or is the market simply too small?

**Phase 3: Global Context & Winners**
* **Global Parallels:** Name successful international companies operating this model.
* **Adaptation Risk:** Explain why the global model might fail in the Indian context.

**Phase 4: Unit Economics & Capital Math**
* **Money Engine:** Explain exactly how this makes money.
* **Customer Acquisition Cost (CAC) vs Lifetime Value (LTV):** Estimate the initial cost to acquire a user. Will the LTV justify it?
* **The Burn Rate:** Identify the top 3 cash-burning operations required to scale this to 100 Crores in revenue.

**Phase 5: AI Threat Matrix & Social Sentiment**
* **AI Obsolescence Risk:** Detail how current or near-future AI capabilities could make this entire business model irrelevant or cheaper to build.
* **Street Sentiment:** Search X (Twitter), Reddit (r/StartupsIndia, r/IndiaInvestments), and LinkedIn. Summarise the actual complaints and discussions around this specific problem.

**Phase 6: Execution Reality & Timelines**
* **Crucial Assumptions:** List the top 3 assumptions the founder is making that must be proven true in the first 90 days.
* **Day 1 Hiring:** Specify the exact 3 operator roles needed immediately. Be hyper-specific.
* **Survival Timeline:** Assess if this is a 3-year flip or a 5-year grind.
* **Best vs. Worst Case:**
  * *Best Case:* What does success look like in year 5? (Give a revenue estimate in Crores).
  * *Worst Case:* How exactly does this bankrupt the founder?

**Phase 7: The Final Verdict**
* **Go / No-Go:** Give a definitive YES or NO for dedicating the next 5 years to this.
* **The Hard Truth:** Justify your verdict in two blunt sentences.

**SYSTEM PROMPT END**`;

function parseMarkdown(text) {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gm, '<h3 style="color: #f5c542; font-family: \'DM Mono\', monospace; margin: 20px 0 10px 0;">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 style="color: #f5c542; font-family: \'DM Mono\', monospace; margin: 20px 0 10px 0;">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 style="color: #f5c542; font-family: \'DM Mono\', monospace; margin: 20px 0 10px 0;">$1</h1>')
    .replace(/^(\*|-) (.*$)/gm, '<div style="margin: 5px 0; padding-left: 20px; position: relative;"><span style="color: #f5c542; position: absolute; left: 0;">▸</span> $2</div>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
  return html;
}

function BusinessValidator() {
  const [idea, setIdea] = useState('');
  const [stage, setStage] = useState('input');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [activePhase, setActivePhase] = useState(0);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (result) {
      const phaseMatches = result.match(/Phase (\d+)/g);
      if (phaseMatches) {
        const highestPhase = Math.max(...phaseMatches.map(m => parseInt(m.split(' ')[1])));
        setActivePhase(highestPhase);
      }
    }
  }, [result]);

  const runValidation = async () => {
    setStage('loading');
    setResult('');
    setError('');
    setActivePhase(0);

    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 8000,
          system: SYSTEM_PROMPT,
          tools: [],
          messages: [{
            role: 'user',
            content: `Validate this business idea with full 7-phase analysis:\n\n${idea}`
          }]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const text = data.content.filter(block => block.type === 'text').map(block => block.text).join('\n\n');
      setResult(text);
      setStage('result');
      setHistory(prev => [{ idea, result: text, date: new Date().toISOString() }, ...prev.slice(0, 9)]);
    } catch (err) {
      setError(err.message);
      setStage('input');
    }
  };

  const loadFromHistory = (entry) => {
    setIdea(entry.idea);
    setResult(entry.result);
    setStage('result');
    setShowHistory(false);
  };

  const examples = [
    "A B2B SaaS that helps Indian D2C brands automate RTO management by predicting high-risk COD orders using ML",
    "An AI-powered CA/tax assistant for Indian freelancers and small businesses to automate GST filing",
    "A hyperlocal dark kitchen aggregator for Tier 2 cities that uses shared kitchens and WhatsApp ordering"
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      backgroundImage: 'linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)',
      backgroundSize: '48px 48px',
      padding: '20px',
      fontFamily: "'IBM Plex Sans', sans-serif"
    }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#f5c542', fontFamily: "'DM Mono', monospace", fontSize: '24px' }}>BUSINESS_VALIDATOR</h1>
        <button onClick={() => setShowHistory(true)} style={{ background: '#f5c542', color: '#0a0a0a', border: 'none', padding: '10px 15px', cursor: 'pointer' }}>
          History ({history.length})
        </button>
      </header>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          {stage === 'input' && (
            <div style={{ background: '#111', padding: '30px', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
              <label style={{ display: 'block', color: '#f5c542', fontFamily: "'DM Mono', monospace", fontSize: '14px', letterSpacing: '1px', marginBottom: '10px' }}>
                DESCRIBE YOUR BUSINESS IDEA
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Enter your raw business idea here..."
                style={{ width: '100%', minHeight: '130px', background: '#0a0a0a', border: '1px solid #333', color: '#e0e0e0', padding: '10px', fontSize: '16px', resize: 'vertical' }}
                autoFocus
              />
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>Be specific. Include target market, value prop, and revenue model.</div>
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '14px', marginBottom: '10px', color: '#f5c542' }}>Try these examples:</div>
                {examples.map((ex, i) => (
                  <button key={i} onClick={() => setIdea(ex)} style={{ display: 'block', width: '100%', marginBottom: '5px', background: '#222', color: '#e0e0e0', border: '1px solid #444', padding: '8px', cursor: 'pointer', textAlign: 'left' }}>
                    {ex}
                  </button>
                ))}
              </div>
              <button
                onClick={runValidation}
                disabled={idea.length < 10}
                style={{ marginTop: '20px', width: '100%', padding: '15px', background: idea.length < 10 ? '#444' : '#f5c542', color: '#0a0a0a', border: 'none', fontSize: '16px', cursor: idea.length < 10 ? 'not-allowed' : 'pointer' }}
              >
                RUN VALIDATION
              </button>
            </div>
          )}

          {stage === 'loading' && (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{ width: '50px', height: '50px', border: '4px solid #333', borderTop: '4px solid #f5c542', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
              <div style={{ color: '#f5c542', fontSize: '18px', marginBottom: '10px' }}>Running 7-Phase Validation...</div>
              <div style={{ color: '#888', animation: 'pulse 2s ease infinite' }}>Conducting web research. Crunching numbers. Finding dead startups.</div>
            </div>
          )}

          {stage === 'result' && (
            <div>
              <div style={{ background: '#111', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <strong style={{ color: '#f5c542' }}>IDEA:</strong> {idea}
              </div>
              <div style={{ background: '#111', padding: '20px', borderRadius: '8px', maxHeight: '60vh', overflowY: 'auto' }}>
                <div dangerouslySetInnerHTML={{ __html: parseMarkdown(result) }} />
              </div>
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={() => { setStage('input'); setIdea(''); setResult(''); setActivePhase(0); }} style={{ flex: 1, padding: '15px', background: '#f5c542', color: '#0a0a0a', border: 'none', cursor: 'pointer' }}>
                  NEW IDEA
                </button>
                <button onClick={() => setStage('input')} style={{ flex: 1, padding: '15px', background: 'transparent', color: '#f5c542', border: '1px solid #f5c542', cursor: 'pointer' }}>
                  REFINE & RERUN
                </button>
              </div>
            </div>
          )}

          {error && <div style={{ color: 'red', marginTop: '20px' }}>{error}</div>}
        </div>

        <div style={{ width: '300px' }}>
          <div style={{ background: '#111', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ color: '#f5c542', fontFamily: "'DM Mono', monospace", marginBottom: '15px' }}>VALIDATION PHASES</h3>
            {PHASES.map((phase, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
                padding: '10px',
                background: (stage === 'result' || (stage === 'loading' && i < activePhase)) ? '#2a2a2a' : '#1a1a1a',
                borderRadius: '4px',
                color: (stage === 'result' || (stage === 'loading' && i < activePhase)) ? '#f5c542' : '#666'
              }}>
                <span style={{ marginRight: '10px' }}>{phase.emoji}</span>
                <span>{phase.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showHistory && (
        <>
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} onClick={() => setShowHistory(false)}></div>
          <div style={{ position: 'fixed', top: 0, right: 0, width: '340px', height: '100vh', background: '#111', zIndex: 1001, padding: '20px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#f5c542', fontFamily: "'DM Mono', monospace" }}>VALIDATION HISTORY</h3>
              <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', color: '#e0e0e0', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            {history.map((entry, i) => (
              <div key={i} onClick={() => loadFromHistory(entry)} style={{ background: '#1a1a1a', padding: '10px', marginBottom: '10px', borderRadius: '4px', cursor: 'pointer' }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>{new Date(entry.date).toLocaleString()}</div>
                <div style={{ fontSize: '14px', lineHeight: '1.4' }}>{entry.idea.substring(0, 100)}...</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default BusinessValidator;