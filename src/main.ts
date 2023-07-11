// @ts-ignore
import { HfInference } from "https://cdn.jsdelivr.net/npm/@huggingface/inference@2.5.2/+esm";

const hfAPIInput = document.querySelector("#hfAPIInput")! as HTMLInputElement;
const hfSaveBtn = document.querySelector("#hfSaveBtn")!;
const generateButton = document.querySelector("#generateButton")!;
const cancelButton = document.querySelector("#cancelButton")!;
const promptInput = document.querySelector("#promptInput")! as HTMLInputElement;
const imageContainer = document.querySelector("#generatedImageContainer");

const hfApiKey = window.localStorage.getItem("hf-api-key");
if (hfApiKey) {
  hfAPIInput.value = hfApiKey;
}

const cleanImages = () => {
  imageContainer?.replaceChildren();
};
generateButton.addEventListener("click", async () => {
  cleanImages();
  if (generateButton.childNodes.length === 1) {
    setGenerateButtonLoadingState(true);
    await generateArtFromPrompt(promptInput.value);
  }
});

cancelButton.addEventListener("click", () => {
  console.log("Clicked on the cancel button");
  promptInput.value = "";
  setGenerateButtonLoadingState(false);
});

hfSaveBtn.addEventListener("click", () => {
  const apiKey = hfAPIInput.value;
  if (apiKey.length) {
    window.localStorage.setItem("hf-api-key", apiKey);
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
    const API_KEY = window.localStorage.getItem("hf-api-key");
    const inference = new HfInference(API_KEY);
    // calls the inference API of hugging face and get's the image object
    const generatedArt = await inference.textToImage({
      model: "stabilityai/stable-diffusion-2",
      inputs: inputText,
    });

    console.log("Art object: ", generatedArt);
    const objectUrl = URL.createObjectURL(generatedArt);
    const imageElement = document.createElement("img");
    imageElement.src = objectUrl;
    imageContainer?.appendChild(imageElement);
  } catch (error) {
    console.error("Unable to generate art: ", error);
  } finally {
    setGenerateButtonLoadingState(false);
  }
};

// TODO:
// 1. Adding HuggingFace text to image generation api
