import { Calendar, Plus, Check, Trash2, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { cls } from "../utils/cls";
import trimestreService from "../../services/trimestreService";

function TrimestresPage() {
  const [trimestres, setTrimestres] = useState([]);
  const [form, setForm] = useState({ nom: "", debut: "", fin: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getTrimestre = async () => {
      try {
        const res = await trimestreService.getTrimestres();
        if (res.data) setTrimestres(res.data);
      } catch (err) {
        console.log("erreur serveur");
      }
    };
    getTrimestre();
  }, []);

  // Retourne un message d'erreur si les dates chevauchent un trimestre existant
  const getOverlapError = (debut, fin, excludeId = null) => {
    const newStart = new Date(debut);
    const newEnd = new Date(fin);

    // Trier par date de fin pour trouver le dernier trimestre
    const sorted = [...trimestres]
      .filter(t => t.id_trimestre !== excludeId)
      .sort((a, b) => new Date(b.date_fin) - new Date(a.date_fin));

    if (sorted.length > 0) {
      const lastEnd = new Date(sorted[0].date_fin);
      if (newStart <= lastEnd) {
        return `Le trimestre doit commencer après le ${lastEnd.toLocaleDateString("fr-FR")} (fin du "${sorted[0].libelle}").`;
      }
    }

    // Vérification de chevauchement strict (cas général)
    const overlap = trimestres.find(t => {
      if (t.id_trimestre === excludeId) return false;
      const ts = new Date(t.date_debut);
      const te = new Date(t.date_fin);
      return newStart <= te && newEnd >= ts;
    });

    if (overlap) {
      return `Ces dates chevauchent le trimestre "${overlap.libelle}".`;
    }

    return null;
  };

  const submitTrimestre = async () => {
    setError("");
    setSuccess(false);

    if (!form.nom || !form.debut || !form.fin) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (new Date(form.fin) <= new Date(form.debut)) {
      setError("La date de fin doit être postérieure à la date de début.");
      return;
    }

    const overlapErr = getOverlapError(form.debut, form.fin);
    if (overlapErr) {
      setError(overlapErr);
      return;
    }

    try {
      await trimestreService.postTrimestre(form);
      setSuccess(true);
      setForm({ nom: "", debut: "", fin: "" });
      // Recharger la liste
      const res = await trimestreService.getTrimestres();
      if (res.data) setTrimestres(res.data);
    } catch (err) {
      console.log("erreur serveur");
    }
  };

  const toggleActif = async (id) => {
    try {
      await trimestreService.activeTrimestre(id);
      const res = await trimestreService.getTrimestres();
      if (res.data) setTrimestres(res.data);
    } catch (err) {
      console.log("erreur serveur");
    }
  };

  const handleDelete = async (id) => {
    try {
      await trimestreService.deleteTrimestre(id);
      setTrimestres(prev => prev.filter(t => t.id_trimestre !== id));
    } catch (err) {
      setTrimestres(prev => prev.filter(t => t.id_trimestre !== id));
    }
  };

  // Date minimum pour le champ début = lendemain de la fin du dernier trimestre
  const getMinDebut = () => {
    if (trimestres.length === 0) return "";
    const sorted = [...trimestres].sort((a, b) => new Date(b.date_fin) - new Date(a.date_fin));
    const lastEnd = new Date(sorted[0].date_fin);
    lastEnd.setDate(lastEnd.getDate() + 1);
    return lastEnd.toISOString().split("T")[0];
  };

  return (
    <div className="ml-45 max-sm:ml-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-semibold text-slate-800 mb-5 flex items-center gap-2">
            <Plus size={18} className="text-blue-500" /> Ajouter un trimestre
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1.5 block">Nom du trimestre</label>
              <input
                type="text"
                value={form.nom}
                onChange={e => setForm(p => ({ ...p, nom: e.target.value }))}
                placeholder="ex: 1er Trimestre"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1.5 block">Date de début</label>
                <input
                  type="date"
                  value={form.debut}
                  min={getMinDebut()}
                  onChange={e => {
                    setForm(p => ({ ...p, debut: e.target.value, fin: "" }));
                    setError("");
                  }}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1.5 block">Date de fin</label>
                <input
                  type="date"
                  value={form.fin}
                  min={form.debut || undefined}
                  onChange={e => {
                    setForm(p => ({ ...p, fin: e.target.value }));
                    setError("");
                  }}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-rose-700 bg-rose-50 rounded-xl px-4 py-2.5 text-sm">
                <span className="mt-0.5">⚠</span> {error}
              </div>
            )}

            <button
              onClick={submitTrimestre}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Créer le trimestre
            </button>

            {success && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-xl px-4 py-2.5 text-sm animate-pulse">
                <Check size={16} /> Trimestre ajouté avec succès !
              </div>
            )}
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-semibold text-slate-800 mb-5 flex items-center gap-2">
            <BookOpen size={18} className="text-blue-500" /> Trimestres enregistrés
          </h3>
          <div className="space-y-3">
            {[...trimestres]
              .sort((a, b) => new Date(a.date_debut) - new Date(b.date_debut))
              .map(t => (
              <div key={t.id_trimestre} className={cls(
                "rounded-xl p-4 border-2 transition-all duration-300",
                t.actif ? "border-blue-300 bg-blue-50" : "border-slate-100 bg-slate-50 hover:border-slate-200"
              )}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800 flex items-center gap-2">
                      {t.libelle}
                      {t.actif && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Actif</span>}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(t.date_debut).toLocaleDateString("fr-FR")} → {new Date(t.date_fin).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActif(t.id_trimestre)}
                      className={cls(
                        "text-xs font-medium px-3 py-1.5 rounded-lg transition",
                        t.actif ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600 hover:bg-blue-100 hover:text-blue-600"
                      )}
                    >{t.actif ? "Actif" : "Activer"}</button>
                    <button onClick={() => handleDelete(t.id_trimestre)} className="text-slate-400 hover:text-rose-500 transition p-1">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrimestresPage;