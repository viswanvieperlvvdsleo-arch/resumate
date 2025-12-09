import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export type AIResumeChatOutput = {
  response: string;
};

export async function chatWithResumeAI(params: {
  resumeText: string;
  question: string;
}): Promise<AIResumeChatOutput> {

  const prompt = `
You are a professional resume advisor AI.
Use the user's resume and answer their question clearly.

RESUME:
${params.resumeText}

USER QUESTION:
${params.question}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are a helpful resume assistant." },
      { role: "user", content: prompt },
    ]
  });

  return {
    response: completion.choices[0].message.content ?? "No response."
  };
}
