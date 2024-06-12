import SheetView from "../../../sheetView";

export default function Sheet({
  params,
}: {
  params: { publisher: string; name: string };
}) {
  return <SheetView sheetName={params.name} publisher={params.publisher} />;
}
