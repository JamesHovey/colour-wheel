'use client';

import packageJson from '../../package.json';

export default function VersionBadge() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <span className="text-xs text-slate-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-slate-200">
        v{packageJson.version}
      </span>
    </div>
  );
}
