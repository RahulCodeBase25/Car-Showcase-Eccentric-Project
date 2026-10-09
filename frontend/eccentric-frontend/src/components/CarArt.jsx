import { useId } from "react";
import { motion } from "framer-motion";

// Side-view drawings of the three cars, built from SVG paths so the paint
// colour and wheels can change live (a photo can't be repainted).
// The car faces left. viewBox is 1000 x 380; the ground is at y = 330.

const GROUND = 330;

// Wheel-arch cut-out: from the sill on the right side of the wheel, up and
// over the wheel, back down to the sill on the left side.
function arch(cx, cy, r, sillY) {
  const dx = Math.sqrt(r * r - (sillY - cy) ** 2);
  return `L ${cx + dx} ${sillY} A ${r} ${r} 0 1 0 ${cx - dx} ${sillY}`;
}

const BODIES = {
  hatch: {
    wheels: [262, 742],
    tire: 62,
    sill: 304,
    shell: (a) => `
      M 122 298 C 104 296 98 280 100 262 L 106 238 C 110 220 126 210 150 207
      C 220 196 280 188 332 184 C 382 148 424 122 476 113 L 640 107 C 702 108 748 124 794 162
      L 846 198 C 860 204 868 216 868 234 L 866 288 C 864 300 856 304 842 304
      ${a(742)} ${a(262)} L 142 304 C 132 304 124 302 122 298 Z`,
    glass: `M 356 191 C 400 158 434 134 480 126 L 636 121 C 690 122 730 138 772 172 L 780 180 Z`,
    pillars: [`M 556 121 L 574 121 L 580 186 L 560 187 Z`, `M 744 152 L 760 158 L 768 180 L 752 181 Z`],
    doors: [`M 470 192 C 474 230 476 270 474 300`, `M 664 186 C 660 230 656 266 650 300`],
    handles: [[500, 208], [684, 204]],
    head: `M 108 234 C 128 220 160 213 192 211 L 188 221 C 162 225 136 231 112 242 Z`,
    tail: `M 836 202 L 866 214 L 867 232 L 830 220 Z`,
    shoulder: `M 152 228 C 400 214 640 204 860 222`,
    mirror: `M 372 186 C 380 172 404 170 410 178 L 404 192 Z`,
  },
  suv: {
    wheels: [252, 758],
    tire: 68,
    sill: 296,
    shell: (a) => `
      M 112 288 C 96 286 90 268 92 248 L 96 212 C 98 196 112 188 134 186
      L 334 168 C 372 130 404 100 452 90 L 762 82 C 802 82 832 88 858 102
      L 884 152 C 892 170 896 188 896 212 L 894 280 C 892 292 884 296 870 296
      ${a(758)} ${a(252)} L 132 296 C 122 296 114 294 112 288 Z`,
    glass: `M 360 172 C 394 138 418 110 458 100 L 758 94 C 792 94 816 100 836 112 L 858 160 Z`,
    pillars: [`M 566 98 L 584 98 L 590 166 L 570 167 Z`, `M 728 95 L 746 95 L 758 162 L 740 163 Z`],
    doors: [`M 476 172 C 480 220 482 262 480 292`, `M 676 166 C 674 214 670 254 664 292`],
    handles: [[506, 188], [698, 184]],
    head: `M 96 214 C 122 200 160 194 200 193 L 196 205 C 164 208 130 214 98 226 Z`,
    tail: `M 870 158 L 888 164 L 892 204 L 872 200 Z`,
    shoulder: `M 136 206 C 400 192 660 184 884 200`,
    mirror: `M 378 168 C 386 152 412 150 418 160 L 410 174 Z`,
    rails: `M 470 84 L 790 78`,
    cladding: true,
  },
  coupe: {
    wheels: [272, 748],
    tire: 58,
    sill: 306,
    shell: (a) => `
      M 104 298 C 88 296 84 282 88 268 L 96 250 C 104 238 118 233 140 231
      C 196 224 226 200 278 198 C 320 198 346 202 370 204 C 426 170 474 148 534 141 L 600 139 C 686 142 766 170 842 206
      L 884 218 C 896 222 902 232 902 246 L 898 292 C 896 302 888 306 874 306
      ${a(748)} ${a(272)} L 126 306 C 116 306 108 304 104 298 Z`,
    glass: `M 390 209 C 436 178 478 157 534 151 L 598 149 C 656 152 706 168 752 194 Z`,
    pillars: [`M 628 151 L 644 152 L 662 198 L 644 200 Z`],
    doors: [`M 480 206 C 484 240 486 274 484 302`],
    handles: [[516, 222]],
    head: `M 94 252 C 120 240 156 234 196 233 L 192 243 C 160 246 128 252 96 262 Z`,
    tail: `M 846 210 L 900 226 L 900 240 L 840 222 Z`,
    shoulder: `M 150 246 C 420 230 660 216 896 236`,
    mirror: `M 404 206 C 412 192 436 190 442 198 L 436 212 Z`,
    intake: `M 600 262 C 626 256 652 255 676 258 L 672 264 C 648 262 624 264 602 268 Z`,
    spoiler: `M 846 204 L 896 214 L 892 222 L 842 212 Z`,
  },
};

export function Wheel({ cx, r, style, finish, spinning, cy: cyIn }) {
  const cy = cyIn ?? GROUND - r;
  const rim = r * 0.68;
  const spokes = style === "sport" ? 5 : style === "turbine" ? 12 : 5;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#0d0e10" />
      <circle cx={cx} cy={cy} r={r - 5} fill="none" stroke="#24262a" strokeWidth="2" />
      <motion.g
        style={{ originX: `${cx}px`, originY: `${cy}px` }}
        animate={{ rotate: spinning ? -720 : 0 }}
        transition={spinning ? { duration: 1.6, ease: [0.2, 0.7, 0.3, 1] } : { duration: 0 }}
      >
        {style === "aero" && (
          <>
            <circle cx={cx} cy={cy} r={rim} fill={finish} style={{ transition: "fill .5s" }} />
            <circle cx={cx} cy={cy} r={rim} fill="#000" opacity=".12" />
            <circle cx={cx - rim * 0.25} cy={cy - rim * 0.3} r={rim * 0.5} fill="#fff" opacity=".18" />
            {Array.from({ length: spokes }, (_, i) => (
              <ellipse key={i} cx={cx} cy={cy - rim * 0.62} rx={rim * 0.12} ry={rim * 0.22} fill="#121316" transform={`rotate(${(360 / spokes) * i} ${cx} ${cy})`} />
            ))}
          </>
        )}
        {style === "sport" && (
          <>
            <circle cx={cx} cy={cy} r={rim} fill="#060708" />
            {Array.from({ length: spokes }, (_, i) => (
              <path
                key={i}
                d={`M ${cx - rim * 0.1} ${cy} L ${cx - rim * 0.2} ${cy - rim * 0.95} L ${cx + rim * 0.2} ${cy - rim * 0.95} L ${cx + rim * 0.1} ${cy} Z`}
                fill={finish}
                stroke="#fff"
                strokeOpacity=".22"
                strokeWidth="1.2"
                transform={`rotate(${(360 / spokes) * i} ${cx} ${cy})`}
                style={{ transition: "fill .5s" }}
              />
            ))}
            <circle cx={cx} cy={cy} r={rim} fill="none" stroke={finish} strokeWidth={rim * 0.1} style={{ transition: "stroke .5s" }} />
          </>
        )}
        {style === "turbine" && (
          <>
            <circle cx={cx} cy={cy} r={rim} fill="#141518" />
            {Array.from({ length: spokes }, (_, i) => (
              <path
                key={i}
                d={`M ${cx} ${cy - rim * 0.2} Q ${cx + rim * 0.45} ${cy - rim * 0.55} ${cx + rim * 0.12} ${cy - rim * 0.98} L ${cx - rim * 0.06} ${cy - rim * 0.98} Q ${cx + rim * 0.25} ${cy - rim * 0.55} ${cx - rim * 0.08} ${cy - rim * 0.2} Z`}
                fill={finish}
                transform={`rotate(${(360 / spokes) * i} ${cx} ${cy})`}
                style={{ transition: "fill .5s" }}
              />
            ))}
            <circle cx={cx} cy={cy} r={rim} fill="none" stroke={finish} strokeWidth={rim * 0.07} style={{ transition: "stroke .5s" }} />
          </>
        )}
        <circle cx={cx} cy={cy} r={rim * 0.2} fill="#2a2c30" />
        <circle cx={cx} cy={cy} r={rim * 0.08} fill="#8b9097" />
      </motion.g>
    </g>
  );
}

export default function CarArt({ body = "hatch", paint = "#c21f2e", wheel = { style: "aero", finish: "#c9ced4" }, spinning = false, className = "", title }) {
  const b = BODIES[body] || BODIES.hatch;
  const uid = useId().replace(/:/g, "");
  const id = (n) => `${n}-${uid}`;
  const a = (cx) => arch(cx, GROUND - b.tire, b.tire + 8, b.sill);
  const shell = b.shell(a);

  return (
    <svg viewBox="0 0 1000 380" className={className} role="img" aria-label={title || `${body} in the selected colour`}>
      <defs>
        <linearGradient id={id("shade")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".38" />
          <stop offset=".3" stopColor="#fff" stopOpacity=".06" />
          <stop offset=".55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".42" />
        </linearGradient>
        <linearGradient id={id("sheen")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".45" stopColor="#fff" stopOpacity=".16" />
          <stop offset=".6" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c3644" />
          <stop offset="1" stopColor="#0e1218" />
        </linearGradient>
        <radialGradient id={id("shadow")} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#000" stopOpacity=".55" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <clipPath id={id("clip")}>
          <path d={shell} />
        </clipPath>
      </defs>

      {/* ground shadow */}
      <ellipse cx="500" cy={GROUND + 4} rx="440" ry="22" fill={`url(#${id("shadow")})`} />

      {/* body */}
      <path d={shell} fill={paint} style={{ transition: "fill .6s ease" }} />
      <g clipPath={`url(#${id("clip")})`}>
        <path d={shell} fill={`url(#${id("shade")})`} />
        <rect x="0" y="0" width="1000" height="380" fill={`url(#${id("sheen")})`} />
        {b.cladding && (
          <>
            <rect x="0" y={b.sill - 22} width="1000" height="30" fill="#17191c" opacity=".9" />
            {b.wheels.map((cx) => (
              <circle key={cx} cx={cx} cy={GROUND - b.tire} r={b.tire + 17} fill="none" stroke="#17191c" strokeWidth="16" />
            ))}
          </>
        )}
        {!b.cladding && <rect x="0" y={b.sill - 10} width="1000" height="14" fill="#000" opacity=".22" />}
        <path d={b.shoulder} fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="2" />
        {b.doors.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#000" strokeOpacity=".28" strokeWidth="1.6" />
        ))}
        {b.intake && <path d={b.intake} fill="#0f1012" opacity=".55" />}
      </g>

      {/* glass */}
      <path d={b.glass} fill={`url(#${id("glass")})`} />
      <path d={b.glass} fill={`url(#${id("sheen")})`} opacity=".9" />
      {b.pillars.map((d, i) => (
        <path key={i} d={d} fill="#0a0c0f" />
      ))}
      {b.rails && <path d={b.rails} stroke="#1b1d21" strokeWidth="5" strokeLinecap="round" />}
      {b.spoiler && <path d={b.spoiler} fill="#0f1012" />}

      {/* details */}
      <path d={b.mirror} fill={paint} style={{ transition: "fill .6s ease" }} />
      <path d={b.mirror} fill="#000" opacity=".18" />
      {b.handles.map(([x, y]) => (
        <rect key={x} x={x} y={y} width="30" height="5" rx="2.5" fill="#000" opacity=".35" />
      ))}
      <path d={b.head} fill="#f5f8fc" />
      <path d={b.head} fill="none" stroke="#9fd3ff" strokeOpacity=".7" strokeWidth="1.5" />
      <path d={b.tail} fill="#d01a2e" />

      {/* wheel wells, then wheels */}
      <clipPath id={id("well")}>
        <rect x="0" y="0" width="1000" height={b.sill} />
      </clipPath>
      {b.wheels.map((cx) => (
        <circle key={cx} cx={cx} cy={GROUND - b.tire} r={b.tire + 7.5} fill="#0b0c0e" clipPath={`url(#${id("well")})`} />
      ))}
      {/* wheels */}
      {b.wheels.map((cx) => (
        <Wheel key={cx} cx={cx} r={b.tire} style={wheel.style} finish={wheel.finish} spinning={spinning} />
      ))}
    </svg>
  );
}

// A single wheel on its own, for the wheel picker
export function WheelPreview({ style, finish, size = 64 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <Wheel cx={50} cy={50} r={46} style={style} finish={finish} spinning={false} />
    </svg>
  );
}
