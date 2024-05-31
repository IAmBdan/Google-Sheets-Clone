"use client";

import axios from "axios";
import { useEffect } from "react";

export default function Dummy() {
  async function registerPublisher() {
    const result = await axios.post(
      "http://localhost:3000/api/trpc/publisher.register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "test" }),
      },
    );
    console.log(result);
    return result;
  }

  useEffect(() => {
    console.log("inside use effect")
    registerPublisher();
  }, []);

  return (
    <div>
      <h1>Test</h1>
    </div>
  );
}
