import React, { useState, useEffect, useRef } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import { deleteTeam, getTeam, inviteToTeam, Team } from "../../data/teams"; // Adjust imports based on actual functions
import { markAsCurrent } from "../../data/docs"; // Adjust imports based on actual functions
import BoardDropdown from "../../components/BoardDropdown";
import FileUploadForm from "../../components/FileUploadForm";
import { set } from "react-hook-form";
import { Board } from "../../data/boards";
import BoardList from "../../components/BoardList";
import TeamInviteForm from "../../components/TeamInviteForm";
import { useCurrentUser } from "../../hooks/useCurrentUser";
interface ViewTeamScreenProps {
  id: string;
}
const ViewTeamScreen: React.FC<ViewTeamScreenProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [currentTeam, setCurrentTeam] = useState<string | null>("");
  const boardTab = useRef<HTMLDivElement>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [segmentType, setSegmentType] = useState("teamTab");
  const teamTab = useRef<HTMLDivElement>(null);
  const boardGrid = useRef<HTMLDivElement>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const history = useHistory();
  const { currentUser } = useCurrentUser();

  const fetchTeam = async () => {
    const teamToSet = await getTeam(Number(id));
    if (!teamToSet) {
      console.error("Error fetching team");
      return;
    }
    setTeam(teamToSet);
    setBoards(teamToSet.boards);
    return teamToSet;
  };

  const handleInvite = async (email: string, role: string) => {
    console.log("email", email);
    const result = await inviteToTeam(id, email, role);
    console.log("result", result);
    if (result) {
      console.log("invite sent");
      setTeam(result);
    }
  };

  const getData = async () => {
    const teamToSet = await fetchTeam();
    setTeam(teamToSet);
    toggleForms(segmentType);
    if (teamToSet && teamToSet.current) {
      setCurrentTeam(teamToSet);
    } else {
      setCurrentTeam(null);
    }
    setShowLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  const toggleForms = (segmentType: string) => {
    if (segmentType === "boardTab") {
      teamTab.current?.classList.add("hidden");
      boardTab.current?.classList.remove("hidden");
    }
    if (segmentType === "teamTab") {
      teamTab.current?.classList.remove("hidden");
      boardTab.current?.classList.add("hidden");
    }
  };

  const handleDocClick = async (e: React.MouseEvent) => {
    const target = e.target as HTMLMenuElement;
    const id = target.id;
    history.push(`/boards/${id}`);
  };

  const handleSegmentChange = (e: CustomEvent) => {
    const newSegment = e.detail.value;
    setSegmentType(newSegment);
    toggleForms(newSegment);
  };

  const handleDeleteTeam = async () => {
    const result = await deleteTeam(id);
    console.log("delete result", result);
    if (result) {
      history.push("/teams");
      window.location.reload();
    }
  };

  return (
    <IonPage id="view-team-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/teams" />
          </IonButtons>
          <IonTitle>{team?.name}</IonTitle>
        </IonToolbar>
        <IonToolbar>{/* placeholder for search for teams */}</IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" scrollY={true}>
        <div className="" ref={teamTab}>
          {team && (
            <div className="">
              <IonList>
                <IonItem>
                  <IonLabel>Team Name</IonLabel>
                  <IonText>{team.name}</IonText>
                </IonItem>
                <IonItem>
                  <IonLabel>Team Members</IonLabel>
                  <IonText>
                    {team.members?.map((member, index) => (
                      <div key={index}>{member.name}</div>
                    ))}
                  </IonText>
                </IonItem>
                <IonItem>
                  <IonLabel># of Team Boards</IonLabel>
                  <IonText>{team.boards?.length}</IonText>
                </IonItem>
                <IonItem>
                  <IonLabel>Team Boards</IonLabel>
                  {team.boards && <BoardList boards={team.boards} />}
                </IonItem>
              </IonList>
              <div className="ion-padding">
                <TeamInviteForm onSave={handleInvite} onCancel={() => {}} />
              </div>
              {currentUser?.role === "admin" && (
                <div className="ion-padding">
                  <IonButton
                    expand="block"
                    color="danger"
                    onClick={handleDeleteTeam}
                  >
                    Delete Team
                  </IonButton>
                </div>
              )}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ViewTeamScreen;
