import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../component/OAuth";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      //key-value in obj
      [e.target.id]: e.target.value,
    });
  };

  //send username,password and email to db
  const handleSubmit = async (e) => {
    //prevent refeshing broswer from clicking sign-up btn
    e.preventDefault();
    try {
      //request is WIP
      setLoading(true);
      //here we use fetch to receive the input values and send them to server whose address is "/api/auth/signup"
      const res = await fetch(
        //the address we gonna send values to
        "/api/auth/signup",
        {
          //we use POST method to submit data
          method: "POST",
          //tell the server the data type
          headers: {
            "Content-Type": "application/json",
          },
          //the actual data we will send, and conver it to string in order to send it over the network
          body: JSON.stringify(formData),
        }
      );
      //conver res to json,as
      const data = await res.json();
      //below block is to handle the logic error, like username is taken already...
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      //finished request
      setLoading(false);
      setError(null);
      navigate("/signin");
    } catch (error) {
      //this is to handle tech error, like network issue
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-center text-3xl font-semibold my-7">Sign Up </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border rounded-lg p-3"
          type="text"
          name="username"
          id="username"
          placeholder="username"
          onChange={handleChange}
        />
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
          {loading ? "Loading..." : "sign up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have a account?</p>
        <Link to={"/signin"}>
          <span className="text-blue-700"> Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error} </p>}
    </div>
  );
};

export default SignUp;
