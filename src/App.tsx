import React, { useState, useEffect } from 'react';
import { evaluateState } from './bridge';
import { TshOutput, StateSeal, StateType } from './types/riverbraid';

function App() {
  const [anchor, setAnchor] = useState('0xDE2062');
  const [state, setState] = useState('');
  const [type, setType] = useState<StateType>('Linear');
  const [history, setHistory] = useState<StateSeal[]>([]);
  const [currentOutput, setCurrentOutput] = useState<TshOutput | null>(null);

  const prevHash = history.length > 0 ? history[history.length - 1].hash : '0x0000_GENESIS';
  const sequence = history.length + 1;

  useEffect(() => {
    const runScan = async () => {
      const result = await evaluateState(anchor, state, type, sequence, prevHash);
      setCurrentOutput(result);
    };
    runScan();
  }, [anchor, state, type, history]);

  const commitState = () => {
    if (currentOutput?.seal) {
      setHistory([...history, currentOutput.seal]);
      setState('');
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#080808', color: '#f0f0f0', minHeight: '100vh', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '2px solid #ffd700', paddingBottom: '10px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ color: '#ffd700', margin: 0, fontSize: '1.5rem' }}>RIVERBRAID // GOLD_SYSTEM_v2</h1>
          <span style={{ color: '#00ff00', fontSize: '0.7rem' }}>? CORE_STABLE</span>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#666' }}>
          NODE_PORT: 4444 <br/> SEQ_DEPTH: {history.length}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
        <main>
          <div style={{ background: '#111', padding: '25px', border: '1px solid #222', borderRadius: '8px' }}>
            <h3 style={{ color: '#ffd700', marginTop: 0 }}>STATE_PROPOSAL</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#666', fontSize: '0.7rem' }}>ANCHOR</label>
              <input value={anchor} onChange={e => setAnchor(e.target.value)} style={{ width: '100%', background: '#000', border: '1px solid #333', color: '#ffd700', padding: '10px' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#666', fontSize: '0.7rem' }}>GOVERNANCE_TYPE</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                {['Linear', 'Nonlinear'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setType(t as StateType)}
                    style={{ flex: 1, padding: '10px', cursor: 'pointer', border: '1px solid #333', background: type === t ? '#ffd700' : '#111', color: type === t ? '#000' : '#666', fontWeight: 'bold' }}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#666', fontSize: '0.7rem' }}>SUBSTRATE_DATA</label>
              <textarea value={state} onChange={e => setState(e.target.value)} style={{ width: '100%', background: '#000', border: '1px solid #333', color: '#fff', padding: '10px', height: '120px', resize: 'none' }} />
            </div>

            <button 
              onClick={commitState}
              disabled={!currentOutput?.ok}
              style={{ width: '100%', padding: '15px', background: currentOutput?.ok ? '#ffd700' : '#222', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              EXECUTE_SEAL
            </button>
          </div>
        </main>

        <aside>
          <h3 style={{ color: '#ffd700', marginTop: 0 }}>INTEGRITY_LEDGER</h3>
          <div style={{ overflowY: 'auto', maxHeight: '70vh', display: 'flex', flexDirection: 'column-reverse', gap: '12px' }}>
            {history.map((s) => (
              <div key={s.hash} style={{ padding: '15px', border: '1px solid #222', background: '#0a0a0a', fontSize: '0.75rem', position: 'relative' }}>
                <span style={{ position: 'absolute', right: '10px', top: '10px', color: '#444' }}>#{s.sequence}</span>
                <div style={{ color: '#ffd700', fontWeight: 'bold', marginBottom: '5px' }}>[{s.type}] STATIONARY_SEAL</div>
                <div style={{ color: '#00ff00', fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: '5px' }}>{s.hash}</div>
                <div style={{ color: '#666' }}>ANCHOR: {s.anchor}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
