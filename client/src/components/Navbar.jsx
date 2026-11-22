import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, History, LayoutDashboard, Settings2 } from 'lucide-react';
import ProviderSelector from './ProviderSelector';
import { updateProviderSelection } from './providerSelection';
import { api } from '../services/api';

const Navbar = () => {
  const location = useLocation();
  const [panelOpen, setPanelOpen] = useState(false);
  const [autoFallback, setAutoFallback] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedModels, setSelectedModels] = useState({});  // { providerName: modelId }
  const [apiHealth, setApiHealth] = useState('unknown'); // 'ok' | 'warn' | 'error' | 'unknown'

  // Sync module-level exports whenever state changes
  useEffect(() => {
    updateProviderSelection(autoFallback ? null : selectedProvider, selectedModels);
  }, [autoFallback, selectedProvider, selectedModels]);

  // Quick health check on mount
  useEffect(() => {
    api.getProviderStatus()
      .then(providers => {
        const activeCount = providers.filter(p => p.status === 'active').length;
        if (activeCount === 0) setApiHealth('error');
        else if (activeCount < providers.filter(p => p.configured).length) setApiHealth('warn');
        else setApiHealth('ok');
      })
      .catch(() => setApiHealth('error'));
  }, []);

  const handleModelChange = (providerName, modelId) => {
    setSelectedModels(prev => ({ ...prev, [providerName]: modelId }));
  };

  const healthColor = { ok: '#22d3ee', warn: '#f59e0b', error: '#ef4444', unknown: '#6b7280' };
  return (
    <>
      <nav className="forge-nav sticky top-0 z-50 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="forge-mark">
                <Flame size={21} strokeWidth={2.2} />
              </div>
              <span className="forge-brand-name font-bold text-xl text-white tracking-tight">Prompt<span className="text-orange-400">Forge</span></span>
            </div>

            {/* Nav links + settings */}
            <div className="flex items-center gap-2">
              <Link
                to="/"
                aria-label="Dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'forge-nav-link active'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <LayoutDashboard size={18} />
                <span className="forge-nav-label">Dashboard</span>
              </Link>

              <Link
                to="/history"
                aria-label="History"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  location.pathname === '/history'
                    ? 'forge-nav-link active'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
              >
                <History size={18} />
                <span className="forge-nav-label">History</span>
              </Link>

              {/* Providers button */}
              <button
                onClick={() => setPanelOpen(true)}
                title="AI Provider Settings"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 10,
                  background: panelOpen ? 'rgba(108,71,255,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${panelOpen ? 'rgba(108,71,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  color: panelOpen ? '#a78bfa' : '#9ca3af',
                  cursor: 'pointer', transition: 'all 0.2s', fontSize: 14, fontWeight: 500,
                }}
              >
                {/* Health dot */}
                <span style={{ position: 'relative', width: 8, height: 8, display: 'inline-flex' }}>
                  {apiHealth === 'ok' && (
                    <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: healthColor.ok, opacity: 0.4, animation: 'ping 1.5s ease-out infinite' }} />
                  )}
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: healthColor[apiHealth] || '#6b7280', display: 'block' }} />
                </span>
                <Settings2 size={16} />
                <span style={{ display: 'none' }} className="sm:inline">Providers</span>
                {!autoFallback && selectedProvider && (
                  <span style={{ fontSize: 10, background: 'rgba(108,71,255,0.4)', color: '#c4b5fd', borderRadius: 4, padding: '1px 5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {selectedProvider}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <ProviderSelector
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        selectedProvider={selectedProvider}
        selectedModel={selectedModels}
        onProviderChange={setSelectedProvider}
        onModelChange={handleModelChange}
        autoFallback={autoFallback}
        onAutoFallbackChange={setAutoFallback}
      />

      <style>{`@keyframes ping{0%{transform:scale(1);opacity:.4}70%{transform:scale(2.2);opacity:0}100%{transform:scale(2.2);opacity:0}}`}</style>
    </>
  );
};

export default Navbar;
