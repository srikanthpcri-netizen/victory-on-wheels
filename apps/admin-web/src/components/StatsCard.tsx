import { Card } from "antd";

interface Props {
  title: string;
  value: number;
}

export default function StatsCard({ title, value }: Props) {
  return (
    <Card
      bordered={false}
      styles={{
        body: {
          padding: "18px 20px",
        },
      }}
      style={{
        borderRadius: 12,
        background: "#ffffff",
        border: "1px solid #f0f0f0",
        boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "#fff5f5",
          border: "1px solid #ffe1e1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: "#ff0000",
          }}
        />
      </div>

      <div
        style={{
          fontSize: 13,
          color: "#666666",
          marginBottom: 6,
          fontWeight: 500,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 30,
          lineHeight: 1,
          fontWeight: 700,
          color: "#111111",
        }}
      >
        {value}
      </div>
    </Card>
  );
}
