import Image from 'next/image'

// Create a deterministic hash from the input string
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
};

// Generate consistent random numbers from the hash
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateColor = (seed: number) => {
  const hue = Math.floor(seededRandom(seed) * 360);
  const saturation = 70 + Math.floor(seededRandom(seed + 1) * 20);
  const lightness = 45 + Math.floor(seededRandom(seed + 2) * 20);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export default function Avatar({
  height,
  width,
  address,
}: {
  height: number
  width: number
  address?: string
}) {
  const color1 = generateColor(hashString(address?.slice(0, 6) || ''))
  const color2 = generateColor(hashString(address?.slice(-6) || ''))
  const gradient = `linear-gradient(to right, ${color1}, ${color2})`
  return (
    <div
      className="rounded-full flex items-center justify-center relative overflow-hidden"
      style={{ height, width }}
    >
      {!address ? (
        <Image src="/favicon.svg" alt="avatar" fill />
      ) : (
        <div style={{ background: gradient }} className="h-full w-full" />
      )}
    </div>
  )
}

