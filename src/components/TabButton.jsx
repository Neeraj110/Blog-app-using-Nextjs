const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex-1 relative flex items-center justify-center h-14 hover:bg-gray-900/40 transition-all
      ${active ? "font-bold" : "text-gray-500"}`}
  >
    <span>{children}</span>
    {active && (
      <div className="absolute bottom-0 h-1 w-12 bg-blue-500 rounded-full" />
    )}
  </button>
);

export default TabButton;