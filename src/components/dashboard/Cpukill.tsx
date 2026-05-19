import { useState } from 'react';
import { Loader2, Settings, Check, X } from 'lucide-react';
//실제 백엔드서버ip주소로 변경필요
const API = 'http://localhost:8000/api/kill/run';

type State = 'idle' | 'running' | 'done' | 'fail';

interface Props {
  onStateChange?: (s: State) => void;
}

export default function CpuKill({ onStateChange }: Props) {
  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('대기 중');

  const run = async () => {
    setState('running');
    onStateChange?.('running');
    setMessage('스크립트 실행 중...');
    try {
      const res  = await fetch(API, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setState('done');
        onStateChange?.('done');
        setMessage(data.message || '실행 완료');
      } else {
        throw new Error(data.message || '실행 실패');
      }
    } catch (e: any) {
      setState('fail');
      onStateChange?.('fail');
      setMessage(e.message || '서버 연결 실패');
    }
  };
  const iconMap = {
    idle:    <Settings size={16} className="text-gray-500" />,
    running: <Loader2  size={16} className="animate-spin text-yellow-400" />,
    done:    <Check    size={16} className="text-green-400" />,
    fail:    <X        size={16} className="text-red-400" />,
  };

  const iconBg = {
    idle:    'bg-gray-800',
    running: 'bg-yellow-950',
    done:    'bg-green-950',
    fail:    'bg-red-950',
  };

  const msgColor = {
    idle:    'text-gray-500',
    running: 'text-yellow-400',
    done:    'text-green-400',
    fail:    'text-red-400',
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-2xl border border-gray-700 max-w-lg mt-6">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg[state]}`}>
        {iconMap[state]}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">4. CPU 킬 스크립트</p>
        <p className={`text-xs mt-0.5 ${msgColor[state]}`}>{message}</p>
      </div>
      <button
        onClick={run}
        disabled={state === 'running' || state === 'done'}
        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-600 text-gray-300
                   hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {state === 'running' ? '실행 중' : state === 'done' ? '완료' : state === 'fail' ? '재시도' : '실행'}
      </button>
    </div>
  );
}