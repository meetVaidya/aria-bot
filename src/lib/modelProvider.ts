import { OpenAI } from "openai";
import { config } from "../config/environment";

export const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: config.GROQ_API_KEY,
});
