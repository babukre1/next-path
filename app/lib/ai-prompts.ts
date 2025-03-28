// AI System Prompt
export const SYSTEM_PROMPT = `You are an AI career guidance counselor helping high school graduates choose their college major and career path. Your role is to:

1. Analyze student's academic performance and interests
2. Ask targeted questions to understand their preferences
3. Provide personalized career recommendations

Guidelines:
- Ask ONE question at a time
- Keep questions focused and specific
- Consider both academic performance and personal interests
- Provide clear, actionable recommendations
- Use the student's academic background to inform questions

Response Formats:
1. For Questions: Use JSON format with 'type: "question"'
2. For Recommendations: Use JSON format with 'type: "recommendation"'

Always maintain a professional and supportive tone.`

// Question Format
export const QUESTION_FORMAT = {
  type: "question",
  question: "string",
  context: "string" // Optional context about why this question is being asked
}

// Answer Options
export const ANSWER_OPTIONS = [
  { value: 1, label: "Hate it", icon: "💢" },
  { value: 2, label: "Dislike it", icon: "👎" },
  { value: 3, label: "Neutral", icon: "😐" },
  { value: 4, label: "Like it", icon: "👍" },
  { value: 5, label: "Love it", icon: "❤️" }
]

// Recommendation Format
export const RECOMMENDATION_FORMAT = {
  type: "recommendation",
  recommendations: [
    {
      program: "string",
      university: "string",
      description: "string",
      matchScore: number, // 0-100
      reasons: ["string"],
      requiredSubjects: ["string"],
      careerPaths: ["string"]
    }
  ],
  summary: "string",
  nextSteps: ["string"]
}

// Example Questions Based on Academic Background
export const getInitialQuestions = (subjects: Array<{ subject: string; mark: number }>) => {
  return [
    {
      type: "question",
      question: "How do you feel about solving complex mathematical problems?",
      context: "Based on your strong performance in Mathematics"
    },
    {
      type: "question",
      question: "What's your interest in conducting scientific experiments and research?",
      context: "Considering your excellent grades in Science subjects"
    },
    {
      type: "question",
      question: "How do you feel about analyzing historical events and their impact?",
      context: "Given your interest in History"
    }
  ]
}

// Example Recommendation
export const EXAMPLE_RECOMMENDATION = {
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

// AI Analysis Prompt
export const ANALYSIS_PROMPT = `Analyze the following information to generate personalized questions and recommendations:

Student Information:
- Academic Performance: {subjects}
- Previous Answers: {previousAnswers}
- Current Question: {currentQuestion}

Guidelines:
1. Consider academic strengths and weaknesses
2. Build upon previous answers to understand interests
3. Generate relevant follow-up questions
4. Identify patterns in interests and abilities
5. Formulate targeted recommendations

Remember to:
- Keep questions focused and specific
- Consider both academic and personal factors
- Provide actionable recommendations
- Maintain a logical progression of questions` 