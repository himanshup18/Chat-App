"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Logo from "../assets/QC2.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const router = useRouter();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY)) {
      router.push("/chat");
    }
  }, [router]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be the same.", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("Username should be greater than 3 characters.", toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error("Password should be equal to or greater than 8 characters.", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      } else if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        router.push("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center items-center">
            <Image src={Logo} alt="logo" width={40} height={50} style={{ borderRadius: "20px", marginRight: "10px" }} />
            <h3 className="font-semibold text-xl">
              <span className="text-blue-600">Quick</span>
              <span style={{ color: "#2c3e50" }}>Con</span>
            </h3>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account? <Link href="/login">Login.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh; /* Full viewport height */
  width: 100vw; /* Full viewport width */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center vertically */
  align-items: center; /* Center horizontally */
  background-color: #e1f5fe; /* Light sky blue background */

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #ffffff; /* White background for the form */
    border-radius: 2rem;
    padding: 3rem 5rem; /* Adjusted padding for better spacing */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Slight shadow for depth */
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff; /* Sky blue border */
    border-radius: 0.4rem;
    color: #2c3e50; /* Dark text color */
    width: 100%;
    font-size: 1rem;

    &:focus {
      border: 0.1rem solid #007bbf; /* Focused border color */
      outline: none;
    }
  }

  button {
    background-color: #007bbf; /* Sky blue button */
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #005f8c; /* Darker blue on hover */
    }
  }

  span {
    color: #2c3e50; /* Dark text color */
    text-transform: uppercase;

    a {
      color: #007bbf; /* Link color */
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
