import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../services/userServices";
  
import "../styles/users.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      // 🔥 fallback name
      const safeName =
        userInfo.name ||
        userInfo.username ||
        userInfo.email?.split("@")[0];

      const updatedUser = {
        ...userInfo,
        name: safeName,
      };

      setUser(updatedUser);
      setFormData({
        name: safeName,
        email: userInfo.email,
      });

      // ✅ future ke liye fix
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
  
    try {
      // Simulate API call for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setEditMode(false);
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setLoading(false);
    }
  };
  

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
      </div>

      <div className="profile-card">
        <div className="avatar">
          {(user.name || user.email || "U")
            .charAt(0)
            .toUpperCase()}
        </div>

        {!editMode ? (
          <div className="profile-info">
            <p>
              <b>Name:</b> {user.name}
            </p>
            <p>
              <b>Email:</b> {user.email}
            </p>
            <p>
              <b>Role:</b>{" "}
              <span className={`role-badge ${user.role?.toLowerCase()}`}>
                {user.role}
              </span>
            </p>

            <button
              className="edit-btn"
              onClick={() => setEditMode(true)}
            >
              ✏️ Edit Profile
            </button>
          </div>
        ) : (
          <div className="edit-form">
            <input
              type="text"
              placeholder="Enter name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <div className="form-actions">
              <button onClick={handleSave}>💾 Save</button>
              <button
                className="cancel"
                onClick={() => setEditMode(false)}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
