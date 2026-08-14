'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface SimpleCaptchaProps {
  onValidate: (isValid: boolean) => void;
}

export default function SimpleCaptcha({ onValidate }: SimpleCaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isValid, setIsValid] = useState(false);

  function generateQuestion() {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setAnswer('');
    setIsValid(false);
    onValidate(false);
  }

  useEffect(() => {
    generateQuestion();
  }, []);

  function checkAnswer(value: string) {
    setAnswer(value);
    const correct = parseInt(value) === num1 + num2;
    setIsValid(correct);
    onValidate(correct);
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-700">تحقق بسيط</span>
        <button
          type="button"
          onClick={generateQuestion}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-slate-900">{num1} + {num2} = ?</span>
        <input
          type="number"
          value={answer}
          onChange={(e) => checkAnswer(e.target.value)}
          className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-lg text-center text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="؟"
        />
        {isValid && (
          <span className="text-emerald-600 text-sm font-medium">✓ صحيح</span>
        )}
      </div>
    </div>
  );
}
