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
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const router = useRouter();
  const [values, setValues] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY)) {
      router.push("/chat");
    }
  }, [router]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "" || password === "") {
      toast.error("Username and Password are required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const { username, password } = values;
        const { data } = await axios.post(loginRoute, { username, password });
        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        } else {
          localStorage.setItem(
            process.env.NEXT_PUBLIC_LOCALHOST_KEY,
            JSON.stringify(data.user)
          );
          router.push("/chat");
        }
      } catch (error) {
        toast.error("An error occurred while logging in. Please try again.", toastOptions);
      } finally {
        setLoading(false);
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
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
          <button type="submit">Log In</button>
          <span>
            Do not have an account? <Link href="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #e1f5fe; /* Light sky blue background */

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #ffffff; /* White background for the form */
    border-radius: 2rem;
    padding: 5rem; /* Adjusted padding for better spacing */
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
