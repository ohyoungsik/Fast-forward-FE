import { useEffect, useRef, useState } from 'react';
import { X, Terminal } from 'lucide-react';
import CpuKill from './Cpukill';

const WS_URL = import.meta.env.VITE_WS_URL as string;

type KillState = 'idle' | 'running' | 'done' | 'fail';

interface Props {
  open: boolean;
  onClose: () => void;
  onKillStateChange?: (s: KillState) => void;
}

export default function CpuMonitorModal({ open, onClose, onKillStateChange }: Props) {
  const [log, setLog] = useState('');
  const [wsStatus, setWsStatus] = useState<'connecting' | 'open' | 'error'>('connecting');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!open) return;

    setLog('');
    setWsStatus('connecting');

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => setWsStatus('open');
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'process_status') setLog(msg.data);
      } catch {
        setLog(event.data);
      }
    };
    ws.onerror = () => setWsStatus('error');
    wsRef.current = ws;

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 bg-gray-950 rounded-2xl border border-gray-800 shadow-2xl flex flex-col max-h-[80vh]">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-green-400" />
            <h2 className="text-white font-extrabold text-lg tracking-tight">CPU 실시간 모니터링</h2>
            <span className={`ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              wsStatus === 'open'        ? 'bg-green-950 text-green-400' :
              wsStatus === 'error'       ? 'bg-red-950 text-red-400' :
                                           'bg-gray-800 text-gray-500'
            }`}>
              {wsStatus === 'open' ? '● 연결됨' : wsStatus === 'error' ? '● 오류' : '● 연결 중'}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pt-3 pb-2 font-mono text-xs text-gray-500 grid grid-cols-[56px_80px_56px_56px_1fr] gap-2 border-b border-gray-800 bg-gray-900/60">
          <span>PID</span>
          <span>USER</span>
          <span>CPU%</span>
          <span>MEM%</span>
          <span>COMMAND</span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 font-mono text-xs text-green-400 whitespace-pre bg-gray-950 min-h-[220px]">
          {log || (
            <span className="text-gray-600 animate-pulse">
              {wsStatus === 'error' ? 'WebSocket 연결에 실패했습니다.' : '프로세스 데이터 수신 중...'}
            </span>
          )}
        </div>

        <div className="px-6 pb-5 pt-4 border-t border-gray-800">
          <CpuKill onStateChange={onKillStateChange} />
        </div>

      </div>
    </div>
  );
}
