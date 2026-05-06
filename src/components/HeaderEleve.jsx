import { useNavigate } from "react-router-dom"
import { useState } from "react"
import eleveService from "../../services/eleveService"
function HeaderEleve({ eleve, onLogout }) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const logOut = () => {
        localStorage.removeItem('token')
        onLogout()
    }

    const telechargerbulletin = async () => {
        setLoading(true)
        try {
            const matricule = eleve.matricule_eleve
            const classe = eleve.classe.libelle
            const res = await eleveService.getEleveBulletin({ matricule, classe })
            const signedUrl = res.data?.url ?? res.data
            if (!signedUrl) throw new Error("URL manquante")
            const link = document.createElement('a')
            link.href = signedUrl
            link.setAttribute('target', '_blank')
            link.setAttribute('download', `bulletin_${matricule}.pdf`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (err) {
            console.log(err)
            navigate('/500')
        } finally {
            setLoading(false)
        }
    }

    const initiales = `${eleve?.eleve.prenom?.[0] ?? ''}${eleve?.eleve.nom?.[0] ?? ''}`.toUpperCase()

    return (
        <header style={{
            background: "#fff",
            border: "0.5px solid #dce8f9",
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: "1.25rem"
        }}>
            <div style={{ height: 3, background: "linear-gradient(90deg, #1565c0, #1e88e5, #64b5f6)" }} />

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "1.1rem 1.5rem" }}>

                {/* Infos élève */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: "50%",
                        background: "#e6f1fb", color: "#185fa5",
                        fontWeight: 600, fontSize: 15,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1.5px solid #b5d4f4", flexShrink: 0
                    }}>
                        {initiales}
                    </div>
                    <div>
                        <p style={{ fontSize: 10, color: "#5f82b0", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 2px" }}>
                            Tableau de bord élève
                        </p>
                        <h1 style={{ fontSize: 18, fontWeight: 600, color: "#0c2c5a", margin: 0, lineHeight: 1.2 }}>
                            {eleve?.eleve?.prenom}{" "}
                            <span style={{ color: "#1e88e5" }}>{eleve?.eleve?.nom}</span>
                        </h1>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, fontSize: 12, color: "#6c8db5" }}>
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                            </svg>
                            {eleve?.classe?.libelle}
                            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#b5d4f4", display: "inline-block" }} />
                            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {eleve?.matricule_eleve}
                        </div>
                    </div>
                </div>

                {/* Boutons */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={telechargerbulletin} style={{
                        display: "flex", alignItems: "center", gap: 7,
                        padding: "9px 16px", borderRadius: 10,
                        fontSize: 13, fontWeight: 500, cursor: "pointer",
                        background: "#e6f1fb", color: "#185fa5",
                        border: "0.5px solid #85b7eb", transition: "all 0.15s"
                    }}>
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {loading ? "En cours..." : "Imprimer bulletin"}
                    </button>

                    <button onClick={logOut} style={{
                        display: "flex", alignItems: "center", gap: 7,
                        padding: "9px 16px", borderRadius: 10,
                        fontSize: 13, fontWeight: 500, cursor: "pointer",
                        background: "#fcebeb", color: "#791f1f",
                        border: "0.5px solid #f09595", transition: "all 0.15s"
                    }}>
                        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Déconnexion
                    </button>
                </div>
            </div>
        </header>
    )
}

export default HeaderEleve