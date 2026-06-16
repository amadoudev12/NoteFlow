import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Users, ClipboardList, TrendingUp, Award,
  AlertCircle, ArrowLeft, BookOpen,
} from "lucide-react";
import noteService from "../../services/noteService";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const calcMoyenne = (notes) => {
  const totalCoeff = notes.reduce((s, n) => s + n.coefficient, 0)
  if (totalCoeff === 0) return 0
  const somme = notes.reduce((s, n) => s + n.valeur * n.coefficient, 0)
  return Math.round((somme / totalCoeff) * 100) / 100
}

const getAppreciation = (moy) => {
  if (moy >= 16) return { label: "Très bien",  style: "bg-teal-50 text-teal-700" }
  if (moy >= 14) return { label: "Bien",        style: "bg-blue-50 text-blue-700" }
  if (moy >= 12) return { label: "Assez bien",  style: "bg-indigo-50 text-indigo-700" }
  if (moy >= 10) return { label: "Passable",    style: "bg-amber-50 text-amber-700" }
  return           { label: "Insuffisant",  style: "bg-rose-50 text-rose-700" }
}

const getNoteColor = (val) => {
  if (val >= 16) return "text-teal-700 bg-teal-50"
  if (val >= 12) return "text-blue-700 bg-blue-50"
  if (val >= 10) return "text-amber-700 bg-amber-50"
  return "text-rose-700 bg-rose-50"
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-slate-50">
      <td className="px-4 py-3"><div className="h-3.5 w-32 bg-slate-100 rounded" /></td>
      <td className="px-4 py-3"><div className="h-3.5 w-16 bg-slate-100 rounded" /></td>
      <td className="px-4 py-3"><div className="flex gap-1 justify-center">{Array.from({length:4}).map((_,i)=><div key={i} className="h-5 w-8 bg-slate-100 rounded-lg"/>)}</div></td>
      <td className="px-4 py-3"><div className="h-6 w-12 bg-slate-100 rounded-xl mx-auto" /></td>
      <td className="px-4 py-3"><div className="h-5 w-20 bg-slate-100 rounded-full mx-auto" /></td>
    </tr>
  )
}
import { useSearchParams } from "react-router-dom";
// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NotesPage() {
  const { id_classe } = useParams()
  const [searchParams]                  = useSearchParams()
  const id_matiere                      = searchParams.get("id_matiere")
  const navigate      = useNavigate()

  const [notes, setNotes]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState("")

  // Récupère les infos de la classe passées via localStorage
  const classeInfo = JSON.parse(localStorage.getItem("selectedClasse") || "null")

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true)
      try {
        const res = await noteService.getNotes({ id_classe, id_matiere })
        if (res.data?.notes) setNotes(res.data.notes)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [id_classe, id_matiere])

  const elevesData = notes.map((eleveNotes) => {
    const moy = calcMoyenne(eleveNotes.notes)
    return {
      matricule:    eleveNotes.matricule,
      nom:          eleveNotes.nom,
      prenom:       eleveNotes.prenom,
      matiere:      eleveNotes.matiere,
      coefficient:  eleveNotes.coefficient_matiere,
      notesList:    eleveNotes.notes,
      moyenne:      moy,
      appreciation: getAppreciation(moy),
    }
  }).filter(Boolean)

  const filtered = elevesData.filter(e =>
    `${e.nom} ${e.prenom} ${e.matricule}`.toLowerCase().includes(search.toLowerCase())
  )

  // Stats
  const moyenneClasse = elevesData.length
    ? Math.round(elevesData.reduce((s, e) => s + e.moyenne, 0) / elevesData.length * 100) / 100
    : null
  const nbReussi = elevesData.filter(e => e.moyenne >= 10).length
  const nbEchec  = elevesData.filter(e => e.moyenne < 10).length

  return (
    <div className="space-y-6 px-4 lg:px-8 py-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {classeInfo?.classe?.libelle ?? `Classe #${id_classe}`}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {classeInfo?.matiere.nom ?? "—"} · Notes des élèves
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {!loading && elevesData.length > 0 && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { icon: Users,       bg: "bg-blue-50",   color: "text-blue-600",   val: elevesData.length, label: "Élèves" },
            { icon: TrendingUp,  bg: "bg-indigo-50", color: "text-indigo-600", val: moyenneClasse,     label: "Moyenne classe" },
            { icon: Award,       bg: "bg-teal-50",   color: "text-teal-600",   val: nbReussi,          label: "Au-dessus de 10" },
            { icon: AlertCircle, bg: "bg-rose-50",   color: "text-rose-600",   val: nbEchec,           label: "En difficulté" },
          ].map(({ icon: Icon, bg, color, val, label }, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${bg}`}>
                <Icon size={16} className={color} />
              </div>
              <p className="text-3xl font-bold text-slate-800">{val ?? "—"}</p>
              <p className="text-sm text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
          <p className="font-semibold text-slate-800">
            {classeInfo
              ? `${classeInfo.classe?.libelle} · ${classeInfo.matiere.nom}`
              : "Notes"
            }
          </p>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un élève…"
            className="border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-52 transition"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Élève</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Matricule</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Moyenne</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Appréciation</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                : filtered.length === 0
                  ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-sm text-slate-400">
                        {search ? `Aucun résultat pour "${search}"` : "Aucune note disponible"}
                      </td>
                    </tr>
                  )
                  : filtered.map((eleve, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">

                      {/* Nom */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700 shrink-0">
                            {eleve.nom[0]}{eleve.prenom[0]}
                          </div>
                          <p className="font-semibold text-slate-800">{eleve.nom} {eleve.prenom}</p>
                        </div>
                      </td>

                      {/* Matricule */}
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono">{eleve.matricule}</td>

                      {/* Notes */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {eleve.notesList.map((n, j) => (
                            <span key={j} className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${getNoteColor(n.valeur)}`}>
                              {n.valeur}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Moyenne */}
                      <td className="px-4 py-3 text-center">
                        <span className={`text-sm font-bold px-3 py-1 rounded-xl ${getNoteColor(eleve.moyenne)}`}>
                          {eleve.moyenne}
                        </span>
                      </td>

                      {/* Appréciation */}
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${eleve.appreciation.style}`}>
                          {eleve.appreciation.label}
                        </span>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && elevesData.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {filtered.length} élève{filtered.length > 1 ? "s" : ""}
              {search && ` · filtrés sur "${search}"`}
            </p>
            <p className="text-xs text-slate-400">
              Coeff. matière : <span className="font-semibold text-slate-600">{elevesData[0]?.coefficient}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}