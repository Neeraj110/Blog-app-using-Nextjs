const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex-1 relative flex items-center justify-center h-14 hover:bg-surface-container-high transition-all text-sm tracking-tight
      ${active ? "font-semibold text-on-surface" : "text-on-surface-variant"}`}
  >
    <span>{children}</span>
    {active && (
      <div className="absolute bottom-0 h-1 w-12 bg-primary rounded-full" />
    )}
  </button>
);

export default TabButton;
