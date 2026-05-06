import { useEffect, useState } from "react";
// import StatCard from "./StatCard";
import eleveService from "../../services/eleveService";
import { useNavigate } from "react-router-dom";
const getMoyenneGenerale = (matieres) => {
    if(!matieres.length){
        return 0
    }
    const totalPoints = matieres.reduce(
        (acc, m) => acc + Number(m.moyenne) * Number(m.coefficient), 
        0
    )
    const totalCoef = matieres.reduce((acc, m) => acc + m.coefficient, 0);
    return (totalPoints / totalCoef).toFixed(2);
}

const getMention = (moy) => {
    const m = parseFloat(moy);
    if (m >= 16) return { label: "Très Bien", color: "text-emerald-400" };
    if (m >= 14) return { label: "Bien", color: "text-teal-400" };
    if (m >= 12) return { label: "Assez Bien", color: "text-sky-400" };
    if (m >= 10) return { label: "Passable", color: "text-yellow-400" };
    return { label: "Insuffisant", color: "text-red-400" };
}
const getMeilleureMatiere = (matieres) => {
    if (!matieres || matieres.length === 0) {
        return null
    }
    return matieres.reduce((best, m) => (Number(m.moyenne) > Number(best.moyenne) ? m : best), matieres[0]);
} 
function StatCard({ label, value, sub, subColor, accentColor }) {
    return (
        <div style={{
            background: "#fff", border: "0.5px solid #dce8f9",
            borderRadius: 14, padding: "1rem 1.2rem",
            position: "relative", overflow: "hidden"
        }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2.5, background: accentColor, borderRadius: "14px 14px 0 0" }} />
            <p style={{ fontSize: 11, color: "#6c8db5", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>
                {label}
            </p>
            <p style={{ fontSize: 26, fontWeight: 700, color: "#0c2c5a", margin: "0 0 4px", lineHeight: 1 }}>
                {value}
            </p>
            <p style={{ fontSize: 12, fontWeight: 500, color: subColor, margin: 0 }}>
                {sub}
            </p>
        </div>
    )
}

function StatsCards({ matiereMoyenne, eleve }) {
    const [rang, setRang] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const getRangFunction = async () => {
            try {
                const res = await eleveService.getRang()
                if (res.data) setRang(res.data.rang)
            } catch {
                navigate('/500')
            }
        }
        getRangFunction()
    }, [eleve])

    const moy = getMoyenneGenerale(matiereMoyenne)
    const mention = getMention(moy)
    const meilleure = getMeilleureMatiere(matiereMoyenne)

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: "1.25rem" }}>
            <StatCard label="Moyenne générale" value={`${moy}/20`} sub={mention.label}
                subColor={parseFloat(moy) >= 10 ? "#0d6b43" : "#b91c1c"} accentColor="#1e88e5" />
            <StatCard label="Matières" value={matiereMoyenne.length} sub="au programme"
                subColor="#6c8db5" accentColor="#42a5f5" />
            <StatCard label="Meilleure matière" value={`${Number(meilleure?.moyenne ?? 0).toFixed(1)}/20`}
                sub={meilleure?.matiere ?? "—"} subColor="#0d6b43" accentColor="#00897b" />
            <StatCard label="Classement" value={rang != null ? `${rang}e` : "—"}
                sub="sur la classe" subColor="#1e88e5" accentColor="#1565c0" />
        </div>
    )
}

export default StatsCards