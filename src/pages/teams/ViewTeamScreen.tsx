import React, { useState, useEffect, useRef } from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
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
import {
  createTeamBoard,
  deleteTeam,
  getTeam,
  inviteToTeam,
  Team,
} from "../../data/teams"; // Adjust imports based on actual functions
import { markAsCurrent } from "../../data/docs"; // Adjust imports based on actual functions
import BoardDropdown from "../../components/boards/BoardDropdown";
import FileUploadForm from "../../components/images/FileUploadForm";
import { set } from "react-hook-form";
import { Board } from "../../data/boards";
import BoardList from "../../components/boards/BoardList";
import TeamInviteForm from "../../components/teams/TeamInviteForm";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  albumsOutline,
  gridOutline,
  earthOutline,
  peopleCircleOutline,
  mailOutline,
} from "ionicons/icons";
import MainMenu from "../../components/main_menu/MainMenu";
import MainHeader from "../MainHeader";
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
  const inviteTab = useRef<HTMLDivElement>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [boardName, setBoardName] = useState("");
  const history = useHistory();
  const { currentUser, isWideScreen } = useCurrentUser();

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
    console.log("segmentType", segmentType);
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
      inviteTab.current?.classList.add("hidden");
    }
    if (segmentType === "teamTab") {
      teamTab.current?.classList.remove("hidden");
      boardTab.current?.classList.add("hidden");
      inviteTab.current?.classList.add("hidden");
    }
    if (segmentType === "inviteTab") {
      teamTab.current?.classList.add("hidden");
      boardTab.current?.classList.add("hidden");
      inviteTab.current?.classList.remove("hidden");
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

  const showDeleteBtn = () => {
    if (
      currentUser?.role === "admin" ||
      team?.created_by === currentUser?.email
    ) {
      return (
        <IonButton
          expand="block"
          color="danger"
          onClick={handleDeleteTeam}
          className="ion-margin-top"
        >
          Delete Team
        </IonButton>
      );
    }
  };

  const handleCreateTeamBoard = async () => {
    const newBoard = await createTeamBoard(id, boardName);
    if (newBoard) {
      console.log("newBoard", newBoard);
      setBoardName("");
    }
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
    <>
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/teams" />
            </IonButtons>
            <IonTitle>{team?.name}</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSegment
              value={segmentType}
              onIonChange={handleSegmentChange}
              className="w-full bg-inherit"
            >
              <IonSegmentButton value="teamTab">
                <IonLabel className="text-xl">
                  <IonIcon
                    icon={peopleCircleOutline}
                    className="text-2xl mt-3 mb-2"
                  />
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="boardTab">
                <IonLabel className="text-xl">
                  <IonIcon icon={gridOutline} />
                </IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="inviteTab">
                <IonLabel className="text-xl">
                  <IonIcon icon={mailOutline} className="text-2xl mt-3 mb-2" />
                </IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" scrollY={true}>
          <div className="hidden" ref={teamTab}>
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
                </IonList>
                {showDeleteBtn()}
              </div>
            )}
          </div>
          <div className="hidden" ref={inviteTab}>
            {team && (
              <div className="">
                <TeamInviteForm onSave={handleInvite} onCancel={() => {}} />
              </div>
            )}
          </div>
          <div className="hidden" ref={boardTab}>
            {team && (
              <div className="">
                <IonLabel>Team Boards</IonLabel>
                {team.boards && <BoardList boards={team.boards} />}
              </div>
            )}
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default ViewTeamScreen;
