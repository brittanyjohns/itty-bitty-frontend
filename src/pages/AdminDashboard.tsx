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
import {
  BetaRequest,
  fetchBetaRequests,
  getAllUsers,
} from "../data/beta_requests";
import { useEffect, useState } from "react";
import StaticMenu from "../components/main_menu/StaticMenu";
import MainHeader from "./MainHeader";
const AdminDashboard: React.FC = () => {
  const { isWideScreen, currentUser, currentAccount } = useCurrentUser();
  const [betaRequests, setBetaRequests] = useState<BetaRequest[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  useEffect(() => {
    loadBetaRequests();
    loadAllUsers();
  }, []);

  const loadBetaRequests = async () => {
    const betaRequests = await fetchBetaRequests();
    setBetaRequests(betaRequests);
    console.log("Beta Requests: ", betaRequests);
  };

  const loadAllUsers = async () => {
    const users = await getAllUsers();
    setUsers(users);
    console.log("All Users: ", users);
  };

  return (
    <>
      <MainMenu
        pageTitle="Dashboard"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle="Dashboard"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle="Dashboard"
          isWideScreen={isWideScreen}
          showMenuButton={!isWideScreen}
        />
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="ion-padding">
            <h1 className="text-3xl">Welcome to the Admin dashboard</h1>
            <p className="text-lg">
              This is where you can view your account information, manage your
              subscriptions, and more.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="p-2 w-full">
              {betaRequests.length > 0 && (
                <div className=" w-full">
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
                        <span className="text-xs block">
                          {request.created_at}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="p-1 w-full">
              <h1 className="text-2xl">Users</h1>
              <ul>
                {users.map((user, i) => (
                  <li
                    key={i}
                    className="border-b border-gray-200 py-2 flex justify-between"
                  >
                    <span className="font-bold">{user.id}</span>
                    <span className="font-bold">{user.email}</span>
                    <span className="text-right">{user.role}</span>
                    <span className="text-xs block">{user.created_at}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default AdminDashboard;
