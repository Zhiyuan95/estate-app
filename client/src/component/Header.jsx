import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 ">
        <Link to={"/"}>
          <h1 className="flex flex-wrap font-bold text-sm sm:text-xl">
            <span className="text-slate-500">Zane</span>
            <span className="text-slate-500">Estate</span>
          </h1>
        </Link>

        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-500" />
        </form>
        <ul className="flex gap-4 ">
          <Link to="/home">
            <li className="hover:underline hidden sm:inline text-slate-700">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hover:underline hidden sm:inline text-slate-700">
              About
            </li>
          </Link>
          <Link to="signin">
            <li className="hover:underline text-slate-700">Sign in</li>
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
