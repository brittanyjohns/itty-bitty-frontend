import { Redirect, Route, useHistory } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import "./pages/boards/ViewBoard.css";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import ViewBoard from "./pages/boards/ViewBoard";
import NewBoard from "./pages/boards/NewBoard";
import NewImage from "./pages/images/NewImage";
import SignUpScreen from "./pages/auth/SignUpScreen";
import SignInScreen from "./pages/auth/SignInScreen";
import Dashboard from "./pages/Dashboard";
import ImagesScreen from "./pages/images/ImagesScreen";
import EditImageScreen from "./pages/images/EditImageScreen";
import SignOutScreen from "./pages/auth/SignOutScreen";
import NewMenu from "./pages/menus/NewMenu";
import BoardsScreen from "./pages/boards/BoardsScreen";
import { UserProvider } from "./contexts/UserContext";
import EditBoardScreen from "./pages/boards/EditBoardScreen";
import ViewImageScreen from "./pages/images/ViewImageScreen";
import MenusScreen from "./pages/menus/MenusScreen";
import SelectGalleryScreen from "./pages/boards/SelectGalleryScreen";
import SettingsPage from "./pages/users/SettingsPage";
import NewScenario from "./pages/scenarios/NewScenario";
import ViewMenuScreen from "./pages/menus/ViewMenuScreen";
import PredictiveIndex from "./pages/predictive/PredictiveIndex";
import TeamsScreen from "./pages/teams/TeamsScreen";
import ViewTeamScreen from "./pages/teams/ViewTeamScreen";
import ViewLockedBoard from "./pages/boards/ViewLockedBoard";
import NewTeamScreen from "./pages/teams/NewTeamScreen";
import Demo from "./pages/Demo";
import ForgotPasswordScreen from "./pages/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "./pages/auth/ResetPasswordScreen ";

setupIonicReact({
  platform: {
    /** The default `desktop` function returns false for devices with a touchscreen.
     * This is not always wanted, so this function tests the User Agent instead.
     **/
    desktop: (win) => {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          win.navigator.userAgent
        );
      return !isMobile;
    },
  },
});

import PricingPage from "./pages/PricingPage";
import AdminDashboard from "./pages/AdminDashboard";
import Upgrade from "./pages/Upgrade";
import ContactUs from "./pages/ContactUs";
import About from "./pages/About";
import SuccessfulSubscription from "./pages/SuccessfulSubscription";
import ChildAccountsScreen from "./pages/childAccounts/ChildAccountsScreen";
import ViewChildAccountScreen from "./pages/childAccounts/ViewChildAccountScreen";
import AccountSignInScreen from "./pages/accounts/AccountSignInScreen";
import SignInPage from "./pages/SignInPage";
import AccountSignOutScreen from "./pages/accounts/AccountSignOutScreen";
import ViewChildBoardScreen from "./pages/childBoards/ViewChildBoardScreen";
import CookiesConsent from "./components/utils/CookieConsent";
import { useState, useEffect } from "react";
import PrivacyPolicy from "./pages/utils/PrivacyPolicy";

const UserRoutes: React.FC = () => (
  <UserProvider>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/" component={Home} exact={true} />
        <Route path="/privacy-policy" component={PrivacyPolicy} exact={true} />

        <Route path="/home" exact={true}>
          <Home />
        </Route>
        <Route path="/sign-in" component={SignInPage} exact={true} />
        {/* <Route path="/users/password/edit/:reset_password_token" component={ResetPasswordScreen} exact={true} /> */}
        <Route
          path="/reset_password/"
          component={ResetPasswordScreen}
          exact={true}
        />

        <Route path="/dashboard" component={Dashboard} exact={true} />
        <Route path="/account-dashboard">
          <Dashboard childAccountSignedIn={true} />
        </Route>
        <Route
          path="/admin/dashboard"
          component={AdminDashboard}
          exact={true}
        />
        <Route path="/demo" component={Demo} exact={true} />
        <Route path="/faq" component={Dashboard} exact={true} />
        <Route path="/boards/:id" component={ViewBoard} exact={true} />
        <Route
          path="/boards/:id/locked"
          component={ViewLockedBoard}
          exact={true}
        />
        <Route path="/boards/new" component={NewBoard} exact={true} />
        <Route path="/scenarios/new" component={NewScenario} exact={true} />
        <Route
          path="/boards/:id/edit"
          component={EditBoardScreen}
          exact={true}
        />
        <Route
          path="/boards/:id/gallery"
          component={SelectGalleryScreen}
          exact={true}
        />
        {/* <Route path="/boards" component={BoardsScreen} exact={true} /> */}
        <Route path="/boards" exact={true}>
          <BoardsScreen gridType="user" />
        </Route>
        <Route path="/scenarios" component={BoardsScreen} exact={true} />

        <Route path="/menus/new" component={NewMenu} exact={true} />

        <Route
          path="/images/:id/edit"
          component={EditImageScreen}
          exact={true}
        />
        <Route path="/images/:id" component={ViewImageScreen} exact={true} />
        <Route path="/images/add" component={NewImage} exact={true} />
        <Route path="/images" component={ImagesScreen} exact={true} />

        <Route path="/predictive" component={PredictiveIndex} exact={true} />
        <Route
          path="/predictive/:id"
          component={PredictiveIndex}
          exact={true}
        />

        <Route path="/menus/:id" component={ViewMenuScreen} exact={true} />
        <Route path="/menus/new" component={NewMenu} exact={true} />

        <Route path="/menus" component={MenusScreen} exact={true} />
        <Route path="/teams" component={TeamsScreen} exact={true} />
        <Route path="/teams/:id" component={ViewTeamScreen} exact={true} />
        <Route path="/teams/new" component={NewTeamScreen} exact={true} />
        <Route path="/settings" component={SettingsPage} exact={true} />
        <Route path="/sign-up">
          <SignUpScreen plan="free" />
        </Route>
        <Route path="/sign-up/free">
          <SignUpScreen plan="free" />
        </Route>
        <Route path="/sign-up/pro">
          <SignUpScreen plan="pro" />
        </Route>

        <Route path={"/users/sign-in"} component={SignInScreen} exact={true} />
        <Route path="/users/sign-out" component={SignOutScreen} exact={true} />
        <Route
          path="/forgot-password"
          component={ForgotPasswordScreen}
          exact={true}
        />
        <Route path="/pricing" component={PricingPage} exact />
        <Route path="/contact-us" component={ContactUs} exact />
        <Route path="/upgrade" component={Upgrade} exact />
        <Route path="/faq" component={About} exact />
        <Route path="/about" component={About} exact />

        <Route path="/success" component={SuccessfulSubscription} exact />
        <Route path="/billing" component={Upgrade} exact />

        <Route
          path="/child-accounts"
          component={ChildAccountsScreen}
          exact={true}
        />
        <Route
          path="/child-accounts/new"
          component={ChildAccountsScreen}
          exact={true}
        />
        <Route path="/child-accounts/:id" component={ViewChildAccountScreen} />
        <Route
          path="/child-accounts/sign-out"
          component={AccountSignOutScreen}
          exact={true}
        />

        <Route path="/child-boards" exact={true}>
          <BoardsScreen gridType="child" />
        </Route>
        <Route path="/child-boards/:id" component={ViewChildBoardScreen} />
        <Route
          path="/accounts/sign-in"
          component={AccountSignInScreen}
          exact={true}
        />
      </IonRouterOutlet>
    </IonReactRouter>
  </UserProvider>
);

const App: React.FC = () => {
  const [showCookiesConsent, setShowCookiesConsent] = useState(false);
  const [showTrackingConsent, setShowTrackingConsent] = useState(false);

  useEffect(() => {
    const cookiesConsent = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cookies_consent="));
    const trackingConsent = document.cookie
      .split("; ")
      .find((row) => row.startsWith("tracking_consent="));

    if (!cookiesConsent) setShowCookiesConsent(true);
    if (!trackingConsent) setShowTrackingConsent(true);
  }, []);

  return (
    <IonApp>
      <UserRoutes />
      {showCookiesConsent && <CookiesConsent />}
    </IonApp>
  );
};
export default App;
