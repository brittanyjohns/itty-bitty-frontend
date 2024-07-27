import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import MainMenu from "../components/main_menu/MainMenu";
import Tabs from "../components/utils/Tabs";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { BetaRequest, fetchBetaRequests } from "../data/beta_requests";
import { useEffect, useState } from "react";
const AdminDashboard: React.FC = () => {
  const { isWideScreen } = useCurrentUser();
  const [betaRequests, setBetaRequests] = useState<BetaRequest[]>([]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  useEffect(() => {
    loadBetaRequests();
  }, []);

  const loadBetaRequests = async () => {
    const betaRequests = await fetchBetaRequests();
    setBetaRequests(betaRequests);
    console.log("Beta Requests: ", betaRequests);
  };

  return (
    <>
      <MainMenu />
      <IonPage id="main-content">
        <IonHeader className="bg-inherit shadow-none">
          <IonToolbar>
            <IonButtons slot="start">
              {!isWideScreen && <IonMenuButton></IonMenuButton>}
            </IonButtons>
            <IonTitle>Admin Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="p-4">
            <h1 className="text-4xl font-bold my-8"> Under Construction </h1>

            <h1 className="text-2xl">Welcome to the Admin dashboard</h1>
            <p className="text-lg">
              This is where you can view your account information, manage your
              subscriptions, and more.
            </p>
          </div>
          {betaRequests.length > 0 && (
            <div className="p-4 w-full md:w-1/2 mx-auto">
              <h1 className="text-2xl">Beta Requests</h1>
              <ul>
                {betaRequests.map((request, i) => (
                  <li
                    key={i}
                    className="border-b border-gray-200 py-2 flex justify-between"
                  >
                    <span className="font-bold">{request.email}</span>
                    <span className="text-right">
                      {request.details?.client_ip}
                    </span>
                    <span className="text-xs block">{request.created_at}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </IonContent>
        <Tabs />
      </IonPage>
    </>
  );
};

export default AdminDashboard;
