import { useState } from "react";
import { registerUser } from "../../api/axiosClient";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    try {
      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      setMessage("✅ Registration successfull! You can now log in.");

      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (err) {
      setMessage("❌ Registration failed. Try again.");
    }
  };

  return (
    <div >
      <div>
        <h2>
          Register
        </h2>

        <form onSubmit={handleSubmit}>
          
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Full Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
          >
            Register
          </button>
        </form>

        {message && <p >{message}</p>}
      </div>
    </div>
  );
};

export default Register;
