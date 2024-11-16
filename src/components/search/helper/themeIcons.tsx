import { makeStyles } from "@mui/styles";
import IconTag from "../detailPanel/iconTag";
import tailwindConfig from "../../../../tailwind.config";
import IconMatch from "./IconMatch";
import resolveConfig from "tailwindcss/resolveConfig";

interface Props {
  handleSearch(params: any, value: string, filterQueries: any): void;
  variant: string;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  themeIcons: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]} !important`,
  },
}));
const ThemeIcons = (props: Props): JSX.Element => {
  const iconData = [
    "Demographics",
    "Economic Stability",
    "Employment",
    "Education",
    "Food Environment",
    "Health and Healthcare",
    "Housing",
    "Neighborhood and Built Environment",
    "Physical Activity and Lifestyle",
    "Safety",
    "Social and Community Context",
    "Transportation and Infrastructure",
  ];
  return (
    <>
      {iconData.map((label) => (
        <IconTag
          key={label}
          svgIcon={IconMatch(label)}
          label={label}
          variant={props.variant}
          labelClass={`text-s font-normal ${fullConfig.theme.fontFamily["sans"]}`}
          labelColor={fullConfig.theme.colors["almostblack"]}
          roundBackground={true}
          handleSearch={props.handleSearch}
        />
      ))}
    </>
  );
};
export default ThemeIcons;
