const SHEETS = [
  {
    name: "my awesome spreadsheet",
    author: "Author 1",
  },
  {
    name: "another spreadsheet",
    author: "Author 1",
  },
  {
    name: "a third spreadsheet",
    author: "Author 1",
  },
];

export default async function Home() {
  console.log("home")
  return (
    <div className="mx-auto my-16 flex max-w-sm flex-col gap-4">
      <h1 className="text-center text-2xl">Spreadsheets</h1>
      {SHEETS.map(({ name, author }) => (
        <a
          key={name}
          className="flex w-full flex-col rounded border border-black p-2"
          href={"/sheet"}
        >
          <h2 className="text-xl font-bold">{name}</h2>
          <span>{author}</span>
        </a>
      ))}
    </div>
  );
}
