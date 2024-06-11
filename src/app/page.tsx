"use client"

//Landing Page
import Register from "./register/page";

export default function Home() {
  return (
    <div className="mx-auto my-16 flex max-w-sm flex-col gap-4">
      <Register />
    </div>
  );
}
