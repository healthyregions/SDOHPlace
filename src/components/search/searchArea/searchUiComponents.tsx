import * as React from "react";
import { Popper, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import tailwindConfig from "../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

const fullConfig = resolveConfig(tailwindConfig);

export const useSearchStyles = makeStyles((theme) => ({
  searchBox: {
    fontFamily: `${fullConfig.theme.fontFamily["sans"]} !important`,
    "& input": {
      fontFamily: `${fullConfig.theme.fontFamily["sans"]} !important`,
      "&:focus": {
        outline: "none",
        borderColor: "transparent",
        boxShadow: "none",
      },
      "&::-webkit-search-cancel-button": {
        display: "none",
      },
    },
    "& .MuiOutlinedInput-root": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent",
      },
    },
    "& .MuiAutocomplete-option": {
      "&[aria-selected='true']": {
        backgroundColor: "transparent !important",
      },
      "&:hover": {
        backgroundColor: "#f0f0f0 !important",
      },
      "&.Mui-focused": {
        backgroundColor: "transparent !important",
      },
      "&[data-focus='true']": {
        backgroundColor: "transparent !important",
      },
    },
  },
  popper: {
    borderRadius: "1em !important",
    zIndex: 1000,
  },
  paper: {
    fontFamily: `${fullConfig.theme.fontFamily["sans"]} !important`,
    fontColor: `${fullConfig.theme.colors["smokegray"]}`,
    fontSize: "0.875em",
    marginTop: "0.1em",
    width: "80%",
    transform: "translateX(5%)",
    zIndex: 1000,
  },
  aiModeButton: {
    color: fullConfig.theme.colors["frenchviolet"],
    "&.active": {
      backgroundColor: fullConfig.theme.colors["frenchviolet"],
      color: "white",
    },
    "&:hover": {
      color: fullConfig.theme.colors["frenchviolet"],
    },
    "&:hover&.active": {
      backgroundColor: fullConfig.theme.colors["frenchviolet"],
      color: "white",
    },
  },
  loadingButton: {
    color: fullConfig.theme.colors["frenchviolet"],
    animation: "$spin 1s linear infinite",
  },
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

export const CustomPopper = (props) => {
  const classes = useSearchStyles();
  return (
    <Popper {...props} className={classes.popper} placement="bottom-start" />
  );
};

export const CustomPaper = (props) => {
  const classes = useSearchStyles();
  return <Paper {...props} className={classes.paper} />;
};

export const CustomListbox = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement> & { 
    onMouseEnter: () => void, 
    onMouseLeave: () => void 
  }
>((props, ref) => {
  return (
    <ul
      ref={ref}
      {...props}
      className={`${props.className || ""} custom-autocomplete-listbox`}
    />
  );
});

CustomListbox.displayName = "CustomListbox"; 