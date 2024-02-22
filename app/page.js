"use client";
import "regenerator-runtime/runtime";
import SocketIOClient from "socket.io-client";

import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const socket = SocketIOClient("http://localhost:3000");
const deviceThreadId = { deviceThreadId: "11" };

const sendMessage = (msg) => {
  console.log("message");
  let request = { deviceThreadId: "11", message: msg };
  console.log("request ===================", request);
  socket.emit("request", request);
};

const Home = () => {
  const msg = new SpeechSynthesisUtterance();

  useEffect(() => {
    socket.emit("register", deviceThreadId);
  }, []);

  const commands = [
    {
      command: "Salut *",
      callback: (text) => {
        console.log("text", text);
        sendMessage(text);
        msg.text = text;

        if (window["speechSynthesis"] === undefined) {
          return;
        }
        window.speechSynthesis.speak(msg);
        socket.on("response", (r) => {
          console.log("respons", r);
          msg.text = r;
          window.speechSynthesis.speak(msg);
        });
      },
    },
    {
      command: "reset *",
      callback: (text) => {
        console.log("text", text);
      },
    },
  ];
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ commands });

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <main className="w-full min-h-full bg-white">
      <p>Microphone: {listening ? "on" : "off"}</p>
      <button onClick={SpeechRecognition.startListening({ continuous: true })}>
        Start
      </button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>{transcript}</p>
    </main>
  );
};
export default Home;
