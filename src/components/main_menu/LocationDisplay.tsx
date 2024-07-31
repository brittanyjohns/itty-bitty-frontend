import { useLocation } from "react-router-dom";

const LocationDisplay = () => {
  const location = useLocation();

  return (
    <div>
      <h3>Current Path: {location.pathname}</h3>
      <h3>Search String: {location.search}</h3>
      <h3>Hash: {location.hash}</h3>
      <h3>State: {JSON.stringify(location.state)}</h3>
    </div>
  );
};

export default LocationDisplay;
