import React from 'react';

const HomeLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#d1fae5,_transparent_36%),linear-gradient(135deg,_#f8fafc_0%,_#ecfdf5_100%)]">
      <header className="border-b border-emerald-950/10 bg-white/75 px-5 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-lg font-bold tracking-tight text-slate-950">Eco Spark Hub</span>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Admin space</span>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      {children}
      </main>
    </div>
  );
};

export default HomeLayout;