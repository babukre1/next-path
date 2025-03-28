import { motion } from "framer-motion"

interface Option {
  value: number
  label: string
  icon: string
}

const options: Option[] = [
  { value: 1, label: "Hate it", icon: "💢" },
  { value: 2, label: "Dislike it", icon: "👎" },
  { value: 3, label: "Neutral", icon: "😐" },
  { value: 4, label: "Like it", icon: "👍" },
  { value: 5, label: "Love it", icon: "❤️" },
]

interface QuestionCardProps {
  question: string
  onAnswer: (value: number) => void
}

export function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
    >
      <h3 className="text-2xl font-bold text-white mb-8 text-center">
        {question}
      </h3>
      <div className="grid gap-4">
        {options.map((option) => (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(option.value)}
            className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-white"
          >
            <span className="text-lg font-medium">{option.label}</span>
            <span className="text-2xl">{option.icon}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
} 