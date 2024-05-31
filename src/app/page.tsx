import "bootstrap/dist/css/bootstrap.min.css";
import { api } from "~/trpc/server";
import axios from "axios";

import Grid from "~/grid";
import Header from "./header";
import InputLine from "./inputline";
import ButtonToolbar from "./btnmenu";
import { useEffect } from "react";
import Dummy from "./_components/dummy";

export default async function Home() {
  const data = await api.publisher.getPublishers();
  console.log(data);
  const users = await api.user.getAll();
  console.log(users);
  const publishers = await api.publisher.register({ name: "test" });
  console.log(publishers);

  return (
    <main className="flex h-full flex-col">
      {/* <Dummy /> */}
      <Header />
      <ButtonToolbar />
      <InputLine />
      <Grid numColumns={26} numRows={100} />
    </main>
  );
}
