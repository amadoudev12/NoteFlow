import { cls } from "../../utils/cls";
function ClasseRow({classe, nombre }) {
    return (
        <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0 group hover:bg-slate-50 -mx-2 px-2 rounded-lg transition">
        <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{classe}</p>
            {/* <p className="text-xs text-slate-400">{classe}</p> */}
            <div className="flex items-center gap-1.5 mt-1">
            {/* <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                <div className={cls("h-full rounded-full transition-all duration-700", barColor)} style={{ width: `${pct}%` }} />
            </div> */}
            </div>
        </div>
        <span className="text-sm font-bold shrink-0">{nombre}</span>
        </div>
    );
    }

export default ClasseRow