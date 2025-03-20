import {
  People,
  Paid,
  Work,
  School,
  LocalHospital,
  Home,
  Park,
  LocationCity,
  DirectionsBike,
  Security,
  Forum,
  DirectionsBus,
  AutoAwesomeMosaic, ShoppingCart,
} from "@mui/icons-material";

/**
 * @param icon is the icon name based on SolrObject theme(?)
 * @returns the Material UI icon component corresponding to the icon name
 */
const IconMatch = (icon: string): JSX.Element => {
  switch (icon) {
    case "Demographics":
      return <People />;
    case "Economic Stability":
      return <Paid />;
    case "Employment":
      return <Work />;
    case "Education":
      return <School />;
    case "Food Environment":
      return <ShoppingCart />;
    case "Health and Healthcare":
      return <LocalHospital />;
    case "Housing":
      return <Home />;
    case "Natural Environment":
      return <Park />;
    case "Neighborhood and Built Environment":
      return <LocationCity />;
    case "Physical Activity and Lifestyle":
      return <DirectionsBike />;
    case "Safety":
      return <Security />;
    case "Social and Community Context":
      return <Forum />;
    case "Transportation and Infrastructure":
      return <DirectionsBus />;
    case "Composite Index":
      return <AutoAwesomeMosaic />; // Composite
    default:
      return <AutoAwesomeMosaic />;
  }
};

export default IconMatch;
