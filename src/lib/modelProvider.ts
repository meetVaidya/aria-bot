import { OpenAI } from "openai";
import { config } from "../config/environment";

export const openai = new OpenAI({
  baseURL: "https://api.x.ai/v1",
  apiKey: config.OPENAI_API_KEY,
});
