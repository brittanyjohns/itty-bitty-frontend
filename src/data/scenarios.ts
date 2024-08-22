import { BASE_URL, userHeaders } from "../data/constants";

export interface Scenario {
  prompt_text?: string;
  id?: string;
  name: string;
  age_range: string;
  displayImage?: string;
  number_of_columns: number;
  number_of_images: number;
  token_limit: number;
  board_id?: string;
  errors?: string[];
  initial_description?: string;
  question_1?: string;
  question_2?: string;
  answer_1?: string;
  answer_2?: string;
  word_list?: string[];
  image_list?: string[];
  finalize?: boolean;
  can_edit?: boolean;
  board?: any;
  questions?: string[];
  answers?: string[];
}

export interface ScenarioData {
  name: string;
  age_range: string;
  initial_description: string;
}
export const ageRange = [
  "0-3",
  "4-7",
  "8-12",
  "13-18",
  "19-25",
  "26-40",
  "41-60",
  "61-80",
  "80+",
];

export const createScenario = async (scenario: Scenario): Promise<Scenario> => {
  const response = await fetch(`${BASE_URL}scenarios`, {
    method: "POST",
    headers: userHeaders,
    body: JSON.stringify(scenario),
  });
  const newScenario: Scenario = await response.json();
  return newScenario;
};

export const answerQuestion = async (
  scenario_id: string,
  question_number: number,
  answer: string,
  finalize?: boolean
) => {
  let response;
  console.log("finalizing", finalize);
  console.log("answer", answer);
  if (!finalize) {
    response = await fetch(`${BASE_URL}scenarios/${scenario_id}/answer`, {
      method: "POST",
      headers: userHeaders,
      body: JSON.stringify({ question_number, answer }),
    });
  } else {
    response = await fetch(`${BASE_URL}scenarios/${scenario_id}/finalize`, {
      method: "POST",
      headers: userHeaders,
      body: JSON.stringify({ question_number, answer, finalize }),
    });
  }
  const updatedScenario: Scenario = await response.json();
  return updatedScenario;
};

export const getScenarios = async (): Promise<Scenario[]> => {
  const response = await fetch(`${BASE_URL}scenarios`, {
    headers: userHeaders,
  });
  console.log("response", response);
  const scenarios: Scenario[] = await response.json();
  return scenarios;
};

export const getScenario = async (id: string): Promise<Scenario> => {
  const response = await fetch(`${BASE_URL}scenarios/${id}`, {
    headers: userHeaders,
  });
  const scenario: Scenario = await response.json();
  return scenario;
};

export const updateScenario = async (scenario: Scenario): Promise<Scenario> => {
  const response = await fetch(`${BASE_URL}scenarios/${scenario.id}`, {
    method: "PUT ",
    headers: userHeaders,
    body: JSON.stringify(scenario),
  });
  const updatedScenario: Scenario = await response.json();
  return updatedScenario;
};
