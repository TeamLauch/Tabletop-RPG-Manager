export const WURFEL = [
  {
    name: "W12",
    maxValue: 12,
    minValue: 1,
    steps: 1,
  },
  {
    name: "W20",
    maxValue: 20,
    minValue: 1,
    steps: 1,
  },
  {
    name: "W10",
    maxValue: 10,
    minValue: 1,
    steps: 1,
  },
  {
    name: "W8",
    maxValue: 8,
    minValue: 1,
    steps: 1,
  },
  {
    name: "W6",
    maxValue: 6,
    minValue: 1,
    steps: 1,
  },
  {
    name: "W4",
    maxValue: 4,
    minValue: 1,
    steps: 1,
  },
  {
    name: "W100",
    maxValue: 100,
    minValue: 1,
    steps: 1,
  },
];

/**
 *
 * @param text Dice String
 * @returns Dice Role
 */
export function decodeAndRunDiceString(text: string) {
  let constAdd = 0;
  text = text.trim();
  text = text.replace(" ", "");
  if (text.includes("+")) {
    constAdd = Number.parseInt(text.split("+")[1]);
    text = text.split("+")[0];
  }
  if (text.includes("-")) {
    constAdd = -Number.parseInt(text.split("-")[1]);
    text = text.split("-")[0];
  }
  let amount = 1;
  let w;
  text = text.toLowerCase();
  console.log(text);
  for (const wurf of WURFEL) {
    if (
      text.includes(wurf.name.toLowerCase()) &&
      text.endsWith(wurf.name.toLowerCase())
    ) {
      w = wurf;
      amount = Number.parseInt(text.split(wurf.name)[0]);
      break;
    }
  }
  if (!w) return -1;

  let e = constAdd;
  for (let i = 0; i < amount; i++) {
    e += roleDice(w.minValue, w.maxValue, w.steps);
  }
  return e;
}

/**
 *
 * @param min_val Min Value
 * @param max_val Max Value
 * @param i Steps
 * @returns Random int between
 */
export default function roleDice(min_val: number, max_val: number, i: number) {
  let t_steps = Math.floor((max_val - min_val) / i);
  let random = Math.round(Math.random() * t_steps) * i + min_val;
  return random;
}
