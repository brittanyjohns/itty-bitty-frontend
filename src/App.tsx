import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import ViewBoard from './pages/ViewBoard';
import NewBoard from './pages/NewBoard';
import NewImage from './pages/NewImage';
import SignUpScreen from './pages/SignUpScreen';
import SignInScreen from './pages/SignInScreen';
import Dashboard from './pages/Dashboard';
import ImagesScreen from './pages/ImagesScreen';
import EditImageScreen from './pages/EditImageScreen';
import SignOutScreen from './pages/SignOutScreen';
import NewMenu from './pages/NewMenu';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/" component={Home} exact={true} />
          {/* {isUserSignedIn() ? <Redirect to="/home" /> : <Redirect to="/sign-in" />} */}

        <Route path="/home" exact={true}>
          <Home />
        </Route>
        <Route path="/boards" component={Dashboard} exact={true} />
        <Route path="/boards/:id" component={ViewBoard} exact={true} />
        <Route path="/boards/new" component={NewBoard} exact={true} />
        <Route path="/menus/new" component={NewMenu} exact={true} />
        <Route path="/images/new" component={NewImage} exact={true} />
        <Route path="/images/:id/edit" component={EditImageScreen } exact={true} />
        <Route path="/images" component={ImagesScreen} exact={true} />
        <Route path={"/sign-up"} >
          <SignUpScreen />
          {/* {isUserSignedIn() ? <Redirect to="/" /> : <SignUpScreen />} */}
        </Route>
        <Route path={"/sign-in"} component={SignInScreen} exact={true} />
        <Route path="/sign-out" component={SignOutScreen} exact={true} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);
export default App;