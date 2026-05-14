import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Server, ShieldCheck, Globe } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import UserMenu from '../components/auth/UserMenu';

type NavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { to: '/', label: '대시보드', icon: <LayoutDashboard size={18} /> },
  { to: '/infra', label: '인프라 모니터링', icon: <Server size={18} /> },
  { to: '/access-security-logs', label: '접근 보안 로그', icon: <ShieldCheck size={18} /> },
  { to: '/webapp-logs', label: 'Web Application 로그', icon: <Globe size={18} /> }
];

function NavItemLink({ to, label, icon }: NavItem) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors',
          isActive ? 'text-blue-400 bg-blue-900/30' : 'text-gray-300 hover:text-white hover:bg-gray-900/40',
        ].join(' ')
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-black text-gray-300 font-sans">
      <aside className="w-64 border-r border-gray-900 flex flex-col p-6 space-y-9 shadow-lg">
        <h1 className="text-xl font-bold text-blue-500 flex items-center gap-3">
          <LayoutDashboard /> Infra Monitor
        </h1>

        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <NavItemLink key={item.to} {...item} />
          ))}
        </nav>

        {/* <div className="border-t border-gray-900 pt-9 flex flex-col space-y-2">
          <button className="flex items-center gap-3 hover:text-white text-sm p-3 rounded-lg hover:bg-gray-900/40 transition-colors">
            <Bell size={18} /> 알림
          </button>
          <button className="flex items-center gap-3 hover:text-white text-sm p-3 rounded-lg hover:bg-gray-900/40 transition-colors">
            <Settings size={18} /> 설정
          </button>
        </div> */}
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-end px-6 py-3 border-b border-gray-900 shrink-0">
          <UserMenu />
        </div>
        <main className="flex-1 p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

