import CrystalBall from 'react-crystal-ball'

export default function ChatLandingScreen({ isMobile }: { isMobile: boolean }) {
  return (
    <div
      className={`w-full md:w-2/3 flex flex-col absolute md:relative inset-0 z-0
      ${isMobile ? 'translate-x-[100%]' : 'translate-x-0'} 
      transition-transform duration-300 ease-in-out`}
    >
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <div className="flex justify-center items-center mb-4">
            <CrystalBall size={100} colorPalette={1} speed={1.5} />
          </div>
          <h2 className="text-xl font-medium mb-2">
            Chat with Duin and its minions
          </h2>
          <p className="text-gray-500 mb-4 max-w-sm mx-auto">
            You only get 10 messages per day to chat with Duin and its minions.
            It&apos;s best to chat with the minions first and get your
            attestations before messaging Duin.
          </p>
        </div>
      </div>
    </div>
  )
}
