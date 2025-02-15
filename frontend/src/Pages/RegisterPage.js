import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

export default function RegisterPage() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Add success state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(""); // Reset success message

    try {
      console.log("Request Payload:", user); // Debugging line
      const response = await axios.post("http://localhost:5000/api/auth/register", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response:", response); // Debugging line
      if (response.status === 200) {
        setSuccess("Registration successful! Redirecting to login..."); // Set success message
        setTimeout(() => {
          navigate("/login");
        }, 1000); // Redirect after 1 seconds
      }
    } catch (err) {
      console.error("Error Response:", err.response); // Debugging line
      setError(err.response?.data?.message || "Failed to register.");
    }
  };

  return (
    <div className="container">
      <div className="heading">
        <h4>Register</h4>
      </div>
      <div className="para">
        Enter your email address to create an account.
      </div>
      <div className="input">
        {error && <div className="error-message" style={{color: 'red'}}>{error}</div>}
        {success && <div className="success-message" style={{color: 'green'}}>{success}</div>} {/* Display success message */}
        <form className="register" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input-field"
            value={user.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-field"
            value={user.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}