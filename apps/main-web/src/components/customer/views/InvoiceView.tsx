import { useEffect, useMemo, useState } from "react";

type InvoiceItem = {
  id: string;
  slNo: number;
  description: string;
  hsnSac?: string | null;
  qty: number;
  unit?: string | null;
  rate: number;
  taxable: number;
  cgstPercent: number;
  cgstAmount: number;
  sgstPercent: number;
  sgstAmount: number;
  total: number;
};

type InvoiceData = {
  id: string;
  invoiceNumber: string;
  serviceAmount: number;
  additionalCharges?: number;
  additionalChargeReason?: string | null;
  discountAmount?: number;
  taxableAmount: number;
  gstPercentage: number;
  gstAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  gstin?: string | null;
  notes?: string | null;
  createdAt?: string;
  jobCardId?: string;
  items?: InvoiceItem[];
  jobCard?: any;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function money(value?: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function numberToWords(num: number) {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const small = (n: number) => {
    if (n < 20) return ones[n];
    return `${tens[Math.floor(n / 10)]} ${ones[n % 10]}`.trim();
  };

  const hundred = (n: number) => {
    if (n < 100) return small(n);
    return `${ones[Math.floor(n / 100)]} Hundred ${small(n % 100)}`.trim();
  };

  const rupees = Math.floor(num);
  if (!rupees) return "Zero Rupees Only";

  const crore = Math.floor(rupees / 10000000);
  const lakh = Math.floor((rupees % 10000000) / 100000);
  const thousand = Math.floor((rupees % 100000) / 1000);
  const rest = rupees % 1000;

  let words = "";
  if (crore) words += `${hundred(crore)} Crore `;
  if (lakh) words += `${hundred(lakh)} Lakh `;
  if (thousand) words += `${hundred(thousand)} Thousand `;
  if (rest) words += `${hundred(rest)} `;

  return `${words.trim()} Rupees Only`;
}

function getInvoiceDetails(invoice: InvoiceData | null, customerPhone: string) {
  const jobCard = invoice?.jobCard || {};
  const booking = jobCard.booking || {};
  const vehicle = booking.vehicle || jobCard.vehicle || {};

  return {
    customerName: booking.customerName || booking.name || "Customer",
    customerPhone: booking.customerPhone || booking.phone || customerPhone,
    customerAddress: booking.address || "-",
    serviceCenterName:
      booking.serviceCenter?.name ||
      jobCard.serviceCenter?.name ||
      "Victory On Wheels Service Center",
    serviceCenterAddress:
      booking.serviceCenter?.address || jobCard.serviceCenter?.address || "-",
    vehicleName:
      vehicle.name ||
      `${vehicle.brand || ""} ${vehicle.model || ""}`.trim() ||
      booking.vehicleName ||
      "-",
    vehicleNumber: vehicle.vehicleNumber || booking.vehicleNumber || "-",
    fuelType: vehicle.fuelType || booking.fuelType || "-",
    jobCardNumber:
      jobCard.jobCardNumber || jobCard.id || invoice?.jobCardId || "-",
  };
}

export default function InvoiceView() {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const customerPhone =
    localStorage.getItem("customerPhone") ||
    localStorage.getItem("phone") ||
    "9876543210";

  useEffect(() => {
    async function loadInvoice() {
      try {
        const res = await fetch(
          `${API_BASE}/invoice/customer/all?customerPhone=${encodeURIComponent(
            customerPhone,
          )}`,
        );

        if (!res.ok) throw new Error("Invoice not found");

        const data = await res.json();
        setInvoices(Array.isArray(data) ? data : [data]);
      } catch {
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    }

    loadInvoice();
  }, [customerPhone]);

  const details = useMemo(
    () => getInvoiceDetails(selectedInvoice, customerPhone),
    [selectedInvoice, customerPhone],
  );

  if (loading) {
    return <div className="invoice-state">Loading invoices...</div>;
  }

  if (invoices.length === 0) {
    return (
      <div className="invoice-state">
        <h2>No Invoice Found</h2>
        <p>Your invoice will appear here once service center creates it.</p>
      </div>
    );
  }

  const cgstTotal = Number(selectedInvoice?.gstAmount || 0) / 2;
  const sgstTotal = Number(selectedInvoice?.gstAmount || 0) / 2;

  return (
    <section className="invoice-gallery-page">
      <div className="invoice-gallery-head">
        <div>
          <span>Customer Billing</span>
          <h2>My Invoices</h2>
          <p>Click any invoice thumbnail to view, print, or save as PDF.</p>
        </div>
      </div>

      <div className="invoice-gallery-grid">
        {invoices.map((invoice) => (
          <button
            key={invoice.id}
            className="invoice-mini-card"
            onClick={() => setSelectedInvoice(invoice)}
          >
            <div className="mini-invoice-paper">
              <div className="mini-invoice-top">
                <b>Victory On Wheels</b>
                <span>TAX INVOICE</span>
              </div>

              <div className="mini-invoice-lines">
                <i></i>
                <i></i>
                <i></i>
              </div>

              <div className="mini-invoice-table">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>

              <div className="mini-invoice-total">
                <span>Total</span>
                <b>{money(invoice.totalAmount)}</b>
              </div>
            </div>

            <div className="invoice-mini-info">
              <b>{invoice.invoiceNumber}</b>
              <span>{formatDate(invoice.createdAt)}</span>
              <strong>{invoice.dueAmount > 0 ? "Due" : "Paid"}</strong>
            </div>
          </button>
        ))}
      </div>

      {selectedInvoice && (
        <div className="invoice-modal-backdrop">
          <div className="invoice-modal">
            <div className="invoice-modal-actions no-print">
              <button
                className="invoice-close-btn"
                onClick={() => setSelectedInvoice(null)}
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="invoice-print-btn"
              >
                Print / Save PDF
              </button>
            </div>

            <div className="tax-invoice-document">
              <div className="invoice-top-bar">
                <div>
                  <h1>Victory On Wheels</h1>
                  <p>Premium Vehicle Service & Roadside Assistance</p>
                  <p>GSTIN: {selectedInvoice.gstin || "36ABCDE1234F1Z5"}</p>
                </div>

                <div className="invoice-title-box">
                  <h2>TAX INVOICE</h2>
                  <span>Original for Recipient</span>
                </div>
              </div>

              <div className="invoice-meta-grid">
                <div>
                  <b>Invoice No:</b>
                  <span>{selectedInvoice.invoiceNumber}</span>
                </div>
                <div>
                  <b>Invoice Date:</b>
                  <span>{formatDate(selectedInvoice.createdAt)}</span>
                </div>
                <div>
                  <b>Job Card:</b>
                  <span>{details.jobCardNumber}</span>
                </div>
                <div>
                  <b>Payment Status:</b>
                  <span>{selectedInvoice.dueAmount > 0 ? "Due" : "Paid"}</span>
                </div>
              </div>

              <div className="invoice-party-grid">
                <div>
                  <h3>Billed To</h3>
                  <p>
                    <b>{details.customerName}</b>
                  </p>
                  <p>Phone: {details.customerPhone}</p>
                  <p>Address: {details.customerAddress}</p>
                </div>

                <div>
                  <h3>Service Center</h3>
                  <p>
                    <b>{details.serviceCenterName}</b>
                  </p>
                  <p>{details.serviceCenterAddress}</p>
                </div>

                <div>
                  <h3>Vehicle Details</h3>
                  <p>
                    <b>{details.vehicleName}</b>
                  </p>
                  <p>Vehicle No: {details.vehicleNumber}</p>
                  <p>Fuel Type: {details.fuelType}</p>
                </div>
              </div>

              <table className="invoice-items-table">
                <thead>
                  <tr>
                    <th>Sl</th>
                    <th>Description</th>
                    <th>HSN/SAC</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Taxable</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {(selectedInvoice.items || []).map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{item.slNo || index + 1}</td>
                      <td>{item.description}</td>
                      <td>{item.hsnSac || "-"}</td>
                      <td>
                        {item.qty} {item.unit || ""}
                      </td>
                      <td>{money(item.rate)}</td>
                      <td>{money(item.taxable)}</td>
                      <td>{money(item.cgstAmount)}</td>
                      <td>{money(item.sgstAmount)}</td>
                      <td>{money(item.total)}</td>
                    </tr>
                  ))}

                  {(!selectedInvoice.items ||
                    selectedInvoice.items.length === 0) && (
                    <tr>
                      <td>1</td>
                      <td>Vehicle Service Charges</td>
                      <td>9987</td>
                      <td>1 Nos</td>
                      <td>{money(selectedInvoice.serviceAmount)}</td>
                      <td>{money(selectedInvoice.taxableAmount)}</td>
                      <td>{money(cgstTotal)}</td>
                      <td>{money(sgstTotal)}</td>
                      <td>{money(selectedInvoice.totalAmount)}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="invoice-summary-section">
                <div className="invoice-words">
                  <h3>Amount in Words</h3>
                  <p>{numberToWords(selectedInvoice.totalAmount)}</p>

                  {selectedInvoice.notes && (
                    <>
                      <h3>Notes</h3>
                      <p>{selectedInvoice.notes}</p>
                    </>
                  )}
                </div>

                <div className="invoice-totals">
                  <div>
                    <span>Service Amount</span>
                    <b>{money(selectedInvoice.serviceAmount)}</b>
                  </div>
                  <div>
                    <span>Additional Charges</span>
                    <b>{money(selectedInvoice.additionalCharges)}</b>
                  </div>
                  <div>
                    <span>Discount</span>
                    <b>- {money(selectedInvoice.discountAmount)}</b>
                  </div>
                  <div>
                    <span>Taxable Amount</span>
                    <b>{money(selectedInvoice.taxableAmount)}</b>
                  </div>
                  <div>
                    <span>CGST</span>
                    <b>{money(cgstTotal)}</b>
                  </div>
                  <div>
                    <span>SGST</span>
                    <b>{money(sgstTotal)}</b>
                  </div>
                  <div className="grand-total">
                    <span>Grand Total</span>
                    <b>{money(selectedInvoice.totalAmount)}</b>
                  </div>
                  <div>
                    <span>Paid Amount</span>
                    <b>{money(selectedInvoice.paidAmount)}</b>
                  </div>
                  <div>
                    <span>Due Amount</span>
                    <b>{money(selectedInvoice.dueAmount)}</b>
                  </div>
                </div>
              </div>

              <div className="invoice-footer-row">
                <div>
                  <h4>Terms & Conditions</h4>
                  <p>
                    This is a computer-generated invoice for vehicle service
                    completed by Victory On Wheels.
                  </p>
                </div>

                <div className="signature-box">
                  <div></div>
                  <b>Authorized Signature</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
