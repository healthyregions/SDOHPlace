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
}

const ButtonWithIcon: NextPage<Props> = (props: Props) => {
  return (
    <div>
      <Button
        variant="contained"
        startIcon={
          <Image
            priority
            src={props.svgIcon}
            alt="The SDOH & Place project logo"
          />
        }
        sx={{
          height: "3.75rem",
          borderRadius: "6.25rem",
          background: `${fullConfig.theme.colors[props.fillColor]}`,
          textTransform: "none",
          color: `${fullConfig.theme.colors[props.labelColor]}`,
          fontFamily: "nunito",
          fontSize: "clamp(1.125rem, 1vw + 0.5rem, 1.25rem)",
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
