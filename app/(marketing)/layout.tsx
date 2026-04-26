import "@/design-tokens.css";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--sys-surface-roles-surface)",
      }}
    >
      {children}
    </div>
  );
}
