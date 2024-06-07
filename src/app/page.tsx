// import { api } from "~/trpc/server";

import Sheet from "./sheet";

export default async function Home() {
  // const data = await api.publisher.getPublishers();
  // console.log(data);
  // const users = await api.user.getAll();
  // console.log(users);
  // const publishers = await api.publisher.register({ name: "test" });
  // console.log(publishers);

  "use client";

  return <Sheet />;
}
