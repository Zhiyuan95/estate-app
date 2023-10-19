import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-center text-3xl font-semibold my-7">Sign In </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border rounded-lg p-3"
          type="email"
          name="email"
          id="email"
          placeholder="email"
          onChange={handleChange}
        />
        <input
          className="border rounded-lg p-3"
          type="password"
          name="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="uppercase border rounded-lg bg-slate-700 text-white p-3 hover:opacity-90 disabled:opacity-75"
        >
          {loading ? "Loading..." : "sign in"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have a account?</p>
        <Link to={"/signup"}>
          <span className="text-blue-700"> Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error} </p>}
    </div>
  );
};

export default SignIn;
