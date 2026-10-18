import type { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  ['Explore', '/explore'],
  ['Contribute', '/contribute'],
  ['Saved', '/saved'],
  ['Profile', '/profile'],
] as const;

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1536px] items-center gap-4 px-4 py-3 lg:px-6">
          <NavLink to="/explore" className="text-xl font-bold tracking-tight text-blue-900">
            SerbisYO
          </NavLink>
          <div className="hidden flex-1 md:block">
            <input
              aria-label="Search a service or place"
              placeholder="Search a service or place..."
              className="w-full rounded-2xl bg-slate-100 px-4 py-2.5 outline-none ring-blue-500 transition focus:ring-2"
            />
          </div>
          <span className="ml-auto rounded-full border border-slate-200 px-3 py-2 text-sm">Morong, Rizal</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1536px]">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-slate-200 bg-white md:hidden">
        {navItems.map(([label, to]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-2 py-3 text-center text-sm ${isActive ? 'font-semibold text-blue-600' : 'text-slate-500'}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
