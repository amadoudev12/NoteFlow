import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
// ── Icons ────────────────────────────────────────────────────────
const Icon = ({ d, size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"
    strokeLinejoin="round" className={className}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

export const icons = {
  logo:      "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  bulletin:  ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"],
  chart:     ["M18 20V10","M12 20V4","M6 20v-6"],
  users:     ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M23 21v-2a4 4 0 00-3-3.87","M9 7a4 4 0 100 8 4 4 0 000-8z","M16 3.13a4 4 0 010 7.75"],
  edit:      ["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7","M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"],
  eye:       ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 100 6 3 3 0 000-6z"],
  shield:    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  clock:     ["M12 22a10 10 0 100-20 10 10 0 000 20z","M12 6v6l4 2"],
  database:  ["M12 2C6.48 2 2 4.02 2 6.5S6.48 11 12 11s10-2.02 10-4.5S17.52 2 12 2z","M2 6.5v5C2 13.98 6.48 16 12 16s10-2.02 10-4.5v-5","M2 11.5v5C2 18.98 6.48 21 12 21s10-2.02 10-4.5v-5"],
  check:     "M20 6L9 17l-5-5",
  arrow:     "M5 12h14M12 5l7 7-7 7",
  star:      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  building:  ["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"],
  menu:      "M3 12h18M3 6h18M3 18h18",
  close:     "M18 6L6 18M6 6l12 12",
  zap:       "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  sparkle:   ["M12 3v1m0 16v1M4.22 4.22l.7.7m12.17 12.17l.7.7M3 12h1m16 0h1M4.92 19.08l.7-.7m12.17-12.17l.7-.7","M12 8a4 4 0 100 8 4 4 0 000-8z"],
};

// ── Navbar ───────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-blue-50' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="h-9 w-9 rounded-xl bg-linear-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md shadow-blue-200">
            <Icon d={icons.logo} size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">NoteFlow</span>
        </div>

        {/* Desktop buttons */}
        {/* <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200"
          >
            Se connecter
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200 hover:shadow-blue-300 transition-all duration-200 hover:-translate-y-0.5"
          >
            Créer un compte établissement
          </button>
        </div> */}

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon d={menuOpen ? icons.close : icons.menu} size={22} className="text-gray-700" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-3">
          {/* <button onClick={() => { navigate('/login'); setMenuOpen(false); }}
            className="w-full py-3 text-sm font-medium text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Se connecter
          </button>
          <button onClick={() => { navigate('/register'); setMenuOpen(false); }}
            className="w-full py-3 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">
            Créer un compte établissement
          </button> */}
        </div>
      )}
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────
function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-blue-50/40 to-indigo-50/60" />
      <div className="absolute top-20 right-0 w-150 h-150 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#1e40af 1px, transparent 1px), linear-gradient(to right, #1e40af 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-sm font-medium">
            <Icon d={icons.sparkle} size={14} className="text-blue-500" />
            Plateforme de gestion scolaire
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
            Simplifiez la gestion des{' '}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">notes</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M0 6 Q50 0 100 4 Q150 8 200 2" stroke="url(#u)" strokeWidth="2.5" strokeLinecap="round"/>
                <defs><linearGradient id="u" x1="0" y1="0" x2="1" y2="0">
                  <stop stopColor="#2563eb"/><stop offset="1" stopColor="#6366f1"/>
                </linearGradient></defs>
              </svg>
            </span>{' '}
            dans votre établissement
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
            Générez des bulletins, suivez les performances et donnez accès aux notes
            en temps réel à vos enseignants et élèves.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* <button
              onClick={() => navigate('/register')}
              className="group px-7 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Créer un compte établissement
              <Icon d={icons.arrow} size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:border-gray-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              Se connecter
            </button> */}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 pt-2">
            {[['500+', 'Établissements'], ['50k+', 'Élèves'], ['99.9%', 'Disponibilité']].map(([v, l]) => (
              <div key={l}>
                <p className="text-2xl font-bold text-gray-900">{v}</p>
                <p className="text-xs text-gray-500 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Dashboard mockup */}
        <div className="relative hidden lg:block">
          <div className="absolute -inset-4 bg-linear-to-br from-blue-100 to-indigo-100 rounded-3xl blur-2xl opacity-60" />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Window bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 bg-gray-50 border-b border-gray-100">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 h-6 bg-white rounded-md border border-gray-200 flex items-center px-3">
                <span className="text-[11px] text-gray-400">app.noteflow.ci/dashboard</span>
              </div>
            </div>
            {/* Dashboard preview */}
            <div className="p-6 bg-slate-50">
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[['142', 'Élèves', 'blue'], ['12', 'Classes', 'indigo'], ['8', 'Matières', 'violet']].map(([n, l, c]) => (
                  <div key={l} className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
                    <p className={`text-2xl font-bold text-${c}-600`}>{n}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
              {/* Table preview */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Notes récentes</span>
                  <span className="text-xs text-blue-600 font-medium">Voir tout</span>
                </div>
                {[['Diallo Aminata', 'Maths', '16/20', 'bg-green-100 text-green-700'],
                  ['Koné Ibrahim', 'Français', '13/20', 'bg-blue-100 text-blue-700'],
                  ['Touré Fatou', 'Physique', '11/20', 'bg-yellow-100 text-yellow-700'],
                  ['Bamba Seydou', 'Histoire', '17/20', 'bg-green-100 text-green-700']].map(([n, m, g, cls]) => (
                  <div key={n} className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-600">
                        {n.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-800">{n}</p>
                        <p className="text-[10px] text-gray-400">{m}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{g}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Features ─────────────────────────────────────────────────────
function Features() {
  const features = [
    { icon: icons.bulletin, title: 'Bulletins automatiques', desc: 'Générez les bulletins de notes de chaque élève en un clic, prêts à imprimer ou partager.', color: 'blue' },
    { icon: icons.chart, title: 'Fiches de notes', desc: 'Consultez les notes par classe, par matière ou par élève avec une vue claire et structurée.', color: 'indigo' },
    { icon: icons.star, title: 'Rapports annuels', desc: 'Suivez les performances sur toute l\'année scolaire et identifiez les élèves en difficulté.', color: 'violet' },
    { icon: icons.edit, title: 'Saisie par les enseignants', desc: 'Chaque enseignant saisit les notes de sa matière directement depuis son compte sécurisé.', color: 'blue' },
    { icon: icons.eye, title: 'Consultation en temps réel', desc: 'Les élèves accèdent à leurs notes et moyennes instantanément depuis n\'importe quel appareil.', color: 'indigo' },
    { icon: icons.shield, title: 'Accès sécurisé', desc: 'Chaque utilisateur dispose de son espace avec des droits adaptés à son rôle.', color: 'violet' },
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100', hover: 'hover:border-blue-200 hover:shadow-blue-100' },
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100', hover: 'hover:border-indigo-200 hover:shadow-indigo-100' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-600', border: 'border-violet-100', hover: 'hover:border-violet-200 hover:shadow-violet-100' },
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100 mb-4">Fonctionnalités</span>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Tout ce dont votre établissement a besoin</h2>
          <p className="text-gray-500 text-lg">Une plateforme complète pour digitaliser la gestion des notes, de la saisie à la publication.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc, color }) => {
            const c = colorMap[color];
            return (
              <div key={title} className={`group p-6 bg-white rounded-2xl border ${c.border} ${c.hover} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                <div className={`h-11 w-11 ${c.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon d={icon} size={20} className={c.icon} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── How it works ─────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: '01', title: "L'établissement crée un compte", desc: "Inscription rapide en quelques minutes. Renseignez les informations de votre établissement." },
    { n: '02', title: "Configuration de l'espace", desc: "Ajoutez vos classes, matières et organisez votre structure scolaire simplement." },
    { n: '03', title: "Ajout des utilisateurs", desc: "Invitez vos enseignants et inscrivez vos élèves. Chaque profil est créé automatiquement." },
    { n: '04', title: "Accès personnalisé", desc: "Chaque utilisateur reçoit ses identifiants et accède à son espace dédié." },
    { n: '05', title: "Notes centralisées", desc: "Les notes sont saisies, centralisées et accessibles en temps réel par tous les acteurs." },
  ];

  return (
    <section className="py-24 bg-linear-to-br from-slate-50 to-blue-50/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100 mb-4">Comment ça marche</span>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Démarrez en 5 étapes simples</h2>
          <p className="text-gray-500 text-lg">Votre établissement est opérationnel en moins d'une heure.</p>
        </div>
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-linear-to-r from-blue-200 via-indigo-200 to-blue-200" />
          <div className="grid lg:grid-cols-5 gap-8">
            {steps.map(({ n, title, desc }, i) => (
              <div key={n} className="relative flex flex-col items-center text-center group">
                <div className="relative z-10 h-20 w-20 bg-white rounded-2xl border-2 border-blue-100 group-hover:border-blue-400 shadow-md flex flex-col items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-100 group-hover:-translate-y-1">
                  <span className="text-xs font-bold text-blue-400">{n}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-snug">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Roles ────────────────────────────────────────────────────────
function Roles() {
  const roles = [
    {
      icon: icons.building,
      role: 'Administrateur',
      sub: 'Établissement',
      color: 'blue',
      features: ['Gestion globale de la plateforme', 'Création des classes et matières', 'Ajout des enseignants et élèves', 'Génération des bulletins', 'Rapports et statistiques annuels'],
    },
    {
      icon: icons.edit,
      role: 'Enseignant',
      sub: 'Corps pédagogique',
      color: 'indigo',
      features: ['Saisie des notes par matière', 'Vue par classe et par élève', 'Suivi des performances', 'Modification des notes', 'Historique des évaluations'],
      highlight: true,
    },
    {
      icon: icons.eye,
      role: 'Élève',
      sub: 'Apprenant',
      color: 'violet',
      features: ['Consultation des notes', 'Visualisation des moyennes', 'Accès aux bulletins', 'Suivi en temps réel', 'Historique scolaire'],
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100 mb-4">Rôles utilisateurs</span>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Une plateforme pour chaque acteur</h2>
          <p className="text-gray-500 text-lg">Chaque utilisateur dispose d'un espace adapté à ses besoins et responsabilités.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map(({ icon, role, sub, color, features, highlight }) => {
            const colors = {
              blue: { bg: 'from-blue-600 to-blue-500', light: 'bg-blue-50', text: 'text-blue-600', check: 'text-blue-500', border: 'border-blue-200' },
              indigo: { bg: 'from-indigo-600 to-blue-600', light: 'bg-indigo-50', text: 'text-indigo-600', check: 'text-indigo-500', border: 'border-indigo-200' },
              violet: { bg: 'from-violet-600 to-indigo-600', light: 'bg-violet-50', text: 'text-violet-600', check: 'text-violet-500', border: 'border-violet-200' },
            }[color];
            return (
              <div key={role} className={`rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${highlight ? `${colors.border} border-2 shadow-lg` : 'border-gray-100 shadow-sm'}`}>
                {highlight && (
                  <div className={`py-2 text-center text-xs font-semibold text-white bg-linear-to-r ${colors.bg}`}>
                    ⭐ Rôle principal
                  </div>
                )}
                <div className="p-7">
                  <div className={`h-13 w-13 h-12 w-12 ${colors.light} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon d={icon} size={22} className={colors.text} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{role}</h3>
                  <p className={`text-sm font-medium ${colors.text} mb-5`}>{sub}</p>
                  <ul className="space-y-3">
                    {features.map(f => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Icon d={icons.check} size={16} className={`${colors.check} mt-0.5 shrink-0`} />
                        <span className="text-sm text-gray-600">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Advantages ───────────────────────────────────────────────────
function Advantages() {
  const items = [
    { icon: icons.clock, title: 'Gain de temps', desc: 'Fini les bulletins manuels. Automatisez les tâches répétitives et concentrez-vous sur l\'essentiel.', color: 'bg-blue-500' },
    { icon: icons.database, title: 'Centralisation', desc: 'Toutes les notes, bulletins et rapports au même endroit, accessibles depuis n\'importe quel appareil.', color: 'bg-indigo-500' },
    { icon: icons.shield, title: 'Accès sécurisé', desc: 'Chaque rôle a ses droits. Les données sont protégées et accessibles uniquement aux personnes autorisées.', color: 'bg-violet-500' },
    { icon: icons.zap, title: 'Interface moderne', desc: 'Une expérience intuitive et agréable pour les administrateurs, enseignants et élèves.', color: 'bg-blue-600' },
  ];

  return (
    <section className="py-24 bg-linear-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-900/30 rounded-full blur-3xl" />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-blue-100 text-sm font-medium rounded-full border border-white/20 mb-4">Avantages</span>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-4">Pourquoi choisir NoteFlow ?</h2>
          <p className="text-blue-200 text-lg">Des bénéfices concrets pour chaque établissement scolaire.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ icon, title, desc, color }) => (
            <div key={title} className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
              <div className={`h-11 w-11 ${color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon d={icon} size={20} className="text-white" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-blue-200 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Preview ──────────────────────────────────────────────────────
function Preview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100 mb-4">Aperçu</span>
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Une interface pensée pour vous</h2>
          <p className="text-gray-500 text-lg">Tableau de bord clair, données accessibles, navigation intuitive.</p>
        </div>

        {/* Full dashboard mockup */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-linear-to-br from-blue-100 via-indigo-50 to-violet-100 rounded-3xl blur-2xl opacity-70 group-hover:opacity-90 transition-opacity" />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon d={icons.logo} size={16} className="text-white" />
                </div>
                <span className="text-white font-semibold">NoteFlow</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-white/20 rounded-full" />
                <div className="hidden sm:block">
                  <p className="text-xs text-white font-medium">Lycée Classique</p>
                  <p className="text-[10px] text-blue-200">Administrateur</p>
                </div>
              </div>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <div className="hidden md:flex flex-col w-52 bg-slate-50 border-r border-gray-100 p-4 gap-1">
                {[['Tableau de bord', icons.chart, true], ['Élèves', icons.users, false], ['Notes', icons.bulletin, false], ['Rapports', icons.star, false]].map(([label, icon, active]) => (
                  <div key={label} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-colors ${active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <Icon d={icon} size={16} />
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 bg-slate-50/50">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[['142', 'Élèves', 'text-blue-600', 'bg-blue-50'], ['18', 'Enseignants', 'text-indigo-600', 'bg-indigo-50'], ['12', 'Classes', 'text-violet-600', 'bg-violet-50'], ['14.2', 'Moy. générale', 'text-green-600', 'bg-green-50']].map(([v, l, tc, bg]) => (
                    <div key={l} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <p className={`text-2xl font-bold ${tc}`}>{v}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Dernières notes saisies</p>
                    {[['Koné A.', 'Maths — 3e A', '18/20', 'bg-green-100 text-green-700'],
                      ['Diallo F.', 'Français — 4e B', '14/20', 'bg-blue-100 text-blue-700'],
                      ['Touré M.', 'SVT — 3e A', '11/20', 'bg-yellow-100 text-yellow-700'],
                      ['Bamba S.', 'Histoire — 4e C', '16/20', 'bg-green-100 text-green-700'],
                    ].map(([n, c, g, cls]) => (
                      <div key={n} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">{n[0]}</div>
                          <div><p className="text-xs font-medium text-gray-800">{n}</p><p className="text-[10px] text-gray-400">{c}</p></div>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${cls}`}>{g}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Top matières</p>
                    {[['Mathématiques', 85], ['Français', 72], ['Sciences', 68], ['Histoire', 60]].map(([m, p]) => (
                      <div key={m} className="mb-3">
                        <div className="flex justify-between mb-1"><span className="text-xs text-gray-600">{m}</span><span className="text-xs font-semibold text-gray-700">{p}%</span></div>
                        <div className="h-1.5 bg-gray-100 rounded-full"><div className="h-1.5 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${p}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CTA ──────────────────────────────────────────────────────────
function CTA() {
  const navigate = useNavigate();
  return (
    <section className="py-24 bg-linear-to-br from-slate-50 to-blue-50/50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-200 mb-6">
              <Icon d={icons.zap} size={28} className="text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
              Passez à une gestion moderne et efficace des notes
            </h2>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              Rejoignez les établissements qui font confiance à NoteFlow pour simplifier leur gestion scolaire.
            </p>
            {/* <button
              onClick={() => navigate('/register')}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-2xl shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300 transition-all duration-300 hover:-translate-y-1"
            >
              Créer mon établissement
              <Icon d={icons.arrow} size={20} className="group-hover:translate-x-1 transition-transform" />
            </button> */}
            <p className="mt-4 text-sm text-gray-400">Gratuit pour commencer · Aucune carte bancaire requise</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────
function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-linear-to-br from-blue-500 to-blue-400 flex items-center justify-center">
              <Icon d={icons.logo} size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">NoteFlow</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            {/* <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Se connecter</button>
            <button onClick={() => navigate('/register')} className="hover:text-white transition-colors">Créer un compt</button> */}
          </div>
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} NoteFlow. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
// ── Main export ──────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
      useEffect(()=>{
          const token = localStorage.getItem('token')
          if(token){
              const decodedToken = jwtDecode(token)
              if(decodedToken.user.role === "ENSEIGNANT"){
                  navigate('/dashboard/enseignant')
              }else if (decodedToken.user.role === "ELEVE"){
                  navigate('/dashboard/eleve')
              }else{
                navigate('/dashboard/admin')
              }
          }else{
              return
          }
      },[])
  return (
    <div className="font-sans antialiased">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Roles />
      <Advantages />
      <Preview />
      <CTA />
      <Footer />
    </div>
  );
}