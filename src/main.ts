import { HfInference } from "https://cdn.jsdelivr.net/npm/@huggingface/inference@2.5.2/+esm";

const API_URL = "https://api.openai.com/v1/images/generations";
const COMPLETION_API_URL = "https://chat.openai.com/backend-api/conversation";

const openAIAPIInput = document.querySelector(
  "#openAIAPIInput"
)! as HTMLInputElement;
const openAISaveBtn = document.querySelector("#openAISaveBtn")!;
const generateButton = document.querySelector("#generateButton")!;
const cancelButton = document.querySelector("#cancelButton")!;
const promptInput = document.querySelector("#promptInput")! as HTMLInputElement;

generateButton.addEventListener("click", async () => {
  console.log("Input prompt: ", promptInput.value);
  if (generateButton.childNodes.length === 1) {
    setGenerateButtonLoadingState(true);
    await generateStoryFromPrompt(promptInput.value);
  }
});

cancelButton.addEventListener("click", () => {
  console.log("Clicked on the cancel button");
  promptInput.value = "";
  setGenerateButtonLoadingState(false);
});

openAISaveBtn.addEventListener("click", () => {
  const apiKey = openAIAPIInput.value;
  if (apiKey.length) {
    window.localStorage.setItem("openai-api-key", apiKey);
  }
});

const setGenerateButtonLoadingState = (isLoading: boolean) => {
  if (isLoading) {
    const spanElement = document.createElement("span");
    spanElement.classList.add(...["loading", "loading-spinner"]);
    generateButton.appendChild(spanElement);
  } else {
    if (generateButton.childNodes.length > 1) {
      generateButton.removeChild(generateButton.firstElementChild!);
    }
  }
};

const generateArtFromPrompt = async (inputText: string) => {
  if (!inputText.length) {
    throw new Error("Please enter a prompt");
  }

  try {
    const API_KEY = window.localStorage.getItem("openai-api-key");
    const inference = new HfInference(API_KEY);
    const someArt = await inference.textToImage({
      model: "stabilityai/stable-diffusion-2",
      inputs: inputText,
    });

    console.log("Art: ", someArt);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        prompt: inputText,
        n: 1,
        size: "1024x1024",
      }),
    });

    const data = await response.json();
    console.log("Data: ", data);
  } catch (error) {
    console.error("Unable to generate art: ", error);
  } finally {
    setGenerateButtonLoadingState(false);
  }
};

const generateStoryFromPrompt = async (inputText: string) => {
  if (!inputText.length) {
    throw new Error("Please enter a prompt");
  }

  try {
    const API_KEY = window.localStorage.getItem("openai-api-key");
    const response = await fetch(COMPLETION_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-002-render-sha",
        messages: [{ role: "user", content: inputText }],
      }),
    });

    const data = await response.json();
    console.log("Completion: ", data);
  } catch (error) {
    console.error("Unable to generate story: ", error);
  } finally {
    setGenerateButtonLoadingState(false);
  }
};

// TODO:
// 1. Adding HuggingFace text to image generation api
