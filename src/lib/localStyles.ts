import { makeStyles } from "@mui/styles";
import tailwindConfig from "../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

const fullConfig = resolveConfig(tailwindConfig);

export const localStyles = {
  overlaysButton: {
    padding: 0,
    margin: 0,
    textTransform: "none",
    color: `${fullConfig.theme.colors["frenchviolet"]}`,
    fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
    fontSize: "1.1em",
  },
};

export const useLocalStyles = makeStyles({ localStyles });
