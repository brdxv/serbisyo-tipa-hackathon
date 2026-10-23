import React, { useState } from 'react';

interface ContributeExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName?: string;
}

export function ContributeExperienceModal({
  isOpen,
  onClose,
  serviceName = 'Morong Community Health Center',
}: ContributeExperienceModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [selectedServiceType, setSelectedServiceType] = useState('General Consultation');
  const [visitDate, setVisitDate] = useState('2026-10-18');
  const [visitTime, setVisitTime] = useState('10:30');
  const [waitTimeMinutes, setWaitTimeMinutes] = useState('25');
  const [processingTimeMinutes, setProcessingTimeMinutes] = useState('15');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setIsSubmitted(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const serviceOptions = [
    {
      id: 'General Consultation',
      label: 'General Consultation',
      desc: 'Medical check-ups and consultations',
      icon: '🩺',
    },
    {
      id: 'Medical Records Request',
      label: 'Medical Records Request',
      desc: 'Request and claiming of records',
      icon: '📄',
    },
    {
      id: 'Vaccination',
      label: 'Vaccination',
      desc: 'Routine and seasonal immunizations',
      icon: '💉',
    },
    {
      id: 'Laboratory Services',
      label: 'Laboratory Services',
      desc: 'Basic laboratory and diagnostic tests',
      icon: '🔬',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-lg">
              ✏️
            </span>
            <div>
          <h2 className="sy-h4">Contribute Experience</h2>
              <p className="text-xs text-slate-500">
                Help keep community service information accurate for everyone.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-12 flex flex-col items-center text-center space-y-3">
            <span className="text-5xl">🎉</span>
              <h3 className="sy-h3">Thank you for contributing!</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Your contribution helps citizens in Morong estimate wait times and prepare better.
            </p>
          </div>
        ) : (
          <>
            {/* Stepper Progress Indicator */}
            <div className="flex items-center justify-between px-2 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100 shrink-0 text-xs">
              {[
                { s: 1, name: 'Service', sub: 'Confirm service' },
                { s: 2, name: 'Visit', sub: 'Visit details' },
                { s: 3, name: 'Experience', sub: 'Rate experience' },
                { s: 4, name: 'Review', sub: 'Check & submit' },
              ].map((item) => (
                <div key={item.s} className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition ${
                      step >= item.s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {item.s}
                  </div>
                  <div className="hidden sm:block">
                      <div className="sy-small sy-semibold leading-none text-slate-800">
                      {item.name}
                    </div>
                    <div className="sy-small text-slate-400">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Service Card Summary */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200"
                alt={serviceName}
                className="h-11 w-11 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
              <h4 className="sy-h4 truncate">{serviceName}</h4>
                <p className="sy-small truncate text-slate-500">
                  Clinic / Healthcare • Poblacion, Morong, Rizal • 1.2 km from center
                </p>
                <span className="sy-small sy-semibold mt-0.5 inline-block rounded-full bg-emerald-50 px-1.5 py-0.5 text-emerald-700">
                  Open 8:00 AM – 5:00 PM
                </span>
              </div>
            </div>

            {/* Form Steps Content */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                <h3 className="sy-h4">
                      What service did you use?
                    </h3>
                    <p className="sy-small text-slate-400">
                      Tell us which service you accessed and when you visited.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {serviceOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedServiceType(opt.id)}
                        className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-2.5 ${
                          selectedServiceType === opt.id
                            ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/10'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-lg">{opt.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                          <div className="sy-small text-slate-400">{opt.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Visit Date</label>
                      <input
                        type="date"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Visit Time</label>
                      <input
                        type="time"
                        value={visitTime}
                        onChange={(e) => setVisitTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                <h3 className="sy-h4">Visit & Waiting Time</h3>
                    <p className="sy-small text-slate-400">
                      Estimate your waiting and processing time during your visit.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        How long did you wait in line? (Minutes)
                      </label>
                      <input
                        type="number"
                        value={waitTimeMinutes}
                        onChange={(e) => setWaitTimeMinutes(e.target.value)}
                        placeholder="e.g., 25"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Processing Time at the Counter? (Minutes)
                      </label>
                      <input
                        type="number"
                        value={processingTimeMinutes}
                        onChange={(e) => setProcessingTimeMinutes(e.target.value)}
                        placeholder="e.g., 15"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                <h3 className="sy-h4">Rate your experience</h3>
                    <p className="sy-small text-slate-400">
                      Overall satisfaction and helpful details for fellow citizens.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Overall Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-2xl cursor-pointer transition ${
                            star <= rating ? 'text-amber-400 scale-110' : 'text-slate-200'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-600 ml-2">{rating} / 5</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Comments or Tips</label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="e.g., Staff was helpful but line was long near lunch..."
                      className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white resize-none"
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div>
                <h3 className="sy-h4">Review your submission</h3>
                    <p className="sy-small text-slate-400">Please verify details before submitting.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Service:</span>
                      <span className="font-bold text-slate-900">{selectedServiceType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date & Time:</span>
                      <span className="font-bold text-slate-900">
                        {visitDate} at {visitTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Wait & Processing:</span>
                      <span className="font-bold text-slate-900">
                        {waitTimeMinutes} min wait • {processingTimeMinutes} min process
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rating:</span>
                      <span className="font-bold text-amber-500">{"★".repeat(rating)} ({rating}/5)</span>
                    </div>
                    {comment && (
                      <div className="pt-2 border-t border-slate-200/80 text-slate-700 italic">
                        "{comment}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={step === 1 ? handleClose : () => setStep((s) => (s - 1) as any)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                {step === 1 ? 'Cancel' : '← Back'}
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s + 1) as any)}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 shadow-md transition cursor-pointer"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 shadow-md transition cursor-pointer"
                >
                  Submit Contribution
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
