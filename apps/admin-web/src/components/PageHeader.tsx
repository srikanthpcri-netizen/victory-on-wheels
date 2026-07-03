import { Typography } from "antd";

const { Title, Text } = Typography;

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  extra,
}: PageHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <div>
        <Title level={3} style={{ margin: 0, color: "#111111" }}>
          {title}
        </Title>
        {subtitle && (
          <Text style={{ color: "#666666", fontSize: 14 }}>{subtitle}</Text>
        )}
      </div>

      {extra && <div>{extra}</div>}
    </div>
  );
}
