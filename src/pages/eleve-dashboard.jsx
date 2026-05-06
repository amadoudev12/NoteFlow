import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import eleveService from "../../services/eleveService";
import noteService from "../../services/noteService";
import HeaderEleve from "../components/HeaderEleve";
import StatsCards from "../components/StatsCards";

// ─── Helpers ────────────────────────────────────────────────────────────────

const getAppreciation = (moy) => {
    if (moy >= 16) return "Excellent";
    if (moy >= 14) return "Très bien";
    if (moy >= 12) return "Bien";
    if (moy >= 10) return "Assez bien";
    if (moy >= 8)  return "Insuffisant";
    return "Très insuffisant";
};

// ─── Scrollbar globale (injectée une seule fois) ─────────────────────────────

const scrollbarCSS = `
  .blue-scroll::-webkit-scrollbar {
    width: 5px;
  }
  .blue-scroll::-webkit-scrollbar-track {
    background: #f0f6ff;
    border-radius: 10px;
  }
  .blue-scroll::-webkit-scrollbar-thumb {
    background: #85b7eb;
    border-radius: 10px;
    transition: background 0.2s;
  }
  .blue-scroll::-webkit-scrollbar-thumb:hover {
    background: #1e88e5;
  }
  .blue-scroll {
    scrollbar-width: thin;
    scrollbar-color: #85b7eb #f0f6ff;
  }
  .db-row:hover { background: #f7faff !important; }
`;

function InjectStyles() {
    useEffect(() => {
        const id = "db-eleve-styles";
        if (!document.getElementById(id)) {
            const style = document.createElement("style");
            style.id = id;
            style.textContent = scrollbarCSS;
            document.head.appendChild(style);
        }
    }, []);
    return null;
}

// ─── Styles partagés ────────────────────────────────────────────────────────

const tableCard = {
    background: "#fff",
    border: "0.5px solid #dce8f9",
    borderRadius: 16,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    maxHeight: 480,
};

const tableCardHeader = {
    padding: "1rem 1.25rem 0.85rem",
    borderBottom: "0.5px solid #eef4fc",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
};

const cardTitle = { fontSize: 15, fontWeight: 600, color: "#0c2c5a", margin: 0 };
const cardSub   = { fontSize: 12, color: "#6c8db5", margin: "2px 0 0" };

const thStyle = {
    textAlign: "left",
    padding: "9px 14px",
    color: "#6c8db5",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 600,
    background: "#f7faff",
    position: "sticky",
    top: 0,
    zIndex: 1,
};

const tdBase = {
    padding: "11px 14px",
    color: "#1a3557",
    borderBottom: "0.5px solid #eef4fc",
};

const coefBadge = {
    background: "#e6f1fb", color: "#185fa5",
    fontSize: 11, fontWeight: 600,
    padding: "2px 8px", borderRadius: 6,
};

const pillGood = {
    background: "#e8f7f0", color: "#0d6b43",
    padding: "3px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 600, display: "inline-block",
};

const pillBad = {
    background: "#fcebeb", color: "#791f1f",
    padding: "3px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 600, display: "inline-block",
};

const badgePill = {
    background: "#e6f1fb", color: "#185fa5",
    fontSize: 11, fontWeight: 600,
    padding: "3px 10px", borderRadius: 20,
};

// ─── ResumeParMatiere ────────────────────────────────────────────────────────

function ResumeParMatiere({ matiereMoyenne }) {
    return (
        <div style={tableCard}>
            <div style={tableCardHeader}>
                <div>
                    <p style={cardTitle}>Résumé par matière</p>
                    <p style={cardSub}>Vue d'ensemble de toutes les matières</p>
                </div>
                <span style={badgePill}>{matiereMoyenne.length} matières</span>
            </div>

            <div className="blue-scroll" style={{ overflowY: "auto", flex: 1 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                        <tr>
                            {["Matière", "Moyenne", "Coefficient", "Appréciation"].map((h) => (
                                <th key={h} style={thStyle}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matiereMoyenne.map((m, i) => {
                            const isGood = m.moyenne >= 10;
                            const isLast = i === matiereMoyenne.length - 1;
                            const td = { ...tdBase, borderBottom: isLast ? "none" : tdBase.borderBottom };
                            return (
                                <tr key={i} className="db-row" style={{ background: "transparent" }}>
                                    <td style={{ ...td, fontWeight: 500 }}>{m.matiere}</td>
                                    <td style={td}>
                                        <span style={{ fontWeight: 700, fontSize: 15, color: isGood ? "#0d6b43" : "#b91c1c" }}>
                                            {isGood ? "▲" : "▼"} {Number(m.moyenne).toFixed(1)}
                                        </span>
                                    </td>
                                    <td style={td}><span style={coefBadge}>×{m.coefficient}</span></td>
                                    <td style={td}><span style={isGood ? pillGood : pillBad}>{getAppreciation(m.moyenne)}</span></td>
                                </tr>
                            );
                        })}
                        {matiereMoyenne.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "#6c8db5", fontSize: 13 }}>
                                    Aucune matière enregistrée
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── NotesRecentes ───────────────────────────────────────────────────────────

function NotesRecentes() {
    const navigate = useNavigate();
    const [notesRecentes, setNotesRecentes] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const token_decoded = jwtDecode(token);
        const getNotes = async () => {
            try {
                const res = await noteService.getNoteByMatricule(token_decoded.profil.matricule);
                if (res.data) setNotesRecentes(res.data.noteFinal);
            } catch {
                console.error('Erreur lors du chargement des notes');
            }
        };
        getNotes();
    }, []);

    const notesAffichees = [...notesRecentes].reverse();

    return (
        <div style={tableCard}>
            <div style={tableCardHeader}>
                <div>
                    <p style={cardTitle}>Notes récentes</p>
                    <p style={cardSub}>Dernières évaluations enregistrées</p>
                </div>
                <span style={badgePill}>{notesRecentes.length} notes</span>
            </div>

            <div className="blue-scroll" style={{ overflowY: "auto", flex: 1 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                        <tr>
                            {["Matière", "Type", "Note", "Coef."].map((h) => (
                                <th key={h} style={thStyle}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {notesAffichees.map((n, i) => {
                            const isGood = n.valeur >= 10;
                            const isLast = i === notesAffichees.length - 1;
                            const td = { ...tdBase, borderBottom: isLast ? "none" : tdBase.borderBottom };
                            return (
                                <tr key={i} className="db-row" style={{ background: "transparent" }}>
                                    <td style={{ ...td, fontWeight: 500 }}>{n.matiere}</td>
                                    <td style={{ ...td, color: "#6c8db5" }}>{n.type}</td>
                                    <td style={td}>
                                        <span style={{ fontWeight: 700, fontSize: 16, color: isGood ? "#0d6b43" : "#b91c1c" }}>
                                            {n.valeur}
                                            <span style={{ color: "#93b4d4", fontSize: 12, fontWeight: 400 }}>/20</span>
                                        </span>
                                    </td>
                                    <td style={td}><span style={coefBadge}>×{n.coefficient}</span></td>
                                </tr>
                            );
                        })}
                        {notesAffichees.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "#6c8db5", fontSize: 13 }}>
                                    Aucune note enregistrée
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── DashboardEleve ──────────────────────────────────────────────────────────

export default function DashboardEleve() {
    const [loggedOut, setLoggedOut] = useState(false);
    const [matiereMoyenne, setMatiereMoyenne] = useState([]);
    const [eleve, setEleve] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    const matricule = jwtDecode(token).profil.matricule;

    useEffect(() => {
        eleveService.getEleve(matricule)
            .then(res => { if (res.data) setEleve(res.data.eleveInformation); })
            .catch(() => {});
    }, []);

    useEffect(() => {
        eleveService.getMoyenneMat(matricule)
            .then(res => { if (res.data) setMatiereMoyenne(res.data.moyenne); })
            .catch(() => {});
    }, []);

    if (loggedOut) {
        return (
            <div style={{
                minHeight: "100vh", display: "flex",
                alignItems: "center", justifyContent: "center",
                background: "#f0f6ff",
            }}>
                <div style={{
                    textAlign: "center", padding: "2.5rem 3rem",
                    background: "#fff", borderRadius: 20,
                    border: "0.5px solid #dce8f9",
                }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>👋</div>
                    <h2 style={{ fontSize: 22, fontWeight: 600, color: "#0c2c5a", margin: "0 0 8px" }}>
                        À bientôt, {eleve?.eleve?.prenom} !
                    </h2>
                    <p style={{ color: "#6c8db5", fontSize: 14, marginBottom: 24 }}>
                        Vous avez été déconnecté avec succès.
                    </p>
                    <button
                        onClick={() => setLoggedOut(false)}
                        style={{
                            padding: "10px 28px", borderRadius: 10,
                            background: "#1e88e5", color: "#fff",
                            border: "none", fontWeight: 600, fontSize: 14,
                            cursor: "pointer",
                        }}
                    >
                        Se reconnecter
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <InjectStyles />
            <div style={{
                minHeight: "100vh",
                padding: "1.5rem",
                background: "#f0f6ff",
                fontFamily: "'DM Sans', system-ui, sans-serif",
                boxSizing: "border-box",
            }}>
                <div style={{ maxWidth: 1152, margin: "0 auto" }}>
                    <HeaderEleve eleve={eleve} onLogout={() => setLoggedOut(true)} />
                    <StatsCards matiereMoyenne={matiereMoyenne} eleve={eleve} />
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "1.25rem",
                        alignItems: "start",
                    }}>
                        <ResumeParMatiere matiereMoyenne={matiereMoyenne} />
                        <NotesRecentes />
                    </div>
                    <p style={{
                        textAlign: "center", color: "#93b4d4",
                        fontSize: 11, marginTop: "1.5rem",
                    }}>
                        Dashboard Élève © 2025 — {eleve?.eleve?.prenom} {eleve?.eleve?.nom} · {eleve?.classe?.libelle}
                    </p>
                </div>
            </div>
        </>
    );
}