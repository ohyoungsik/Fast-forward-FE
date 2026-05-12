import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

import { Card, CardHeader } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../auth/useAuth';
import { signup } from '../api/auth';

type LocationState = {
  from?: { pathname?: string };
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-xs text-red-400">{message}</p>;
}

function InlineError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-300">
      {message}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ username: boolean; password: boolean }>({ username: false, password: false });

  const [signupOpen, setSignupOpen] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupSubmitting, setSignupSubmitting] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupTouched, setSignupTouched] = useState<{ name: boolean; username: boolean; email: boolean; password: boolean }>({
    name: false,
    username: false,
    email: false,
    password: false,
  });

  const fromPath = (location.state as LocationState | null)?.from?.pathname ?? '/';

  const usernameError = useMemo(() => {
    if (!touched.username) return undefined;
    if (!username.trim()) return '아이디를 입력해주세요.';
    return undefined;
  }, [touched.username, username]);

  const passwordError = useMemo(() => {
    if (!touched.password) return undefined;
    if (!password) return '비밀번호를 입력해주세요.';
    return undefined;
  }, [touched.password, password]);

  const canSubmit = Boolean(username.trim()) && Boolean(password) && !submitting;

  const signupNameError = useMemo(() => {
    if (!signupTouched.name) return undefined;
    if (!signupName.trim()) return '이름을 입력해주세요.';
    return undefined;
  }, [signupTouched.name, signupName]);

  const signupUsernameError = useMemo(() => {
    if (!signupTouched.username) return undefined;
    if (!signupUsername.trim()) return '아이디를 입력해주세요.';
    return undefined;
  }, [signupTouched.username, signupUsername]);

  const signupEmailError = useMemo(() => {
    if (!signupTouched.email) return undefined;
    if (!signupEmail.trim()) return '이메일을 입력해주세요.';
    const email = signupEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '올바른 이메일 형식이 아닙니다.';
    return undefined;
  }, [signupTouched.email, signupEmail]);

  const signupPasswordError = useMemo(() => {
    if (!signupTouched.password) return undefined;
    if (!signupPassword) return '비밀번호를 입력해주세요.';
    if (signupPassword.length < 6) return '비밀번호는 6자 이상이어야 합니다.';
    return undefined;
  }, [signupTouched.password, signupPassword]);

  const canSignup =
    Boolean(signupName.trim()) &&
    Boolean(signupUsername.trim()) &&
    Boolean(signupEmail.trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim()) &&
    signupPassword.length >= 6 &&
    !signupSubmitting;

  useEffect(() => {
    if (isAuthenticated) navigate(fromPath, { replace: true });
  }, [isAuthenticated, fromPath, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ username: true, password: true });
    setError(null);
    if (!username.trim() || !password) return;

    setSubmitting(true);
    try {
      await login({ username: username.trim(), password });
      navigate(fromPath, { replace: true });
    } catch {
      setError('로그인에 실패했습니다. 아이디/비밀번호를 확인해주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  async function onSignupSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSignupTouched({ name: true, username: true, email: true, password: true });
    setSignupError(null);
    if (!signupName.trim() || !signupUsername.trim() || !signupEmail.trim() || signupPassword.length < 6) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim())) return;

    setSignupSubmitting(true);
    try {
      await signup({
        name: signupName.trim(),
        username: signupUsername.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
      });
      setSignupOpen(false);
      setSignupName('');
      setSignupUsername('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupTouched({ name: false, username: false, email: false, password: false });
      setError('회원가입이 완료되었습니다. 로그인해주세요.');
    } catch {
      setSignupError('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSignupSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-gray-300 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-left">
          <div className="flex items-center gap-3 text-blue-500 font-bold">
            <ShieldCheck />
            <span>Infra Monitor</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">로그인</h2>
          <p className="mt-2 text-gray-500">로그인을 완료하면 대시보드로 이동합니다.</p>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="p-7">
            <CardHeader
              title="계정으로 로그인 테스트중^^"
              description="아이디와 비밀번호를 입력하세요."
              // right={<span className="text-xs text-gray-500">JWT 인증</span>}
            />

            <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-300">아이디</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, username: true }))}
                  className="mt-2 w-full rounded-xl border border-gray-800 bg-black/30 px-4 py-3 text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  placeholder="아이디"
                  autoComplete="username"
                />
                <FieldError message={usernameError} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">비밀번호</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  className="mt-2 w-full rounded-xl border border-gray-800 bg-black/30 px-4 py-3 text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  placeholder="비밀번호"
                  type="password"
                  autoComplete="current-password"
                />
                <FieldError message={passwordError} />
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className={[
                  'w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                  canSubmit ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed',
                ].join(' ')}
              >
                {submitting ? '로그인 중…' : '로그인'}
              </button>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSignupOpen(true);
                    setSignupError(null);
                    setSignupName('');
                    setSignupUsername('');
                    setSignupEmail('');
                    setSignupPassword('');
                    setSignupTouched({ name: false, username: false, email: false, password: false });
                  }}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  회원가입
                </button>
              </div>

              <InlineError message={error ?? undefined} />
            </form>
          </div>
        </Card>
      </div>

      <Modal open={signupOpen} onClose={() => setSignupOpen(false)} title="회원가입">
        <form className="space-y-5" onSubmit={onSignupSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300">이름</label>
            <input
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              onBlur={() => setSignupTouched((t) => ({ ...t, name: true }))}
              className="mt-2 w-full rounded-xl border border-gray-800 bg-black/30 px-4 py-3 text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
              placeholder="이름"
              autoComplete="name"
            />
            <FieldError message={signupNameError} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">아이디</label>
            <input
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
              onBlur={() => setSignupTouched((t) => ({ ...t, username: true }))}
              className="mt-2 w-full rounded-xl border border-gray-800 bg-black/30 px-4 py-3 text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
              placeholder="아이디"
              autoComplete="username"
            />
            <FieldError message={signupUsernameError} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">이메일</label>
            <input
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              onBlur={() => setSignupTouched((t) => ({ ...t, email: true }))}
              className="mt-2 w-full rounded-xl border border-gray-800 bg-black/30 px-4 py-3 text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
              placeholder="name@example.com"
              type="email"
              autoComplete="email"
            />
            <FieldError message={signupEmailError} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">비밀번호</label>
            <input
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              onBlur={() => setSignupTouched((t) => ({ ...t, password: true }))}
              className="mt-2 w-full rounded-xl border border-gray-800 bg-black/30 px-4 py-3 text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
              placeholder="비밀번호 (6자 이상)"
              type="password"
              autoComplete="new-password"
            />
            <FieldError message={signupPasswordError} />
          </div>

          <button
            type="submit"
            disabled={!canSignup}
            className={[
              'w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
              canSignup ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed',
            ].join(' ')}
          >
            {signupSubmitting ? '가입 처리 중…' : '회원가입'}
          </button>

          <InlineError message={signupError ?? undefined} />
        </form>
      </Modal>
    </div>
  );
}

