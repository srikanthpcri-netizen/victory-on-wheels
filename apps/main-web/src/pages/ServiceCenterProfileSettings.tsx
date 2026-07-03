import { useState } from "react";
import "./ServiceCenterProfileSettings.css";

const API_BASE_URL = "https://victory-on-wheels-production.up.railway.app";

type StoredServiceCenter = {
  id?: string;
  name?: string;
  city?: string;
  phone?: string;
  address?: string;
  status?: string;
  creditLimit?: number;
  usedCredit?: number;
  outstandingAmount?: number;
};

export default function ServiceCenterProfileSettings() {
  let storedData: StoredServiceCenter | null = null;

  try {
    const raw = localStorage.getItem("serviceCenter");
    storedData = raw ? JSON.parse(raw) : null;
  } catch {
    storedData = null;
  }

  const [serviceCenter, setServiceCenter] =
    useState<StoredServiceCenter | null>(storedData);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(storedData?.name || "");
  const [city, setCity] = useState(storedData?.city || "");
  const [phone, setPhone] = useState(storedData?.phone || "");
  const [address, setAddress] = useState(storedData?.address || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = async () => {
    try {
      if (!serviceCenter?.id) {
        setError("Service center ID not found. Please login again.");
        return;
      }

      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE_URL}/service-center/${serviceCenter.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            city: city.trim(),
            phone: phone.trim(),
            address: address.trim(),
            status: serviceCenter.status || "ACTIVE",
            creditLimit: serviceCenter.creditLimit ?? 0,
            usedCredit: serviceCenter.usedCredit ?? 0,
            outstandingAmount: serviceCenter.outstandingAmount ?? 0,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      const updated = await response.json();

      localStorage.setItem("serviceCenter", JSON.stringify(updated));
      localStorage.setItem("serviceCenterName", updated.name || "");
      localStorage.setItem("serviceCenterPhone", updated.phone || "");

      setServiceCenter(updated);
      setIsEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="sc-profile-page">
      <div className="sc-profile-hero">
        <div>
          <p>Victory On Wheels</p>
          <h1>Profile Settings</h1>
          <span>View and update your registered service center details.</span>
        </div>

        <button
          className="sc-profile-edit-btn"
          onClick={() => {
            setError("");
            setSuccess("");
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="sc-profile-card-main">
        <h3>Service Center Details</h3>

        <div className="sc-profile-grid">
          <div>
            <label>Name</label>
            {isEditing ? (
              <input value={name} onChange={(e) => setName(e.target.value)} />
            ) : (
              <strong>{serviceCenter?.name || "-"}</strong>
            )}
          </div>

          <div>
            <label>Phone</label>
            {isEditing ? (
              <input value={phone} onChange={(e) => setPhone(e.target.value)} />
            ) : (
              <strong>{serviceCenter?.phone || "-"}</strong>
            )}
          </div>

          <div>
            <label>City</label>
            {isEditing ? (
              <input value={city} onChange={(e) => setCity(e.target.value)} />
            ) : (
              <strong>{serviceCenter?.city || "-"}</strong>
            )}
          </div>

          <div>
            <label>Status</label>
            <strong>{serviceCenter?.status || "ACTIVE"}</strong>
          </div>

          <div className="wide">
            <label>Address</label>
            {isEditing ? (
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
              />
            ) : (
              <strong>{serviceCenter?.address || "-"}</strong>
            )}
          </div>
        </div>

        {error ? <p className="sc-profile-error">{error}</p> : null}
        {success ? <p className="sc-profile-success">{success}</p> : null}

        {isEditing ? (
          <button
            className="sc-profile-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
