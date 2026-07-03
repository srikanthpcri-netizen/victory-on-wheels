import { useMemo, useState } from "react";
import axios from "axios";
import { vehicleBrands } from "../data/vehicleData";
import type { VehicleType } from "../data/vehicleData";
import "./Insurance.css";

const vehicleTypes: VehicleType[] = [
  "Car",
  "Bike",
  "EV Car",
  "EV Bike",
  "Commercial Vehicle",
];

const manufacturingYears = Array.from({ length: 35 }, (_, index) =>
  String(new Date().getFullYear() - index),
);

export default function Insurance() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    city: "",
    vehicleType: "" as VehicleType | "",
    vehicleBrand: "",
    vehicleModel: "",
    registrationNumber: "",
    manufacturingYear: "",
    previousPolicyProvider: "",
    insuranceType: "",
    policyExpiryDate: "",
    claimHistory: "",
    addonsRequired: "",
    additionalMessage: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const brands = useMemo(() => {
    if (!formData.vehicleType) return [];
    return Object.keys(vehicleBrands[formData.vehicleType] || {});
  }, [formData.vehicleType]);

  const models = useMemo(() => {
    if (!formData.vehicleType || !formData.vehicleBrand) return [];
    return vehicleBrands[formData.vehicleType]?.[formData.vehicleBrand] || [];
  }, [formData.vehicleType, formData.vehicleBrand]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "vehicleType") {
      setFormData((prev) => ({
        ...prev,
        vehicleType: value as VehicleType,
        vehicleBrand: "",
        vehicleModel: "",
        manufacturingYear: "",
      }));
      return;
    }

    if (name === "vehicleBrand") {
      setFormData((prev) => ({
        ...prev,
        vehicleBrand: value,
        vehicleModel: "",
        manufacturingYear: "",
      }));
      return;
    }

    if (name === "vehicleModel") {
      setFormData((prev) => ({
        ...prev,
        vehicleModel: value,
        manufacturingYear: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      mobile: "",
      email: "",
      city: "",
      vehicleType: "",
      vehicleBrand: "",
      vehicleModel: "",
      registrationNumber: "",
      manufacturingYear: "",
      previousPolicyProvider: "",
      insuranceType: "",
      policyExpiryDate: "",
      claimHistory: "",
      addonsRequired: "",
      additionalMessage: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    try {
      setLoading(true);

      const payload = {
        fullName: formData.fullName,
        mobileNumber: formData.mobile,
        email: formData.email || undefined,
        city: formData.city,
        vehicleType: formData.vehicleType,
        vehicleBrand: formData.vehicleBrand,
        vehicleModel: formData.vehicleModel,
        registrationNumber: formData.registrationNumber,
        manufacturingYear: Number(formData.manufacturingYear),
        previousPolicyProvider: formData.previousPolicyProvider || undefined,
        insuranceType: formData.insuranceType || undefined,
        policyExpiryDate: formData.policyExpiryDate || undefined,
        claimHistory: formData.claimHistory || undefined,
        additionalNotes: [
          formData.addonsRequired
            ? `Add-ons Required: ${formData.addonsRequired}`
            : "",
          formData.additionalMessage
            ? `Message: ${formData.additionalMessage}`
            : "",
        ]
          .filter(Boolean)
          .join(" | "),
      };

      await axios.post("http://localhost:3000/insurance", payload);

      setSuccessMessage("Insurance enquiry submitted successfully!");
      resetForm();
    } catch (error) {
      console.error("Insurance submit error:", error);
      alert("Something went wrong while submitting the insurance enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="insurance-page">
      <div className="insurance-wrap">
        <div className="insurance-card">
          <div className="insurance-hero">
            <h1>Vehicle Insurance Enquiry</h1>
            <p>
              Select vehicle type, brand, model and year. Our team will contact
              you shortly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="insurance-form">
            <div className="insurance-grid">
              <FormField label="Full Name *">
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="insurance-input"
                  placeholder="Enter full name"
                />
              </FormField>

              <FormField label="Mobile Number *">
                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="insurance-input"
                  placeholder="Enter mobile number"
                />
              </FormField>

              <FormField label="Email">
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="insurance-input"
                  placeholder="Enter email"
                />
              </FormField>

              <FormField label="City *">
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="insurance-input"
                  placeholder="Enter city"
                />
              </FormField>

              <FormField label="Vehicle Type *">
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  className="insurance-input"
                >
                  <option value="">Select vehicle type</option>
                  {vehicleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Vehicle Brand *">
                <select
                  name="vehicleBrand"
                  value={formData.vehicleBrand}
                  onChange={handleChange}
                  required
                  disabled={!formData.vehicleType}
                  className="insurance-input"
                >
                  <option value="">
                    {formData.vehicleType
                      ? "Select vehicle brand"
                      : "Select vehicle type first"}
                  </option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Vehicle Model *">
                <select
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleChange}
                  required
                  disabled={!formData.vehicleBrand}
                  className="insurance-input"
                >
                  <option value="">
                    {formData.vehicleBrand
                      ? "Select vehicle model"
                      : "Select brand first"}
                  </option>
                  {models.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Manufacturing Year *">
                <select
                  name="manufacturingYear"
                  value={formData.manufacturingYear}
                  onChange={handleChange}
                  required
                  disabled={!formData.vehicleModel}
                  className="insurance-input"
                >
                  <option value="">
                    {formData.vehicleModel
                      ? "Select manufacturing year"
                      : "Select model first"}
                  </option>
                  {manufacturingYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Registration Number *">
                <input
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                  className="insurance-input"
                  placeholder="TS09AB1234"
                />
              </FormField>

              <FormField label="Previous Policy Provider">
                <input
                  name="previousPolicyProvider"
                  value={formData.previousPolicyProvider}
                  onChange={handleChange}
                  className="insurance-input"
                  placeholder="Previous policy provider"
                />
              </FormField>

              <FormField label="Insurance Type">
                <select
                  name="insuranceType"
                  value={formData.insuranceType}
                  onChange={handleChange}
                  className="insurance-input"
                >
                  <option value="">Select insurance type</option>
                  <option value="Comprehensive">Comprehensive</option>
                  <option value="Third Party">Third Party</option>
                  <option value="Zero Dep">Zero Dep</option>
                  <option value="Own Damage">Own Damage</option>
                </select>
              </FormField>

              <FormField label="Policy Expiry Date">
                <input
                  name="policyExpiryDate"
                  type="date"
                  value={formData.policyExpiryDate}
                  onChange={handleChange}
                  className="insurance-input"
                />
              </FormField>

              <FormField label="Claim History">
                <select
                  name="claimHistory"
                  value={formData.claimHistory}
                  onChange={handleChange}
                  className="insurance-input"
                >
                  <option value="">Select claim history</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </FormField>

              <FormField label="Add-ons Required?">
                <input
                  name="addonsRequired"
                  value={formData.addonsRequired}
                  onChange={handleChange}
                  className="insurance-input"
                  placeholder="Zero Dep, RSA, Engine Protect"
                />
              </FormField>
            </div>

            <div className="insurance-message">
              <FormField label="Additional Message">
                <textarea
                  name="additionalMessage"
                  value={formData.additionalMessage}
                  onChange={handleChange}
                  rows={5}
                  className="insurance-textarea"
                  placeholder="Enter any additional details"
                />
              </FormField>
            </div>

            {successMessage && (
              <div className="insurance-success">{successMessage}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="insurance-submit"
            >
              {loading ? "Submitting..." : "Submit Insurance Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="insurance-field">
      <label>{label}</label>
      {children}
    </div>
  );
}
