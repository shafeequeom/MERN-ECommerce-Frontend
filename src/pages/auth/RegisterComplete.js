import { useState, useEffect } from "react";
import { auth } from "../../utils/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RegisterComplete = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForRegistration"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email & password is required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password should be least 6 characters long");
      return;
    }
    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      if (result.user.emailVerified) {
        window.localStorage.removeItem("emailForRegistration");
        let user = auth.currentUser;
        await user.updatePassword(password);
        const idTokenResult = await user.getIdTokenResult();
        console.log(user, idTokenResult);
        navigate("/");
        toast.success("Success");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const completeRegisterForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={email}
        className="form-control"
        disabled
      />
      <input
        type="password"
        name="password"
        value={password}
        className="form-control"
        autoFocus
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button className="btn btn-raised" type="submit">
        Complete Registration
      </button>
    </form>
  );
  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register</h4>

          {completeRegisterForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
