import { useState } from "react";
import { Layout, Menu, Typography } from "antd";
import {
  DashboardOutlined,
  ShopOutlined,
  BookOutlined,
  ToolOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  SafetyCertificateOutlined,
  BuildOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import Dashboard from "../pages/Dashboard";
import ServiceCenters from "../pages/ServiceCenters";
import Bookings from "../pages/Bookings";
import JobCards from "../pages/JobCards";
import AddOns from "../pages/AddOns";
import Invoices from "../pages/Invoices";
import Payments from "../pages/Payments";
import Insurance from "../pages/Insurance";
import SpareParts from "../pages/SpareParts";
import SparePartRequests from "../pages/SparePartRequests";

const { Sider, Header, Content } = Layout;
const { Title } = Typography;

export default function AdminLayout() {
  const [selectedPage, setSelectedPage] = useState("dashboard");

  const renderPage = () => {
    if (selectedPage === "service-centers") {
      return <ServiceCenters />;
    }

    if (selectedPage === "bookings") {
      return <Bookings />;
    }

    if (selectedPage === "job-cards") {
      return <JobCards />;
    }

    if (selectedPage === "addons") {
      return <AddOns />;
    }

    if (selectedPage === "spare-parts") {
      return <SpareParts />;
    }

    if (selectedPage === "spare-part-requests") {
      return <SparePartRequests />;
    }

    if (selectedPage === "invoices") {
      return <Invoices />;
    }

    if (selectedPage === "payments") {
      return <Payments />;
    }

    if (selectedPage === "insurance") {
      return <Insurance />;
    }

    return <Dashboard />;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250} style={{ background: "#ffffff" }}>
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            fontSize: "20px",
            fontWeight: 800,
            borderBottom: "1px solid #f0f0f0",
            color: "#D4AF37",
          }}
        >
          VICTORY
          <span style={{ color: "#ff0000", marginLeft: 6 }}>ON WHEELS</span>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedPage]}
          onClick={({ key }) => setSelectedPage(key)}
          style={{ height: "100%", borderRight: 0 }}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "service-centers",
              icon: <ShopOutlined />,
              label: "Service Centers",
            },
            {
              key: "bookings",
              icon: <BookOutlined />,
              label: "Bookings",
            },
            {
              key: "job-cards",
              icon: <ToolOutlined />,
              label: "Job Cards",
            },
            {
              key: "addons",
              icon: <AppstoreAddOutlined />,
              label: "Add-Ons",
            },
            {
              key: "spare-parts",
              icon: <BuildOutlined />,
              label: "Spare Parts",
            },
            {
              key: "spare-part-requests",
              icon: <UnorderedListOutlined />,
              label: "Spare Part Requests",
            },
            {
              key: "invoices",
              icon: <FileTextOutlined />,
              label: "Invoices",
            },
            {
              key: "payments",
              icon: <CreditCardOutlined />,
              label: "Payments",
            },
            {
              key: "insurance",
              icon: <SafetyCertificateOutlined />,
              label: "Insurance",
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#ffffff",
            padding: "0 24px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ margin: 0, color: "#111111" }}>
            Victory On Wheels Admin
          </Title>
        </Header>

        <Content style={{ margin: "24px", background: "#f5f7fa" }}>
          <div
            style={{
              background: "#ffffff",
              minHeight: "calc(100vh - 112px)",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
              borderTop: "4px solid #ff0000",
            }}
          >
            {renderPage()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
