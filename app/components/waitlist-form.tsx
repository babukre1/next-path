// app/components/WaitlistForm.js
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getStudentResult } from '../actions/fetchRollNumber'
import { StudentConfirmation } from './StudentConfirmation'
import { QuestionCard } from './QuestionCard'
import { motion, AnimatePresence } from 'framer-motion'

// Mock AI questions
const mockQuestions = [
  "How do you feel about solving complex problems and puzzles?",
  "What's your reaction to the idea of selling and persuading others?",
  "How do you feel about working with data and numbers?",
  "Do you enjoy helping and teaching others?",
  "What's your take on creative and artistic activities?"
]
interface StudentResult {
  rollNumber: string
  studentName: string
  subjects: Array<{ subject: string; mark: number }>
  totalPercentage: number
  finalStatus: string
}

interface WaitlistFormProps {
  onStateChange: (state: 'initial' | 'confirmation' | 'questions') => void
}

function WaitlistForm({ onStateChange }: WaitlistFormProps) {
  const [rollNumber, setRollNumber] = useState('')
  const [result, setResult] = useState<StudentResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showQuestions, setShowQuestions] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rollNumber) {
      setError('Roll Number is required')
      return
    }
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('rollNumber', rollNumber)

    try {
      const data = await getStudentResult(formData)
      setResult(data)
      setShowForm(false)
      onStateChange('confirmation')
    } catch (err) {
      console.error('Error:', err)
      setError('Failed to fetch results. Please check the roll number and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmStudent = () => {
    setShowQuestions(true)
    onStateChange('questions')
  }

  const handleCancelStudent = () => {
    setResult(null)
    setShowForm(true)
    onStateChange('initial')
  }

  const handleAnswer = (value: number) => {
    // Here you would normally send the answer to your AI service
    console.log(`Question ${currentQuestion + 1} answered with value: ${value}`)
    
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Handle completion - for now just reset
      setCurrentQuestion(0)
      setShowQuestions(false)
      setShowForm(true)
      setResult(null)
      onStateChange('initial')
    }
  }

  return (
    <div className="w-full space-y-4">
      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <form
            action={handleSubmit}
              onSubmit={handleSubmit}
              className="flex overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-blue-500"
            >
              <Input
                id="rollNumber"
                name="rollNumber"
                type="number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="Enter your Roll Number"
                required
                className="h-12 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full border-0 bg-transparent text-white placeholder:text-gray-400 focus:ring-0 focus:border-transparent focus-visible:border-transparent focus:outline-none active:ring-0 active:outline-none focus-visible:ring-0 focus-visible:outline-none active:border-transparent focus-visible:ring-offset-0"
              />
              <Button
                type="submit"
                disabled={loading}
                className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 rounded-xl transition-all duration-300 ease-in-out focus:outline-none min-w-[100px]"
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </form>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        )}

        {result && !showQuestions && (
          <StudentConfirmation
            key="confirmation"
            studentName={result.studentName}
            rollNumber={result.rollNumber}
            subjects={result.subjects}
            onConfirm={handleConfirmStudent}
            onCancel={handleCancelStudent}
          />
        )}

        {showQuestions && (
          <QuestionCard
            key={`question-${currentQuestion}`}
            question={mockQuestions[currentQuestion]}
            onAnswer={handleAnswer}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default WaitlistForm