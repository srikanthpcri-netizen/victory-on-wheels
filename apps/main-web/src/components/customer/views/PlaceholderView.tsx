type Props = {
  title: string;
  text?: string;
};

export default function PlaceholderView({ title, text }: Props) {
  return (
    <section className="customer-card">
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <p style={{ color: "#777", marginBottom: 0 }}>
        {text || "This section will be connected next."}
      </p>
    </section>
  );
}
