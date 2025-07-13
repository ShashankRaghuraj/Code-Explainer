import React, { useState, useEffect } from 'react';
import './App.css';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

const API_URL = 'http://localhost:8000';

const initialExplanation = (
  <span>
    <b style={{ color: '#3a6df0' }}>Code Explainer</b> lets you <b>write</b>, <b style={{ color: '#6a82fb' }}>highlight</b>, <b>explain</b>, and <b style={{ color: '#5b85f6' }}>run</b> Python code.<br/>
    <span style={{ color: '#b6c2e0' }}>Highlight code and press <b>E</b> to get a simple explanation, or use the buttons below.</span>
  </span>
);

function App() {
  const [code, setCode] = useState('print("Hello, world!")');
  const [explanation, setExplanation] = useState<React.ReactNode>(initialExplanation);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Only for running code
  const [explaining, setExplaining] = useState(false); // Only for explanation
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [explainingSelection, setExplainingSelection] = useState(false);
  const [showInitial, setShowInitial] = useState(true);

  const explain = async (selectedCode?: string) => {
    setExplaining(true);
    setExplainingSelection(!!selectedCode);
    setShowInitial(false);
    const codeToExplain = selectedCode || code;
    const res = await fetch(`${API_URL}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: codeToExplain, language: 'python' })
    });
    const data = await res.json();
    setExplanation(data.explanation);
    setExplaining(false);
  };

  const run = async () => {
    setLoading(true);
    setOutput('');
    setError('');
    const res = await fetch(`${API_URL}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language: 'python' })
    });
    const data = await res.json();
    setOutput(data.output);
    setError(data.error);
    setLoading(false);
  };

  // Track selection in CodeMirror
  const handleViewUpdate = (update: any) => {
    const sel = update.state.selection.main;
    if (!sel.empty) {
      const selected = update.state.doc.sliceString(sel.from, sel.to);
      setSelectedText(selected);
    } else {
      setSelectedText(null);
    }
  };

  // Add keydown event to editor DOM for 'e' key
  useEffect(() => {
    const editor = document.querySelector('.cm-editor');
    if (!editor) return;
    const handleKeyDown = (event: Event) => {
      const e = event as KeyboardEvent;
      if (e.key === 'e' && !e.ctrlKey && !e.metaKey && !e.altKey && selectedText) {
        explain(selectedText);
        e.preventDefault();
      }
    };
    editor.addEventListener('keydown', handleKeyDown);
    return () => {
      editor.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedText]);

  // Always explain the whole code on mount and when code changes, unless explaining a selection
  useEffect(() => {
    if (!explainingSelection && !showInitial) {
      explain();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div className="container">
      <h1>Code Explainer <span role="img" aria-label="sparkles">✨</span></h1>
      <div className="main-content">
        <div className="editor-section">
          <CodeMirror
            value={code}
            height="340px"
            theme="dark"
            extensions={[python()]}
            onChange={value => setCode(value)}
            onUpdate={handleViewUpdate}
            className="code-editor"
            basicSetup={{ highlightActiveLine: true }}
          />
          <div className="editor-actions">
            <button onClick={() => explain()} disabled={explaining}>Explain Code</button>
            <button onClick={run} disabled={loading}>Run Code</button>
          </div>
        </div>
        <div className="output-section">
          <div className="explanation">
            <h2>Explanation</h2>
            <div>{explaining ? <span className="loader">Loading...</span> : (showInitial ? initialExplanation : explanation)}</div>
          </div>
          <div className="terminal">
            <h2>Terminal</h2>
            <pre>{loading ? <span className="terminal-loading">Running...</span> : (output || ' ')}</pre>
            {error && <div className="error">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
