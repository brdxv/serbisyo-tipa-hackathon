import React, { useEffect, useRef, useState } from 'react';
import { LogIn, LogOut, Settings, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentAccount, signOutPrototypeAccount, subscribeToAuthChanges } from '../../auth/taympersAuth';

export function AccountMenu({
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState(() => getCurrentAccount());
  const dimension = size === 'sm' ? 'h-9 w-9' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';

  useEffect(() => subscribeToAuthChanges(() => setAccount(getCurrentAccount())), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <div ref={rootRef} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        aria-label="Open account menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`${dimension} overflow-hidden rounded-full border-2 border-white bg-white shadow-sm transition hover:ring-2 hover:ring-blue-200`}
      >
        {account ? (
          <img src={account.avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center bg-blue-50 text-blue-700"><UserRound size={size === 'lg' ? 22 : 19} /></span>
        )}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-[1700] w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,.18)]">
          {account ? (
            <>
              <div className="border-b border-slate-100 px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <img src={account.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                  <div className="min-w-0">
                    <div className="sy-small sy-semibold truncate text-slate-900">{account.fullName}</div>
                    <div className="sy-small truncate text-slate-500">{account.email}</div>
                    <div className="sy-small mt-0.5 truncate text-slate-400">{account.location}</div>
                  </div>
                </div>
              </div>
              <div className="p-1.5">
                <button type="button" onClick={() => go('/profile')} className="sy-small sy-semibold flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-700 hover:bg-slate-50"><UserRound size={17} className="text-blue-600" /> Account Profile</button>
                <button type="button" onClick={() => go('/profile?settings=1')} className="sy-small sy-semibold flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-slate-700 hover:bg-slate-50"><Settings size={17} className="text-blue-600" /> Account Settings</button>
                <button type="button" onClick={() => { signOutPrototypeAccount(); setOpen(false); navigate('/login'); }} className="sy-small sy-semibold flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-red-600 hover:bg-red-50"><LogOut size={17} /> Log out</button>
              </div>
            </>
          ) : (
            <div className="p-3">
              <div className="px-2 pb-3"><div className="sy-small sy-semibold text-slate-900">Browsing as guest</div><div className="sy-small mt-1 text-slate-500">Sign in to manage your profile and account settings.</div></div>
              <button type="button" onClick={() => go('/login')} className="sy-small sy-semibold flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-white"><LogIn size={17} /> Sign in</button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
