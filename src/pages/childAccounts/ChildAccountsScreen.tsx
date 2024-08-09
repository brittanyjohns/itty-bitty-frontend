import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ChildAccountList from "../../components/childAccounts/ChildAccountList";
import MainMenu from "../../components/main_menu/MainMenu";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import Tabs from "../../components/utils/Tabs";
import { useEffect, useState } from "react";
// import { useHistory } from "react-router";
import { addCircleOutline } from "ionicons/icons";
import MainHeader from "../MainHeader";
import StaticMenu from "../../components/main_menu/StaticMenu";
const ChildAccountsScreen: React.FC = () => {
  const { currentUser, isWideScreen, currentAccount } = useCurrentUser();
  // const history = useHistory();
  const [childAccounts, setChildAccounts] = useState<any>([]);
  // const [pageTitle, setPageTitle] = useState("Your ChildAccounts");

  const fetchChildAccounts = async () => {
    const fetchedChildAccounts = currentUser?.child_accounts;
    if (!fetchedChildAccounts) {
      console.error("Error fetching childAccounts");
      // return;
    }
    setChildAccounts(fetchedChildAccounts);
  };

  useEffect(() => {
    fetchChildAccounts();
  }, [currentUser]);
  useEffect(() => {
    fetchChildAccounts();
  }, []);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  return (
    <>
      <MainMenu
        pageTitle=" Child Accounts"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />
      <StaticMenu
        pageTitle=" Child Accounts"
        isWideScreen={isWideScreen}
        currentUser={currentUser}
        currentAccount={currentAccount}
      />

      <IonPage id="main-content">
        <MainHeader
          pageTitle=" Child Accounts"
          isWideScreen={isWideScreen}
          endLink="/child-accounts/new"
          showMenuButton={!isWideScreen}
        />

        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <div className="p-1 w-full md:w-3/4 mx-auto">
            {currentUser && childAccounts?.length === 0 && (
              <div className="p-1 w-full md:w-3/4 mx-auto border">
                <h2 className="text-2xl font-semibold text-center">
                  Get Started
                </h2>
                <p className="text-lg md:text-xl font-bold mt-5 text-center">
                  Manage your child accounts here.
                </p>
                <p className="ml-3 my-5 text-md md:text-lg flex items-center">
                  <IonIcon icon={addCircleOutline} className="mr-2" />
                  Create a new child account.
                </p>
                <p className="ml-3 my-5 text-md md:text-lg flex items-center">
                  <IonIcon icon={addCircleOutline} className="mr-2" />
                  Choose a username & password.
                </p>
                <p className="ml-3 my-5 text-md md:text-lg flex items-center">
                  <IonIcon icon={addCircleOutline} className="mr-2" />
                  Assign boards and track progress.
                </p>
                <p className="ml-3 my-5 text-md md:text-lg flex items-center">
                  <IonIcon icon={addCircleOutline} className="mr-2" />
                  Set up your child's account in minutes.
                </p>
              </div>
            )}
            <div className="mt-5">
              <p className="text-sm md:text-md mt-5 text-center">
                Changes made to shared boards will be reflected in the child
                account in real-time.
              </p>
              {currentUser && childAccounts?.length === 0 && (
                <div className="mt-5 text-center">
                  <p>No Accounts found</p>
                  <IonButton
                    fill="clear"
                    expand="block"
                    routerLink="/child-accounts/new"
                  >
                    <IonIcon icon={addCircleOutline} slot="start" />
                    Create New Child Account
                  </IonButton>
                </div>
              )}
            </div>
          </div>

          <ChildAccountList childAccounts={childAccounts} />
        </IonContent>
        {currentUser && <Tabs />}
      </IonPage>
    </>
  );
};

export default ChildAccountsScreen;
