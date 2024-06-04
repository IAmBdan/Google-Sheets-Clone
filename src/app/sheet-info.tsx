// @ts-ignore
export default function SheetInfo({ title , description }) {
    return (
        <div className="p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-gray-600 mb-2">{description}</p>
        </div>
    )
};