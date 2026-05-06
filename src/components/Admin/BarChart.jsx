// function BarChart({ data, labelKey = "classe", valueKey = "moyenne", color = "#3b82f6", maxVal = 20 }) {
//     console.log(data)
//     if (!data?.length) return null;
//     const H = 180, PAD_L = 48, PAD_B = 36, PAD_T = 16, W_AVAIL = 100;
//     const barW = Math.min(36, Math.floor((W_AVAIL / data.length) * 0.6));
//     const gap  = Math.floor(W_AVAIL / data.length);
//     const totalW = PAD_L + data.length * gap + 20;
//     const yScale = v => H - PAD_B - (v / maxVal) * (H - PAD_B - PAD_T);

//     return (
//         <div className="overflow-x-auto">
//         <svg viewBox={`0 0 ${totalW} ${H}`} className="w-full" style={{ minWidth: Math.max(260, totalW), height: 180 }}>
//             {/* Y-axis */}
//             {[0, 5, 10, 15, 20].map(v => {
//             const y = yScale(v);
//             return (
//                 <g key={v}>
//                 <line x1={PAD_L} y1={y} x2={totalW - 10} y2={y} stroke="#f1f5f9" strokeWidth="1" />
//                 <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{v}</text>
//                 </g>
//             );
//             })}
//             {data.map((d, i) => {
//                 const x = PAD_L + i * gap + gap / 2 - barW / 2;
//                 const val = parseFloat(d[valueKey]);
//                 const y = yScale(val);
//                 const barH = H - PAD_B - y;
//                 const barColor = val >= 10 ? color : "#f87171";
//                 return (
//                     <g key={i}>
//                     <rect x={x} y={y} width={barW} height={barH} rx="4" fill={barColor} opacity="0.85" />
//                     <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="9" fontWeight="600" fill={barColor}>
//                         {val.toFixed(1)}
//                     </text>
//                     <text
//                         x={x + barW / 2} y={H - PAD_B + 14}
//                         textAnchor="middle" fontSize="9" fill="#64748b"
//                         transform={`rotate(-25, ${x + barW / 2}, ${H - PAD_B + 14})`}
//                     >
//                         {d[labelKey]}
//                     </text>
//                     </g>
//                 );
//             })}
//             {/* Axis line */}
//             <line x1={PAD_L} y1={H - PAD_B} x2={totalW - 10} y2={H - PAD_B} stroke="#e2e8f0" strokeWidth="1.5" />
//         </svg>
//         </div>
//     );
//     }
// export default BarChart
function BarChart({ data, labelKey = "classe", valueKey = "moyenne", color = "#3b82f6", maxVal = 20 }) {
    if (!data?.length) return null;

    const H       = 180;
    const PAD_L   = 48;
    const PAD_R   = 16;
    const PAD_B   = 36;
    const PAD_T   = 16;
    const BAR_W   = 28;          // largeur fixe de chaque barre
    const BAR_GAP = 20;          // espace fixe entre les barres
    const SLOT    = BAR_W + BAR_GAP; // largeur d'un slot complet

    const totalW  = PAD_L + data.length * SLOT - BAR_GAP + PAD_R;
    const yScale  = v => H - PAD_B - (v / maxVal) * (H - PAD_B - PAD_T);

    return (
        <div style={{ overflowX: "auto" }}>
            <svg
                viewBox={`0 0 ${totalW} ${H}`}
                style={{ minWidth: Math.max(260, totalW), height: 180, width: "100%" }}
            >
                {/* Grille Y */}
                {[0, 5, 10, 15, 20].map(v => {
                    const y = yScale(v);
                    return (
                        <g key={v}>
                            <line
                                x1={PAD_L} y1={y}
                                x2={totalW - PAD_R} y2={y}
                                stroke="#e8f1fb" strokeWidth="1"
                            />
                            <text x={PAD_L - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#93b4d4">
                                {v}
                            </text>
                        </g>
                    );
                })}

                {/* Barres */}
                {data.map((d, i) => {
                    // chaque barre commence à PAD_L + i * SLOT, centrée dans son slot
                    const x       = PAD_L + i * SLOT;
                    const val     = parseFloat(d[valueKey]);
                    const y       = yScale(val);
                    const barH    = H - PAD_B - y;
                    const barColor = val >= 10 ? color : "#e24b4a";
                    const cx      = x + BAR_W / 2;   // centre horizontal de la barre

                    return (
                        <g key={i}>
                            <rect
                                x={x} y={y}
                                width={BAR_W} height={barH}
                                rx="4" fill={barColor} opacity="0.85"
                            />
                            {/* valeur au-dessus */}
                            <text
                                x={cx} y={y - 4}
                                textAnchor="middle"
                                fontSize="9" fontWeight="600" fill={barColor}
                            >
                                {val.toFixed(1)}
                            </text>
                            {/* label en bas, légèrement incliné */}
                            <text
                                x={cx} y={H - PAD_B + 14}
                                textAnchor="middle"
                                fontSize="9" fill="#6c8db5"
                                transform={`rotate(-25, ${cx}, ${H - PAD_B + 14})`}
                            >
                                {d[labelKey]}
                            </text>
                        </g>
                    );
                })}

                {/* Axe X */}
                <line
                    x1={PAD_L} y1={H - PAD_B}
                    x2={totalW - PAD_R} y2={H - PAD_B}
                    stroke="#dce8f9" strokeWidth="1.5"
                />
            </svg>
        </div>
    );
}

export default BarChart;