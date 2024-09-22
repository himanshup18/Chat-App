"use client"; 

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";

export default function Welcome() {
  const [userName, setUserName] = useState("");

  // Refactor useEffect to handle async correctly
  useEffect(() => {
    const fetchUserName = async () => {
      const data = await JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_LOCALHOST_KEY));
            if (data) {
        setUserName(data.username);
      }
    };

    fetchUserName();
  }, []);

  return (
    <Container>
      {/* <Image src={Robot} alt="Robot" width={300} height={300} /> */}
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #333; /* Dark text for better contrast */
  background-color: #f0f4ff; /* Light blue background */
  height: 100%; /* Ensure it fills the available space */
  padding: 2rem; /* Add some padding for spacing */

  img {
    height: 20rem;
  }

  span {
    color: #4e0eff; /* Keep the existing accent color */
  }

  h1 {
    margin: 0; /* Remove default margin for better alignment */
  }

  h3 {
    margin-top: 0.5rem; /* Space between headings */
  }

  @media (max-width: 768px) {
    img {
      height: 15rem;
    }
  }

  @media (max-width: 480px) {
    display: none;}
`;
