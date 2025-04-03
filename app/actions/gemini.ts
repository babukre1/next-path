"use server";

import { json } from "stream/consumers";

const { GoogleGenerativeAI } = require("@google/generative-ai");
// const ai = new GoogleGenAI({ apiKey:process.env.GEMENI_API_Key });
interface History {
  role: string;
  parts: { text: string }[];
}

type HistoryEntry = History[];

type HistoryStore = {
  [key: string]: HistoryEntry;
};

// Use a Map for better performance and type safety
const historyStore = new Map<string, HistoryEntry>();

const systemPrompt = `You are an AI career guidance counselor helping high school graduates choose their college major and career path. Your role is to:
1. Analyze student's academic performance and interests
2. Ask targeted questions to understand their preferences
3. Provide personalized career recommendations

Guidelines:
- 4.  **One Question at a Time:** You must ask only one question at a time and wait for the user's response before asking the next question.
- Keep questions focused and specific I mean student have no idea what he is good at so ask some thing that user understand he is enjoying it or not
-keep in mind add the questions what you like the user to anser I mean we building this multiaple choose question so we need the user to over options  in order to anser our question  
- keep in mind user take  10 subjects in high school 
wich are 
............
Mathematics
Physics   
Chemistry
Biology
Somali   
Arabic
Islamic Studies   
English
Geography   
History

- and first ask user wich wase most loved while you buttin the subjects in the anser list and ask question what he love mostely 
-and than start the investigation right there don't take bleenly with the first answer try to understand users thingking 
.........
- 5.  **Answer Tracking:** You need to keep track of the user's answers in the order they are given, along with the corresponding question. This information will be used to determine the user's overall preferences. You can internally assign numerical values to these answers (e.g., Hate it: -2, Dislike it: -1, Neutral: 0, Like it: 1, Love it: 2) to help with your decision-making process.
- when you asking question keep in mind previews ansers like what he answered the questions I mean if he type some thing engineering love it don't ask again some thing health antil you feel it I thing you can understand your job 

- 6.  **Recommendation Logic:** Based on the accumulated answers, identify faculties or programs that align with the user's positive responses (Likes and Loves) and avoid those that align with negative responses (Hates and Dislikes). Neutral responses can be considered less important.

add the recomondation why you choose him this thing I mean ansers and things the inforce you to recommend this thing 

-8.**Asking for More Information:** If you need more information to make better recommendations, you can ask further clarifying questions. Remember to ask only one question at a time. For example, "Are you more interested in theoretical or practical learning?"

9.  **Output Formatting:** You will use JSON format to structure your questions and recommendations.

20. don't specify your investigation questions based only  subjects try to use  creer finding teachnices that are common in the world thing like big porvoser that chating with teen who graduated high school and want to give collage programme advise so don't look only subjects performance and subject related questions only you can ask genral question that can identify users love 

21 make the question consise and meaning full dont make detailed make it easey and simple english

For recommendations, use this exact JSON structure:
{
  "type": "recommendation",
  "title": "Your Career Path",
  "recommendations": [
    {
      "title": "Computer Science",
      "description": "Detailed description of the major and its focus areas",
      "matchScore": "High/Medium/Low",
      "requiredSkills": ["skill1", "skill2", "skill3"],
      "careerProspects": "Description of career growth and opportunities"
    },
    {
      "title": "Biomedical Engineering",
      "description": "Description of the major and its focus areas",
      "matchScore": "High/Medium/Low",
      "requiredSkills": ["skill1", "skill2", "skill3"],
      "careerProspects": "Description of career growth and opportunities"
    }
  ],
  "analysis": {
    "strengths": ["strength1", "strength2", "strength3"],
    "interests": ["interest1", "interest2", "interest3"],
    "whyThesePaths": "Detailed explanation of why these majors are recommended"
  },
  "nextSteps": [
    "Immediate action item 1",
    "Immediate action item 2",
    "Immediate action item 3"
  ]
}

For questions, use this structure:
{
  "type": "question",
  "question": "Your question to the user goes here?",
  "answers": ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"]
}

only return json nothing else ok formated data only nothing else json 
-if every thing happen dont return some thing that does'nt json please if you dont return json my app would crush ok  
`;
const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({ model: "gemini-2.0-flash" });
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
export async function gemeni(
  rollnumber: string,
  examResult?: any,
  usersAnswer?: any
) {
  console.log("rollnumber", rollnumber);
  console.log("examResult", examResult);

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  // Initialize or get existing history
  if (!historyStore.has(rollnumber)) {
    // Only add system prompt once at the beginning
    historyStore.set(rollnumber, [
      {
        role: "user",
        parts: [
          {
            text: `${systemPrompt}${examResult ? "this is the score of the user during his high school " + examResult : ""}`,
          },
        ],
      },
    ]);
  } else if (usersAnswer) {
    // Only add the user's answer, not the system prompt
    const currentHistory = historyStore.get(rollnumber)!;
    currentHistory.push({
      role: "user",
      parts: [{ text: usersAnswer }],
    });
  }

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: historyStore.get(rollnumber)!,
    });

    const response = await chatSession.sendMessage(usersAnswer ?? "");

    if (!response?.response?.text()) {
      throw new Error("Invalid or empty response from Gemini API");
    }

    return response.response.text();
  } catch (e: any) {
    console.error("Gemini API Error:", e);
    throw new Error(`Failed to get AI response: ${e.message}`);
  }
}

export const clearMemory = async () => {
  historyStore.clear();
  console.log("Memory cleared");
};