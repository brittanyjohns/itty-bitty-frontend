import { BASE_URL, userHeaders } from "./constants";
interface RequestDetails {
  client_ip: string;
}
export interface BetaRequest {
  email: string;
  details?: RequestDetails;
  ip?: string;
  created_at?: string;
}

export const createBetaRequest = async (
  betaRequest: BetaRequest
): Promise<BetaRequest> => {
  const response = await fetch(`${BASE_URL}beta_requests`, {
    method: "POST",
    headers: userHeaders,
    body: JSON.stringify(betaRequest),
  });
  const newBetaRequest: BetaRequest = await response.json();
  return newBetaRequest;
};

export const fetchBetaRequests = () => {
  const betaRequests = fetch(`${BASE_URL}beta_requests`, {
    headers: userHeaders,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.error("Error fetching data: ", error));

  return betaRequests;
};

export const getAllUsers = async () => {
  const response = await fetch(`${BASE_URL}users`, { headers: userHeaders });
  console.log("response", response);
  const users = await response.json();
  return users;
};
