// import { api } from "~/trpc/server";

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

  return (
    <main className="flex h-full flex-col">
      {/* <Dummy /> */}
      <Header />
      <InputLine />
      <Grid numColumns={26} numRows={100} />
    </main>
  );
}
