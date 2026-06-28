import { useRef, useState, useEffect } from "react";
function BarChart({ data, labelKey = "classe", valueKey = "moyenne", color = "#3b82f6", maxVal = 20 }) {
    const containerRef = useRef(null);
    const [containerW, setContainerW] = useState(600);

    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(([e]) => setContainerW(e.contentRect.width));
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    if (!data?.length) return null;

    const H       = 280;
    const PAD_L   = 48;
    const PAD_R   = 24;
    const PAD_B   = 70;
    const PAD_T   = 20;

    const totalW    = containerW;
    const drawW     = totalW - PAD_L - PAD_R;
    const SLOT      = drawW / data.length;
    const BAR_W     = Math.min(48, SLOT * 0.45);  // barre = 45% du slot, max 48px

    const yScale = v => H - PAD_B - (v / maxVal) * (H - PAD_B - PAD_T);

    return (
        <div ref={containerRef} style={{ width: "100%" }}>
            <svg viewBox={`0 0 ${totalW} ${H}`} style={{ width: "100%", height: H }}>

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
                            <text x={PAD_L - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#93b4d4">
                                {v}
                            </text>
                        </g>
                    );
                })}

                {/* Barres */}
                {data.map((d, i) => {
                    const slotStart = PAD_L + i * SLOT;
                    const cx        = slotStart + SLOT / 2;
                    const x         = cx - BAR_W / 2;
                    const val       = parseFloat(d[valueKey]);
                    const y         = yScale(val);
                    const barH      = H - PAD_B - y;
                    const barColor  = val >= 10 ? color : "#e24b4a";

                    return (
                        <g key={i}>
                            <rect
                                x={x} y={y}
                                width={BAR_W} height={barH}
                                rx="5" fill={barColor} opacity="0.88"
                            />
                            <text
                                x={cx} y={y - 6}
                                textAnchor="middle"
                                fontSize="10" fontWeight="600" fill={barColor}
                            >
                                {val.toFixed(1)}
                            </text>
                            <text
                                x={cx} 
                                y={H - PAD_B + 35}
                                textAnchor="middle"
                                fontSize="10" fill="#6c8db5"
                                transform={`rotate(-90, ${cx}, ${H - PAD_B + 35})`}
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

export default BarChart