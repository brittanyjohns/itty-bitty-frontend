import { BASE_URL, userHeaders } from "./users";
export interface BetaRequest {
    email: string;
}

export const createBetaRequest = async (betaRequest: BetaRequest): Promise<BetaRequest> => {
    const response = await fetch(`${BASE_URL}beta_requests`, {
        method: 'POST',
        headers: userHeaders,
        body: JSON.stringify(betaRequest),
    });
    const newBetaRequest: BetaRequest = await response.json();
    return newBetaRequest;
};