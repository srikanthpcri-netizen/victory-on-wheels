import { useEffect, useMemo, useState } from "react";
import "./ServiceCenterInvoices.css";

const API_BASE_URL = "http://localhost:3000";

type ServiceCenterData = {
  id?: string;
  name?: string;
  phone?: string;
  city?: string;
};

type InvoiceItem = {
  id: string;
  invoiceNumber: string;
  jobCardId: string;
  serviceAmount: number;
  additionalCharges: number;
  discountAmount: number;
  taxableAmount: number;
  gstPercentage: number;
  gstAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  gstin?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  jobCard?: {
    id: string;
    vehicleNumber?: string;
    serviceType?: string;
    status?: string;
    booking?: {
      id: string;
      customerName?: string;
      customerPhone?: string;
      serviceCenterId?: string;
      serviceCenter?: {
        id: string;
        name?: string;
        phone?: string;
      };
    };
  };
};

export default function ServiceCenterInvoices() {
  const [serviceCenter, setServiceCenter] = useState<ServiceCenterData | null>(
    null,
  );
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const rawServiceCenter =
      localStorage.getItem("serviceCenterData") ||
      localStorage.getItem("serviceCenter");

    if (!rawServiceCenter) {
      setError("Service center login data not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(rawServiceCenter);
      setServiceCenter(parsed);
    } catch (err) {
      console.error("Failed to parse service center data:", err);
      setError("Invalid service center login data. Please login again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!serviceCenter?.phone) return;

    const loadInvoices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/invoice`);
        if (!response.ok) {
          throw new Error("Failed to fetch invoices");
        }

        const data: InvoiceItem[] = await response.json();

        const filtered = data.filter(
          (invoice) =>
            invoice.jobCard?.booking?.serviceCenter?.phone ===
            serviceCenter.phone,
        );

        setInvoices(filtered);
      } catch (err) {
        console.error(err);
        setError("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [serviceCenter?.phone]);

  const filteredInvoices = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      return (
        !searchValue ||
        invoice.invoiceNumber?.toLowerCase().includes(searchValue) ||
        invoice.jobCard?.booking?.customerName
          ?.toLowerCase()
          .includes(searchValue) ||
        invoice.jobCard?.vehicleNumber?.toLowerCase().includes(searchValue) ||
        invoice.jobCard?.serviceType?.toLowerCase().includes(searchValue)
      );
    });
  }, [invoices, search]);

  const totals = useMemo(() => {
    return filteredInvoices.reduce(
      (acc, invoice) => {
        acc.totalAmount += Number(invoice.totalAmount || 0);
        acc.paidAmount += Number(invoice.paidAmount || 0);
        acc.dueAmount += Number(invoice.dueAmount || 0);
        return acc;
      },
      {
        totalAmount: 0,
        paidAmount: 0,
        dueAmount: 0,
      },
    );
  }, [filteredInvoices]);

  const formatCurrency = (amount: number) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPaymentStatus = (invoice: InvoiceItem) => {
    if (Number(invoice.dueAmount || 0) <= 0) return "PAID";
    if (Number(invoice.paidAmount || 0) > 0) return "PARTIAL";
    return "UNPAID";
  };

  return (
    <div className="sc-invoices-page">
      <div className="sc-invoices-header">
        <div>
          <p className="sc-invoices-eyebrow">Victory On Wheels</p>
          <h1>Invoices</h1>
          <p className="sc-invoices-subtext">
            View customer invoice summary for your service center.
          </p>
        </div>
      </div>

      <div className="sc-invoices-summary-grid">
        <div className="sc-invoices-summary-card">
          <span>Total Invoices</span>
          <strong>{filteredInvoices.length}</strong>
        </div>

        <div className="sc-invoices-summary-card">
          <span>Total Billing</span>
          <strong>{formatCurrency(totals.totalAmount)}</strong>
        </div>

        <div className="sc-invoices-summary-card">
          <span>Total Paid</span>
          <strong>{formatCurrency(totals.paidAmount)}</strong>
        </div>

        <div className="sc-invoices-summary-card">
          <span>Total Due</span>
          <strong>{formatCurrency(totals.dueAmount)}</strong>
        </div>
      </div>

      <div className="sc-invoices-toolbar">
        <input
          type="text"
          placeholder="Search by invoice no, customer, vehicle, service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="sc-invoices-table-wrap">
        {loading ? (
          <div className="sc-invoices-empty-state">Loading invoices...</div>
        ) : error ? (
          <div className="sc-invoices-empty-state error">{error}</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="sc-invoices-empty-state">
            No invoices found for this service center.
          </div>
        ) : (
          <table className="sc-invoices-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice No</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Service</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((invoice) => {
                const paymentStatus = getPaymentStatus(invoice);

                return (
                  <tr key={invoice.id}>
                    <td>{formatDate(invoice.createdAt)}</td>
                    <td className="invoice-no">{invoice.invoiceNumber}</td>
                    <td>{invoice.jobCard?.booking?.customerName || "-"}</td>
                    <td>{invoice.jobCard?.vehicleNumber || "-"}</td>
                    <td>{invoice.jobCard?.serviceType || "-"}</td>
                    <td>{formatCurrency(invoice.totalAmount)}</td>
                    <td>{formatCurrency(invoice.paidAmount)}</td>
                    <td>{formatCurrency(invoice.dueAmount)}</td>
                    <td>
                      <span
                        className={`invoice-status ${paymentStatus.toLowerCase()}`}
                      >
                        {paymentStatus}
                      </span>
                    </td>
                    <td>
                      <button
                        className="invoice-view-btn"
                        onClick={() => setSelectedInvoice(invoice)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selectedInvoice ? (
        <div
          className="invoice-modal-overlay"
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            className="invoice-modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="invoice-modal-head">
              <div>
                <p>Invoice Details</p>
                <h2>{selectedInvoice.invoiceNumber}</h2>
              </div>

              <button onClick={() => setSelectedInvoice(null)}>×</button>
            </div>

            <div className="invoice-detail-grid">
              <div>
                <span>Customer</span>
                <strong>
                  {selectedInvoice.jobCard?.booking?.customerName || "-"}
                </strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>
                  {selectedInvoice.jobCard?.booking?.customerPhone || "-"}
                </strong>
              </div>

              <div>
                <span>Vehicle</span>
                <strong>{selectedInvoice.jobCard?.vehicleNumber || "-"}</strong>
              </div>

              <div>
                <span>Service</span>
                <strong>{selectedInvoice.jobCard?.serviceType || "-"}</strong>
              </div>
            </div>

            <div className="invoice-breakup">
              <div>
                <span>Service Amount</span>
                <strong>{formatCurrency(selectedInvoice.serviceAmount)}</strong>
              </div>
              <div>
                <span>Additional Charges</span>
                <strong>
                  {formatCurrency(selectedInvoice.additionalCharges)}
                </strong>
              </div>
              <div>
                <span>Discount</span>
                <strong>
                  {formatCurrency(selectedInvoice.discountAmount)}
                </strong>
              </div>
              <div>
                <span>Taxable Amount</span>
                <strong>{formatCurrency(selectedInvoice.taxableAmount)}</strong>
              </div>
              <div>
                <span>GST ({selectedInvoice.gstPercentage}%)</span>
                <strong>{formatCurrency(selectedInvoice.gstAmount)}</strong>
              </div>
              <div className="grand">
                <span>Grand Total</span>
                <strong>{formatCurrency(selectedInvoice.totalAmount)}</strong>
              </div>
              <div>
                <span>Paid Amount</span>
                <strong>{formatCurrency(selectedInvoice.paidAmount)}</strong>
              </div>
              <div className="due">
                <span>Due Amount</span>
                <strong>{formatCurrency(selectedInvoice.dueAmount)}</strong>
              </div>
            </div>

            <div className="invoice-notes">
              <span>GSTIN</span>
              <p>{selectedInvoice.gstin || "-"}</p>

              <span>Notes</span>
              <p>{selectedInvoice.notes || "-"}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
