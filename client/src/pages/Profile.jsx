import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="mx-auto max-w-lg p-3">
      <h1 className="text-center font-semibold my-7 text-3xl">Profile</h1>
      <form className="flex flex-col gap-4 ">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 self-center mt-2 cursor-pointer object-cover"
        />
        <input
          type="text"
          id="username"
          placeholder="username"
          className="rounded-lg p-3 border"
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          className="rounded-lg p-3 border"
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          className="rounded-lg p-3 border"
        />
        <button className="uppercase rounded-lg p-3 bg-slate-700 text-white hover:opacity-90 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-2">
        <span className="text-red-700 cursor-pointer">Delete Account!</span>
        <span className="text-red-700">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
