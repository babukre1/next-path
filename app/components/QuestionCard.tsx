import { motion } from "framer-motion"
import { Loader2 } from "lucide-react";

interface QuestionCardProps {
  question: string;
  answers?: string[];
  onAnswer: (value: number) => void;
  isLoading?: boolean;
}

export function QuestionCard({
  question,
  answers,
  onAnswer,
  isLoading = false,
}: QuestionCardProps) {
  // If no answers provided, use default options
  const options = answers?.map((answer, index) => ({
    value: index + 1,
    label: answer,
    icon: "", // Default icon for dynamic answers
  })) || [
    { value: 1, label: "Hate it", icon: "💢" },
    { value: 2, label: "Dislike it", icon: "👎" },
    { value: 3, label: "Neutral", icon: "😐" },
    { value: 4, label: "Like it", icon: "👍" },
    { value: 5, label: "Love it", icon: "❤️" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl relative"
    >
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-white font-medium">Processing your answer...</p>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-bold text-white mb-8 text-center">
        {question}
      </h3>
      <div className="grid gap-4">
        {options.map((option) => (
          <motion.button
            key={option.value}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            onClick={() => onAnswer(option.value)}
            disabled={isLoading}
            className={`flex items-center justify-between w-full p-4 rounded-xl bg-white/5 transition-colors border border-white/10 text-white ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-white/10"
            }`}
          >
            <span className="text-lg font-medium">{option.label}</span>
            <span className="text-2xl">{option.icon}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
} 