import {
    Bell,
    Search,
    Menu,
    Calendar,
} from "lucide-react";
function Header({ setOpen }) {
    const date = new Date ()
    const toDay = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
    return (
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-8 py-3 flex items-center gap-4">
        <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500"
        >
            <Menu size={20} />
        </button>

        {/* Search */}
        {/* <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
            type="text"
            placeholder="Rechercher un élève, une classe…"
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
            />
        </div> */}

        <div className="ml-auto flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition">
            {/* <Bell size={20} /> */}
            {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" /> */}
            </button>

            {/* Date */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium">
            <Calendar size={15} />
                {toDay}
            </div>

            {/* Avatar */}
            {/* <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=teacher42&backgroundColor=b6e3f4"
            alt="avatar"
            className="w-9 h-9 rounded-xl object-cover border-2 border-blue-200 cursor-pointer hover:border-blue-400 transition"
            /> */}
        </div>
        </header>
    );
}

export default Header