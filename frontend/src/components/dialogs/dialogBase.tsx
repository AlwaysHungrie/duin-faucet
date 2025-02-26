export default function DialogBase({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-lg flex-col w-full mx-4 max-w-[calc(100%-2rem)] sm:max-w-lg md:max-w-xl lg:max-w-2xl overflow-hidden"
    >
      {children}
    </div>
  )
}
