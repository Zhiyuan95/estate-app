import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-center text-3xl font-semibold my-7">Sign Up </h1>
      <form className="flex flex-col gap-4">
        <input
          className="border rounded-lg p-3"
          type="text"
          name="username"
          id="username"
          placeholder="username"
        />
        <input
          className="border rounded-lg p-3"
          type="email"
          name="email"
          id="email"
          placeholder="email"
        />
        <input
          className="border rounded-lg p-3"
          type="password"
          name="password"
          id="password"
          placeholder="password"
        />
        <button className="uppercase border rounded-lg bg-slate-700 text-white p-3 hover:opacity-90 disabled:opacity-75">
          sign up
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have a account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700"> Sign in</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
