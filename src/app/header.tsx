/**
 * Renders the header of the application, including the sheet name, menus, and login/logout buttons.
 */
export default function Header() {
  return (
    <header className="bg-gray-200 p-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-2xl">My Spreadsheet</span>
          <div className="flex flex-row gap-2">
            <button className="hover:underline">File</button>
            <button className="hover:underline">Edit</button>
            <button className="hover:underline">Help</button>
          </div>
        </div>
        <div className="flex flex-row gap-2 self-start">
          <button className="text-gray-600 hover:text-black hover:underline">
            Log In
          </button>
          <button className="text-gray-600 hover:text-black hover:underline">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}
