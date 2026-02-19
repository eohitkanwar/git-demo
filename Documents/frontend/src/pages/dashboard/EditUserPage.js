import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiShield, FiArrowLeft, FiSave, FiCheck, FiX, FiLoader } from "react-icons/fi";
import { updateUser, getUserById } from "../../services/userServices";
import { toast } from "react-toastify";
import "../../styles/EditUserPage.css";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", role: "user" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        toast.error("Invalid user ID");
        navigate("/dashboard/users");
        return;
      }

      try {
        // Show loading for 2 seconds minimum
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
        
        const response = await getUserById(id);

        // Safe check: response could be object or array
        let userData = null;

        if (response && response._id) {
          userData = response; // direct object
        } else if (response && response.user) {
          userData = response.user; // wrapped object
        } else if (Array.isArray(response)) {
          userData = response.find(u => u._id === id || u.id === id);
        } else if (response && response.data) {
          userData = response.data; 
        }

        if (!userData) {
          toast.error("User not found!");
          setError("User not found in the system");
          return;
        }

        setFormData({
          name: userData.username || userData.name || "",
          email: userData.email || "",
          role: userData.role || "user",
        });
      } catch (err) {
        const msg = err.response?.data?.message || err.message || "Failed to fetch user data";
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setIsSaving(true);
      setSaveSuccess(false);

      // Convert name to username for backend compatibility
      const updateData = {
        ...formData,
        username: formData.name
      };

      await updateUser(id, updateData);

      setSaveSuccess(true);
      toast.success("User updated successfully!");

      // Keep saving state for 2 seconds minimum
      setTimeout(() => {
        setIsSaving(false);
        navigate("/dashboard/users");
      }, 2000);
    } catch (err) {
      console.log('Error caught:', err); // Debug log
      const msg = err.response?.data?.message || err.message || "Failed to update user";
      console.log('Message to show:', msg); // Debug log
      
      // Always show the actual server message
      setError(msg);
      console.log("msg",msg)
      toast.error("User Not Updated", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => navigate("/dashboard/users");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiLoader className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-user-container">
      <div className="edit-user-card">
        <div className="edit-user-header">
          <button onClick={handleCancel} className="back-button">
            <FiArrowLeft /> Back to Users
          </button>
          <div>
            <h1 className="edit-user-title">Edit User</h1>
            <p className="edit-user-subtitle">Update user information and permissions</p>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <FiX className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {saveSuccess && (
          <div className="success-message">
            <FiCheck className="w-4 h-4 mr-2" />
            User updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-user-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter user's full name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input custom-select"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="button-group">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="loading-spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPage;
