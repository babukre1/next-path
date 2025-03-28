import { motion } from "framer-motion"

interface Subject {
  subject: string
  mark: number
}

interface StudentConfirmationProps {
  studentName: string
  rollNumber: string
  subjects: Subject[]
  onConfirm: () => void
  onCancel: () => void
}

export function StudentConfirmation({
  studentName,
  rollNumber,
  subjects,
  onConfirm,
  onCancel,
}: StudentConfirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
    >
      
      <div className="space-y-6">

          <div>
            <h3 className="text-xl font-semibold text-white">{studentName}</h3>
            <p className="text-gray-400">Roll Number: {rollNumber}</p>
        </div>

        <div className="mt-6">
          {/* <h4 className="text-lg font-semibold text-white mb-3">Your Subjects</h4> */}
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-lg p-3 border border-white/10"
              >
                <div className="text-sm text-gray-400">{subject.subject}</div>
                <div className="text-lg font-semibold text-white">{subject.mark}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Yes, this is me
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="flex-1 py-3 px-6 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors border border-white/10"
          >
            This is not me
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
} 