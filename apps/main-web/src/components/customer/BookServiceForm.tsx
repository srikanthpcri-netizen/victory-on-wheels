import { useMemo, useState } from "react";
import { vehicleBrands } from "../../data/vehicleData";
import type { VehicleType } from "../../data/vehicleData";
import { vehicleServices } from "../../data/vehicleServices";
import { getServicePrice } from "../../data/servicePricing";
import "./BookServiceForm.css";

type ServiceCenter = {
  id: string;
  name: string;
  city: string;
  address?: string;
  phone: string;
  status: string;
};

type GarageVehicle = {
  id: string;
  vehicleType: VehicleType;
  vehicleBrand: string;
  vehicleModel: string;
  registrationNumber: string;
  manufacturingYear?: number;
  fuelType?: string;
  transmission?: string;
  odometer?: number;
};

export type BookServiceFormData = {
  city: string;
  serviceCenterId: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  vehicleBrand: string;
  vehicleModel: string;
  manufacturingYear: string;
  fuelType: string;
  transmission: string;
  odometer: string;
  serviceType: string;
  bookingDate: string;
  preferredTimeSlot: string;
  pickupRequired: boolean;
  emergencyService: boolean;
  notes: string;
};

type Props = {
  form: BookServiceFormData;
  cities: string[];
  filteredCenters: ServiceCenter[];
  loadingCenters: boolean;
  submitting: boolean;
  garageVehicles?: GarageVehicle[];
  onChange: (key: keyof BookServiceFormData, value: string | boolean) => void;
  onSubmit: (amount: number) => void;
};

const vehicleTypes: VehicleType[] = [
  "Car",
  "Bike",
  "EV Car",
  "EV Bike",
  "Commercial Vehicle",
];

const fuelTypes = ["Petrol", "Diesel", "CNG", "Hybrid", "Electric"];
const transmissions = ["Manual", "Automatic", "AMT", "CVT", "DCT"];

const timeSlots = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "01:00 PM - 03:00 PM",
  "03:00 PM - 05:00 PM",
  "05:00 PM - 07:00 PM",
];

export default function BookServiceForm({
  form,
  cities,
  filteredCenters,
  loadingCenters,
  submitting,
  garageVehicles = [],
  onChange,
  onSubmit,
}: Props) {
  const [serviceSearch, setServiceSearch] = useState(form.serviceType || "");
  const [showServiceList, setShowServiceList] = useState(false);
  const [selectedGarageVehicleId, setSelectedGarageVehicleId] = useState("");

  const brands = useMemo(() => {
    return Object.keys(vehicleBrands[form.vehicleType] || {});
  }, [form.vehicleType]);

  const models = useMemo(() => {
    if (!form.vehicleBrand) return [];
    return vehicleBrands[form.vehicleType]?.[form.vehicleBrand] || [];
  }, [form.vehicleType, form.vehicleBrand]);

  const services = useMemo(() => {
    return vehicleServices[form.vehicleType] || [];
  }, [form.vehicleType]);

  const filteredServices = useMemo(() => {
    const query = serviceSearch.toLowerCase().trim();
    if (!query) return services;

    return services.filter((service) => service.toLowerCase().includes(query));
  }, [serviceSearch, services]);

  const servicePrice = form.serviceType ? getServicePrice(form.serviceType) : 0;
  const pickupCharge = form.pickupRequired ? 300 : 0;
  const emergencyCharge = form.emergencyService ? 500 : 0;
  const convenienceFee = form.serviceType ? 99 : 0;

  const subTotal =
    servicePrice + pickupCharge + emergencyCharge + convenienceFee;

  const gst = form.serviceType ? Math.round(subTotal * 0.18) : 0;
  const grandTotal = subTotal + gst;

  const handleVehicleTypeChange = (value: VehicleType) => {
    setSelectedGarageVehicleId("");
    onChange("vehicleType", value);
    onChange("vehicleBrand", "");
    onChange("vehicleModel", "");
    onChange("vehicleNumber", "");
    onChange("manufacturingYear", "");
    onChange("fuelType", "");
    onChange("transmission", "");
    onChange("odometer", "");
    onChange("serviceType", "");
    setServiceSearch("");
  };

  const handleBrandChange = (value: string) => {
    setSelectedGarageVehicleId("");
    onChange("vehicleBrand", value);
    onChange("vehicleModel", "");
  };

  const handleServiceSelect = (value: string) => {
    onChange("serviceType", value);
    setServiceSearch(value);
    setShowServiceList(false);
  };

  const handleGarageVehicleSelect = (vehicleId: string) => {
    setSelectedGarageVehicleId(vehicleId);

    if (!vehicleId) {
      onChange("vehicleType", "Car");
      onChange("vehicleBrand", "");
      onChange("vehicleModel", "");
      onChange("vehicleNumber", "");
      onChange("manufacturingYear", "");
      onChange("fuelType", "");
      onChange("transmission", "");
      onChange("odometer", "");
      return;
    }

    const selectedVehicle = garageVehicles.find(
      (vehicle) => vehicle.id === vehicleId,
    );

    if (!selectedVehicle) return;

    onChange("vehicleType", selectedVehicle.vehicleType);
    onChange("vehicleBrand", selectedVehicle.vehicleBrand || "");
    onChange("vehicleModel", selectedVehicle.vehicleModel || "");
    onChange("vehicleNumber", selectedVehicle.registrationNumber || "");
    onChange(
      "manufacturingYear",
      selectedVehicle.manufacturingYear
        ? String(selectedVehicle.manufacturingYear)
        : "",
    );
    onChange("fuelType", selectedVehicle.fuelType || "");
    onChange("transmission", selectedVehicle.transmission || "");
    onChange(
      "odometer",
      selectedVehicle.odometer ? String(selectedVehicle.odometer) : "",
    );
  };

  return (
    <div className="book-service-form">
      {garageVehicles.length > 0 && (
        <label className="book-service-field" style={{ display: "block" }}>
          <b>Select Vehicle From My Garage</b>
          <select
            className="book-service-input"
            value={selectedGarageVehicleId}
            onChange={(e) => handleGarageVehicleSelect(e.target.value)}
          >
            <option value="">+ Add New Vehicle / Manual Entry</option>
            {garageVehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.vehicleBrand} {vehicle.vehicleModel} -{" "}
                {vehicle.registrationNumber}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="book-service-grid" style={{ marginTop: 16 }}>
        <label className="book-service-field">
          <b>Vehicle Type</b>
          <select
            className="book-service-input"
            value={form.vehicleType}
            onChange={(e) =>
              handleVehicleTypeChange(e.target.value as VehicleType)
            }
          >
            {vehicleTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </label>

        <label className="book-service-field">
          <b>Brand</b>
          <select
            className="book-service-input"
            value={form.vehicleBrand}
            onChange={(e) => handleBrandChange(e.target.value)}
          >
            <option value="">Select brand</option>
            {brands.map((brand) => (
              <option key={brand}>{brand}</option>
            ))}
          </select>
        </label>

        <label className="book-service-field">
          <b>Model</b>
          <select
            className="book-service-input"
            value={form.vehicleModel}
            onChange={(e) => onChange("vehicleModel", e.target.value)}
            disabled={!form.vehicleBrand}
          >
            <option value="">
              {form.vehicleBrand ? "Select model" : "Select brand first"}
            </option>
            {models.map((model) => (
              <option key={model}>{model}</option>
            ))}
          </select>
        </label>

        <label className="book-service-field">
          <b>Manufacturing Year</b>
          <input
            className="book-service-input"
            value={form.manufacturingYear}
            onChange={(e) =>
              onChange(
                "manufacturingYear",
                e.target.value.replace(/\D/g, "").slice(0, 4),
              )
            }
            placeholder="2022"
          />
        </label>

        <label className="book-service-field">
          <b>Fuel Type</b>
          <select
            className="book-service-input"
            value={form.fuelType}
            onChange={(e) => onChange("fuelType", e.target.value)}
          >
            <option value="">Select fuel type</option>
            {fuelTypes.map((fuel) => (
              <option key={fuel}>{fuel}</option>
            ))}
          </select>
        </label>

        <label className="book-service-field">
          <b>Transmission</b>
          <select
            className="book-service-input"
            value={form.transmission}
            onChange={(e) => onChange("transmission", e.target.value)}
          >
            <option value="">Select transmission</option>
            {transmissions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="book-service-field">
          <b>Vehicle Number</b>
          <input
            className="book-service-input"
            value={form.vehicleNumber}
            onChange={(e) => {
              setSelectedGarageVehicleId("");
              onChange("vehicleNumber", e.target.value);
            }}
            placeholder="TS09AB1234"
          />
        </label>

        <label className="book-service-field">
          <b>Odometer Reading</b>
          <input
            className="book-service-input"
            value={form.odometer}
            onChange={(e) =>
              onChange("odometer", e.target.value.replace(/\D/g, ""))
            }
            placeholder="45000"
          />
        </label>

        <div className="book-service-field book-service-search-wrap">
          <b>Search Service</b>
          <input
            className="book-service-input"
            value={serviceSearch}
            onChange={(e) => {
              setServiceSearch(e.target.value);
              setShowServiceList(true);
              onChange("serviceType", e.target.value);
            }}
            onFocus={() => setShowServiceList(true)}
            placeholder="Search oil, brake, AC, battery..."
          />

          {showServiceList && (
            <div className="book-service-results">
              {filteredServices.length === 0 ? (
                <div className="book-service-option">No service found</div>
              ) : (
                filteredServices.map((service) => (
                  <div
                    key={service}
                    className="book-service-option"
                    onClick={() => handleServiceSelect(service)}
                  >
                    {service}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <label className="book-service-field">
          <b>City</b>
          <select
            className="book-service-input"
            value={form.city}
            onChange={(e) => {
              onChange("city", e.target.value);
              onChange("serviceCenterId", "");
            }}
          >
            <option value="">
              {loadingCenters ? "Loading cities..." : "Select city"}
            </option>
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </label>

        <label className="book-service-field">
          <b>Area / Service Center</b>
          <select
            className="book-service-input"
            value={form.serviceCenterId}
            onChange={(e) => onChange("serviceCenterId", e.target.value)}
            disabled={!form.city}
          >
            <option value="">
              {form.city ? "Select area / center" : "Select city first"}
            </option>
            {filteredCenters.map((center) => (
              <option key={center.id} value={center.id}>
                {center.address || "Area not added"} - {center.name}
              </option>
            ))}
          </select>
        </label>

        <label className="book-service-field">
          <b>Preferred Date</b>
          <input
            className="book-service-input"
            type="date"
            value={form.bookingDate}
            onChange={(e) => onChange("bookingDate", e.target.value)}
          />
        </label>

        <label className="book-service-field">
          <b>Preferred Time Slot</b>
          <select
            className="book-service-input"
            value={form.preferredTimeSlot}
            onChange={(e) => onChange("preferredTimeSlot", e.target.value)}
          >
            <option value="">Select time slot</option>
            {timeSlots.map((slot) => (
              <option key={slot}>{slot}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="book-service-grid" style={{ marginTop: 16 }}>
        <label className="book-service-field">
          <b>Pickup & Drop Required?</b>
          <select
            className="book-service-input"
            value={form.pickupRequired ? "YES" : "NO"}
            onChange={(e) =>
              onChange("pickupRequired", e.target.value === "YES")
            }
          >
            <option value="NO">No</option>
            <option value="YES">Yes (+₹300)</option>
          </select>
        </label>

        <label className="book-service-field">
          <b>Emergency Service?</b>
          <select
            className="book-service-input"
            value={form.emergencyService ? "YES" : "NO"}
            onChange={(e) =>
              onChange("emergencyService", e.target.value === "YES")
            }
          >
            <option value="NO">No</option>
            <option value="YES">Yes (+₹500)</option>
          </select>
        </label>
      </div>

      <label
        className="book-service-field"
        style={{ display: "block", marginTop: 16 }}
      >
        <b>Problem / Additional Notes</b>
        <textarea
          className="book-service-input book-service-textarea"
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="Describe your vehicle problem..."
        />
      </label>

      {form.serviceType && (
        <div className="book-service-price-card">
          <h3 className="book-service-price-title">Booking Summary</h3>

          <div className="book-service-price-row">
            <span>{form.serviceType}</span>
            <b>₹{servicePrice.toLocaleString("en-IN")}</b>
          </div>

          <div className="book-service-price-row">
            <span>Pickup & Drop</span>
            <b>₹{pickupCharge.toLocaleString("en-IN")}</b>
          </div>

          <div className="book-service-price-row">
            <span>Emergency Service</span>
            <b>₹{emergencyCharge.toLocaleString("en-IN")}</b>
          </div>

          <div className="book-service-price-row">
            <span>Convenience Fee</span>
            <b>₹{convenienceFee.toLocaleString("en-IN")}</b>
          </div>

          <div className="book-service-price-row">
            <span>GST 18%</span>
            <b>₹{gst.toLocaleString("en-IN")}</b>
          </div>

          <div className="book-service-price-total">
            <span>Total Estimate</span>
            <span>₹{grandTotal.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      <button
        className="book-service-button"
        onClick={() => onSubmit(grandTotal)}
        disabled={submitting}
      >
        {submitting
          ? "Creating Booking..."
          : form.serviceType
            ? `Confirm Booking ₹${grandTotal.toLocaleString("en-IN")}`
            : "Select Service"}
      </button>
    </div>
  );
}
