import { Button } from "@mui/material";
import Image from "next/image";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";
import { makeStyles } from "@mui/styles";

const fullConfig = resolveConfig(tailwindConfig);
interface Props {
  svgIcon?: any;
  muiIcon?: any;
  label: string;
  fillColor: string;
  labelColor: string;
  onClick: any;
  disabled?: boolean;
  iconOpacity?: number;
  width?: string;
  noBox?: boolean;
  noHover?: boolean;
  justifyContent?: string;
  borderRadius?: string;
  border?: string;
  endIcon?: any; // if there's end icon, then start icon and label will be left aligned and end icon will be right aligned (i.e. footer style)
}
const useStyles = makeStyles((theme) => ({
  buttonWithEndIcon: {
    position: "relative",
    paddingLeft: "4rem",
    paddingRight: "4rem",
    "& .MuiButton-startIcon": {
      position: "absolute",
      left: "1.5rem",
    },
    "& .MuiButton-endIcon": {
      position: "absolute",
      right: "1.5rem",
    },
    "& .button-content": {
      position: "absolute",
      left: "4rem",
    },
  },
}));
const ButtonWithIcon = (props: Props): JSX.Element => {
  const classes = useStyles();
  return (
    <div>
      <Button
        className={props.endIcon ? classes.buttonWithEndIcon : ""}
        variant="contained"
        startIcon={
          props.svgIcon ? (
            <Image
              priority
              src={props.svgIcon}
              alt={props.label}
              style={{
                opacity: props.iconOpacity ? props.iconOpacity : 1,
              }}
            />
          ) : props.muiIcon ? (
            <props.muiIcon />
          ) : null
        }
        endIcon={
          props.endIcon ? props.endIcon : null
        }
        onClick={props.onClick}
        disabled={props.disabled}
        sx={{
          width: props.width ? props.width : "auto ",
          height: "3rem",
          "@media (min-width: 768px)": {
            height: "3.75rem",
          },
          "@media only screen and (max-width: 921px) and (min-width: 768px)": {
            height: "3.25rem",
          },
          borderRadius: props.borderRadius ? props.borderRadius : "6.25rem",
          background: `${fullConfig.theme.colors[props.fillColor]}`,
          textTransform: "none",
          color: `${fullConfig.theme.colors[props.labelColor]}`,
          fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
          fontSize: "clamp(1.125rem, 1vw + 0.1rem, 1.25rem)",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "1.5rem",
          letterSpacing: "0.00938rem",
          justifyContent: props.justifyContent
            ? props.justifyContent
            : "initial",
          boxShadow: props.noBox ? "none" : "3px 3px 5px rgba(0, 0, 0, 0.3)",
          border: props.border ? props.border : "none",
          "&:hover": {
            boxShadow: props.noHover
              ? "none"
              : "3px 3px 5px rgba(0, 0, 0, 0.3)",
            backgroundColor: `${fullConfig.theme.colors[props.fillColor]}`,
            color: `${fullConfig.theme.colors[props.labelColor]}`,
          },
        }}
      >
        <span className="button-content">{props.label}</span>
      </Button>
    </div>
  );
};

export default ButtonWithIcon;
