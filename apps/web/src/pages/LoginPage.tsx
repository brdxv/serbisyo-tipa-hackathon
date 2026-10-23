import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticatePrototypeAccount, createPrototypeAccount } from '../auth/taympersAuth';

const TAYMPERS_LOGO_MARK_PATH = '/assets/branding/taympers-logo.png';
const TAYMPERS_LOGO_TEXT_PATH = '/assets/branding/taympers-logo-text.png';

const ASSETS = {
  loginBackdrop: '/assets/backdrops/login-page-main-backdrop.png',
  loginMapOverlay: '/assets/backdrops/3d-map-overlay.png',
  mail: '/assets/icons/53_mail.png',
  chevronRight: '/assets/icons/06_chevron_right.png',
  star: '/assets/icons/19_star.png',
  governmentPin: '/assets/pinpoints/default-government-marker.png',
  activePin: '/assets/pinpoints/active-open-location-marker.png',
  locationPin: '/assets/pinpoints/default-location-marker.png',
} as const;

function TaymPersLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? 'sy-brand-image sy-brand-image--compact' : 'sy-brand-image'} aria-label="TaymPers">
      <img className="sy-brand-mark" src={TAYMPERS_LOGO_MARK_PATH} alt="" />
      <img className="sy-brand-wordmark" src={TAYMPERS_LOGO_TEXT_PATH} alt="" />
    </span>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="sy-inline-svg">
      <path d="M7.5 10V7.7a4.5 4.5 0 0 1 9 0V10" />
      <rect x="5" y="10" width="14" height="10" rx="2.5" />
      <path d="M12 14v2.5" />
    </svg>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="sy-inline-svg">
      <path d="M2.8 12s3.3-5 9.2-5 9.2 5 9.2 5-3.3 5-9.2 5-9.2-5-9.2-5Z" />
      <circle cx="12" cy="12" r="2.2" />
      {hidden && <path d="M4 4l16 16" />}
    </svg>
  );
}

interface PreviewCardProps {
  className: string;
  name: string;
  image: string;
  score: string;
  wait: string;
  pin: string;
}

function PreviewCard({ className, name, image, score, wait, pin }: PreviewCardProps) {
  return (
    <div className={`sy-preview-group ${className}`}>
      <div className="sy-service-card">
        <img className="sy-service-photo" src={image} alt="" />
        <div className="sy-service-details">
          <div className="sy-service-title-row">
            <strong>{name}</strong>
            <span className="sy-rating">
              <img src={ASSETS.star} alt="" />
              {score}
            </span>
          </div>
          <div className="sy-service-meta">
            <span className="sy-open">Open</span>
            <span className="sy-wait">{wait}</span>
          </div>
        </div>
      </div>
      <img className="sy-preview-pin" src={pin} alt="" />
    </div>
  );
}

export function LoginPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');
    const account = isSignIn
      ? authenticatePrototypeAccount(email, password)
      : createPrototypeAccount(email, password);
    if (!account) {
      setAuthError('Email or password does not match the TaymPers demo account.');
      return;
    }
    navigate('/explore');
  };

  return (
    <main className="sy-login-page">
      <img className="sy-login-background" src={ASSETS.loginBackdrop} alt="" aria-hidden="true" />
      <img className="sy-login-map-art" src={ASSETS.loginMapOverlay} alt="" aria-hidden="true" />
      <div className="sy-login-overlay" aria-hidden="true" />

      <div className="sy-login-layout">
        <section className="sy-intro" aria-label="About TaymPers">
          <div className="sy-intro-brand">
            <TaymPersLogo />
          </div>

          <div className="sy-intro-copy">
            <h1>
              <span>Share</span> experiences.<br />
              <span>Save</span> services.<br />
              <span>Help</span> your community<br />
              know what to expect.
            </h1>
            <p>
              Real experiences and useful information<br className="sy-desktop-break" /> for a more informed community.
            </p>
          </div>

          <div className="sy-service-preview" aria-label="Example community services">
            <PreviewCard
              className="sy-preview--municipal"
              name="Morong Municipal Office"
              score="4.5"
              wait="10–20 min"
              pin={ASSETS.governmentPin}
              image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=240&q=80"
            />
            <PreviewCard
              className="sy-preview--health"
              name="Morong Community Health Center"
              score="4.6"
              wait="15–30 min"
              pin={ASSETS.activePin}
              image="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=240&q=80"
            />
            <PreviewCard
              className="sy-preview--pharmacy"
              name="Bayanihan Pharmacy"
              score="4.7"
              wait="5–15 min"
              pin={ASSETS.locationPin}
              image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=240&q=80"
            />
          </div>
        </section>

        <section className="sy-auth-column" aria-label="Sign in to TaymPers">
          <div className="sy-auth-card">
            <div className="sy-auth-brand">
              <TaymPersLogo compact />
            </div>

            <header className="sy-auth-heading">
              <h2>{isSignIn ? 'Welcome back' : 'Create your account'}</h2>
              <p>{isSignIn ? 'Sign in to continue to TaymPers.' : 'Join your community on TaymPers.'}</p>
            </header>

            <form className="sy-auth-form" onSubmit={handleSubmit}>
              <div className="sy-field">
                <label htmlFor="sy-email">Email</label>
                <div className="sy-input-wrap">
                  <img className="sy-input-asset-icon" src={ASSETS.mail} alt="" />
                  <input
                    id="sy-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => { setEmail(event.target.value); setAuthError(''); }}
                    required
                  />
                </div>
              </div>

              <div className="sy-field">
                <div className="sy-password-label-row">
                  <label htmlFor="sy-password">Password</label>
                  {isSignIn && (
                    <button
                      className="sy-forgot-button"
                      type="button"
                      onClick={() => alert('Password reset is not connected in this prototype yet.')}
                    >
                      Forgot your password?
                    </button>
                  )}
                </div>
                <div className="sy-input-wrap">
                  <span className="sy-svg-icon"><LockIcon /></span>
                  <input
                    id="sy-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isSignIn ? 'current-password' : 'new-password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => { setPassword(event.target.value); setAuthError(''); }}
                    required
                  />
                  <button
                    className="sy-show-password"
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    <EyeIcon hidden={!showPassword} />
                  </button>
                </div>
              </div>

              <button className="sy-submit-button" type="submit">
                {isSignIn ? 'Sign In' : 'Create Account'}
              </button>
              {authError ? <div className="sy-auth-error" role="alert">{authError}</div> : null}
            </form>

            <div className="sy-divider"><span /><b>or</b><span /></div>

            <button
              className="sy-create-button"
              type="button"
              onClick={() => {
                setIsSignIn((value) => !value);
                setPassword('');
                setAuthError('');
              }}
            >
              {isSignIn ? 'Create Account' : 'Back to Sign In'}
            </button>

            <div className="sy-guest-link-wrap">
              <button className="sy-guest-link" type="button" onClick={() => navigate('/explore')}>
                <span className="sy-guest-location" aria-hidden="true">
                  <img src={ASSETS.locationPin} alt="" />
                </span>
                <span>Continue exploring without signing in</span>
                <img className="sy-guest-chevron" src={ASSETS.chevronRight} alt="" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .sy-login-page, .sy-login-page * { box-sizing: border-box; }
        .sy-login-page {
          position: relative;
          isolation: isolate;
          min-height: 100vh;
          min-height: 100svh;
          overflow: hidden;
          background: #fafbff;
          color: #0f172a;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .sy-login-background {
          position: absolute;
          inset: 0;
          z-index: -4;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
        }
        .sy-login-map-art {
          position: absolute;
          z-index: -3;
          left: clamp(-300px, -11vw, -90px);
          bottom: clamp(-470px, -31vh, -260px);
          width: clamp(1320px, 96vw, 2350px);
          max-width: none;
          height: auto;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          filter: drop-shadow(0 30px 50px rgba(77, 127, 181, .14));
        }
        .sy-login-overlay {
          position: absolute;
          inset: 0;
          z-index: -2;
          background:
            linear-gradient(90deg, rgba(250,253,255,.52) 0%, rgba(250,253,255,.20) 15%, rgba(250,253,255,.035) 42%, rgba(250,253,255,.23) 67%, rgba(250,253,255,.78) 88%, rgba(250,253,255,.96) 100%),
            linear-gradient(180deg, rgba(250,253,255,.16) 0%, rgba(250,253,255,.025) 28%, rgba(250,253,255,.06) 56%, rgba(250,253,255,.58) 88%, rgba(250,253,255,.86) 100%),
            radial-gradient(ellipse at 39% 43%, rgba(255,255,255,0) 0%, rgba(250,253,255,.025) 45%, rgba(250,253,255,.14) 72%, rgba(250,253,255,.38) 100%);
        }
        .sy-login-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.18fr) minmax(470px, .82fr);
          align-items: center;
          gap: clamp(38px, 5.2vw, 92px);
          width: min(calc(100% - 96px), 1380px);
          min-height: 100vh;
          min-height: 100svh;
          margin-inline: auto;
          padding-block: 48px;
        }
        .sy-intro { min-width: 0; align-self: center; padding: 6px 0 0; }
        .sy-intro-brand { margin-bottom: 44px; }
        .sy-brand-image { display: inline-flex; width: 246px; max-width: 100%; aspect-ratio: 4.45 / 1; align-items: center; gap: 8px; }
        .sy-brand-mark { display: block; height: 86%; width: auto; object-fit: contain; }
        .sy-brand-wordmark { display: block; height: 55%; width: auto; object-fit: contain; }
        .sy-brand-image--compact { width: 208px; }
        .sy-intro-copy h1 {
          margin: 0;
          max-width: 690px;
          color: #0f172a;
          font-size: 32px;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -.025em;
        }
        .sy-intro-copy h1 span { color: #0066ff; }
        .sy-intro-copy p {
          margin: 18px 0 0;
          color: #475569;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.5;
        }
        .sy-service-preview { position: relative; width: min(100%, 735px); height: 300px; margin-top: 30px; }
        .sy-preview-group { position: absolute; z-index: 2; }
        .sy-preview--municipal { top: 112px; left: 0; }
        .sy-preview--health { top: 0; left: 45%; transform: translateX(-20%); }
        .sy-preview--pharmacy { top: 182px; right: 2%; }
        .sy-service-card {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 290px;
          min-height: 94px;
          padding: 12px;
          border: 1px solid rgba(255,255,255,.95);
          border-radius: 17px;
          background: rgba(255,255,255,.95);
          box-shadow: 0 13px 35px rgba(25,61,110,.15);
          backdrop-filter: blur(10px);
        }
        .sy-service-photo { display: block; width: 64px; height: 64px; flex: 0 0 auto; border-radius: 11px; object-fit: cover; }
        .sy-service-details { min-width: 0; flex: 1; }
        .sy-service-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
        .sy-service-title-row strong { color: #0f172a; font-size: 12px; font-weight: 600; line-height: 1.4; }
        .sy-rating { display: inline-flex; align-items: center; gap: 3px; color: #475569; font-size: 12px; white-space: nowrap; }
        .sy-rating img { width: 13px; height: 13px; object-fit: contain; }
        .sy-service-meta { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
        .sy-open { border-radius: 999px; padding: 3px 9px; background: #ecfdf5; color: #10b981; font-size: 12px; font-weight: 600; }
        .sy-wait { color: #475569; font-size: 12px; }
        .sy-preview-pin {
          position: absolute;
          z-index: 1;
          width: 58px;
          height: 58px;
          object-fit: contain;
          left: 50%;
          top: 68px;
          transform: translateX(-50%);
          filter: drop-shadow(0 7px 10px rgba(39,96,174,.2));
          pointer-events: none;
        }
        .sy-auth-column { display: flex; width: 100%; min-width: 0; align-items: center; justify-content: flex-end; }
        .sy-auth-card {
          width: 100%;
          max-width: 560px;
          margin-left: auto;
          padding:
            clamp(28px, 4.25vh, 46px)
            clamp(36px, 3vw, 56px)
            clamp(26px, 3.9vh, 42px);
          border: 1px solid rgba(222,234,248,.96);
          border-radius: 24px;
          background: rgba(255,255,255,.96);
          box-shadow: 0 22px 65px rgba(29,66,112,.14);
          backdrop-filter: blur(16px);
        }
        .sy-auth-brand { display: flex; justify-content: center; }
        .sy-auth-heading { margin-top: clamp(20px, 3.15vh, 34px); text-align: center; }
        .sy-auth-heading h2 { margin: 0; color: #0f172a; font-size: 24px; font-weight: 700; line-height: 1.2; letter-spacing: -.02em; }
        .sy-auth-heading p { margin: 8px 0 0; color: #475569; font-size: 14px; line-height: 1.45; }
        .sy-auth-form { display: grid; gap: clamp(16px, 2.25vh, 24px); margin-top: clamp(22px, 3.15vh, 34px); }
        .sy-field label { display: block; margin-bottom: 9px; color: #0f172a; font-size: 14px; font-weight: 600; }
        .sy-password-label-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .sy-input-wrap {
          display: flex;
          min-width: 0;
          height: clamp(48px, 5vh, 54px);
          align-items: center;
          border: 1px solid #d8e2ef;
          border-radius: 11px;
          background: #fff;
          transition: border-color .2s, box-shadow .2s;
        }
        .sy-input-wrap:focus-within { border-color: #66a3ff; box-shadow: 0 0 0 3px rgba(0,102,255,.1); }
        .sy-input-asset-icon { width: 18px; height: 18px; margin-left: 14px; object-fit: contain; }
        .sy-svg-icon { display: inline-flex; width: 18px; height: 18px; margin-left: 14px; color: #8090b5; }
        .sy-inline-svg { width: 100%; height: 100%; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        .sy-input-wrap input { width: 100%; min-width: 0; height: 100%; padding: 0 14px; border: 0; outline: 0; background: transparent; color: #0f172a; font-family: inherit; font-size: 14px; }
        .sy-input-wrap input::placeholder { color: #8d9ab7; opacity: 1; }
        .sy-forgot-button { margin: 0 0 9px; padding: 0; border: 0; background: transparent; color: #0066ff; cursor: pointer; font: inherit; font-size: 12px; font-weight: 700; white-space: nowrap; }
        .sy-forgot-button:hover { text-decoration: underline; }
        .sy-show-password { display: inline-flex; width: 46px; height: 100%; align-items: center; justify-content: center; padding: 0 14px; border: 0; background: transparent; color: #7e8faf; cursor: pointer; }
        .sy-show-password .sy-inline-svg { width: 20px; height: 20px; }
        .sy-submit-button { width: 100%; min-height: clamp(49px, 5.2vh, 56px); border: 0; border-radius: 11px; background: #0066ff; box-shadow: 0 8px 18px rgba(0,102,255,.2); color: #fff; cursor: pointer; font: inherit; font-size: 14px; font-weight: 600; transition: background .2s, transform .2s; }
        .sy-submit-button:hover { background: #0058de; }
        .sy-submit-button:active { transform: translateY(1px); }
        .sy-auth-error { margin-top: -8px; border-radius: 10px; background: #fef2f2; padding: 9px 11px; color: #b91c1c; font-size: 12px; line-height: 1.35; }
        .sy-divider { display: flex; align-items: center; gap: 16px; margin: clamp(18px, 2.6vh, 28px) 0; color: #8290ae; }
        .sy-divider span { height: 1px; flex: 1; background: #dfe6f0; }
        .sy-divider b { font-size: 12px; font-weight: 400; }
        .sy-create-button { width: 100%; min-height: clamp(48px, 5vh, 54px); border: 1.5px solid #0066ff; border-radius: 11px; background: #fff; color: #0066ff; cursor: pointer; font: inherit; font-size: 14px; font-weight: 600; transition: background .2s; }
        .sy-create-button:hover { background: #f4f8ff; }
        .sy-guest-link-wrap { margin-top: clamp(22px, 3.25vh, 35px); text-align: center; }
        .sy-guest-link { display: inline-flex; align-items: center; justify-content: center; gap: 9px; padding: 0; border: 0; background: transparent; color: #0066ff; cursor: pointer; font: inherit; font-size: 12px; font-weight: 600; }
        .sy-guest-link:hover { text-decoration: underline; }
        .sy-guest-location { display: inline-flex; width: 24px; height: 24px; align-items: center; justify-content: center; overflow: hidden; border: 1px solid #80b3ff; border-radius: 999px; }
        .sy-guest-location img { width: 18px; height: 18px; object-fit: contain; }
        .sy-guest-chevron { width: 14px; height: 14px; object-fit: contain; }

        @media (max-width: 1180px) and (min-width: 781px) {
          .sy-login-map-art { left: -270px; bottom: -330px; width: 1480px; }
          .sy-login-layout { width: calc(100% - 54px); grid-template-columns: minmax(0, 1fr) minmax(410px, .85fr); gap: 38px; }
          .sy-intro-brand { margin-bottom: 34px; }
          .sy-intro-copy h1 { font-size: 32px; }
          .sy-intro-copy p { font-size: 16px; }
          .sy-service-preview { transform: scale(.9); transform-origin: left top; }
          .sy-auth-card { padding: 38px 38px 34px; }
        }
        @media (min-width: 781px) and (max-height: 1100px) {
          .sy-login-layout { padding-block: 32px; }
          .sy-brand-image--compact { width: 190px; }
          .sy-auth-card { padding-top: 34px; padding-bottom: 30px; }
          .sy-auth-heading { margin-top: 22px; }
          .sy-auth-heading h2 { font-size: 24px; }
          .sy-auth-form { gap: 18px; margin-top: 25px; }
          .sy-input-wrap { height: 50px; }
          .sy-submit-button { min-height: 51px; }
          .sy-divider { margin-block: 20px; }
          .sy-create-button { min-height: 50px; }
          .sy-guest-link-wrap { margin-top: 25px; }
        }
        @media (min-width: 781px) and (max-height: 900px) {
          .sy-login-layout { padding-block: 24px; }
          .sy-intro-brand { margin-bottom: 22px; }
          .sy-brand-image:not(.sy-brand-image--compact) { width: 205px; }
          .sy-intro-copy h1 { font-size: 32px; line-height: 1.15; letter-spacing: -.025em; }
          .sy-intro-copy p { margin-top: 12px; font-size: 16px; line-height: 1.5; }
          .sy-service-preview { height: 220px; margin-top: 18px; transform: scale(.72); transform-origin: left top; }
          .sy-brand-image--compact { width: 176px; }
          .sy-auth-card { padding-block: 24px; }
          .sy-auth-heading { margin-top: 18px; }
          .sy-auth-heading h2 { font-size: 24px; }
          .sy-auth-form { gap: 14px; margin-top: 20px; }
          .sy-divider { margin-block: 15px; }
          .sy-guest-link-wrap { margin-top: 17px; }
        }
        @media (min-width: 781px) and (max-height: 760px) {
          .sy-login-layout { padding-block: 14px; }
          .sy-intro-brand { margin-bottom: 16px; }
          .sy-brand-image:not(.sy-brand-image--compact) { width: 185px; }
          .sy-intro-copy h1 { font-size: 32px; }
          .sy-intro-copy p { margin-top: 8px; font-size: 16px; }
          .sy-service-preview { height: 190px; margin-top: 12px; transform: scale(.64); }
          .sy-brand-image--compact { width: 154px; }
          .sy-auth-card { padding-block: 18px; }
          .sy-auth-heading { margin-top: 12px; }
          .sy-auth-heading h2 { font-size: 24px; }
          .sy-auth-heading p { margin-top: 5px; font-size: 14px; }
          .sy-auth-form { gap: 10px; margin-top: 15px; }
          .sy-input-wrap { height: 44px; }
          .sy-submit-button { min-height: 46px; }
          .sy-divider { margin-block: 12px; }
          .sy-create-button { min-height: 46px; }
          .sy-guest-link-wrap { margin-top: 14px; }
        }
        @media (max-width: 780px) {
          .sy-login-page { overflow-y: auto; }
          .sy-login-background, .sy-login-map-art, .sy-login-overlay { position: fixed; }
          .sy-login-map-art { left: 50%; bottom: -210px; width: max(960px, 190vw); transform: translateX(-54%); opacity: .62; }
          .sy-login-overlay {
            background:
              linear-gradient(90deg, rgba(250,253,255,.54) 0%, rgba(250,253,255,.10) 38%, rgba(250,253,255,.78) 84%, rgba(250,253,255,.95) 100%),
              linear-gradient(180deg, rgba(250,253,255,.20) 0%, rgba(250,253,255,.05) 34%, rgba(250,253,255,.22) 70%, rgba(250,253,255,.74) 100%);
          }
          .sy-login-layout { display: flex; flex-direction: column; align-items: stretch; gap: 26px; width: 100%; min-height: 100svh; padding: 28px 20px 34px; }
          .sy-intro { padding: 0; }
          .sy-intro-brand { margin-bottom: 22px; }
          .sy-brand-image { width: 190px; }
          .sy-brand-image--compact { width: 180px; }
          .sy-intro-copy h1 { font-size: 28px; letter-spacing: -.025em; }
          .sy-intro-copy p { max-width: 390px; font-size: 16px; }
          .sy-desktop-break { display: none; }
          .sy-service-preview { display: none; }
          .sy-auth-column { justify-content: center; }
          .sy-auth-card { max-width: 520px; margin: 0 auto; padding: 30px 24px 28px; border-radius: 20px; }
          .sy-auth-heading { margin-top: 24px; }
          .sy-auth-heading h2 { font-size: 22px; }
          .sy-auth-form { margin-top: 27px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sy-login-page *, .sy-login-page *::before, .sy-login-page *::after { transition-duration: .01ms !important; }
        }
      `}</style>
    </main>
  );
}
