interface LayoutGridProps {
  children: React.ReactNode;
}

export default function LayoutGrid({ children }: LayoutGridProps) {
  return (
    <div className="l-grid centered">
      {children}
    </div>
  );
}