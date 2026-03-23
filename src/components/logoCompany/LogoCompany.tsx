"use client";

export function CompanyLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">
        {typeof window !== "undefined" ? localStorage.getItem("pulpaNameCompany") ?? "" : ""}
      </span>
    </div>
  );
}
