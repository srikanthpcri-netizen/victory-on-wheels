import { useEffect, useMemo, useState } from "react";
import { Table, Tag, message, Input, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import PageHeader from "../components/PageHeader";
import ContentCard from "../components/ContentCard";
import { invoiceService, type Invoice } from "../services/invoiceService";

const { Search } = Input;

type InvoiceRow = Invoice & {
  dueAmount?: number;
  customerName?: string;
  customerPhone?: string;
  vehicleNumber?: string;
  serviceType?: string;
  serviceCenterName?: string;
  serviceCenterPhone?: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "green";
    case "PARTIAL":
      return "orange";
    case "UNPAID":
      return "red";
    default:
      return "default";
  }
};

const formatCurrency = (value?: number | null) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const formatDate = (value?: string) => {
  return value ? new Date(value).toLocaleDateString("en-IN") : "-";
};

export default function Invoices() {
  const [items, setItems] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getAll();

      const mapped: InvoiceRow[] = (data || []).map((invoice: any) => {
        const paidAmount = Number(invoice.paidAmount || 0);
        const totalAmount = Number(invoice.totalAmount || 0);

        return {
          ...invoice,
          dueAmount: Math.max(totalAmount - paidAmount, 0),
          customerName: invoice.jobCard?.booking?.customerName || "-",
          customerPhone: invoice.jobCard?.booking?.customerPhone || "-",
          vehicleNumber: invoice.jobCard?.vehicleNumber || "-",
          serviceType: invoice.jobCard?.serviceType || "-",
          serviceCenterName:
            invoice.jobCard?.booking?.serviceCenter?.name || "-",
          serviceCenterPhone:
            invoice.jobCard?.booking?.serviceCenter?.phone || "-",
        };
      });

      setItems(mapped);
    } catch (error) {
      console.error(error);
      message.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) => {
      return (
        item.invoiceNumber?.toLowerCase().includes(q) ||
        item.customerName?.toLowerCase().includes(q) ||
        item.customerPhone?.toLowerCase().includes(q) ||
        item.vehicleNumber?.toLowerCase().includes(q) ||
        item.serviceType?.toLowerCase().includes(q) ||
        item.serviceCenterName?.toLowerCase().includes(q) ||
        item.serviceCenterPhone?.toLowerCase().includes(q) ||
        item.status?.toLowerCase().includes(q)
      );
    });
  }, [items, searchText]);

  const handleDownloadPdf = (record: InvoiceRow) => {
    const subtotal = Number(record.subtotal || 0);
    const labourAmount = Number(record.labourAmount || 0);
    const taxableValue = subtotal + labourAmount;
    const gstRate = 18;
    const gstAmount = Number(record.totalAmount || 0) - taxableValue;
    const grandTotal = Number(record.totalAmount || 0);

    const companyGstin = "36ABCDE1234F1Z5";

    const html = `
      <html>
        <head>
          <title>${record.invoiceNumber}</title>
          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              font-family: Arial, Helvetica, sans-serif;
              background: #f5f7fb;
              color: #1a1a1a;
              padding: 24px;
            }

            .invoice-shell {
              max-width: 980px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
              border: 1px solid #ececec;
            }

            .top-band {
              height: 8px;
              background: linear-gradient(90deg, #ff0000 0%, #D4AF37 100%);
            }

            .invoice-body {
              padding: 32px;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 24px;
              margin-bottom: 28px;
            }

            .brand-block {
              flex: 1;
            }

            .brand-row {
              display: flex;
              align-items: center;
              gap: 14px;
              margin-bottom: 10px;
            }

            .brand-logo {
              width: 56px;
              height: 56px;
              border-radius: 14px;
              background: linear-gradient(135deg, #ff0000 0%, #D4AF37 100%);
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 22px;
              font-weight: 800;
            }

            .brand-title {
              font-size: 30px;
              font-weight: 800;
              color: #111111;
              line-height: 1.1;
            }

            .brand-subtitle {
              font-size: 14px;
              color: #666666;
              margin-top: 4px;
            }

            .invoice-meta {
              min-width: 280px;
              background: #fff8e7;
              border: 1px solid #f1dfaa;
              border-radius: 16px;
              padding: 18px;
            }

            .meta-title {
              font-size: 13px;
              font-weight: 700;
              color: #a07800;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              margin-bottom: 12px;
            }

            .meta-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px 18px;
            }

            .label {
              font-size: 12px;
              color: #777777;
              margin-bottom: 4px;
            }

            .value {
              font-size: 15px;
              font-weight: 700;
              color: #111111;
              word-break: break-word;
            }

            .section {
              margin-top: 22px;
              border: 1px solid #eeeeee;
              border-radius: 18px;
              overflow: hidden;
              background: #ffffff;
            }

            .section-head {
              background: #111111;
              color: #ffffff;
              padding: 14px 18px;
              font-size: 15px;
              font-weight: 700;
            }

            .section-content {
              padding: 18px;
            }

            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 18px 28px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th {
              background: #fff5da;
              color: #111111;
              padding: 14px 12px;
              text-align: left;
              font-size: 13px;
              border: 1px solid #ecdca3;
            }

            td {
              padding: 14px 12px;
              border: 1px solid #ececec;
              font-size: 14px;
            }

            .summary-wrap {
              display: flex;
              justify-content: flex-end;
              margin-top: 18px;
            }

            .summary-box {
              width: 360px;
              border: 1px solid #ececec;
              border-radius: 16px;
              overflow: hidden;
            }

            .summary-box table td:first-child {
              background: #fafafa;
              font-weight: 600;
              width: 60%;
            }

            .summary-box .grand-row td {
              background: #111111;
              color: #ffffff;
              font-size: 16px;
              font-weight: 800;
            }

            .status-pill {
              display: inline-block;
              padding: 8px 14px;
              border-radius: 999px;
              font-size: 12px;
              font-weight: 800;
              background: ${
                record.status === "PAID"
                  ? "#dcfce7"
                  : record.status === "PARTIAL"
                    ? "#fef3c7"
                    : "#fee2e2"
              };
              color: ${
                record.status === "PAID"
                  ? "#166534"
                  : record.status === "PARTIAL"
                    ? "#92400e"
                    : "#991b1b"
              };
            }

            .footer {
              margin-top: 28px;
              padding-top: 18px;
              border-top: 1px dashed #d8d8d8;
              text-align: center;
              font-size: 12px;
              color: #666666;
            }

            .footer strong {
              color: #111111;
            }

            @media print {
              body {
                background: #ffffff;
                padding: 0;
              }

              .invoice-shell {
                box-shadow: none;
                border: none;
                border-radius: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-shell">
            <div class="top-band"></div>

            <div class="invoice-body">
              <div class="header">
                <div class="brand-block">
                  <div class="brand-row">
                    <div class="brand-logo">VW</div>
                    <div>
                      <div class="brand-title">Victory On Wheels</div>
                      <div class="brand-subtitle">Corporate Tax Invoice</div>
                    </div>
                  </div>

                  <div style="margin-top: 12px;">
                    <div class="label">GSTIN</div>
                    <div class="value">${companyGstin}</div>
                  </div>
                </div>

                <div class="invoice-meta">
                  <div class="meta-title">Invoice Summary</div>
                  <div class="meta-grid">
                    <div>
                      <div class="label">Invoice No</div>
                      <div class="value">${record.invoiceNumber || "-"}</div>
                    </div>
                    <div>
                      <div class="label">Invoice Date</div>
                      <div class="value">${formatDate(record.createdAt)}</div>
                    </div>
                    <div>
                      <div class="label">Status</div>
                      <div class="value"><span class="status-pill">${record.status || "UNPAID"}</span></div>
                    </div>
                    <div>
                      <div class="label">Job Card ID</div>
                      <div class="value">${record.jobCardId || "-"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="section">
                <div class="section-head">Customer & Vehicle Details</div>
                <div class="section-content">
                  <div class="info-grid">
                    <div>
                      <div class="label">Customer Name</div>
                      <div class="value">${record.customerName || "-"}</div>
                    </div>
                    <div>
                      <div class="label">Customer Phone</div>
                      <div class="value">${record.customerPhone || "-"}</div>
                    </div>
                    <div>
                      <div class="label">Vehicle Number</div>
                      <div class="value">${record.vehicleNumber || "-"}</div>
                    </div>
                    <div>
                      <div class="label">Service Type</div>
                      <div class="value">${record.serviceType || "-"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="section">
                <div class="section-head">Service Center Details</div>
                <div class="section-content">
                  <div class="info-grid">
                    <div>
                      <div class="label">Service Center Name</div>
                      <div class="value">${record.serviceCenterName || "-"}</div>
                    </div>
                    <div>
                      <div class="label">Service Center Phone</div>
                      <div class="value">${record.serviceCenterPhone || "-"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="section">
                <div class="section-head">Billing Breakdown</div>
                <div class="section-content">
                  <table>
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Subtotal</td>
                        <td>${formatCurrency(subtotal)}</td>
                      </tr>
                      <tr>
                        <td>Labour Charges</td>
                        <td>${formatCurrency(labourAmount)}</td>
                      </tr>
                      <tr>
                        <td>Taxable Value</td>
                        <td>${formatCurrency(taxableValue)}</td>
                      </tr>
                      <tr>
                        <td>GST (${gstRate}%)</td>
                        <td>${formatCurrency(gstAmount)}</td>
                      </tr>
                      <tr>
                        <td>Paid Amount</td>
                        <td>${formatCurrency(record.paidAmount)}</td>
                      </tr>
                      <tr>
                        <td>Due Amount</td>
                        <td>${formatCurrency(record.dueAmount)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div class="summary-wrap">
                    <div class="summary-box">
                      <table>
                        <tbody>
                          <tr>
                            <td>Taxable Value</td>
                            <td>${formatCurrency(taxableValue)}</td>
                          </tr>
                          <tr>
                            <td>GST (${gstRate}%)</td>
                            <td>${formatCurrency(gstAmount)}</td>
                          </tr>
                          <tr class="grand-row">
                            <td>Grand Total</td>
                            <td>${formatCurrency(grandTotal)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div class="footer">
                This is a system-generated invoice from <strong>Victory On Wheels Admin Panel</strong>.
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      message.error("Popup blocked. Please allow popups and try again.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const columns: ColumnsType<InvoiceRow> = [
    {
      title: "Invoice No",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: 140,
      fixed: "left",
      render: (val) => <strong>{val || "-"}</strong>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (val: string) => formatDate(val),
    },
    {
      title: "Customer",
      key: "customerName",
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.customerName || "-"}</div>
          <div style={{ fontSize: 12, color: "#666" }}>
            {record.customerPhone || "-"}
          </div>
        </div>
      ),
    },
    {
      title: "Vehicle",
      key: "vehicleNumber",
      width: 140,
      render: (_, record) => record.vehicleNumber || "-",
    },
    {
      title: "Service",
      key: "serviceType",
      width: 170,
      render: (_, record) => record.serviceType || "-",
    },
    {
      title: "Service Center",
      key: "serviceCenterName",
      width: 220,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            {record.serviceCenterName || "-"}
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            {record.serviceCenterPhone || "-"}
          </div>
        </div>
      ),
    },
    {
      title: "Job Card ID",
      dataIndex: "jobCardId",
      key: "jobCardId",
      width: 220,
      render: (val) => val || "-",
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      width: 120,
      render: (val) => formatCurrency(val),
    },
    {
      title: "Labour",
      dataIndex: "labourAmount",
      key: "labourAmount",
      width: 120,
      render: (val) => formatCurrency(val),
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      render: (val) => formatCurrency(val),
    },
    {
      title: "Paid",
      dataIndex: "paidAmount",
      key: "paidAmount",
      width: 120,
      render: (val) => formatCurrency(val),
    },
    {
      title: "Due",
      dataIndex: "dueAmount",
      key: "dueAmount",
      width: 120,
      render: (val) => formatCurrency(val),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (val: string) => (
        <Tag color={getStatusColor(val || "UNPAID")}>{val || "UNPAID"}</Tag>
      ),
    },
    {
      title: "PDF",
      key: "pdf",
      width: 140,
      fixed: "right",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleDownloadPdf(record)}>
          Download PDF
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Invoices"
        subtitle="Detailed billing view across all service centers"
      />

      <ContentCard>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search by invoice no, customer, phone, vehicle, service center..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 420 }}
          />
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredItems}
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 1950 }}
        />
      </ContentCard>
    </>
  );
}
