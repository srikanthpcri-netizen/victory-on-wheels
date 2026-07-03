import { Card } from "antd";
import type { ReactNode } from "react";

type ContentCardProps = {
  title?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
};

export default function ContentCard({
  title,
  extra,
  children,
  style,
  bodyStyle,
}: ContentCardProps) {
  return (
    <Card
      title={title}
      extra={extra}
      bordered={false}
      style={{
        borderRadius: 16,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        overflow: "hidden",
        background: "#ffffff",
        ...style,
      }}
      styles={{
        header: {
          background: "#ffffff",
          color: "#000000",
          fontWeight: 700,
          fontSize: 16,
          borderBottom: "1px solid #f0f0f0",
          minHeight: 56,
        },
        body: {
          padding: 20,
          ...bodyStyle,
        },
      }}
    >
      {children}
    </Card>
  );
}
