import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Image as ImageIcon,
  Maximize2,
  RefreshCw,
  RotateCcw,
  Search,
  Star,
  X,
  XCircle,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

type ReviewStatus = 'pending' | 'approved' | 'rejected';

interface ImageCandidate {
  id: string;
  title: string;
  originalUrl: string;
  descriptionUrl?: string;
  width?: number | null;
  height?: number | null;
  mime?: string | null;
  author?: string;
  credit?: string;
  license?: string;
  licenseUrl?: string;
  attributionRequired?: string;
  description?: string;
  source?: string;
  status: ReviewStatus;
  isMain: boolean;
}

interface ReviewPlace {
  id: string;
  name: string;
  category: string;
  address: string;
  coordinates: { lat: number; lng: number };
  candidates: ImageCandidate[];
  review: {
    candidateCount: number;
    approvedCount: number;
    rejectedCount: number;
    pendingCount: number;
    hasMain: boolean;
    targetCount: number;
    needsMore: boolean;
  };
}

interface ReviewCatalog {
  generatedAt: string;
  outputPath: string;
  progress: {
    totalCandidates: number;
    reviewedCandidates: number;
    pendingCandidates: number;
    completeRound: boolean;
  };
  places: ReviewPlace[];
}

interface FinalizeResult {
  ok: boolean;
  downloadedCount: number;
  outputPath: string;
  manifestPath: string;
  warnings: string[];
}

const apiBase = '/api/dev/image-review';

function statusClasses(status: ReviewStatus) {
  if (status === 'approved') return 'border-emerald-300 bg-emerald-50 text-emerald-700';
  if (status === 'rejected') return 'border-rose-300 bg-rose-50 text-rose-700';
  return 'border-slate-200 bg-slate-50 text-slate-600';
}

export function ImageReviewPage() {
  const [catalog, setCatalog] = useState<ReviewCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [workingKey, setWorkingKey] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<{ place: ReviewPlace; candidate: ImageCandidate } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [finalizeResult, setFinalizeResult] = useState<FinalizeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'needs-review' | 'needs-more' | 'ready'>('all');

  const loadCatalog = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiBase);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Unable to load image review data.');
      setCatalog(data);
      setSelectedPlaceId((current) => current ?? data.places?.[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load image review data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCatalog();
  }, []);

  const filteredPlaces = useMemo(() => {
    if (!catalog) return [];
    return catalog.places.filter((place) => {
      if (filter === 'needs-review') return place.review.pendingCount > 0;
      if (filter === 'needs-more') return place.review.needsMore;
      if (filter === 'ready') return !place.review.needsMore && place.review.pendingCount === 0;
      return true;
    });
  }, [catalog, filter]);

  const selectedPlace = useMemo(() => {
    if (!catalog) return null;
    return catalog.places.find((place) => place.id === selectedPlaceId) ?? catalog.places[0] ?? null;
  }, [catalog, selectedPlaceId]);

  const updateCandidate = async (placeId: string, candidateId: string, status: ReviewStatus, isMain = false) => {
    const key = `${placeId}:${candidateId}:${status}:${isMain}`;
    setWorkingKey(key);
    setError(null);
    try {
      const response = await fetch(`${apiBase}/candidate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId, candidateId, status, isMain }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Unable to update image review.');
      setCatalog(data);
      if (activeImage?.candidate.id === candidateId && activeImage.place.id === placeId) {
        const updatedPlace = data.places.find((place: ReviewPlace) => place.id === placeId);
        const updatedCandidate = updatedPlace?.candidates.find((candidate: ImageCandidate) => candidate.id === candidateId);
        if (updatedPlace && updatedCandidate) setActiveImage({ place: updatedPlace, candidate: updatedCandidate });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update image review.');
    } finally {
      setWorkingKey(null);
    }
  };

  const findMore = async (placeId: string) => {
    setWorkingKey(`refresh:${placeId}`);
    setError(null);
    try {
      const response = await fetch(`${apiBase}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Unable to find more image candidates.');
      setCatalog(data);
      setSelectedPlaceId(placeId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to find more image candidates.');
    } finally {
      setWorkingKey(null);
    }
  };

  const finalize = async () => {
    setWorkingKey('finalize');
    setError(null);
    setFinalizeResult(null);
    try {
      const response = await fetch(`${apiBase}/finalize`, { method: 'POST' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Unable to download approved images.');
      setFinalizeResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to download approved images.');
    } finally {
      setWorkingKey(null);
    }
  };

  const openViewer = (place: ReviewPlace, candidate: ImageCandidate) => {
    setActiveImage({ place, candidate });
    setZoom(1);
  };

  const moveViewer = (direction: -1 | 1) => {
    if (!activeImage) return;
    const list = activeImage.place.candidates;
    const index = list.findIndex((candidate) => candidate.id === activeImage.candidate.id);
    if (index < 0) return;
    const next = list[(index + direction + list.length) % list.length];
    setActiveImage({ place: activeImage.place, candidate: next });
    setZoom(1);
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f8fc]">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-600 shadow-sm">
          <RefreshCw size={18} className="animate-spin text-blue-600" /> Loading image review workspace...
        </div>
      </main>
    );
  }

  if (!catalog) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f8fc] p-6 text-center">
        <div className="max-w-md rounded-3xl border border-rose-200 bg-white p-8 shadow-sm">
          <XCircle size={34} className="mx-auto text-rose-500" />
          <h1 className="mt-4 text-xl font-black text-slate-900">Image review unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">{error ?? 'The local review API could not be loaded.'}</p>
          <button onClick={() => void loadCatalog()} className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">Retry</button>
        </div>
      </main>
    );
  }

  const needsMorePlaces = catalog.places.filter((place) => place.review.needsMore);
  const reviewPercent = catalog.progress.totalCandidates === 0
    ? 0
    : Math.round((catalog.progress.reviewedCandidates / catalog.progress.totalCandidates) * 100);

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white"><ImageIcon size={20} /></div>
              <div>
          <h1 className="text-xl font-black tracking-tight">TaymPers Image Review</h1>
                <p className="text-xs text-slate-500">Review real-place image candidates before anything is downloaded into the project.</p>
              </div>
            </div>
          </div>

          <div className="flex min-w-[320px] flex-1 items-center justify-end gap-3">
            <div className="w-full max-w-sm">
              <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold text-slate-500">
                <span>{catalog.progress.reviewedCandidates} / {catalog.progress.totalCandidates} reviewed</span>
                <span>{reviewPercent}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${reviewPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1680px] grid-cols-1 gap-5 p-5 lg:grid-cols-[330px_minmax(0,1fr)]">
        <aside className="self-start rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-[94px] lg:max-h-[calc(100vh-115px)] lg:overflow-y-auto">
          <div className="mb-3 flex items-center justify-between px-2">
            <div>
              <h2 className="text-sm font-black">15 establishments</h2>
              <p className="text-[10px] text-slate-500">Target: 3 approved images each</p>
            </div>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl bg-slate-50 p-1">
            {([
              ['all', 'All'],
              ['needs-review', 'Pending'],
              ['needs-more', 'Needs more'],
              ['ready', 'Ready'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`rounded-lg px-2 py-2 text-[10px] font-bold transition ${filter === value ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            {filteredPlaces.map((place) => {
              const active = selectedPlace?.id === place.id;
              const ready = !place.review.needsMore && place.review.pendingCount === 0;
              return (
                <button
                  key={place.id}
                  onClick={() => setSelectedPlaceId(place.id)}
                  className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${active ? 'border-blue-300 bg-blue-50' : 'border-transparent hover:bg-slate-50'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-extrabold text-slate-900">{place.name}</span>
                      <span className="mt-0.5 block truncate text-[9px] text-slate-500">{place.category}</span>
                    </span>
                    {ready ? <CheckCircle2 size={15} className="shrink-0 text-emerald-500" /> : place.review.pendingCount > 0 ? <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400" /> : <Search size={14} className="shrink-0 text-blue-500" />}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[9px] font-semibold text-slate-500">
                    <span>{place.review.approvedCount} approved</span>
                    <span>{place.review.rejectedCount} rejected</span>
                    <span>{place.review.pendingCount} pending</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="min-w-0 space-y-5">
          {error && (
            <div className="flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <span>{error}</span>
              <button onClick={() => setError(null)}><X size={16} /></button>
            </div>
          )}

          {selectedPlace && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-black tracking-tight">{selectedPlace.name}</h2>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">{selectedPlace.category}</span>
                    {selectedPlace.review.hasMain && <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700"><Star size={12} fill="currentColor" /> Main selected</span>}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{selectedPlace.address}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold">
                    <span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-emerald-700">{selectedPlace.review.approvedCount} approved</span>
                    <span className="rounded-lg bg-rose-50 px-2.5 py-1.5 text-rose-700">{selectedPlace.review.rejectedCount} rejected</span>
                    <span className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-amber-700">{selectedPlace.review.pendingCount} pending</span>
                  </div>
                </div>

                <button
                  onClick={() => void findMore(selectedPlace.id)}
                  disabled={workingKey === `refresh:${selectedPlace.id}`}
                  className="flex h-10 items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-xs font-bold text-blue-700 transition hover:bg-blue-100 disabled:opacity-60"
                >
                  <Search size={15} />
                  {workingKey === `refresh:${selectedPlace.id}` ? 'Finding...' : 'Find more candidates'}
                </button>
              </div>

              {selectedPlace.candidates.length === 0 ? (
                <div className="mt-5 grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div>
                    <ImageIcon size={36} className="mx-auto text-slate-300" />
                    <h3 className="mt-3 text-sm font-black">No image candidates yet</h3>
                    <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">Use Find more candidates to run another Wikimedia search for this establishment. Official-site candidates can also be added in a later collection pass.</p>
                  </div>
                </div>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {selectedPlace.candidates.map((candidate) => {
                    const candidateBusy = workingKey?.startsWith(`${selectedPlace.id}:${candidate.id}:`) ?? false;
                    return (
                      <article key={candidate.id} className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${candidate.isMain ? 'border-amber-300 ring-2 ring-amber-200/60' : candidate.status === 'approved' ? 'border-emerald-200' : candidate.status === 'rejected' ? 'border-rose-200 opacity-70' : 'border-slate-200'}`}>
                        <button onClick={() => openViewer(selectedPlace, candidate)} className="group relative block aspect-[4/3] w-full overflow-hidden bg-slate-100 text-left">
                          <img src={candidate.originalUrl} alt={candidate.description || candidate.title} className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.02] ${candidate.status === 'rejected' ? 'grayscale' : ''}`} />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                          <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-slate-700 shadow"><Maximize2 size={15} /></span>
                          {candidate.isMain && <span className="absolute left-2 top-2 flex items-center gap-1 rounded-lg bg-amber-400 px-2.5 py-1.5 text-[10px] font-black text-amber-950 shadow"><Star size={12} fill="currentColor" /> MAIN IMAGE</span>}
                          <span className={`absolute bottom-2 left-2 rounded-lg border px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${statusClasses(candidate.status)}`}>{candidate.status}</span>
                        </button>

                        <div className="p-3.5">
                          <h3 className="line-clamp-2 text-[12px] font-extrabold leading-4 text-slate-900">{candidate.title}</h3>
                          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-slate-500">
                            <span><strong className="text-slate-700">Size:</strong> {candidate.width ?? '?'} × {candidate.height ?? '?'}</span>
                            <span><strong className="text-slate-700">Type:</strong> {candidate.mime ?? 'unknown'}</span>
                            <span className="truncate"><strong className="text-slate-700">Author:</strong> {candidate.author || 'Unknown'}</span>
                            <span className="truncate"><strong className="text-slate-700">License:</strong> {candidate.license || 'Unknown'}</span>
                            <span className="truncate"><strong className="text-slate-700">Source:</strong> {candidate.source || 'Unknown'}</span>
                            <span className="truncate"><strong className="text-slate-700">Attribution:</strong> {candidate.attributionRequired === 'true' ? 'Required' : candidate.attributionRequired === 'false' ? 'Not required' : 'Check source'}</span>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              disabled={candidateBusy}
                              onClick={() => void updateCandidate(selectedPlace.id, candidate.id, 'approved', candidate.isMain)}
                              className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border text-[10px] font-bold transition ${candidate.status === 'approved' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700'}`}
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button
                              disabled={candidateBusy}
                              onClick={() => void updateCandidate(selectedPlace.id, candidate.id, 'rejected', false)}
                              className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border text-[10px] font-bold transition ${candidate.status === 'rejected' ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-slate-200 text-slate-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700'}`}
                            >
                              <X size={14} /> Reject
                            </button>
                            <button
                              disabled={candidateBusy}
                              onClick={() => void updateCandidate(selectedPlace.id, candidate.id, 'approved', true)}
                              className={`flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border text-[10px] font-bold transition ${candidate.isMain ? 'border-amber-300 bg-amber-50 text-amber-800' : 'border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-800'}`}
                            >
                              <Star size={14} fill={candidate.isMain ? 'currentColor' : 'none'} /> {candidate.isMain ? 'Current main image' : 'Make main image'}
                            </button>
                            {candidate.status !== 'pending' && (
                              <button onClick={() => void updateCandidate(selectedPlace.id, candidate.id, 'pending', false)} className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg text-[9px] font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600">
                                <RotateCcw size={12} /> Reset review
                              </button>
                            )}
                          </div>

                          <div className="mt-3 border-t border-slate-100 pt-3 text-[9px] leading-4 text-slate-500">
                            <p className="line-clamp-3">{candidate.description || 'No description provided by the source.'}</p>
                            {candidate.descriptionUrl && (
                              <a href={candidate.descriptionUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                                View source details <ExternalLink size={11} />
                              </a>
                            )}
                            {candidate.licenseUrl && (
                              <a href={candidate.licenseUrl} target="_blank" rel="noreferrer" className="ml-3 mt-2 inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
                                View license <ExternalLink size={11} />
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black">End of review</h2>
                <p className="mt-1 text-xs text-slate-500">When every current candidate is reviewed, decide whether to find replacements or continue with the approved set.</p>
              </div>
              <div className={`rounded-xl px-3 py-2 text-xs font-bold ${catalog.progress.completeRound ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                {catalog.progress.completeRound ? 'Current review round complete' : `${catalog.progress.pendingCandidates} candidate(s) still pending`}
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {catalog.places.map((place) => (
                <div key={place.id} className={`rounded-xl border p-3 ${place.review.needsMore ? 'border-amber-200 bg-amber-50/50' : 'border-emerald-200 bg-emerald-50/50'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-[11px] font-extrabold text-slate-900">{place.name}</div>
                      <div className="mt-1 text-[9px] text-slate-500">{place.review.approvedCount}/3 approved · {place.review.hasMain ? 'main selected' : 'no main yet'}</div>
                    </div>
                    {place.review.needsMore ? <Search size={15} className="shrink-0 text-amber-600" /> : <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />}
                  </div>
                  {place.review.needsMore && (
                    <button onClick={() => { setSelectedPlaceId(place.id); void findMore(place.id); }} disabled={workingKey === `refresh:${place.id}`} className="mt-2 flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-amber-200 bg-white text-[9px] font-bold text-amber-700 hover:bg-amber-50 disabled:opacity-60">
                      <Search size={12} /> Find another
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
              <p className="max-w-2xl text-[10px] leading-4 text-slate-500">
                Continue downloads only images you explicitly approved. If a place has fewer than 3 approved images, it will still be exported with a warning so you can complete it later.
              </p>
              <button
                onClick={() => void finalize()}
                disabled={workingKey === 'finalize' || !catalog.progress.completeRound}
                className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-black text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={16} /> {workingKey === 'finalize' ? 'Downloading approved images...' : 'Continue & download approved images'}
              </button>
            </div>

            {needsMorePlaces.length > 0 && (
              <p className="mt-3 text-[10px] font-semibold text-amber-700">{needsMorePlaces.length} establishment(s) still have fewer than 3 approved images or no main image selected.</p>
            )}

            {finalizeResult && (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-emerald-600" />
                  <div>
                    <div className="text-sm font-black text-emerald-900">Approved images downloaded</div>
                    <p className="mt-1 text-[11px] leading-5 text-emerald-800">{finalizeResult.downloadedCount} image(s) were written directly into the project. No unzip step is required.</p>
                    <div className="mt-2 rounded-lg bg-white/70 px-3 py-2 font-mono text-[10px] text-slate-700">{finalizeResult.outputPath}</div>
                    <div className="mt-1 rounded-lg bg-white/70 px-3 py-2 font-mono text-[10px] text-slate-700">Manifest: {finalizeResult.manifestPath}</div>
                    {finalizeResult.warnings.length > 0 && (
                      <ul className="mt-3 list-disc space-y-1 pl-5 text-[10px] text-amber-800">
                        {finalizeResult.warnings.map((warning) => <li key={warning}>{warning}</li>)}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {activeImage && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 text-white" onWheel={(event) => setZoom((value) => Math.min(5, Math.max(0.5, value + (event.deltaY < 0 ? 0.15 : -0.15))))}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur">
            <div className="min-w-0">
              <div className="truncate text-sm font-black">{activeImage.place.name}</div>
              <div className="mt-0.5 truncate text-[10px] text-slate-400">{activeImage.candidate.title}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setZoom((value) => Math.max(0.5, value - 0.25))} className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 hover:bg-white/20"><ZoomOut size={17} /></button>
              <button onClick={() => setZoom(1)} className="h-9 rounded-lg bg-white/10 px-3 text-[10px] font-bold hover:bg-white/20">{Math.round(zoom * 100)}%</button>
              <button onClick={() => setZoom((value) => Math.min(5, value + 0.25))} className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 hover:bg-white/20"><ZoomIn size={17} /></button>
              <button onClick={() => { setActiveImage(null); setZoom(1); }} className="ml-2 grid h-9 w-9 place-items-center rounded-lg bg-white/10 hover:bg-white/20"><X size={18} /></button>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto p-8">
            <button onClick={() => moveViewer(-1)} className="fixed left-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20"><ChevronLeft size={22} /></button>
            <img
              src={activeImage.candidate.originalUrl}
              alt={activeImage.candidate.description || activeImage.candidate.title}
              className="max-h-none max-w-none select-none object-contain transition-[width] duration-150"
              style={{ width: `${92 * zoom}vw` }}
            />
            <button onClick={() => moveViewer(1)} className="fixed right-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 backdrop-blur hover:bg-white/20"><ChevronRight size={22} /></button>
          </div>

          <div className="border-t border-white/10 bg-slate-950 px-4 py-3">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400">
                <span>{activeImage.candidate.width ?? '?'} × {activeImage.candidate.height ?? '?'}</span>
                <span>{activeImage.candidate.license || 'Unknown license'}</span>
                <span>{activeImage.candidate.author || 'Unknown author'}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => void updateCandidate(activeImage.place.id, activeImage.candidate.id, 'rejected', false)} className="flex h-9 items-center gap-1.5 rounded-lg bg-rose-500/15 px-3 text-[10px] font-bold text-rose-300 hover:bg-rose-500/25"><X size={14} /> Reject</button>
                <button onClick={() => void updateCandidate(activeImage.place.id, activeImage.candidate.id, 'approved', activeImage.candidate.isMain)} className="flex h-9 items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/25"><Check size={14} /> Approve</button>
                <button onClick={() => void updateCandidate(activeImage.place.id, activeImage.candidate.id, 'approved', true)} className="flex h-9 items-center gap-1.5 rounded-lg bg-amber-500/15 px-3 text-[10px] font-bold text-amber-300 hover:bg-amber-500/25"><Star size={14} /> Make main</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

