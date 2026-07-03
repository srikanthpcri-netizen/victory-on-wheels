import { useEffect, useState } from "react";

type ProfileViewProps = {
  customerName: string;
  customerPhone: string;
  vehiclesCount: number;
  bookingsCount: number;
  completedBookings: number;
  pendingBookings: number;
};

type CustomerProfile = {
  id: string;
  name?: string | null;
  phone: string;
  email?: string | null;
  address?: string | null;
  role: string;
  createdAt?: string;
};

const API_BASE = "http://localhost:3000";

export default function ProfileView({
  customerName,
  customerPhone,
  vehiclesCount,
  bookingsCount,
  completedBookings,
  pendingBookings,
}: ProfileViewProps) {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({
    fullName: customerName,
    mobile: customerPhone,
    email: "",
    address: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const displayName = profile?.name || customerName || "Customer";
  const displayPhone = profile?.phone || customerPhone;

  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    fetchProfile();
  }, [customerPhone]);

  const fetchProfile = async () => {
    if (!customerPhone) return;

    try {
      setLoadingProfile(true);

      const res = await fetch(
        `${API_BASE}/user/profile/by-phone?phone=${encodeURIComponent(
          customerPhone,
        )}`,
      );

      if (!res.ok) return;

      const data = await res.json();
      setProfile(data);

      setProfileForm({
        fullName: data.name || customerName,
        mobile: data.phone || customerPhone,
        email: data.email || "",
        address: data.address || "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileForm.fullName.trim()) {
      alert("Please enter full name");
      return;
    }

    try {
      setSavingProfile(true);

      const res = await fetch(
        `${API_BASE}/user/profile/by-phone?phone=${encodeURIComponent(
          customerPhone,
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profileForm.fullName.trim(),
            email: profileForm.email.trim(),
            address: profileForm.address.trim(),
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update profile");
        return;
      }

      localStorage.setItem("customerName", data.name || profileForm.fullName);
      setProfile(data);
      setEditOpen(false);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword) {
      alert("Please enter current password");
      return;
    }

    if (!passwordForm.newPassword) {
      alert("Please enter new password");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    const res = await fetch(
      `${API_BASE}/user/change-password/by-phone?phone=${encodeURIComponent(
        customerPhone,
      )}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      },
    );

    const data = await res.json();
    alert(data.message || "Password feature will be connected later.");

    setPasswordOpen(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("customerName");
    localStorage.removeItem("customerPhone");
    window.location.href = "/";
  };

  return (
    <section className="profile-page">
      <div className="profile-hero-card">
        <div className="profile-avatar">{initials || "CU"}</div>

        <div>
          <p className="customer-gold-text">CUSTOMER PROFILE</p>
          <h2>{displayName}</h2>
          <p>{displayPhone || "Mobile number not available"}</p>
          {loadingProfile && <small>Loading profile...</small>}
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-info-card">
          <h3>Personal Information</h3>

          <div className="profile-row">
            <span>Full Name</span>
            <b>{displayName}</b>
          </div>

          <div className="profile-row">
            <span>Mobile Number</span>
            <b>{displayPhone || "-"}</b>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <b>{profile?.email || "Not added"}</b>
          </div>

          <div className="profile-row">
            <span>Customer Type</span>
            <b>Premium Customer</b>
          </div>
        </div>

        <div className="profile-info-card">
          <h3>My Statistics</h3>

          <div className="profile-stats-grid">
            <div>
              <strong>{vehiclesCount}</strong>
              <span>Vehicles</span>
            </div>

            <div>
              <strong>{bookingsCount}</strong>
              <span>Bookings</span>
            </div>

            <div>
              <strong>{completedBookings}</strong>
              <span>Completed</span>
            </div>

            <div>
              <strong>{pendingBookings}</strong>
              <span>Pending</span>
            </div>
          </div>
        </div>

        <div className="profile-info-card">
          <h3>Address</h3>
          <p className="profile-muted">
            {profile?.address || "Address details are not added yet."}
          </p>
        </div>

        <div className="profile-info-card">
          <h3>Quick Actions</h3>

          <div className="profile-actions">
            <button onClick={() => setEditOpen(true)}>Edit Profile</button>
            <button onClick={() => setPasswordOpen(true)}>
              Change Password
            </button>
            <button className="danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {editOpen && (
        <div className="profile-modal-backdrop">
          <div className="profile-modal">
            <div className="profile-modal-head">
              <h3>Edit Profile</h3>
              <button onClick={() => setEditOpen(false)}>×</button>
            </div>

            <div className="profile-form-grid">
              <label>
                Full Name
                <input
                  value={profileForm.fullName}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Mobile Number
                <input value={profileForm.mobile} disabled />
              </label>

              <label>
                Email
                <input
                  type="email"
                  placeholder="Enter email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Address
                <textarea
                  placeholder="Enter address"
                  value={profileForm.address}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div className="profile-modal-actions">
              <button className="secondary" onClick={() => setEditOpen(false)}>
                Cancel
              </button>
              <button onClick={handleSaveProfile} disabled={savingProfile}>
                {savingProfile ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      )}

      {passwordOpen && (
        <div className="profile-modal-backdrop">
          <div className="profile-modal">
            <div className="profile-modal-head">
              <h3>Change Password</h3>
              <button onClick={() => setPasswordOpen(false)}>×</button>
            </div>

            <div className="profile-form-grid">
              <label>
                Current Password
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                />
              </label>

              <label>
                New Password
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Confirm New Password
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div className="profile-modal-actions">
              <button
                className="secondary"
                onClick={() => setPasswordOpen(false)}
              >
                Cancel
              </button>
              <button onClick={handleChangePassword}>Update Password</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
