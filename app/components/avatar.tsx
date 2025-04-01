import { cn } from "@/lib/utils"

interface AvatarProps {
  initials: string
  index: number
  imageUrl?: string
}

const COLORS = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-yellow-500", "bg-red-500", "bg-indigo-500"]

export function Avatar({ initials, index, imageUrl }: AvatarProps) {
  const colorClass = COLORS[index % COLORS.length]

  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-800",
        !imageUrl && colorClass,
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={`GitHub user ${initials}`}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="text-xs font-bold text-white">{initials}</span>
      )}
    </div>
  )
}

