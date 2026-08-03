const NAV_ITEMS = ["Schedule", "Reports", "Help"];

export function PageHeader() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      <span className="text-lg font-semibold text-gray-900">KOMPASS</span>
      <nav className="flex items-center gap-6">
        {NAV_ITEMS.map((item, index) => (
          <span
            key={item}
            className={
              index === 0
                ? "text-sm font-medium text-blue-600"
                : "text-sm font-medium text-gray-500 hover:text-gray-700"
            }
          >
            {item}
          </span>
        ))}
      </nav>
    </header>
  );
}
