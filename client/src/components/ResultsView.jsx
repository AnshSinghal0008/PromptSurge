import React, { useState } from 'react';
import {
  ArrowDown, ArrowRight, Check, CheckCircle2, Copy, Flame, MessageSquareText,
  Target, TrendingUp, Users, Brain, AlertCircle
} from 'lucide-react';

const CRITERIA = [
  { key: 'relevance', label: 'Relevance', description: 'Answers the actual request' },
  { key: 'clarity', label: 'Clarity', description: 'Easy to understand and follow' },
  { key: 'accuracy', label: 'Accuracy', description: 'Factually reliable based on context' },
  { key: 'completeness', label: 'Completeness', description: 'Covers the important details' },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Unable to copy text:', error);
    }
  };

  return (
    <button className="forge-copy" onClick={copy} type="button" aria-label="Copy text">
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function PromptCard({ title, text, score, variant, improvement }) {
  return (
    <article className={`forge-prompt-card ${variant}`}>
      <header className="forge-prompt-card-head">
        <div>
          <span className="forge-kicker">{variant === 'optimized' ? 'THE REFINED PROMPT' : 'THE STARTING PROMPT'}</span>
          <h3>{title}</h3>
        </div>
        <div className="forge-prompt-score">
          <strong>{typeof score === 'number' ? score : '—'}</strong>
          <span>/ 100</span>
        </div>
      </header>
      <p className="forge-prompt-copy">{text || 'No prompt was returned.'}</p>
      <footer>
        {improvement && <span className="forge-delta"><TrendingUp size={14} /> +{improvement} points</span>}
        <CopyButton text={text} />
      </footer>
    </article>
  );
}

function CriterionCard({ criterion, evaluation }) {
  const original = evaluation?.original;
  const optimized = evaluation?.optimized;

  return (
    <article className="forge-criterion">
      <header>
        <div>
          <h4>{criterion.label}</h4>
          <p>{criterion.description}</p>
        </div>
        {typeof original === 'number' && typeof optimized === 'number' && (
          <span className={`forge-delta ${optimized < original ? 'down' : ''}`}>
            {optimized >= original ? '+' : ''}{optimized - original}
          </span>
        )}
      </header>
      <div className="forge-score-row">
        <span>Original</span>
        <div className="forge-score-track"><i className="original" style={{ width: `${original ?? 0}%` }} /></div>
        <strong>{typeof original === 'number' ? original : '—'}</strong>
      </div>
      <div className="forge-score-row">
        <span>Optimized</span>
        <div className="forge-score-track"><i className="optimized" style={{ width: `${optimized ?? 0}%` }} /></div>
        <strong>{typeof optimized === 'number' ? optimized : '—'}</strong>
      </div>
      {evaluation?.note && <p className="forge-criterion-note">{evaluation.note}</p>}
    </article>
  );
}

function ResponseCard({ title, text, score, variant }) {
  return (
    <article className={`forge-response-card ${variant}`}>
      <header>
        <h3>{title}</h3>
        <div className="forge-response-score">
          <strong>{typeof score === 'number' ? score : '—'}</strong><span>/100</span>
        </div>
        <CopyButton text={text} />
      </header>
      <p>{text || 'No response was returned.'}</p>
    </article>
  );
}

const ResultsView = ({ result }) => {
  if (!result) return null;

  const comparison = result.responseComparison || {};
  const criteria = comparison.evaluationCriteria || {};
  const responseGain = typeof comparison.originalScore === 'number' && typeof comparison.optimizedScore === 'number'
    ? comparison.optimizedScore - comparison.originalScore
    : null;

  return (
    <div className="forge-results max-w-7xl mx-auto">
      <div className="forge-results-intro">
        <span className="forge-kicker"><Flame size={14} /> THE FORGE RESULTS</span>
        <h2>One idea. <span>Made clearer.</span></h2>
        <p>Compare the prompt you started with and the instruction the AI shaped from it.</p>
      </div>

      <section className="forge-prompt-comparison" aria-label="Original and optimized prompt comparison">
        <PromptCard
          title="Original"
          text={result.originalPrompt}
          score={result.promptScores?.original}
          variant="original"
        />
        <div className="forge-transform" aria-hidden="true"><ArrowRight size={19} /><span>REFINED</span></div>
        <PromptCard
          title="Optimized"
          text={result.optimizedPrompt}
          score={result.promptScores?.optimized}
          variant="optimized"
          improvement={result.promptScores?.improvement}
        />
      </section>

      {result.improvements?.length > 0 && (
        <div className="forge-improvements">
          <CheckCircle2 size={17} />
          <div><strong>What changed</strong><ul>{result.improvements.map((item, index) => <li key={index}>{item}</li>)}</ul></div>
        </div>
      )}

      <section className="forge-evaluation">
        <header className="forge-section-heading">
          <div>
            <span className="forge-kicker">SIDE-BY-SIDE QUALITY CHECK</span>
            <h2>Which answer works better?</h2>
            <p>Both responses are scored on the same four criteria.</p>
          </div>
          {typeof responseGain === 'number' && (
            <div className="forge-overall-score">
              <span>Response score</span>
              <div><b>{comparison.originalScore}</b><ArrowRight size={16} /><b className="optimized">{comparison.optimizedScore}</b></div>
              <small>{responseGain >= 0 ? '+' : ''}{responseGain} points</small>
            </div>
          )}
        </header>

        <div className="forge-criteria-grid">
          {CRITERIA.map(criterion => (
            <CriterionCard
              key={criterion.key}
              criterion={criterion}
              evaluation={criteria[criterion.key]}
            />
          ))}
        </div>
        <p className="forge-eval-note">AI-assisted estimates from the selected provider. Accuracy scores are not an external fact-check.</p>

        {comparison.overall && (
          <blockquote className="forge-evaluation-summary">
            <MessageSquareText size={17} />
            <p>{comparison.overall}</p>
          </blockquote>
        )}

        <div className="forge-response-grid">
          <ResponseCard title="Original response" text={result.originalResponse} score={comparison.originalScore} variant="original" />
          <ResponseCard title="Optimized response" text={result.optimizedResponse} score={comparison.optimizedScore} variant="optimized" />
        </div>

        {(comparison.keyImprovements?.length > 0 || comparison.keyWeaknesses?.length > 0) && (
          <div className="forge-review-notes">
            {comparison.keyImprovements?.length > 0 && (
              <div><h3><CheckCircle2 size={16} /> Stronger in the optimized answer</h3><ul>{comparison.keyImprovements.map((item, index) => <li key={index}>{item}</li>)}</ul></div>
            )}
            {comparison.keyWeaknesses?.length > 0 && (
              <div><h3><AlertCircle size={16} /> Still worth reviewing</h3><ul>{comparison.keyWeaknesses.map((item, index) => <li key={index}>{item}</li>)}</ul></div>
            )}
          </div>
        )}
      </section>

      <details className="forge-analysis">
        <summary><Target size={17} /> Prompt analysis <ArrowDown size={15} /></summary>
        <div className="forge-analysis-grid">
          <div><span className="forge-kicker">OBJECTIVE</span><p>{result.analysis?.objective || 'Not provided.'}</p></div>
          <div><span className="forge-kicker"><Users size={13} /> AUDIENCE & TONE</span><p>{[result.analysis?.audience, result.analysis?.tone].filter(Boolean).join(' · ') || 'Not provided.'}</p></div>
          {result.analysis?.context && <div><span className="forge-kicker"><Brain size={13} /> CONTEXT</span><p>{result.analysis.context}</p></div>}
          {result.analysis?.weaknesses?.length > 0 && <div><span className="forge-kicker">ORIGINAL GAPS</span><ul>{result.analysis.weaknesses.map((item, index) => <li key={index}>{item}</li>)}</ul></div>}
        </div>
      </details>
    </div>
  );
};

export default ResultsView;
