import { makeStyles } from "@mui/styles";
import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

interface Props {
  svgIcon: any;
  label: string;
  labelClass: string;
  labelColor: string;
  roundBackground: boolean;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  iconTag: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
    fontWeight: 400,
    fontSize: "0.875rem",
  },
}));
const IconText: React.FC<Props> = ({
  svgIcon,
  label,
  labelClass,
  labelColor,
  roundBackground,
}): JSX.Element => {
  const classes = useStyles();
  return (
    <div
      className="flex items-center shadow-none"
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {roundBackground ? (
        <div className="flex-shrink-0 relative w-10 h-10 mr-2 flex items-center justify-center bg-white rounded-full">
          <div
            className="w-6 h-6"
            style={{ color: `${fullConfig.theme.colors["strongorange"]}` }}
          >
            {svgIcon}
          </div>
        </div>
      ) : (
        // for single icon without background
        <div className="w-6 h-6">{svgIcon}</div>
      )}
      <span
        className={`${labelClass} truncate`}
        style={{
          color: labelColor,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default IconText;
