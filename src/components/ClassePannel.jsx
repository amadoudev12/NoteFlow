import { useNavigate } from "react-router-dom"
import { BookOpen, X, ChevronRight } from "lucide-react"
import ROW_COLORS from "../utils/RowColors"
function ClassePanel({ classes, onClose }) {
  const navigate = useNavigate()

const handleSelect = (item) => {
  localStorage.setItem("selectedClasse", JSON.stringify(item))
  navigate(`/dashboard/notes/${item.classe.id}?id_matiere=${item.matiere.id}`)
}

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden animate-fadeIn">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <BookOpen size={15} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Voir les notes</p>
              <p className="text-xs text-slate-400">Sélectionne une classe</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X size={15} />
          </button>
        </div>

        {/* Liste */}
        <div className="px-5 py-3 max-h-80 overflow-y-auto">
          {classes.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Aucune classe disponible</p>
          ) : (
            classes.map((item, i) => {
              const color = ROW_COLORS[i % ROW_COLORS.length]
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl mb-2 last:mb-0 border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-150 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${color.dot}`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-800">
                        {item.matiere.nom} 
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.classe?.libelle}</p>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-500 transition" />
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default ClassePanel