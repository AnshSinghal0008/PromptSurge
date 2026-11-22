import React, { useState, useEffect } from 'react';
import { Eraser, Loader2, Sparkles, Cpu } from 'lucide-react';
import { activeProvider, activeModel } from './providerSelection';

const PROVIDER_COLORS = {
  gemini:     { color: '#4285F4', icon: '✦', label: 'Gemini' },
  openrouter: { color: '#6C47FF', icon: '⟁', label: 'OpenRouter' },
  groq:       { color: '#F55036', icon: '⚡', label: 'Groq' },
  mistral:    { color: '#FF7000', icon: '◈', label: 'Mistral' },
  cohere:     { color: '#39D5AA', icon: '◎', label: 'Cohere' },
};

const PromptInput = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  // Re-render every second so the active provider chip stays in sync
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) onSubmit(prompt);
  };

  const provider = activeProvider;
  const modelMap = activeModel || {};
  const selectedModel = provider ? modelMap[provider] : null;
  const providerMeta = provider ? PROVIDER_COLORS[provider] : null;

  const charCount = prompt.length;
  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;

  return (
    <section className="forge-input-card mb-10 w-full mx-auto" style={{ position: 'relative' }}>

      {/* Header row */}
      <div className="forge-input-heading">
        <div>
          <span className="forge-kicker">YOUR STARTING POINT</span>
          <h2>What do you want the AI to do?</h2>
        </div>
        <span className="forge-provider-chip">
          <Cpu size={13} style={{ color: providerMeta?.color || '#e6a05b' }} />
          {providerMeta
            ? `${providerMeta.label}${selectedModel ? ` · ${selectedModel.split('/').pop().slice(0, 20)}` : ''}`
            : 'Auto provider'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div style={{ position: 'relative' }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit(e); }}
            placeholder="Example: Help me plan a three-day trip to Kyoto…"
            aria-label="Original prompt"
            className="forge-textarea w-full"
            disabled={isLoading}
          />
          {/* char/word counter */}
          <div className="forge-counter">
            <span>{wordCount} words</span>
            <span aria-hidden="true">·</span>
            <span>{charCount} chars</span>
          </div>
        </div>

        {/* Example prompts */}
        {!prompt && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="forge-kicker">TRY A STARTER</span>
            {[
              'Write a blog post about AI',
              'Summarize this article for me',
              'Help me debug my Python code',
            ].map(ex => (
              <button
                key={ex}
                type="button"
                onClick={() => setPrompt(ex)}
                className="forge-starter"
              >
                {ex}
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setPrompt('')}
            disabled={isLoading || !prompt}
            className="forge-button forge-button-muted flex items-center gap-2"
          >
            <Eraser size={18} />
            Clear
          </button>
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="forge-button forge-button-primary flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Optimize &amp; Run
              </>
            )}
          </button>
        </div>
      </form>

      {/* Loading overlay shimmer */}
      {isLoading && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 12, overflow: 'hidden',
          background: 'rgba(15,17,26,0.5)', backdropFilter: 'blur(2px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid rgba(59,130,246,0.15)',
            borderTopColor: '#3b82f6',
            animation: 'spin 0.8s linear infinite',
          }} />
          <div style={{ color: '#9ca3af', fontSize: 14, fontWeight: 500 }}>
            {providerMeta ? `Calling ${providerMeta.label}…` : 'Finding best provider…'}
          </div>
          <div style={{ color: '#4b5563', fontSize: 12 }}>This may take 10–30 seconds</div>
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </section>
  );
};

export default PromptInput;
