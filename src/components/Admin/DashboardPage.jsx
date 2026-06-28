import Skeleton from "./skeleton";
import SectionHeader from "./SectionHeader";
import {
  LayoutDashboard, Users, TrendingUp, Award, AlertCircle,
  ChevronRight, Bell, Search, GraduationCap, BookOpen,
  Star, AlertTriangle, BarChart3, PieChart,Activity
} from "lucide-react";
import StatCard from "./StatCard";
import LineSparkChart from "./miniLineChart";
import BarChart from "./BarChart";
import DonutChart from "./DonutChart";
import ClasseRow from "./ClasseRow";
function DashboardPage({ stat, chartData, loading }) {
    const moyVal = stat?.moyenneEtablissement?.moyenneEtablissement;
    const moyColor = (moyVal ?? 0) >= 10 ? "success" : "danger";
    return (
        <div className="space-y-8">

        {/* ── Stat Cards ── */}
        <section>
            {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
            </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard title="Total élèves"  value={stat?.nombreEleves}       subtitle="Inscrits cette année"                             icon={Users}       color="blue"     delay={0}   />
                <StatCard title="Classes"        value={stat?.nombreClasses}                                                                   icon={BookOpen}    color="emerald"  delay={100} />
                <StatCard title="Enseignants"    value={stat?.nombreEnseignants}  subtitle="Corps enseignant"                                 icon={GraduationCap} color="amber"  delay={200} />
                <StatCard title="Moyenne générale" value={moyVal}                 subtitle={stat?.moyenneEtablissement?.trimestre}            icon={Award}       color={moyColor} delay={300} decimals={1} />
            </div>
            )}
        </section>

        {/* ── Evolution + Répartition ── */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <SectionHeader icon={Activity} title="Évolution de la moyenne générale" subtitle="Par trimestre" color="blue" />
                {loading ? <Skeleton className="h-44" /> : <LineSparkChart  data={chartData.courbeData?.courbeData} />}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <SectionHeader icon={PieChart} title="Répartition des notes" subtitle="Tous trimestres" color="rose" />
            {loading ? <Skeleton className="h-44" /> : <DonutChart count={stat?.nombreEleves} data={chartData.repartition?.repartition} />}
            </div>
        </section>

        {/* ── Moyennes par classe & matière ── */}
        <section >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <SectionHeader icon={BarChart3} title="Moyenne par classe" color="emerald" />
            {loading ? <Skeleton className="h-44" /> : <BarChart data={chartData.moyenneClasses?.moyenneClasses} labelKey="classe" valueKey="moyenne" color="#10b981" />}
            </div>
            {/* <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <SectionHeader icon={BarChart3} title="Moyenne par matière" color="amber" />
                {loading ? <Skeleton className="h-44" /> : <BarChart  data={chartData.moyenneMatieres?.moyenneMatieres} labelKey="matiere" valueKey="moyenne" color="#f59e0b" />}
            </div> */}
        </section>

        {/* ── Classements ── */}
        {/* <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <SectionHeader icon={Star} title="Top 5 meilleurs élèves" subtitle="Ce trimestre" color="amber" />
                {loading
                    ? [...Array(5) || []].map((_, i) => <Skeleton key={i} className="h-12 mb-2" />)
                    : chartData.elevesForts?.result?.map((e, i) => <ClasseRow key={i} rank={i+1} {...e} isTop={true} />)
                }
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <SectionHeader icon={AlertTriangle} title="Élèves en difficulté" subtitle="Suivi prioritaire" color="rose" />
            {loading
                ? [...Array(5) || [] ].map((_, i) => <Skeleton key={i} className="h-12 mb-2" />)
                : chartData.elevesFaibles?.result?.map((e, i) => <ClasseRow key={i} classe={e.classe} nombre={e.nombre} isTop={false} />)
            }
            </div>
        </section> */}
        </div>
    );
}

export default DashboardPage