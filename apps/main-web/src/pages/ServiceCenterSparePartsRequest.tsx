import { useEffect, useMemo, useState } from "react";
import "./ServiceCenterSparePartsRequest.css";

const API_BASE_URL = "https://victory-on-wheels-production.up.railway.app";

type SparePart = {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  brand: string;
  unit: string;
  stockQty: number;
  price: number;
  type: "OEM" | "OES";
  isActive: boolean;
};

type CartItem = SparePart & {
  qty: number;
};

type PaymentType = "FULL" | "PARTIAL_CREDIT";

type ServiceCenterCreditInfo = {
  id: string;
  name: string;
  city: string;
  phone: string;
  address?: string | null;
  status?: string | null;
  creditLimit?: number | null;
  usedCredit?: number | null;
  outstandingAmount?: number | null;
};

type SparePartRequestResponse = {
  id: string;
  totalAmount: number;
  paidAmount: number;
  creditAmount: number;
  paymentMode: string;
};

type SparePartRequestHistoryItem = {
  id: string;
  paymentMode: string;
  totalAmount: number;
  paidAmount: number;
  creditAmount: number;
  notes?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ORDERED" | "RECEIVED";
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    snapshotName: string;
    snapshotPartNumber: string;
    snapshotCategory: string;
    snapshotBrand: string;
    snapshotType: "OEM" | "OES";
  }[];
};

export default function ServiceCenterSparePartsRequest() {
  const [sparePartsList, setSparePartsList] = useState<SparePart[]>([]);
  const [loadingParts, setLoadingParts] = useState(true);
  const [partsError, setPartsError] = useState("");
  const [stockError, setStockError] = useState("");

  const [serviceCenterInfo, setServiceCenterInfo] =
    useState<ServiceCenterCreditInfo | null>(null);
  const [creditLoading, setCreditLoading] = useState(true);
  const [creditError, setCreditError] = useState("");

  const [requestHistory, setRequestHistory] = useState<
    SparePartRequestHistoryItem[]
  >([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const [partSearch, setPartSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "OEM" | "OES">("ALL");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentType, setPaymentType] = useState<PaymentType>("FULL");
  const [paidAmount, setPaidAmount] = useState(0);
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const creditLimit = serviceCenterInfo?.creditLimit ?? 0;
  const usedCredit = serviceCenterInfo?.usedCredit ?? 0;
  const outstandingAmount = serviceCenterInfo?.outstandingAmount ?? 0;
  const availableCredit = Math.max(creditLimit - usedCredit, 0);

  useEffect(() => {
    loadSpareParts();
    loadServiceCenterCreditInfo();
  }, []);

  useEffect(() => {
    if (serviceCenterInfo?.id) {
      loadRequestHistory(serviceCenterInfo.id);
    }
  }, [serviceCenterInfo?.id]);

  const formatMoney = (amount: number) => `₹${Number(amount || 0).toFixed(2)}`;

  const formatDate = (dateValue: string) => {
    return new Date(dateValue).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStoredServiceCenterIdentity = () => {
    const possibleObjectKeys = [
      "serviceCenter",
      "serviceCenterData",
      "serviceCenterUser",
      "serviceCenterAuth",
      "user",
      "authUser",
    ];

    const possiblePhoneKeys = [
      "serviceCenterPhone",
      "phone",
      "userPhone",
      "loginPhone",
    ];

    let serviceCenterId = "";
    let phone = "";

    for (const key of possibleObjectKeys) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      try {
        const parsed = JSON.parse(raw);
        serviceCenterId =
          parsed?.id ||
          parsed?.serviceCenter?.id ||
          parsed?.user?.id ||
          serviceCenterId;

        phone =
          parsed?.phone ||
          parsed?.serviceCenter?.phone ||
          parsed?.user?.phone ||
          phone;

        if (serviceCenterId || phone) break;
      } catch {
        // ignore invalid json
      }
    }

    if (!phone) {
      for (const key of possiblePhoneKeys) {
        const rawPhone = localStorage.getItem(key);
        if (rawPhone) {
          phone = rawPhone;
          break;
        }
      }
    }

    return { serviceCenterId, phone };
  };

  const loadRequestHistory = async (serviceCenterId: string) => {
    try {
      setHistoryLoading(true);
      setHistoryError("");

      const response = await fetch(
        `${API_BASE_URL}/spare-part-request/service-center/${serviceCenterId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to load request history");
      }

      const data = await response.json();
      setRequestHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading spare part request history:", error);
      setHistoryError("Failed to load request history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadServiceCenterCreditInfo = async () => {
    try {
      setCreditLoading(true);
      setCreditError("");

      const { serviceCenterId, phone } = getStoredServiceCenterIdentity();

      const response = await fetch(`${API_BASE_URL}/service-center`);
      if (!response.ok) {
        throw new Error("Failed to fetch service center credit info");
      }

      const data = await response.json();
      const serviceCenters: ServiceCenterCreditInfo[] = Array.isArray(data)
        ? data
        : [];

      let matchedServiceCenter: ServiceCenterCreditInfo | undefined;

      if (serviceCenterId) {
        matchedServiceCenter = serviceCenters.find(
          (item) => item.id === serviceCenterId,
        );
      }

      if (!matchedServiceCenter && phone) {
        matchedServiceCenter = serviceCenters.find(
          (item) => item.phone === phone,
        );
      }

      if (!matchedServiceCenter) {
        setCreditError(
          "Logged-in service center credit info not found. Please login again.",
        );
        setServiceCenterInfo(null);
        return;
      }

      setServiceCenterInfo(matchedServiceCenter);
    } catch (error) {
      console.error("Error loading service center credit info:", error);
      setCreditError("Failed to load service center credit info");
    } finally {
      setCreditLoading(false);
    }
  };

  const loadSpareParts = async () => {
    try {
      setLoadingParts(true);
      setPartsError("");

      const response = await fetch(`${API_BASE_URL}/spare-part/active`);
      if (!response.ok) {
        throw new Error("Failed to fetch spare parts");
      }

      const data = await response.json();
      setSparePartsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading spare parts:", error);
      setPartsError("Failed to load spare parts");
    } finally {
      setLoadingParts(false);
    }
  };

  const filteredParts = useMemo(() => {
    return sparePartsList.filter((part) => {
      const search = partSearch.toLowerCase();

      const matchesSearch =
        part.name.toLowerCase().includes(search) ||
        (part.partNumber || "").toLowerCase().includes(search) ||
        (part.brand || "").toLowerCase().includes(search) ||
        (part.category || "").toLowerCase().includes(search);

      const matchesType = typeFilter === "ALL" || part.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [sparePartsList, partSearch, typeFilter]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const totalAmount = subtotal;

  const normalizedPaidAmount =
    paymentType === "FULL"
      ? totalAmount
      : Math.min(Math.max(paidAmount, 0), totalAmount);

  const creditAmount =
    paymentType === "PARTIAL_CREDIT"
      ? Math.max(totalAmount - normalizedPaidAmount, 0)
      : 0;

  const exceedsAvailableCredit = creditAmount > availableCredit;

  const canSubmit =
    cart.length > 0 &&
    totalAmount > 0 &&
    !creditLoading &&
    !creditError &&
    !!serviceCenterInfo?.id &&
    (paymentType === "FULL" || !exceedsAvailableCredit) &&
    !submitting;

  const handleAddPart = (part: SparePart) => {
    setStockError("");
    setSubmitError("");
    setSubmitSuccess("");

    const existingItem = cart.find((item) => item.id === part.id);

    if (existingItem) {
      if (existingItem.qty >= part.stockQty) {
        setStockError(
          `Only ${part.stockQty} item(s) available in stock for ${part.name}.`,
        );
        return;
      }

      setCart(
        cart.map((item) =>
          item.id === part.id ? { ...item, qty: item.qty + 1 } : item,
        ),
      );
      return;
    }

    if (part.stockQty < 1) {
      setStockError(`${part.name} is out of stock.`);
      return;
    }

    setCart([...cart, { ...part, qty: 1 }]);
  };

  const updateQty = (id: string, qty: number) => {
    setStockError("");
    setSubmitError("");
    setSubmitSuccess("");

    const item = cart.find((cartItem) => cartItem.id === id);
    if (!item) return;

    if (Number.isNaN(qty) || qty < 1) return;

    if (qty > item.stockQty) {
      setStockError(
        `You cannot select more than ${item.stockQty} item(s) for ${item.name}.`,
      );

      setCart(
        cart.map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, qty: cartItem.stockQty }
            : cartItem,
        ),
      );
      return;
    }

    setCart(
      cart.map((cartItem) =>
        cartItem.id === id ? { ...cartItem, qty } : cartItem,
      ),
    );
  };

  const removeItem = (id: string) => {
    setStockError("");
    setSubmitError("");
    setSubmitSuccess("");
    setCart(cart.filter((item) => item.id !== id));
  };

  const handlePaymentTypeChange = (type: PaymentType) => {
    setSubmitError("");
    setSubmitSuccess("");
    setPaymentType(type);

    if (type === "FULL") {
      setPaidAmount(totalAmount);
    } else {
      setPaidAmount(0);
    }
  };

  const handlePaidAmountChange = (value: number) => {
    setSubmitError("");
    setSubmitSuccess("");

    if (Number.isNaN(value) || value < 0) {
      setPaidAmount(0);
      return;
    }

    if (value > totalAmount) {
      setPaidAmount(totalAmount);
      return;
    }

    setPaidAmount(value);
  };

  const handleSubmitRequest = async () => {
    try {
      if (!serviceCenterInfo?.id) {
        setSubmitError("Service center info not found. Please login again.");
        return;
      }

      if (cart.length === 0) {
        setSubmitError("Please add at least one spare part.");
        return;
      }

      if (paymentType === "PARTIAL_CREDIT" && exceedsAvailableCredit) {
        setSubmitError("Credit amount exceeds available credit limit.");
        return;
      }

      setSubmitting(true);
      setSubmitError("");
      setSubmitSuccess("");

      const payload = {
        serviceCenterId: serviceCenterInfo.id,
        paymentMode: paymentType === "FULL" ? "FULL_PAYMENT" : "CREDIT",
        paidAmount: normalizedPaidAmount,
        notes: notes.trim(),
        items: cart.map((item) => ({
          sparePartId: item.id,
          quantity: item.qty,
          unitPrice: item.price,
        })),
      };

      const response = await fetch(`${API_BASE_URL}/spare-part-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = "Failed to submit spare parts request";
        try {
          const errorData = await response.json();
          if (typeof errorData?.message === "string") {
            message = errorData.message;
          } else if (Array.isArray(errorData?.message)) {
            message = errorData.message.join(", ");
          }
        } catch {
          // ignore json parse error
        }
        throw new Error(message);
      }

      const result: SparePartRequestResponse = await response.json();

      setSubmitSuccess(
        `Request submitted successfully. Request total ₹${result.totalAmount}, paid ₹${result.paidAmount}, credit ₹${result.creditAmount}.`,
      );

      setCart([]);
      setNotes("");
      setPaymentType("FULL");
      setPaidAmount(0);

      await Promise.all([
        loadSpareParts(),
        loadServiceCenterCreditInfo(),
        loadRequestHistory(serviceCenterInfo.id),
      ]);
    } catch (error) {
      console.error("Submit spare part request error:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit spare parts request",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="spare-page">
      <div className="spare-page-header">
        <div>
          <p className="spare-eyebrow">Victory On Wheels</p>
          <h1>Spare Parts Request</h1>
          <p className="spare-subtitle">
            Search parts quickly and add OEM or OES parts directly from the
            list.
          </p>
        </div>
      </div>

      <div className="spare-info-card" style={{ marginBottom: "24px" }}>
        <div className="spare-card-head">
          <h3>Credit Info</h3>
        </div>

        {creditLoading ? (
          <p className="spare-muted">Loading credit info...</p>
        ) : creditError ? (
          <p className="spare-error-text">{creditError}</p>
        ) : (
          <div className="spare-info-list">
            <div className="spare-info-row">
              <span>Service Center</span>
              <strong>{serviceCenterInfo?.name || "-"}</strong>
            </div>
            <div className="spare-info-row">
              <span>Credit Limit</span>
              <strong>{formatMoney(creditLimit)}</strong>
            </div>
            <div className="spare-info-row">
              <span>Used Credit</span>
              <strong>{formatMoney(usedCredit)}</strong>
            </div>
            <div className="spare-info-row highlight">
              <span>Available Credit</span>
              <strong>{formatMoney(availableCredit)}</strong>
            </div>
            <div className="spare-info-row">
              <span>Outstanding Amount</span>
              <strong>{formatMoney(outstandingAmount)}</strong>
            </div>
          </div>
        )}
      </div>

      <div className="spare-toolbar-card">
        <div className="spare-card-head">
          <h3>Spare Parts List</h3>
        </div>

        <div className="spare-toolbar-grid spare-toolbar-grid-list">
          <div className="spare-field">
            <label>Search Part</label>
            <input
              type="text"
              value={partSearch}
              onChange={(e) => setPartSearch(e.target.value)}
              placeholder="Search by name, part number, category, brand..."
              className="spare-select"
            />
          </div>

          <div className="spare-field">
            <label>Filter Type</label>
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as "ALL" | "OEM" | "OES")
              }
              className="spare-select"
            >
              <option value="ALL">All Types</option>
              <option value="OEM">OEM</option>
              <option value="OES">OES</option>
            </select>
          </div>
        </div>

        {partsError && <p className="spare-error-text">{partsError}</p>}
        {stockError && <p className="spare-error-text">{stockError}</p>}
      </div>

      <div className="spare-table-card">
        <div className="spare-card-head">
          <h3>Available Parts</h3>
          <span>{filteredParts.length} part(s)</span>
        </div>

        <div className="spare-table-wrap">
          <table className="spare-table">
            <thead>
              <tr>
                <th>Part Name</th>
                <th>Part Number</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Type</th>
                <th>Unit</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loadingParts ? (
                <tr>
                  <td colSpan={9}>
                    <div className="spare-empty-state">
                      <h4>Loading spare parts...</h4>
                    </div>
                  </td>
                </tr>
              ) : filteredParts.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="spare-empty-state">
                      <h4>No spare parts found</h4>
                      <p>Try changing search or filter.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredParts.map((part) => (
                  <tr key={part.id}>
                    <td>{part.name}</td>
                    <td>{part.partNumber}</td>
                    <td>{part.category}</td>
                    <td>{part.brand}</td>
                    <td>
                      <span
                        className={`spare-badge ${
                          part.type === "OEM" ? "oem" : "oes"
                        }`}
                      >
                        {part.type}
                      </span>
                    </td>
                    <td>{part.unit}</td>
                    <td>{part.stockQty}</td>
                    <td>{formatMoney(part.price)}</td>
                    <td>
                      <button
                        onClick={() => handleAddPart(part)}
                        className="spare-btn spare-btn-primary spare-btn-small"
                        disabled={part.stockQty < 1}
                      >
                        Add to Cart
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="spare-table-card">
        <div className="spare-card-head">
          <h3>Request Cart</h3>
          <span>{cart.length} item(s)</span>
        </div>

        <div className="spare-table-wrap">
          <table className="spare-table">
            <thead>
              <tr>
                <th>Part</th>
                <th>Type</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {cart.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="spare-empty-state">
                      <h4>No items added yet</h4>
                      <p>Add parts from the list above.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                cart.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="spare-part-cell">
                        <strong>{item.name}</strong>
                        <span>Part No: {item.partNumber}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`spare-badge ${
                          item.type === "OEM" ? "oem" : "oes"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td>{formatMoney(item.price)}</td>
                    <td>{item.stockQty}</td>
                    <td>
                      <input
                        type="number"
                        value={item.qty}
                        min={1}
                        max={item.stockQty}
                        onChange={(e) =>
                          updateQty(item.id, Number(e.target.value))
                        }
                        className="spare-qty-input"
                      />
                    </td>
                    <td>{formatMoney(item.price * item.qty)}</td>
                    <td>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="spare-btn spare-btn-danger"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="spare-info-card" style={{ marginTop: "24px" }}>
        <div className="spare-card-head">
          <h3>Billing Summary</h3>
        </div>

        <div className="spare-info-list">
          <div className="spare-info-row">
            <span>Subtotal</span>
            <strong>{formatMoney(subtotal)}</strong>
          </div>
          <div className="spare-info-row highlight">
            <span>Total Amount</span>
            <strong>{formatMoney(totalAmount)}</strong>
          </div>
        </div>

        <div className="spare-payment-box">
          <label className="spare-radio">
            <input
              type="radio"
              name="paymentType"
              value="FULL"
              checked={paymentType === "FULL"}
              onChange={() => handlePaymentTypeChange("FULL")}
            />
            <span>Full Payment</span>
          </label>

          <label className="spare-radio">
            <input
              type="radio"
              name="paymentType"
              value="PARTIAL_CREDIT"
              checked={paymentType === "PARTIAL_CREDIT"}
              onChange={() => handlePaymentTypeChange("PARTIAL_CREDIT")}
            />
            <span>Partial Credit</span>
          </label>
        </div>

        {paymentType === "PARTIAL_CREDIT" ? (
          <div className="spare-partial-box">
            <label>Paid Amount</label>
            <input
              type="number"
              value={normalizedPaidAmount}
              min={0}
              max={totalAmount}
              onChange={(e) => handlePaidAmountChange(Number(e.target.value))}
              className="spare-paid-input"
            />

            <div className="spare-info-row highlight">
              <span>Credit Amount</span>
              <strong>{formatMoney(creditAmount)}</strong>
            </div>

            {exceedsAvailableCredit && (
              <p className="spare-error-text">
                Credit amount exceeds available credit limit.
              </p>
            )}
          </div>
        ) : (
          <div className="spare-paynow-box">
            <span>Pay Now</span>
            <strong>{formatMoney(totalAmount)}</strong>
          </div>
        )}

        <div className="spare-partial-box">
          <label>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="spare-textarea"
            placeholder="Enter request notes, urgency, vehicle reference, or admin instructions..."
            rows={4}
          />
        </div>

        {submitError ? <p className="spare-error-text">{submitError}</p> : null}
        {submitSuccess ? (
          <p className="spare-success-text">{submitSuccess}</p>
        ) : null}

        <button
          disabled={!canSubmit}
          className="spare-btn spare-btn-submit"
          onClick={handleSubmitRequest}
        >
          {submitting ? "Submitting..." : "Submit Spare Parts Request"}
        </button>
      </div>

      <div className="spare-table-card" style={{ marginTop: "24px" }}>
        <div className="spare-card-head">
          <h3>Request History</h3>
          <span>{requestHistory.length} request(s)</span>
        </div>

        {historyError ? (
          <p className="spare-error-text">{historyError}</p>
        ) : null}

        <div className="spare-table-wrap">
          <table className="spare-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Items</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Credit</th>
                <th>Notes</th>
              </tr>
            </thead>

            <tbody>
              {historyLoading ? (
                <tr>
                  <td colSpan={7}>
                    <div className="spare-empty-state">
                      <h4>Loading request history...</h4>
                    </div>
                  </td>
                </tr>
              ) : requestHistory.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="spare-empty-state">
                      <h4>No requests yet</h4>
                      <p>Submitted spare part requests will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                requestHistory.map((request) => (
                  <tr key={request.id}>
                    <td>{formatDate(request.createdAt)}</td>
                    <td>
                      <div className="spare-part-cell">
                        <strong>{request.items.length} item(s)</strong>
                        <span>
                          {request.items
                            .map(
                              (item) =>
                                `${item.snapshotName} x ${item.quantity}`,
                            )
                            .join(", ")}
                        </span>
                      </div>
                    </td>
                    <td>{request.paymentMode}</td>
                    <td>
                      <span
                        className={`spare-badge ${
                          request.status === "PENDING"
                            ? "oes"
                            : request.status === "APPROVED"
                              ? "oem"
                              : request.status === "REJECTED"
                                ? "danger"
                                : "oem"
                        }`}
                      >
                        {request.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>{formatMoney(request.totalAmount)}</td>
                    <td>{formatMoney(request.paidAmount)}</td>
                    <td>{formatMoney(request.creditAmount)}</td>
                    <td>{request.notes || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
