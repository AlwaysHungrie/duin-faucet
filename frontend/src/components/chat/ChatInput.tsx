import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Paperclip, Mic } from 'lucide-react'

export default function ChatInput({
  value,
  onChange,
  onSubmit,
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}) {
  return (
    <div className="p-2 sm:p-3 bg-white border-t sticky bottom-0 z-10">
      <form onSubmit={onSubmit} className="flex items-center gap-1 sm:gap-2">
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
          className="flex-1 rounded-full text-sm sm:text-base h-9 sm:h-10"
        />

        {value.trim() ? (
          <Button
            type="submit"
            size="icon"
            className="rounded-full h-9 w-9 sm:h-10 sm:w-10"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        ) : (
          <Button type="button" variant="ghost" size="icon">
            <Mic className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
          </Button>
        )}
      </form>
    </div>
  )
}
