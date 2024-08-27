import dataDiscoveryIcon from "@/public/logos/data-discovery-icon.svg";

/**
 * TODO: change the 'dataDiscoveryIcon' to real icon name, such as dataset
 * @param icon is the icon name based on SolrObject theme(?)
 * @returns the icon file or the icon code if using the default icon
 */
const IconMatch = (icon: string): JSX.Element => {
  switch (icon) {
    case "dataDiscoveryIcon":
      return dataDiscoveryIcon;
    default:
      return <></>;
  }
};

export default IconMatch;
