import { Redirect, Route, useHistory } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";

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
import { AndroidFullScreen } from "@awesome-cordova-plugins/android-full-screen";
import TeamsScreen from "./pages/teams/TeamsScreen";
import ViewTeamScreen from "./pages/teams/ViewTeamScreen";
import ViewLockedBoard from "./pages/boards/ViewLockedBoard";
import NewTeamScreen from "./pages/teams/NewTeamScreen";
import Demo from "./pages/Demo";
import { forgotPassword } from "./data/users";
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

// AndroidFullScreen.isImmersiveModeSupported()
//   .then(() => AndroidFullScreen.immersiveMode())
//   .catch(console.warn);

const App: React.FC = () => (
  <UserProvider>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" component={Home} exact={true} />
          {/* {isUserSignedIn() ? <Redirect to="/home" /> : <Redirect to="/sign-in" />} */}

          <Route path="/home" exact={true}>
            <Home />
          </Route>
          {/* <Route path="/users/password/edit/:reset_password_token" component={ResetPasswordScreen} exact={true} /> */}
          <Route path="/users/password/edit/" component={ResetPasswordScreen} exact={true} />

          <Route path="/dashboard" component={Dashboard} exact={true} />
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
          <Route path="/boards" component={BoardsScreen} exact={true} />
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
          <Route path={"/sign-up"}>
            <SignUpScreen />
            {/* {isUserSignedIn() ? <Redirect to="/" /> : <SignUpScreen />} */}
          </Route>
          <Route path={"/sign-in"} component={SignInScreen} exact={true} />
          <Route path="/sign-out" component={SignOutScreen} exact={true} />
          <Route path="/forgot-password" component={ForgotPasswordScreen} exact={true} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </UserProvider>
);
export default App;
