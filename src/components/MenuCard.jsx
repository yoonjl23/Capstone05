export default function MenuCard({ icon, title, desc, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`bg-white border-2 border-gray-100 p-4 rounded-[28px] shadow-md 
      transition-all duration-300 hover:-translate-y-1 hover:shadow-xl 
      flex flex-col items-center text-center gap-3 ${color}`}
    >
      <div className="p-3 bg-gray-50 rounded-full">
        {icon}
      </div>

      <div>
        <h3 className="text-lg font-black text-gray-800 mb-1">
          {title}
        </h3>
        <p className="text-xs text-gray-400 font-bold leading-tight">
          {desc}
        </p>
      </div>
    </button>
  )
}