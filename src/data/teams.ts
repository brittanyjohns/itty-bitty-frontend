import { Board } from './boards';
import { BASE_URL, User, userHeaders } from './users';

export interface Team {
    id?: string;
    name: string;
    current?: boolean;
    created_by?: string;
    created_at?: string;
    boards?: Board[];
    members?: User[];
    errors?: string[];
}

export const getTeams = () => {
    const teams = fetch(`${BASE_URL}teams`, { headers: userHeaders }) // `localhostteams
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching data: ', error));

    return teams;
}

export const getTeam = (id: number) => {
    const team = fetch(`${BASE_URL}teams/${id}`, { headers: userHeaders }) // `localhostteams
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error fetching data: ', error));

    return team;
}

export const createTeam = (team: Team) => {
    console.log("createTeam", team);
    const formData = new FormData();
    formData.append("team[name]", team.name);
    const newTeam = fetch(`${BASE_URL}teams`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    body: formData,
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error creating team: ', error));

    return newTeam;
}

export const updateTeam = (team: Team) => {
    const updatedTeam = fetch(`${BASE_URL}teams/${team.id}`, {
        method: 'PUT',
        headers: userHeaders,
        body: JSON.stringify(team),
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error updating team: ', error));

    return updatedTeam;
}

export const deleteTeam = (id: string) => {
    const result = fetch(`${BASE_URL}teams/${id}`, {
        method: 'DELETE',
        headers: userHeaders,
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Error deleting team: ', error));

    return result;
}

export async function inviteToTeam(id: string, email: string, role: string): Promise<Team> {
    const payload = JSON.stringify({team_user: {email, role} })
    const requestInfo = {
      method: "POST",
      headers: userHeaders,
      body: payload,
    };
    const response = await fetch(`${BASE_URL}teams/${id}/invite`, requestInfo);
    const team: Team = await response.json();
    return team;
  }

  export async function getTeamBoards(id: string, props: any): Promise<Board[]> {
    const response = await fetch(`${BASE_URL}teams/${id}/remaining_boards?page=${props.page}&query=${props.query}`,
     { headers: userHeaders }) 
    const boards: Board[] = await response.json();
    return boards;
  }

  export async function addBoardToTeam(id: string, board_id: string): Promise<Team> {
    const requestInfo = {
      method: "PUT",
      headers: userHeaders,
      body: JSON.stringify({ board_id }),
    };
    const response = await fetch(`${BASE_URL}teams/${id}/associate_board`, requestInfo);
    console.log("Add Board to Team response", response);
    const team: Team = await response.json();
    console.log("Add Board to Team team", team);
    return team;
  }

  export async function removeBoardFromTeam(id: string, board_id: string): Promise<Team> {
    const body = JSON.stringify({ board_id });
    console.log("Remove Board from Team body", body);
    const requestInfo = {
      method: "POST",
      headers: userHeaders,
      body: body,
    };
    const response = await fetch(`${BASE_URL}teams/${id}/remove_board`, requestInfo);
    console.log("Remove Board from Team response", response);
    const team: Team = await response.json();
    return team;
  }

  export async function createTeamBoard(id: string, boardName: string): Promise<Team> {
    const body = JSON.stringify({ board: { name: boardName } });
    const requestInfo = {
      method: "POST",
      headers: userHeaders,
      body: body,
    };
    const response = await fetch(`${BASE_URL}teams/${id}/create_board`, requestInfo);
    const team: Team = await response.json();
    return team;
  }