"use client";

type TProp = { width: number; height: number };

export const Logo = ({ width, height }: TProp) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold"
        style={{ width, height, fontSize: width * 0.4 }}
      >
        P
      </div>
      {width > 50 && (
        <span className="font-bold text-gray-800 dark:text-white text-lg">Pulpa</span>
      )}
    </div>
  );
};
