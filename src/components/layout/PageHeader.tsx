import type { UserRole } from "@/types/schedule";

export interface PageHeaderProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function PageHeader({ role, onRoleChange }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      <span className="font-heading text-header-md font-semibold text-gray-900">KOMPASS</span>
      <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 text-body-sm">
        <span className="pl-2 text-gray-400" title="Simulated role for demo/testing purposes">
          Viewing as
        </span>
        {(["Creator", "Viewer"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onRoleChange(option)}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${
              role === option ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </header>
  );
}
