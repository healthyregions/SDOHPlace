import { 
  People, 
  Paid, 
  Work, 
  School, 
  Restaurant, 
  LocalHospital, 
  Home, 
  LocationCity, 
  DirectionsBike, 
  Security, 
  Forum, 
  DirectionsBus, 
  AutoAwesomeMosaic 
} from '@mui/icons-material';

/**
 * @param icon is the icon name based on SolrObject theme(?)
 * @returns the Material UI icon component corresponding to the icon name
 */
const IconMatch = (icon: string): JSX.Element => {
  switch (icon) {
    case "Demographics":
      return <People  />;
    case "Economic Stability":
      return <Paid  />;
    case "Employment":
      return <Work  />;
    case "Education":
      return <School  />;
    case "Food Environment":
      return <Restaurant  />;
    case "Health and Healthcare":
      return <LocalHospital  />;
    case "Housing":
      return <Home  />;
    case "Neighborhood and Built Environment":
      return <LocationCity  />;
    case "Physical Activity and Lifestyle":
      return <DirectionsBike  />;
    case "Safety":
      return <Security  />;
    case "Social and Community Context":
      return <Forum  />;
    case "Transportation and Infrastructure":
      return <DirectionsBus  />;
    default:
      return <AutoAwesomeMosaic  />; // Composite
  }
};

export default IconMatch;
