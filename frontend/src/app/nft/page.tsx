'use client'
import CrystalBall from 'react-crystal-ball'

export default function NftPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div
        className="flex flex-col items-center justify-center border-2 border-gray-300"
        style={{
          height: '480px',
          width: '480px',
        }}
      >
        <CrystalBall size={400} speed={3} colorPalette={1} />
      </div>
    </div>
  )
}
