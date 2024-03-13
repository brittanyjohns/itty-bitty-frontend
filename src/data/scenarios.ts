import { BASE_URL, userHeaders } from '../data/users'

export interface Scenario {
    id?: string;
    name?: string | null;
    prompt_text: string;
    age_range: string;
    number_of_images: number;
    token_limit: number;
    errors?: string[];
}

export const ageRange = [
    '0-3',
    '4-7',
    '8-12',
    '13-18',
    '19-25',
    '26-40',
    '41-60',
    '61-80',
    '80+',
];

export const createScenario = async (scenario: Scenario): Promise<Scenario> => {
    console.log('Creating scenario', scenario);
    const formData = new FormData();
    formData.append('scenario[prompt_text]', scenario.prompt_text);
    formData.append('scenario[age_range]', scenario.age_range);
    formData.append('scenario[number_of_images]', scenario.number_of_images.toString());
    formData.append('scenario[token_limit]', scenario.token_limit.toString());

    const response = await fetch(`${BASE_URL}scenarios`, {
        method: 'POST',
        headers: userHeaders,
        body: JSON.stringify(scenario),
    });
    const newScenario: Scenario = await response.json();
    return newScenario;
};