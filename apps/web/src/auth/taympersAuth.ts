export type TaymPersAccount = {
  email: string;
  fullName: string;
  location: string;
  avatar: string;
  role: string;
};

type StoredPrototypeAccount = TaymPersAccount & { password: string };

const ACCOUNT_KEY = 'taympers:prototype-account:v1';
const SESSION_KEY = 'taympers:session:v1';
const AUTH_EVENT = 'taympers-auth-change';

export const DEFAULT_DEMO_ACCOUNT: StoredPrototypeAccount = {
  email: 'iankurt.valencia2005@gmail.com',
  password: 'demo1234',
  fullName: 'Ian Kurt G. Valencia',
  location: 'Morong, Rizal',
  avatar: '/assets/avatars/community-avatar-placeholder-1.png',
  role: 'Community Member',
};

function readStoredAccount(): StoredPrototypeAccount {
  if (typeof window === 'undefined') return DEFAULT_DEMO_ACCOUNT;
  try {
    const raw = window.localStorage.getItem(ACCOUNT_KEY);
    if (!raw) return DEFAULT_DEMO_ACCOUNT;
    const parsed = JSON.parse(raw) as Partial<StoredPrototypeAccount>;
    return { ...DEFAULT_DEMO_ACCOUNT, ...parsed };
  } catch {
    return DEFAULT_DEMO_ACCOUNT;
  }
}

function emitAuthChange() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(AUTH_EVENT));
}

export function authenticatePrototypeAccount(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const account = normalizedEmail === DEFAULT_DEMO_ACCOUNT.email && password === DEFAULT_DEMO_ACCOUNT.password
    ? DEFAULT_DEMO_ACCOUNT
    : readStoredAccount();
  const valid = account.email.toLowerCase() === normalizedEmail && account.password === password;
  if (!valid) return null;
  if (account.email === DEFAULT_DEMO_ACCOUNT.email) {
    const stored = readStoredAccount();
    const next = stored.email === DEFAULT_DEMO_ACCOUNT.email
      ? { ...DEFAULT_DEMO_ACCOUNT, ...stored, email: DEFAULT_DEMO_ACCOUNT.email, password: DEFAULT_DEMO_ACCOUNT.password }
      : DEFAULT_DEMO_ACCOUNT;
    window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(next));
  }
  window.localStorage.setItem(SESSION_KEY, account.email);
  emitAuthChange();
  return getCurrentAccount();
}

export function createPrototypeAccount(email: string, password: string) {
  const trimmedEmail = email.trim().toLowerCase();
  const localPart = trimmedEmail.split('@')[0] || 'Community Member';
  const derivedName = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
  const account: StoredPrototypeAccount = {
    ...DEFAULT_DEMO_ACCOUNT,
    email: trimmedEmail,
    password,
    fullName: trimmedEmail === DEFAULT_DEMO_ACCOUNT.email ? DEFAULT_DEMO_ACCOUNT.fullName : derivedName,
  };
  window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  window.localStorage.setItem(SESSION_KEY, account.email);
  emitAuthChange();
  return getCurrentAccount();
}

export function getCurrentAccount(): TaymPersAccount | null {
  if (typeof window === 'undefined') return null;
  const session = window.localStorage.getItem(SESSION_KEY);
  if (!session) return null;
  const account = readStoredAccount();
  if (account.email.toLowerCase() !== session.toLowerCase()) return null;
  const { password: _password, ...publicAccount } = account;
  return publicAccount;
}

export function updateCurrentAccount(patch: Partial<Pick<TaymPersAccount, 'fullName' | 'location' | 'avatar'>>) {
  const account = readStoredAccount();
  const next = { ...account, ...patch };
  window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(next));
  emitAuthChange();
  return getCurrentAccount();
}

export function signOutPrototypeAccount() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SESSION_KEY);
  emitAuthChange();
}

export function subscribeToAuthChanges(callback: () => void) {
  if (typeof window === 'undefined') return () => undefined;
  const handler = () => callback();
  window.addEventListener(AUTH_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(AUTH_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
