import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const { username, email, photoURL } = result.user;

      //save it to the db
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          photo: photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("Cant log in with Google", error);
    }
  };

  return (
    //by default the btn type is submit, we change it to button so it won't trriger submit in the form
    <button
      type="button"
      className="uppercase bg-red-700 text-white p-3 rounded-lg hover:opacity-90"
      onClick={handleGoogleClick}
    >
      continue with google
    </button>
  );
};

export default OAuth;
