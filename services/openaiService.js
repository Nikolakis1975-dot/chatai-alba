import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

const MODE = process.env.NODE_ENV || "production";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const models = {
  development: {
    chat: "gpt-4o-mini",
    stt: "gpt-4o-mini-transcribe",
    tts: "gpt-4o-mini-tts",
  },
  production: {
    chat: "gpt-4o",
    stt: "gpt-4o-transcribe",
    tts: "gpt-4o-tts",
  },
};

// Funksion universal për të marrë modelin sipas tipit
export function getModel(type) {
  const env = MODE === "development" ? "development" : "production";
  return models[env][type];
}

// Kthe objektin OpenAI dhe model selectorin
export { openai };
