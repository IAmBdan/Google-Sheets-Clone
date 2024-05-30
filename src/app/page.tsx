import "bootstrap/dist/css/bootstrap.min.css";
import { api } from "~/trpc/server";

import Grid from "~/grid";
import Header from "./header";
import InputLine from "./inputline";
import ButtonToolbar from "./btnmenu";

export default async function Home() {
  const data = await api.publisher.getPublishers();
  console.log(data);
  const users = await api.user.getAll();
  console.log(users);

  return (
    <main className="flex h-full flex-col">
      <Header />
      <ButtonToolbar />
      <InputLine />
      <Grid numColumns={26} numRows={100} />
    </main>
  );
}
