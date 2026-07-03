import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ServiceCenterJobCard.css";

const API_BASE_URL = "http://localhost:3000";

type JobCardAttachment = {
  id: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  category: string;
  notes?: string | null;
  createdAt: string;
};

type JobCardData = {
  id: string;
  bookingId: string;
  vehicleNumber?: string;
  serviceType?: string;
  problemNotes?: string | null;
  status?: string;
  attachments?: JobCardAttachment[];
  booking?: {
    id: string;
    customerName?: string;
    customerPhone?: string;
    vehicleType?: string | null;
    bookingDate?: string;
    notes?: string | null;
    status?: string;
  };
};

const JOB_STATUS_OPTIONS = [
  "CREATED",
  "INSPECTION_PENDING",
  "INSPECTION_DONE",
  "WORK_IN_PROGRESS",
  "READY",
  "DELIVERED",
  "CLOSED",
];

const ATTACHMENT_CATEGORIES = [
  "BEFORE_SERVICE",
  "INSPECTION",
  "WORK_PROGRESS",
  "AFTER_SERVICE",
  "DELIVERY_PROOF",
];

export default function ServiceCenterJobCard() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [jobCard, setJobCard] = useState<JobCardData | null>(null);

  const [jobStatus, setJobStatus] = useState("CREATED");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadCategory, setUploadCategory] = useState("BEFORE_SERVICE");
  const [uploadNotes, setUploadNotes] = useState("");

  const loadJobCard = async () => {
    try {
      if (!bookingId) {
        setError("Booking ID is missing in the URL.");
        setLoading(false);
        return;
      }

      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_BASE_URL}/job-card/by-booking/${bookingId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch job card");
      }

      const data = await response.json();
      setJobCard(data);
      setJobStatus(data?.status || "CREATED");
    } catch (err) {
      console.error(err);
      setError("Unable to load job card");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobCard();
  }, [bookingId]);

  const formatStatus = (value?: string) => {
    if (!value) return "N/A";
    return value.replaceAll("_", " ");
  };

  const formatDate = (value?: string) => {
    if (!value) return "-";
    return new Date(value).toLocaleString("en-IN");
  };

  const statusClass = (value?: string) => {
    const normalized = (value || "").toLowerCase();

    if (
      normalized.includes("ready") ||
      normalized.includes("delivered") ||
      normalized.includes("closed")
    ) {
      return "jc-status success";
    }

    if (normalized.includes("progress") || normalized.includes("inspection")) {
      return "jc-status warning";
    }

    return "jc-status";
  };

  const handleUpdateStatus = async () => {
    try {
      if (!jobCard?.id) {
        setError("Job card ID missing.");
        return;
      }

      setSaving(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(`${API_BASE_URL}/job-card/${jobCard.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: jobStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update job status");
      }

      const updated = await response.json();
      setJobCard(updated);
      setJobStatus(updated?.status || "CREATED");
      setSuccessMessage("Job status updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to update job status.");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadAttachment = async () => {
    try {
      if (!jobCard?.id) {
        setError("Job card ID missing.");
        return;
      }

      if (uploadFiles.length === 0) {
        setError("Please select at least one photo or video.");
        return;
      }

      setUploading(true);
      setError("");
      setSuccessMessage("");

      let latestJobCard: JobCardData | null = null;

      for (const file of uploadFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          `${API_BASE_URL}/job-card/${jobCard.id}/attachment?category=${uploadCategory}&notes=${encodeURIComponent(
            uploadNotes.trim(),
          )}`,
          {
            method: "POST",
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        latestJobCard = await response.json();
      }

      if (latestJobCard) {
        setJobCard(latestJobCard);
      }
      setUploadFiles([]);
      setUploadNotes("");
      setSuccessMessage("Photo/video uploaded successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to upload photo/video.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="jc-page">
        <div className="jc-shell">
          <div className="jc-card">
            <p className="jc-message">Loading job card...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !jobCard) {
    return (
      <div className="jc-page">
        <div className="jc-shell">
          <button className="jc-back-btn" onClick={() => navigate(-1)}>
            ← Back to Bookings
          </button>

          <div className="jc-card jc-error-card">
            <h2>Unable to Open Job Card</h2>
            <p>{error}</p>
            <button className="jc-primary-btn" onClick={loadJobCard}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!jobCard) return null;

  return (
    <div className="jc-page">
      <div className="jc-shell">
        <button className="jc-back-btn" onClick={() => navigate(-1)}>
          ← Back to Bookings
        </button>

        <div className="jc-hero">
          <div>
            <p className="jc-eyebrow">Victory On Wheels</p>
            <h1>Job Card</h1>
            <p className="jc-subtitle">
              Update service status and upload service photos/videos.
            </p>
          </div>

          <div className={statusClass(jobStatus)}>
            {formatStatus(jobStatus)}
          </div>
        </div>

        <div className="jc-grid">
          <div className="jc-card">
            <div className="jc-card-head">
              <h3>Vehicle & Service</h3>
            </div>

            <div className="jc-info-list">
              <div className="jc-info-row">
                <span>Vehicle Number</span>
                <strong>{jobCard.vehicleNumber || "-"}</strong>
              </div>

              <div className="jc-info-row">
                <span>Service Type</span>
                <strong>{jobCard.serviceType || "-"}</strong>
              </div>

              <div className="jc-info-row">
                <span>Vehicle Type</span>
                <strong>{jobCard.booking?.vehicleType || "-"}</strong>
              </div>

              <div className="jc-info-row">
                <span>Customer Complaint</span>
                <strong>{jobCard.problemNotes || "-"}</strong>
              </div>
            </div>
          </div>

          <div className="jc-card">
            <div className="jc-card-head">
              <h3>Customer & Booking</h3>
            </div>

            <div className="jc-info-list">
              <div className="jc-info-row">
                <span>Customer Name</span>
                <strong>{jobCard.booking?.customerName || "-"}</strong>
              </div>

              <div className="jc-info-row">
                <span>Customer Phone</span>
                <strong>{jobCard.booking?.customerPhone || "-"}</strong>
              </div>

              <div className="jc-info-row">
                <span>Booking Date</span>
                <strong>{formatDate(jobCard.booking?.bookingDate)}</strong>
              </div>

              <div className="jc-info-row">
                <span>Booking Notes</span>
                <strong>{jobCard.booking?.notes || "-"}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="jc-card" style={{ marginTop: "22px" }}>
          <div className="jc-card-head">
            <h3>Update Service Status</h3>
          </div>

          <div className="jc-pricing-grid">
            <div className="jc-field">
              <label>Current Status</label>
              <select
                value={jobStatus}
                onChange={(e) => setJobStatus(e.target.value)}
                className="jc-input"
              >
                {JOB_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? <p className="jc-error-text">{error}</p> : null}
          {successMessage ? (
            <p className="jc-success-text">{successMessage}</p>
          ) : null}

          <div className="jc-actions">
            <button
              className="jc-primary-btn"
              onClick={handleUpdateStatus}
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Job Status"}
            </button>
          </div>
        </div>

        <div className="jc-card" style={{ marginTop: "22px" }}>
          <div className="jc-card-head">
            <h3>Upload Photos / Videos</h3>
          </div>

          <div className="jc-pricing-grid">
            <div className="jc-field">
              <label>Category</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="jc-input"
              >
                {ATTACHMENT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {formatStatus(category)}
                  </option>
                ))}
              </select>
            </div>

            <div className="jc-field">
              <label>Select Photo / Video</label>
              <label className="jc-upload-dropzone">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={(e) =>
                    setUploadFiles(Array.from(e.target.files || []))
                  }
                />
                <strong>Click to select photos/videos</strong>
                <span>
                  Multiple files allowed • Images and videos supported
                </span>
              </label>

              {uploadFiles.length > 0 ? (
                <div className="jc-selected-files">
                  {uploadFiles.map((file) => (
                    <span key={`${file.name}-${file.size}`}>{file.name}</span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="jc-field" style={{ gridColumn: "span 2" }}>
              <label>Notes</label>
              <textarea
                value={uploadNotes}
                onChange={(e) => setUploadNotes(e.target.value)}
                placeholder="Example: before service photo, inspection video, delivery proof..."
                className="jc-textarea"
                rows={4}
              />
            </div>
          </div>

          <div className="jc-actions">
            <button
              className="jc-primary-btn"
              onClick={handleUploadAttachment}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Attachment"}
            </button>
          </div>
        </div>

        <div className="jc-card" style={{ marginTop: "22px" }}>
          <div className="jc-card-head">
            <h3>Uploaded Attachments</h3>
          </div>

          {!jobCard.attachments || jobCard.attachments.length === 0 ? (
            <p className="jc-message">No photos or videos uploaded yet.</p>
          ) : (
            <div className="jc-attachment-grid">
              {jobCard.attachments.map((attachment) => {
                const fileUrl = `${API_BASE_URL}${attachment.fileUrl}`;
                const isVideo = attachment.fileType.startsWith("video");

                return (
                  <div className="jc-attachment-card" key={attachment.id}>
                    {isVideo ? (
                      <video src={fileUrl} controls />
                    ) : (
                      <img src={fileUrl} alt={attachment.fileName} />
                    )}

                    <div>
                      <strong>{formatStatus(attachment.category)}</strong>
                      <span>{attachment.fileName}</span>
                      <p>{attachment.notes || "-"}</p>
                      <a href={fileUrl} target="_blank" rel="noreferrer">
                        Open File
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
