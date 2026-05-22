import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { getMetrics } from '../api/metrics';
import { getServers } from '../api/servers';
import { DEFAULT_SERVERS, type ServerItem } from '../types/metrics';

export type RecoveryState = 'idle' | 'running' | 'done' | 'fail';

interface CpuAlertState {
  alertServer: string | null;
  alertCpuUsage: number | null;
  showAlert: boolean;
  showModal: boolean;
  recoveryState: RecoveryState;
  dismissAlert: () => void;
  openModal: () => void;
  closeModal: () => void;
  setRecoveryState: (s: RecoveryState) => void;
}

const CpuAlertContext = createContext<CpuAlertState | null>(null);

const CPU_THRESHOLD = 70;
const POLL_INTERVAL = 5000;
const SNOOZE_MS = 5 * 60 * 1000;

export function CpuAlertProvider({ children }: { children: ReactNode }) {
  const [servers, setServers] = useState<ServerItem[]>(DEFAULT_SERVERS);
  const [alertServer, setAlertServer] = useState<string | null>(null);
  const [alertCpuUsage, setAlertCpuUsage] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recoveryState, setRecoveryState] = useState<RecoveryState>('idle');
  const ignoredUntilRef = useRef<number | null>(null);

  useEffect(() => {
    getServers()
      .then(setServers)
      .catch(() => setServers(DEFAULT_SERVERS));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;
      const now = Date.now();
      if (ignoredUntilRef.current && now < ignoredUntilRef.current) return;

      const results = await Promise.allSettled(
        servers.map((s) => getMetrics(s.server_name))
      );

      if (cancelled) return;

      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        if (r.status === 'fulfilled' && r.value.cpu_usage >= CPU_THRESHOLD) {
          setAlertServer(servers[i].server_name);
          setAlertCpuUsage(r.value.cpu_usage);
          setShowAlert((prev) => prev || true);
          return;
        }
      }
    };

    poll();
    const id = setInterval(poll, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [servers]);

  const dismissAlert = useCallback(() => {
    setShowAlert(false);
    ignoredUntilRef.current = Date.now() + SNOOZE_MS;
  }, []);

  const openModal = useCallback(() => {
    setShowAlert(false);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => setShowModal(false), []);

  return (
    <CpuAlertContext.Provider
      value={{
        alertServer,
        alertCpuUsage,
        showAlert,
        showModal,
        recoveryState,
        dismissAlert,
        openModal,
        closeModal,
        setRecoveryState,
      }}
    >
      {children}
    </CpuAlertContext.Provider>
  );
}

export function useCpuAlert() {
  const ctx = useContext(CpuAlertContext);
  if (!ctx) throw new Error('useCpuAlert must be used within CpuAlertProvider');
  return ctx;
}
