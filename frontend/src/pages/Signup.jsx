import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });
      alert("Signup successful! Please login.");
      navigate("/");
    } catch (err) {
      alert("Signup failed: " + err.response.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Signup</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2"
        />
        <button className="bg-green-500 text-white p-2">Signup</button>
      </form>
    </div>
  );
}
