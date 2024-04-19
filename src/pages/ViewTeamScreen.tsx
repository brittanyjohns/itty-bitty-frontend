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
import { getTeam, Team } from "../data/teams"; // Adjust imports based on actual functions
import { markAsCurrent } from "../data/docs"; // Adjust imports based on actual functions
import BoardDropdown from "../components/BoardDropdown";
import FileUploadForm from "../components/FileUploadForm";
import { set } from "react-hook-form";
import { Board } from "../data/boards";
import BoardList from "../components/BoardList";
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

  const fetchTeam = async () => {
    const teamToSet = await getTeam(Number(id));
    setTeam(teamToSet);
    setBoards(teamToSet.boards);
    return teamToSet;
  };

  useEffect(() => {
    async function getData() {
      const teamToSet = await fetchTeam();
      setTeam(teamToSet);
      toggleForms(segmentType);
      if (teamToSet.display_doc && teamToSet.display_doc.src) {
        setCurrentTeam(teamToSet.display_doc.src);
      } else {
        setCurrentTeam(teamToSet.src);
      }
    }
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
              <IonItem>
                <IonLabel>Team Name</IonLabel>
                <IonText>{team.name}</IonText>
              </IonItem>
              <IonItem>
                <IonLabel>Team Members</IonLabel>
                <IonText>{team.members}</IonText>
              </IonItem>
              <IonItem>
                <IonLabel># of Team Boards</IonLabel>
                <IonText>{team.boards?.length}</IonText>
              </IonItem>
              <IonItem>
                <IonLabel>Team Boards</IonLabel>
                {team.boards && <BoardList boards={team.boards} />}
              </IonItem>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ViewTeamScreen;
