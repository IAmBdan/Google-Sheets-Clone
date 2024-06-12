"use client"

//Landing Page
import Login from "./login/page";

export default function Home() {
  return (
    <div className="mx-auto my-16 flex max-w-sm flex-col gap-4">
      <Login />
    </div>
  );
}
