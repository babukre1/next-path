import {
  SYSTEM_PROMPT,
  QUESTION_FORMAT,
  ANSWER_OPTIONS,
  RECOMMENDATION_FORMAT,
  ANALYSIS_PROMPT
} from './ai-prompts'

interface StudentAnswer {
  question: string
  answer: number // 1-5 corresponding to ANSWER_OPTIONS
  timestamp: number
}

interface StudentProfile {
  rollNumber: string
  studentName: string
  subjects: Array<{ subject: string; mark: number }>
  totalPercentage: number
  answers: StudentAnswer[]
}

class AIService {
  private studentProfile: StudentProfile | null = null
  private currentQuestionIndex: number = 0
  private questions: Array<{ type: string; question: string; context?: string }> = []

  constructor() {
    // Initialize with system prompt
    this.initializeAI()
  }

  private initializeAI() {
    // Here you would initialize your AI model with the system prompt
    // This is a placeholder for the actual AI integration
  }

  public setStudentProfile(profile: StudentProfile) {
    this.studentProfile = profile
    this.generateInitialQuestions()
  }

  private generateInitialQuestions() {
    if (!this.studentProfile) return

    // Generate questions based on student's academic background
    const subjects = this.studentProfile.subjects
    const strongSubjects = subjects.filter(s => s.mark >= 80)
    const weakSubjects = subjects.filter(s => s.mark < 60)

    // Generate questions based on academic performance
    this.questions = [
      {
        type: "question",
        question: "How do you feel about solving complex mathematical problems?",
        context: "Based on your performance in Mathematics"
      },
      {
        type: "question",
        question: "What's your interest in conducting scientific experiments and research?",
        context: "Considering your grades in Science subjects"
      },
      {
        type: "question",
        question: "How do you feel about analyzing historical events and their impact?",
        context: "Given your interest in History"
      }
    ]
  }

  public getNextQuestion(): { type: string; question: string; context?: string } | null {
    if (this.currentQuestionIndex >= this.questions.length) {
      return null
    }

    return this.questions[this.currentQuestionIndex]
  }

  public submitAnswer(answer: number) {
    if (!this.studentProfile) return

    const currentQuestion = this.getNextQuestion()
    if (!currentQuestion) return

    // Record the answer
    this.studentProfile.answers.push({
      question: currentQuestion.question,
      answer,
      timestamp: Date.now()
    })

    // Move to next question
    this.currentQuestionIndex++

    // If we've reached the end, generate recommendations
    if (this.currentQuestionIndex >= this.questions.length) {
      return this.generateRecommendations()
    }

    return null
  }

  private generateRecommendations() {
    if (!this.studentProfile) return null

    // Analyze answers and academic performance
    const analysis = this.analyzeStudentProfile()
    
    // Generate recommendations based on analysis
    return {
      type: "recommendation",
      recommendations: [
        {
          program: "Computer Science",
          university: "Top Universities",
          description: "A comprehensive program focusing on software development, algorithms, and computer systems.",
          matchScore: 85,
          reasons: [
            "Strong mathematical background",
            "Interest in problem-solving",
            "Good performance in technical subjects"
          ],
          requiredSubjects: ["Mathematics", "Physics", "Computer Science"],
          careerPaths: [
            "Software Engineer",
            "Data Scientist",
            "AI/ML Specialist",
            "Cybersecurity Analyst"
          ]
        }
      ],
      summary: "Based on your academic performance and interests, Computer Science appears to be an excellent fit. Your strong mathematical background and problem-solving skills align well with the program requirements.",
      nextSteps: [
        "Research specific universities offering Computer Science programs",
        "Look into internship opportunities in tech companies",
        "Consider taking additional programming courses"
      ]
    }
  }

  private analyzeStudentProfile() {
    if (!this.studentProfile) return null

    // Analyze academic performance
    const academicStrengths = this.studentProfile.subjects
      .filter(s => s.mark >= 80)
      .map(s => s.subject)

    // Analyze interests from answers
    const interests = this.studentProfile.answers
      .filter(a => a.answer >= 4) // "Like it" or "Love it"
      .map(a => a.question)

    return {
      academicStrengths,
      interests,
      averageScore: this.studentProfile.totalPercentage
    }
  }
}

// Export a singleton instance
export const aiService = new AIService() 