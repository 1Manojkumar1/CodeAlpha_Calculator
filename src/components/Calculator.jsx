import { useState, useEffect, useCallback } from 'react';

import Display from './Display';
import { ParticleCard } from './MagicBento';

const GLOW_COLOR = '132, 0, 255';

const isOperator = (value) => ['+', '-', '\u00D7', '\u00F7'].includes(value);

function calculate(expr) {
  try {
    const sanitized = expr.replace(/\u00D7/g, '*').replace(/\u00F7/g, '/');
    const evalResult = Function(`"use strict"; return (${sanitized})`)();
    if (!isFinite(evalResult)) return 'Error';
    return parseFloat(evalResult.toFixed(8)).toString();
  } catch {
    return 'Error';
  }
}

function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [justEvaluated, setJustEvaluated] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .card--border-glow {
        position: relative;
        --glow-x: 50%;
        --glow-y: 50%;
        --glow-intensity: 0.25;
        --glow-radius: 200px;
      }
      .card--border-glow::after {
        content: '';
        position: absolute;
        inset: 0;
        padding: 6px;
        background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(${GLOW_COLOR}, calc(var(--glow-intensity) * 0.8)) 0%,
            rgba(${GLOW_COLOR}, calc(var(--glow-intensity) * 0.4)) 30%,
            transparent 60%);
        border-radius: inherit;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
        pointer-events: none;
        opacity: 1;
        z-index: 1;
      }
      .btn--border-glow {
        position: relative;
        --glow-x: 50%;
        --glow-y: 50%;
        --glow-intensity: 0;
        --glow-radius: 80px;
      }
      .btn--border-glow::after {
        content: '';
        position: absolute;
        inset: 0;
        padding: 1.5px;
        background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(${GLOW_COLOR}, calc(var(--glow-intensity) * 0.8)) 0%,
            rgba(${GLOW_COLOR}, calc(var(--glow-intensity) * 0.4)) 30%,
            transparent 60%);
        border-radius: inherit;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
        pointer-events: none;
        opacity: 1;
        z-index: 1;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleCardGlowMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--glow-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--glow-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    el.style.setProperty('--glow-intensity', '1');
  };

  const handleCardGlowLeave = (e) => {
    e.currentTarget.style.setProperty('--glow-intensity', '0.25');
  };

  const handleClick = useCallback(
    (value) => {
      if (value === 'C') {
        setExpression('');
        setResult('');
        setJustEvaluated(false);
        return;
      }

      if (value === '\u232B') {
        if (justEvaluated) {
          setExpression('');
          setResult('');
          setJustEvaluated(false);
          return;
        }
        setExpression((prev) => prev.slice(0, -1));
        return;
      }

      if (value === '=') {
        if (!expression) return;
        const calcResult = calculate(expression);
        setResult(calcResult);
        setJustEvaluated(true);
        return;
      }

      if (justEvaluated) {
        setResult('');
        setJustEvaluated(false);
        if (isOperator(value)) {
          setExpression(result + value);
          return;
        }
        if (value === '.') {
          setExpression('0.');
          return;
        }
        if (/^\d$/.test(value)) {
          setExpression(value);
          return;
        }
      }

      if (value === '.') {
        const parts = expression.split(/[+\-\u00D7\u00F7]/);
        const current = parts.pop();
        if (current.includes('.')) return;
        setExpression((prev) => prev + (current === '' ? '0.' : '.'));
        return;
      }

      if (/^\d$/.test(value)) {
        const parts = expression.split(/[+\-\u00D7\u00F7]/);
        const current = parts.pop();
        setExpression((prev) => (current === '0' ? prev.slice(0, -1) + value : prev + value));
        return;
      }

      if (isOperator(value)) {
        if (!expression) return;
        const last = expression.slice(-1);
        setExpression((prev) => (isOperator(last) ? prev.slice(0, -1) + value : prev + value));
      }
    },
    [expression, result, justEvaluated],
  );

  useEffect(() => {
    const keyMap = {
      0: '0', 1: '1', 2: '2', 3: '3', 4: '4',
      5: '5', 6: '6', 7: '7', 8: '8', 9: '9',
      '+': '+', '-': '-', '*': '\u00D7', '/': '\u00F7',
      '.': '.', Enter: '=', Backspace: '\u232B', Escape: 'C',
    };

    const handleKeyDown = (e) => {
      const mapped = keyMap[e.key];
      if (mapped) {
        e.preventDefault();
        handleClick(mapped);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClick]);

  const buttons = [
    { value: 'C' },
    { value: '\u232B' },
    { value: '\u00F7' },
    { value: '\u00D7' },
    { value: '7' },
    { value: '8' },
    { value: '9' },
    { value: '-' },
    { value: '4' },
    { value: '5' },
    { value: '6' },
    { value: '+' },
    { value: '1' },
    { value: '2' },
    { value: '3' },
    { value: '=' },
    { value: '0', span: 2 },
    { value: '.' },
  ];

  return (
    <ParticleCard
      className="card--border-glow w-full max-w-sm rounded-[20px] p-5 border border-solid border-[#2F293A]/80 text-white font-light transition-all duration-300 ease-out hover:-translate-y-1 animate-fadeIn"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(132,0,255,0.15) 0%, rgba(132,0,255,0.03) 40%, #120F17 70%)',
        boxShadow: '0 4px 20px rgba(132,0,255,0.08), inset 0 1px 0 rgba(132,0,255,0.15), 0 8px 30px rgba(132,0,255,0.25)',
      }}
      onMouseMove={handleCardGlowMove}
      onMouseLeave={handleCardGlowLeave}
      disableAnimations={false}
      particleCount={30}
      glowColor={GLOW_COLOR}
      enableTilt={false}
      enableMagnetism={false}
      clickEffect
      keepParticles
    >
      <Display expression={expression} result={result} />
      <div className="grid grid-cols-4 gap-3">
        {buttons.map((btn) => (
          <ParticleCard
            key={btn.value}
            className={`btn--border-glow flex items-center justify-center rounded-[20px] font-light text-xl sm:text-2xl transition-all duration-150 hover:-translate-y-0.5 active:scale-95 select-none outline-none focus-visible:ring-2 focus-visible:ring-[#8400FF]/40 cursor-pointer h-14 sm:h-16 bg-[#120F17] hover:bg-[#1E1A2A] active:bg-[#2A2440] text-white border border-solid border-[#2F293A] ${btn.span === 2 ? 'col-span-2' : ''}`}
            disableAnimations={false}
            particleCount={8}
            glowColor={GLOW_COLOR}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect
          >
            <button
              className="w-full h-full flex items-center justify-center bg-transparent outline-none border-none cursor-pointer text-inherit font-inherit"
              onClick={() => handleClick(btn.value)}
              onMouseMove={(e) => {
                const p = e.currentTarget.parentElement;
                if (!p) return;
                const r = p.getBoundingClientRect();
                p.style.setProperty('--glow-x', `${((e.clientX - r.left) / r.width) * 100}%`);
                p.style.setProperty('--glow-y', `${((e.clientY - r.top) / r.height) * 100}%`);
                p.style.setProperty('--glow-intensity', '1');
              }}
              onMouseLeave={(e) => {
                e.currentTarget.parentElement?.style.setProperty('--glow-intensity', '0');
              }}
              aria-label={btn.value === '\u232B' ? 'backspace' : btn.value}
            >
              {btn.value}
            </button>
          </ParticleCard>
        ))}
      </div>
    </ParticleCard>
  );
}

export default Calculator;
