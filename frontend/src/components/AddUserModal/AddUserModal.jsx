import React, { useEffect, useMemo, useState } from "react";
import "../EditUserModal/EditUserModal.css";

const AddUserModal = ({ visible, onClose, onSave }) => {
  const initialForm = useMemo(
    () => ({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      userStatus: "",
    }),
    []
  );

  const [formData, setFormData] = useState(initialForm);

  // backend errors
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) {
      setFormData(initialForm);
      setSubmitError("");
      setFieldErrors({});
      setIsSubmitting(false);
    }
  }, [visible, initialForm]);

  if (!visible) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // clear field error while typing
    setFieldErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });

    setSubmitError("");
  };

  // ✅ Parse Spring validation errors and keep the LAST default message per field
  // Supports:
  // - "Field error in object 'userDTO' on field 'email': ... default message [X]"
  // - "email': rejected value ... default message [X]"
  const parseSpringFieldErrors = (message) => {
    const result = {};
    if (!message) return result;

    // 1) "on field 'email' ... default message [..]" format
    let regex = /on field '([^']+)':[\s\S]*?default message \[([^\]]+)\]/gi;
    let m;
    const temp = {}; // field -> array of messages
    while ((m = regex.exec(message)) !== null) {
      const field = m[1];
      const msg = m[2];
      temp[field] = temp[field] || [];
      temp[field].push(msg);
    }

    // 2) "email': rejected value ... default message [..]" format
    if (Object.keys(temp).length === 0) {
      regex = /([A-Za-z0-9_]+)'\s*:\s*rejected value[\s\S]*?default message \[([^\]]+)\]/gi;
      while ((m = regex.exec(message)) !== null) {
        const field = m[1];
        const msg = m[2];
        temp[field] = temp[field] || [];
        temp[field].push(msg);
      }
    }

    // take LAST message per field (usually the best one)
    Object.keys(temp).forEach((field) => {
      const arr = temp[field] || [];
      result[field] = arr[arr.length - 1];
    });

    return result;
  };

  // ✅ Friendly mapping for business messages (fallback)
  const mapBackendMessageToFieldErrors = (msg = "") => {
    const m = msg.toLowerCase();
    const fe = {};

    // email already used
    if (m.includes("email is already in use") || m.includes("already in use")) {
      fe.email = "This email is already in use. Try another one.";
    }

    // generic password case: show backend message as-is if it contains "password"
    if (m.includes("password")) {
      fe.password = msg;
    }

    return fe;
  };

  // ✅ If backend returns huge "Validation failed: [...]" text, show short banner
  const toShortSubmitError = (msg) => {
    const m = (msg || "").toLowerCase();
    if (m.includes("validation failed")) return "Please fix highlighted fields.";
    return msg || "Failed to add user.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitError("");
    setFieldErrors({});

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password, // no frontend validation
      role: formData.role, // Admin/User/Guest
      userStatus: (formData.userStatus || "").toUpperCase(), // ACTIVE/SUSPENDED
    };

    try {
      const res = await onSave(payload);

      if (!res?.ok) {
        const rawMsg = res?.message || "Failed to add user.";
        console.error("Add user backend error:", rawMsg);

        setSubmitError(toShortSubmitError(rawMsg));

        const springFE = parseSpringFieldErrors(rawMsg);
        const mappedFE = mapBackendMessageToFieldErrors(rawMsg);

        // merge: spring has priority
        const combined = { ...mappedFE, ...springFE };

        // extra friendly fix if we ever get "email" as message
        if (combined.email && combined.email.trim().toLowerCase() === "email") {
          combined.email = "Email format is not valid (example: name@domain.com).";
        }

        // if spring gave the correct message, keep it (it already says example)
        if (Object.keys(combined).length > 0) setFieldErrors(combined);

        return;
      }

      // success
      setFormData(initialForm);
      setSubmitError("");
      setFieldErrors({});
      onClose();
    } catch (err) {
      const rawMsg = err?.message || "Failed to add user.";
      console.error("Add user error:", rawMsg);

      setSubmitError(toShortSubmitError(rawMsg));

      const springFE = parseSpringFieldErrors(rawMsg);
      const mappedFE = mapBackendMessageToFieldErrors(rawMsg);
      const combined = { ...mappedFE, ...springFE };

      if (combined.email && combined.email.trim().toLowerCase() === "email") {
        combined.email = "Email format is not valid (example: name@domain.com).";
      }

      if (Object.keys(combined).length > 0) setFieldErrors(combined);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Add New User</h3>

        {submitError && (
          <div className="error-banner" style={{ marginBottom: 12 }}>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-user-form">
          <label>First Name</label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} required />
          {fieldErrors.firstName && <p className="error-message">{fieldErrors.firstName}</p>}

          <label>Last Name</label>
          <input name="lastName" value={formData.lastName} onChange={handleChange} required />
          {fieldErrors.lastName && <p className="error-message">{fieldErrors.lastName}</p>}

          <label>Email</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          {fieldErrors.email && <p className="error-message">{fieldErrors.email}</p>}

          <label>Password</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} required />
          {fieldErrors.password && <p className="error-message">{fieldErrors.password}</p>}

          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="Admin">Administrator</option>
            <option value="User">User</option>
            <option value="Guest">Guest</option>
          </select>
          {fieldErrors.role && <p className="error-message">{fieldErrors.role}</p>}

          <label>Status</label>
          <select name="userStatus" value={formData.userStatus} onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          {fieldErrors.userStatus && <p className="error-message">{fieldErrors.userStatus}</p>}

          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                if (isSubmitting) return;
                setFormData(initialForm);
                setSubmitError("");
                setFieldErrors({});
                onClose();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button type="submit" className="confirm-btn" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
