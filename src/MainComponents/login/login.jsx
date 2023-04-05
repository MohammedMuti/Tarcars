import React, { useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";
import NavBar from "../common/navbar/navBar";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import ContextProvider from "../Context/ContextProvider";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState();

  function handleChange(e) {
    setData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  const [{ user }, dispatch] = useContext(ContextProvider);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setError(null);
    e.preventDefault();
    console.log("clicked");
    try {
      const res = await axios.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      if (res.data === "WRONG_PASSWORD") {
        return setError("WRONG_PASSWORD");
      }
      console.log(res);
      dispatch({
        type: "SET_USER",
        user: res.data,
      });
      const fetchCart = await axios.get(
        `/services/userservices/${res.data._id}`
      );
      console.log(fetchCart);
      dispatch({
        type: "ADD_TO_CART",
        cart: fetchCart.data,
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <NavBar />
      <div className="form" onSubmit={handleSubmit}>
        <div className="box">
          <h2>Sign Up</h2>
          <form>
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={data.email}
              onChange={handleChange}
            />
            <label>Password</label>
            <input
              type="password"
              value={data.password}
              onChange={handleChange}
              name="password"
            />
            {error === "WRONG_PASSWORD" ? (
              <p style={{ color: "red" }}>Invalid Email or Password</p>
            ) : null}
            <input type="submit" className="submit" value="Login" />
            <p>Don't have a account yet?</p>
            <Link to="/Tarcars/signup">
              <span>Sign Up</span>
            </Link>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
