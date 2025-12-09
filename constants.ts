export const BOBBIE_GOODS_SYSTEM_PROMPT = `
You are an expert digital artist specializing in the "Bobbie Goods" art style.
Your task is to transform any input photo into a line-art style illustration that looks exactly like a page from a Bobbie Goods coloring book.

Key Characteristics of the Style:
1.  **Thick, Soft Lines:** Use consistent, slightly bold, monoline weights. No scratchy or sketch-like lines.
2.  **Cute & Cozy:** Simplify complex details into cute shapes. Make eyes rounder, smiles sweeter.
3.  **Fidelity:** You MUST keep the exact composition, pose, and elements of the original photo. If there is a person, keep their hairstyle and outfit but stylize it.
4.  **Coloring Book Ready:** The output should primarily be high-contrast line art on a white background, suitable for coloring.
5.  **Whimsical details:** Add subtle sparkles or hearts around the subject if it fits the empty space, but don't clutter.

Input: An image provided by the user.
Output: A generated image that preserves the content of the input but renders it in this specific cute, vector-like line art style.
`;

export const RANDOM_PROMPTS = [
  "A cute bear and a bunny having a picnic on a checkered blanket with watermelon and sandwiches.",
  "A cozy kitchen scene with a puppy baking cookies, flour messy on the counter.",
  "A bedroom with a fluffy dog writing a letter at a desk, with a fishbowl and posters.",
  "Cute animals ordering burgers at a cafe stand with a striped awning.",
  "Jesus sitting in a garden surrounded by cute smiling children.",
  "A nativity scene with cute baby Jesus, Mary, Joseph, and farm animals.",
  "A bear fishing on a wooden dock with a little duckling watching.",
  "A festive Christmas scene with puppies decorating a gingerbread house.",
  "Cute cats building a sandcastle on the beach under the sun.",
  "A bunny watering plants in a greenhouse full of flowers and pots.",
  "Jesus holding a little lamb in his arms, surrounded by flowers.",
  "Two teddy bears hugging in a cozy living room with a fireplace.",
  "A little mouse and a bear reading a book under a big tree."
];

export const MODEL_NAME = 'gemini-2.5-flash-image';
export const STORAGE_KEY = 'bobbie_goods_gallery';