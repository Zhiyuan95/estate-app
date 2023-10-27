import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);

  const handleSubmit = (e) => {
    e.preventDefault();
    //it retruns query part of URL, params after '?' in url
    console.log("urlParams is:", urlParams);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  useEffect(() => {
    setSearchTerm(urlParams.get("searchTerm" || ""));
  }, [window.location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 ">
        <Link to={"/"}>
          <h1 className="flex flex-wrap font-bold text-sm sm:text-xl">
            <span className="text-slate-500">Zane</span>
            <span className="text-slate-500">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-500" />
          </button>
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
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className=" text-slate-700 hover:underline"> Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
