"use client";
import React, { useState, useRef, useEffect } from "react";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null); 
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiData) => {
    setMsg((prev) => prev + emojiData.emoji); 
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Container>
      <div className="button-container">
        <div className="emoji" ref={emojiPickerRef}>
          <SentimentSatisfiedAltIcon onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && (
            <div className="emoji-picker">
              <Picker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>

      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="Type a message"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #fff; 
  padding: 0 2rem;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: #333; /* Dark text for better contrast */
    gap: 1rem;

    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        cursor: pointer;
      }

      .emoji-picker {
        position: absolute;
        top: -250px;
        right: -370px;
        background-color: #f0f4ff;/
        border: 1px solid #9a86f3;
        border-radius: 8px;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
      }
    }
  }

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    background-color: #ffffff34; 

    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: #333;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }

      &:focus {
        outline: none;
      }

      @media screen and (min-width: 720px) and (max-width: 1080px) {
        font-size: 1rem;
        width: 85%;
        height: 60%;
      }

      @media screen and (max-width: 720px) {
        font-size: 0.8rem;
        width: 75%;
        height: 60%;
      }
    }

    button {
      padding: 0.5rem 0.5rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: blue;
      border: none;

      svg {
        font-size: 1rem;
        color: white;
      }

      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1.5rem;
        }
      }

      @media screen and (max-width: 720px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1.3rem;
        }
      }
    }
  }
`;
