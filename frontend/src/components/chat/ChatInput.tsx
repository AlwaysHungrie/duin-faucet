import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Paperclip } from 'lucide-react'

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  disabled: boolean
}) {
  return (
    <div className="p-2 sm:p-3 bg-white border-t sticky bottom-0 z-10">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (disabled) return
          onSubmit(e)
        }}
        className="flex items-center gap-1 sm:gap-2"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden sm:flex"
        >
          <Paperclip className="h-5 w-5 text-gray-500" />
        </Button>

        <Input
          placeholder="Type a message"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-full text-sm sm:text-base h-9 sm:h-10 focus-visible:ring-0 focus-visible:border-gray-400"
          disabled={disabled}
        />

        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className={`rounded-full h-9 w-9 sm:h-10 sm:w-10 ${
            value.trim()
              ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-white'
              : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-600'
          }`}
          disabled={disabled}
        >
          <Send className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </form>
    </div>
  )
}
