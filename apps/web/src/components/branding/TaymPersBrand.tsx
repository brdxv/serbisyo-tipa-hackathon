import React from 'react';

export const TAYMPERS_LOGO_MARK_PATH = '/assets/branding/taympers-logo.png';
export const TAYMPERS_LOGO_LOCKUP_PATH = '/assets/branding/taympers-logo-text.png';

export function TaymPersBrand({
  compact = false,
  className = '',
}: {
  compact?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      <img
        src={TAYMPERS_LOGO_MARK_PATH}
        alt="TaymPers"
        className={className}
      />
    );
  }

  return (
    <span className={`inline-flex shrink-0 items-center gap-[7px] ${className}`} aria-label="TaymPers">
      <img src={TAYMPERS_LOGO_MARK_PATH} alt="" className="h-[86%] w-auto shrink-0 object-contain" />
      <img src={TAYMPERS_LOGO_LOCKUP_PATH} alt="" className="h-[55%] w-auto shrink-0 object-contain" />
    </span>
  );
}
