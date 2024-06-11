"use client"

//Landing Page
import axios from "axios";
import { useState, useEffect } from "react";
import Register from "./_components/register";

export default function Home() {
  return (
    <div className="mx-auto my-16 flex max-w-sm flex-col gap-4">
      <Register />
    </div>
  );
}
