import dataDiscoveryIcon from "@/public/logos/data-discovery-icon.svg";
import transportation from "@/public/icons/transportation.svg";
import greenSpace from "@/public/icons/greenSpace.svg";
import foodAccess from "@/public/icons/foodAccess.svg";

/**
 * TODO: change the 'dataDiscoveryIcon' to real icon name, such as dataset
 * @param icon is the icon name based on SolrObject theme(?)
 * @returns the icon file or the icon code if using the default icon
 */
const IconMatch = (icon: string): JSX.Element => {
  switch (icon) {
    case "dataDiscoveryIcon":
      return dataDiscoveryIcon;
    case "transportation":
      return transportation;
    case "greenSpace":
      return greenSpace;
    case "foodAccess":
      return foodAccess;
    default:
      return dataDiscoveryIcon;
  }
};

export default IconMatch;
