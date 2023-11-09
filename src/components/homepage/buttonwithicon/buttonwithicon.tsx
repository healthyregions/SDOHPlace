import type { NextPage } from "next";
import { Button, Icon, colors } from "@mui/material";
import Image from "next/image";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "tailwind.config.js";

const fullConfig = resolveConfig(tailwindConfig);
interface Props {
  svgIcon: any;
  label: string;
  fillColor: string;
  labelColor: string;
  onClick: any;
}

const ButtonWithIcon = (props: Props): JSX.Element => {
  return (
    <div>
      <Button
        variant="contained"
        startIcon={<Image priority src={props.svgIcon} alt={props.label} />}
        onClick={props.onClick}
        sx={{
          height: "3rem",
          "@media (min-width: 768px)": {
            height: "3.75rem",
          },
          "@media only screen and (max-width: 921px) and (min-width: 768px)": {
            height: "3.25rem",
          },
          borderRadius: "6.25rem",
          background: `${fullConfig.theme.colors[props.fillColor]}`,
          textTransform: "none",
          color: `${fullConfig.theme.colors[props.labelColor]}`,
          fontFamily: "nunito",
          fontSize: "clamp(1.125rem, 1vw + 0.1rem, 1.25rem)",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "1.5rem",
          letterSpacing: "0.00938rem",
        }}
      >
        {props.label}
      </Button>
    </div>
  );
};

export default ButtonWithIcon;
