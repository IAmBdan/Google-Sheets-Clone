// import { api } from "~/trpc/server";

import { Sheet } from "~/classes/sheets";
import Grid from "./grid";
import Header from "./header";
import InputLine from "./inputline";

export default async function Home() {
  // const data = await api.publisher.getPublishers();
  // console.log(data);
  // const users = await api.user.getAll();
  // console.log(users);
  // const publishers = await api.publisher.register({ name: "test" });
  // console.log(publishers);

  const sheet = new Sheet(100, 26);

  return (
    <main className="flex h-full flex-col">
      {/* <Dummy /> */}
      <Header />
      <InputLine />
      <Grid sheet={sheet} />
    </main>
  );
}
