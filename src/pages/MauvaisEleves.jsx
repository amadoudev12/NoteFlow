import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import PageLoader from "../components/LoaderPage";

function StudentRow({ eleve, rank, isTop1 }) {
    const isGreen = eleve.moyenne >= 10;

    return (
        <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-150`}
        >
        {/* {rank < 3 ? (
            <span className="text-base w-6 text-center shrink-0">{MEDALS[rank]}</span>
        ) : (
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500 shrink-0">
            {rank + 1}
            </div>
        )} */}

        <span
            className={"text-sm flex-1 text-gray-800"}
        >
            {eleve.prenom} {eleve.nom}
        </span>

        <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
            isGreen
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
        >
            {eleve.moyenne.toFixed(2)}
        </span>
        </div>
    );
}

function ClassCard({ classData, delay }) {
    const [visible, setVisible] = useState(false);
    const top5 = classData.eleves

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
        className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-sm
            transition-all duration-300 hover:-translate-y-1 hover:shadow-md
            ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{ transition: "opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s ease" }}
        >
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-800">{classData.classe}</h2>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                Top élèves
            </span>
            </div>
            <span className="text-xs text-gray-400">
            {top5.length} élève{top5.length !== 1 ? "s" : ""}
            </span>
        </div>

        {top5.length === 0 ? (
            <div className="text-center text-sm text-gray-400 py-6">
            Aucun élève 
            </div>
        ) : (
            <div className="flex flex-col gap-1">
            {top5.map((eleve, i) => (
                <StudentRow
                    key={`${eleve.nom}-${eleve.prenom}-${i}`}
                    eleve={eleve}
                    rank={i}
                    isTop1={i === 0}
                />
            ))}
            </div>
        )}
        </div>
    );
}

export default function MauvaisEleves() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await adminService.mauvaisEleves()
                if (res.data) {
                    setData(res.data.resultat)
                }
            } catch(err) {
                console.log('erreur serveur')
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    if (loading) {
        return <div><PageLoader /></div>
    }

    if (data.length === 0) {
        return (
            <div className="ml-45 max-sm:ml-2 max-lg:ml-8 flex items-center justify-center py-20">
                <div className="text-center text-gray-400">
                    <p className="text-sm font-medium">Aucune classe disponible</p>
                </div>
            </div>
        )
    }

    return (
        <div className="ml-45 max-sm:ml-2 max-lg:ml-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {data.map((classData, i) => (
                    <ClassCard
                        key={classData.classe}
                        classData={classData}
                        delay={i * 80}
                    />
                ))}
            </div>
        </div>
    )
}