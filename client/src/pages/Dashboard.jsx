import React, { useState } from 'react';
import PromptInput from '../components/PromptInput';
import ResultsView from '../components/ResultsView';
import { api } from '../services/api';
import { activeProvider, activeModel } from '../components/providerSelection';
import { ArrowDown, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleOptimize = async (prompt) => {
    setIsLoading(true);
    setError(null);
    try {
      // Read provider/model from the Navbar's ProviderSelector state
      const provider = activeProvider || null;
      const modelMap = activeModel || {};
      const model = provider ? (modelMap[provider] || null) : null;
      const data = await api.processPrompt(prompt, provider, model);
      setResult(data);
    } catch (err) {
      console.error(err);
      const details = err.response?.data?.details || err.message || 'An error occurred.';
      const providerErrors = err.response?.data?.providerErrors;
      setError(providerErrors?.length
        ? `All providers failed:\n${providerErrors.join('\n')}`
        : details
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forge-page min-h-[calc(100vh-6rem)] pb-20 px-4 sm:px-6 lg:px-8">
      <section className="forge-hero max-w-7xl mx-auto">
        <div className="forge-hero-copy">
          <div className="forge-eyebrow"><Sparkles size={14} /> PROMPT WORKSHOP <span>01 / 02</span></div>
          <h1>Better prompts.<br /><span>Sharper answers.</span></h1>
          <p>Start with what you have. Forge a clearer instruction, then compare what the AI delivers.</p>
        </div>
        <div className="forge-steps" aria-label="Workflow">
          <span className="current"><b>01</b> Shape prompt</span>
          <ArrowDown size={15} />
          <span><b>02</b> Compare answers</span>
        </div>
      </section>

      <div className="max-w-7xl mx-auto relative z-10">
        <PromptInput onSubmit={handleOptimize} isLoading={isLoading} />
      </div>

      {error && (
        <div className="forge-error max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-semibold tracking-wide">Error: {error}</p>
          </div>
          <p className="text-sm mt-2 text-red-300 ml-9">Check that your API keys are set in <code className="bg-red-900/40 px-1 rounded">server/.env</code> and the server is running. Open <strong>Providers ⚙</strong> in the navbar to see which providers are active.</p>
        </div>
      )}

      {result && <ResultsView result={result} />}
    </div>
  );
};

export default Dashboard;
