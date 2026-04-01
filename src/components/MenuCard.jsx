export default function MenuCard({ icon, title, desc, onClick, color }) {
    return (
      <button
        onClick={onClick}
        className={`bg-white border-4 border-gray-50 p-10 rounded-[48px] shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center text-center space-y-6 ${color}`}
      >
        <div className="p-6 bg-gray-50 rounded-full">{icon}</div>
        <div>
          <h3 className="text-2xl font-black text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-400 font-bold leading-tight">{desc}</p>
        </div>
      </button>
    )
  }