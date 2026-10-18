export function ServiceMapPlaceholder() {
  return (
    <section className="relative min-h-[56vh] overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 via-emerald-50 to-slate-100 lg:min-h-[calc(100vh-104px)] lg:rounded-none">
      <div className="absolute inset-0 grid place-items-center p-8 text-center">
        <div className="max-w-sm rounded-3xl bg-white/90 p-6 shadow-lg backdrop-blur">
          <div className="text-lg font-semibold">Map integration area</div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep map-provider code inside the Explore feature so markers, cards, and selection state stay synchronized.
          </p>
        </div>
      </div>
    </section>
  );
}
