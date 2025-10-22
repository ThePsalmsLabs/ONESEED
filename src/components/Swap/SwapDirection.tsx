'use client';

interface SwapDirectionProps {
  onSwap: () => void;
}

export function SwapDirection({ onSwap }: SwapDirectionProps) {
  return (
    <div className="flex justify-center -my-2 relative z-10">
      <button
        onClick={onSwap}
        className="p-3 glass-medium hover:glass-strong rounded-xl border border-white/20 hover:border-primary-400/50 transition-all duration-200 hover-lift group"
        aria-label="Swap tokens"
      >
        <svg
          className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transform group-hover:rotate-180 transition-all duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      </button>
    </div>
  );
}

