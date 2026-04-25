import React, { useState, useEffect, useRef } from 'react';
import { evaluateState } from './bridge';
import { TshOutput, StateSeal, StateType } from './types/riverbraid';

function App() {
  const [anchor, setAnchor] = useState('0xDE2062');
  const [state, setState] = useState('');
  const [type, setType] = useState<StateType>('Linear');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [history, setHistory] = useState<StateSeal[]>(() => {
    const saved = localStorage.getItem('riverbraid_v2_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentOutput, setCurrentOutput] = useState<TshOutput | null>(null);

  const prevHash = history.length > 0 ? history[history.length - 1].hash : '0x0000_GENESIS';
  const sequence = history.length + 1;

  useEffect(() => {
    localStorage.setItem('riverbraid_v2_history', JSON.stringify(history));
  }, [history]);

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

  const exportManifest = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `riverbraid_manifest_seq${history.length}.json`);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const triggerImport = () => fileInputRef.current?.click();

  const importManifest = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setHistory(imported);
        }
      } catch (err) {
        console.error("Invalid Manifest");
      }
    };
    reader.readAsText(file);
  };

  const clearBraid = () => {
    if (window.confirm("CAUTION: This will purge the local braid. Proceed?")) {
      setHistory([]);
      localStorage.removeItem('riverbraid_v2_history');
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#080808', color: '#f0f0f0', minHeight: '100vh', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '2px solid #ffd700', paddingBottom: '10px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ color: '#ffd700', margin: 0, fontSize: '1.5rem' }}>RIVERBRAID // GOLD_SYSTEM_v2</h1>
          <span style={{ color: '#00ff00', fontSize: '0.7rem' }}>? SOVEREIGN_CORE (PERSISTENT)</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <input type="file" ref={fileInputRef} onChange={importManifest} style={{ display: 'none' }} accept=".json" />
          <button onClick={triggerImport} style={{ background: 'transparent', border: '1px solid #00ff00', color: '#00ff00', padding: '5px 10px', cursor: 'pointer', fontSize: '0.7rem', marginRight: '10px' }}>RESURRECT_BRAID</button>
          <button onClick={exportManifest} style={{ background: 'transparent', border: '1px solid #ffd700', color: '#ffd700', padding: '5px 10px', cursor: 'pointer', fontSize: '0.7rem', marginRight: '10px' }}>EXPORT_MANIFEST</button>
          <button onClick={clearBraid} style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '5px 10px', cursor: 'pointer', fontSize: '0.7rem' }}>PURGE_LOCAL</button>
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
            {!currentOutput?.ok && (
              <div style={{ marginTop: '10px', color: '#ff4444', fontSize: '0.7rem' }}>
                FAIL_CLOSED: {currentOutput?.failures.map(f => f.id).join(', ')}
              </div>
            )}
          </div>
        </main>

        <aside>
          <h3 style={{ color: '#ffd700', marginTop: 0 }}>INTEGRITY_LEDGER (SEQ: {history.length})</h3>
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
