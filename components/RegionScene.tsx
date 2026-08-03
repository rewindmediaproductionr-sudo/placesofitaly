export type SceneKind = "mountain" | "hills" | "coast" | "city" | "lake" | "volcano";

export type Landmark =
  | "colosseum"
  | "towers"
  | "trulli"
  | "cypress"
  | "castle"
  | "hilltown"
  | "campanile"
  | "terraces"
  | "sassi";

interface RegionSceneProps {
  kind: SceneKind;
  colors: [string, string];
  landmark?: Landmark;
  water?: boolean;
  className?: string;
}

const FAR = { fill: "#ffffff", opacity: 0.18 };
const NEAR = { fill: "#000000", opacity: 0.38 };
const LANDMARK = { fill: "#000000", opacity: 0.5 };

function Terrain({ kind, water }: { kind: SceneKind; water?: boolean }) {
  switch (kind) {
    case "mountain":
      return (
        <>
          <path
            d="M0,205 L45,150 L90,185 L140,120 L190,175 L240,130 L290,180 L340,140 L400,190 L400,300 L0,300 Z"
            {...FAR}
          />
          <path
            d="M0,245 L55,190 L105,222 L155,165 L215,210 L265,178 L325,225 L400,195 L400,300 L0,300 Z"
            {...NEAR}
          />
          {water && (
            <>
              <rect x="0" y="255" width="400" height="45" fill="#000000" opacity="0.28" />
              <rect x="30" y="262" width="120" height="3" fill="#ffffff" opacity="0.12" />
              <rect x="200" y="270" width="150" height="3" fill="#ffffff" opacity="0.12" />
              <rect x="80" y="280" width="200" height="3" fill="#ffffff" opacity="0.1" />
            </>
          )}
        </>
      );
    case "hills":
      return (
        <>
          <path
            d="M0,210 C90,165 170,190 250,160 C310,140 360,165 400,150 L400,300 L0,300 Z"
            {...FAR}
          />
          <path
            d="M0,250 C110,208 210,238 300,198 C345,180 375,198 400,188 L400,300 L0,300 Z"
            {...NEAR}
          />
        </>
      );
    case "coast":
      return (
        <>
          <path d="M0,215 C40,195 70,205 100,190 L100,300 L0,300 Z" {...FAR} />
          <path
            d="M0,238 C60,222 120,248 190,228 C250,210 300,234 400,218 L400,300 L0,300 Z"
            {...NEAR}
          />
        </>
      );
    case "city":
      return (
        <>
          <g {...FAR}>
            <rect x="10" y="220" width="18" height="55" />
            <rect x="35" y="205" width="18" height="70" />
            <rect x="60" y="230" width="18" height="45" />
            <rect x="330" y="215" width="18" height="60" />
            <rect x="360" y="235" width="18" height="40" />
          </g>
          <g {...NEAR}>
            <rect x="90" y="235" width="24" height="65" />
            <rect x="122" y="200" width="24" height="100" />
            <rect x="154" y="245" width="24" height="55" />
            <rect x="186" y="215" width="24" height="85" />
            <rect x="218" y="250" width="24" height="50" />
            <rect x="250" y="225" width="24" height="75" />
            <rect x="282" y="245" width="24" height="55" />
          </g>
        </>
      );
    case "lake":
      return (
        <>
          <path
            d="M0,190 L50,140 L95,175 L145,115 L195,168 L245,125 L295,172 L345,135 L400,180 L400,250 L0,250 Z"
            {...FAR}
          />
          <rect x="0" y="250" width="400" height="50" fill="#000000" opacity="0.3" />
          <rect x="40" y="260" width="110" height="3" fill="#ffffff" opacity="0.14" />
          <rect x="210" y="268" width="150" height="3" fill="#ffffff" opacity="0.12" />
          <rect x="90" y="278" width="180" height="3" fill="#ffffff" opacity="0.1" />
        </>
      );
    case "volcano":
      return (
        <>
          <path d="M0,220 C80,200 160,215 220,195 L220,300 L0,300 Z" {...FAR} />
          <polygon points="120,300 192,95 264,300" {...NEAR} />
          <ellipse cx="192" cy="80" rx="20" ry="10" fill="#ffffff" opacity="0.22" />
          <ellipse cx="205" cy="65" rx="26" ry="12" fill="#ffffff" opacity="0.16" />
          <rect x="0" y="270" width="400" height="30" fill="#000000" opacity="0.3" />
        </>
      );
    default:
      return null;
  }
}

function houseCluster(seed: number, count: number, baseY: number, spread: number) {
  const houses = [];
  for (let i = 0; i < count; i++) {
    const x = 130 + (i * spread) / count + ((i * seed) % 9);
    const w = 16 + ((i * seed) % 6);
    const h = 18 + ((i * seed * 3) % 14);
    const y = baseY - h + ((i * seed) % 10);
    houses.push(
      <g key={i}>
        <rect x={x} y={y} width={w} height={h} {...LANDMARK} />
        <polygon points={`${x - 2},${y} ${x + w / 2},${y - 10} ${x + w + 2},${y}`} {...LANDMARK} />
      </g>
    );
  }
  return houses;
}

function LandmarkArt({ landmark }: { landmark: Landmark }) {
  switch (landmark) {
    case "colosseum":
      return (
        <g>
          <rect x="130" y="270" width="140" height="20" {...LANDMARK} />
          <ellipse
            cx="200"
            cy="260"
            rx="85"
            ry="34"
            fill="none"
            stroke="#000000"
            strokeOpacity="0.5"
            strokeWidth="14"
          />
        </g>
      );
    case "towers":
      return (
        <g {...LANDMARK}>
          <rect x="175" y="150" width="16" height="130" />
          <polygon points="171,150 195,150 183,138" />
          <rect x="205" y="175" width="14" height="105" />
          <polygon points="201,175 223,175 212,164" />
        </g>
      );
    case "trulli":
      return (
        <g {...LANDMARK}>
          <rect x="155" y="260" width="22" height="24" rx="3" />
          <polygon points="155,260 177,260 166,234" />
          <rect x="190" y="246" width="26" height="38" rx="3" />
          <polygon points="190,246 216,246 203,214" />
          <rect x="225" y="262" width="20" height="22" rx="3" />
          <polygon points="225,262 245,262 235,238" />
        </g>
      );
    case "cypress":
      return (
        <g {...LANDMARK}>
          <ellipse cx="150" cy="240" rx="7" ry="38" />
          <rect x="148" y="278" width="4" height="14" />
          <ellipse cx="175" cy="222" rx="8" ry="46" />
          <rect x="173" y="268" width="4" height="24" />
          <ellipse cx="250" cy="230" rx="7" ry="40" />
          <rect x="248" y="270" width="4" height="22" />
        </g>
      );
    case "castle":
      return (
        <g {...LANDMARK}>
          <rect x="165" y="210" width="70" height="80" />
          <rect x="165" y="196" width="12" height="16" />
          <rect x="188" y="196" width="12" height="16" />
          <rect x="211" y="196" width="12" height="16" />
          <rect x="223" y="196" width="12" height="16" />
          <rect x="192" y="150" width="16" height="65" />
          <polygon points="192,150 208,150 200,132" />
        </g>
      );
    case "hilltown":
      return <g>{houseCluster(7, 6, 270, 140)}</g>;
    case "sassi":
      return <g>{houseCluster(5, 9, 275, 150)}</g>;
    case "terraces":
      return <g>{houseCluster(11, 5, 260, 120)}</g>;
    case "campanile":
      return (
        <g {...LANDMARK}>
          <rect x="192" y="150" width="16" height="140" />
          <polygon points="188,150 212,150 200,125" />
          <rect x="198" y="118" width="4" height="10" />
        </g>
      );
    default:
      return null;
  }
}

export default function RegionScene({ kind, colors, landmark, water, className }: RegionSceneProps) {
  const [from, to] = colors;
  const gradId = `sky-${from.replace("#", "")}-${to.replace("#", "")}`;

  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${gradId})`} />
      <circle cx="305" cy="65" r="46" fill="#ffffff" opacity="0.12" />
      <circle cx="305" cy="65" r="22" fill="#ffffff" opacity="0.55" />
      <Terrain kind={kind} water={water} />
      {landmark && <LandmarkArt landmark={landmark} />}
    </svg>
  );
}
