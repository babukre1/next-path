// app/components/WaitlistForm.js
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getStudentResult } from '../actions/fetchRollNumber'
import { StudentConfirmation } from './StudentConfirmation'
import { QuestionCard } from './QuestionCard'
import { motion, AnimatePresence } from 'framer-motion'
import { gemeni } from "../actions/gemini";

interface StudentResult {
  rollNumber: string;
  studentName: string;
  subjects: Array<{ subject: string; mark: number }>;
  totalPercentage: number;
  finalStatus: string;
}

interface WaitlistFormProps {
  onStateChange: (state: "initial" | "confirmation" | "questions") => void;
}

interface CareerPath {
  title: string;
  description: string;
  matchScore: string;
  requiredSkills: string[];
  careerProspects: string;
}

interface Analysis {
  strengths: string[];
  interests: string[];
  whyThesePaths: string;
}

interface AIResponse {
  type: "question" | "recomondation" | "recommendation";
  question?: string;
  answers?: string[];
  title?: string;
  recommendations?: CareerPath[];
  analysis?: Analysis;
  nextSteps?: string[];
}

function WaitlistForm({ onStateChange }: WaitlistFormProps) {
  const [rollNumber, setRollNumber] = useState("");
  const [result, setResult] = useState<StudentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const cleanAIResponse = (response: string): string => {
    // Remove markdown code block markers if present
    return response.replace(/```json\n?|\n?```/g, "").trim();
  };

  const normalizeAIResponse = (response: AIResponse): AIResponse => {
    // Fix typo in response type
    if (response.type === "recomondation") {
      response.type = "recommendation";
    }
    return response;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber) {
      setError("Roll Number is required");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("rollNumber", rollNumber);

    try {
      const data = await getStudentResult(formData);
      if (!data) {
        throw new Error("No data received from server");
      }
      setResult(data);
      setShowForm(false);
      onStateChange("confirmation");
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch results. Please check the roll number and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmStudent = async () => {
    if (!result?.subjects) {
      setError("No student data available");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      const response = await gemeni(result.subjects, undefined);
      const cleanedResponse = cleanAIResponse(response);
      const parsedResponse = JSON.parse(cleanedResponse);
      const normalizedResponse = normalizeAIResponse(parsedResponse);
      setAiResponse(normalizedResponse);
      setShowQuestions(true);
      onStateChange("questions");
    } catch (err) {
      console.error("Error getting AI response:", err);
      setError("Failed to analyze your results. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCancelStudent = () => {
    setResult(null);
    setShowForm(true);
    onStateChange("initial");
  };

  const handleAnswer = async (value: number) => {
    try {
      const response = await gemeni(undefined, `option ${value}`);
      const cleanedResponse = cleanAIResponse(response);
      console.log("Cleaned response:", cleanedResponse);
      const parsedResponse = JSON.parse(cleanedResponse);
      const normalizedResponse = normalizeAIResponse(parsedResponse);

      if (normalizedResponse.type === "recommendation") {
        setAiResponse(normalizedResponse);
        setShowRecommendation(true);
        setShowQuestions(false);
      } else {
        setAiResponse(normalizedResponse);
        setCurrentQuestion((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error getting AI response:", err);
      setError("Failed to process answer. Please try again.");
    }
  };

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
                {loading ? "Searching..." : "Search"}
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

        {result && !showQuestions && !showRecommendation && (
          <StudentConfirmation
            key="confirmation"
            studentName={result.studentName}
            rollNumber={result.rollNumber}
            subjects={result.subjects}
            onConfirm={handleConfirmStudent}
            onCancel={handleCancelStudent}
            isLoading={isAnalyzing}
          />
        )}

        {showQuestions && aiResponse?.type === "question" && (
          <QuestionCard
            key={`question-${currentQuestion}`}
            question={aiResponse.question || ""}
            answers={aiResponse.answers}
            onAnswer={handleAnswer}
          />
        )}

        {showRecommendation && aiResponse?.type === "recommendation" && (
          <motion.div
            key="recommendation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl"
          >
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-4">
                  {aiResponse.title || "Your Career Path"}
                </h3>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
              </div>

              <div className="grid gap-6">
                {/* Career Recommendations */}
                <div className="space-y-6">
                  {aiResponse.recommendations?.map((path, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-xl font-semibold text-white">
                          {path.title}
                        </h4>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            path.matchScore === "High"
                              ? "bg-green-500/20 text-green-400"
                              : path.matchScore === "Medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {path.matchScore} Match
                        </span>
                      </div>

                      <p className="text-gray-300 mb-4">{path.description}</p>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-400 mb-2">
                            Required Skills
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {path.requiredSkills.map((skill, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-white/5 rounded-full text-sm text-gray-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/10">
                        <h5 className="text-sm font-medium text-gray-400 mb-2">
                          Career Prospects
                        </h5>
                        <p className="text-sm text-gray-300">
                          {path.careerProspects}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Analysis Section */}
                {aiResponse.analysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl p-6 border border-white/10"
                  >
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <span className="mr-2">🎯</span>
                      Your Profile Analysis
                    </h4>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-medium text-gray-400 mb-2">
                          Your Strengths
                        </h5>
                        <ul className="space-y-2">
                          {aiResponse.analysis.strengths.map((strength, i) => (
                            <li
                              key={i}
                              className="flex items-center text-gray-300"
                            >
                              <span className="mr-2">✨</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-400 mb-2">
                          Your Interests
                        </h5>
                        <ul className="space-y-2">
                          {aiResponse.analysis.interests.map((interest, i) => (
                            <li
                              key={i}
                              className="flex items-center text-gray-300"
                            >
                              <span className="mr-2">💫</span>
                              {interest}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h5 className="text-sm font-medium text-gray-400 mb-2">
                        Why These Paths?
                      </h5>
                      <p className="text-gray-300">
                        {aiResponse.analysis.whyThesePaths}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Next Steps */}
                {aiResponse.nextSteps && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white/5 rounded-xl p-6 border border-white/10"
                  >
                    <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <span className="mr-2">🚀</span>
                      Next Steps
                    </h4>
                    <ul className="space-y-3">
                      {aiResponse.nextSteps.map((step, index) => (
                        <li
                          key={index}
                          className="flex items-start text-gray-300"
                        >
                          <span className="mr-2">{index + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => {
                    setShowRecommendation(false);
                    setShowForm(true);
                    setResult(null);
                    onStateChange("initial");
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white font-semibold px-8 py-6 rounded-xl transition-all duration-300"
                >
                  Start Over
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WaitlistForm