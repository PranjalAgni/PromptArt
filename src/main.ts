const API_URL = "https://api.openai.com/v1/images/generations";
const generateButton = document.querySelector("#generateButton")!;
const cancelButton = document.querySelector("#cancelButton")!;
const promptInput = document.querySelector("#promptInput")! as HTMLInputElement;

generateButton.addEventListener("click", async () => {
  console.log("Input prompt: ", promptInput.value);
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
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer <ADD_YOUR_APIKEY>`,
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
