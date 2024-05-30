import 'bootstrap/dist/css/bootstrap.min.css';

// import { getServerAuthSession } from "~/server/auth";
// import { api } from "~/trpc/server";

import Grid from "~/grid";
import Header from "./header";
import InputLine from './inputline';
import ButtonToolbar from './btnmenu';

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  // const session = await getServerAuthSession();

  return (
    <main className="flex h-full flex-col">
      <Header />
      <ButtonToolbar/>
      <InputLine />
      <Grid numColumns={26} numRows={100} />
    </main>
  );
}
