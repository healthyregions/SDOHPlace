import glossaryEntries from "../../meta/glossary.json";
import * as React from "react";
import Popover from "@mui/material/Popover";

export default function GlossaryPopover({ entry, display = null }) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? `${entry}-popover` : undefined;

  const content = display ? display : glossaryEntries[entry];

  if (content) {
    return (
      <>
        <button
          className={"underline decoration-dotted"}
          aria-describedby={id}
          onClick={handleClick}
        >
          {entry}
        </button>
        {/* TODO: Remove inline style, override default Popover style instead */}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          style={{ boxShadow: 'rgb(170, 170, 170) 6px 12px 16px -8px' }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <div
            className={
              "text-almostblack py-1 px-2 rounded text-center font-sans text-sm bg-lightbisque"
            }
          >
            {content}
          </div>
        </Popover>
      </>
    );
  } else {
    return <>{entry}</>;
  }
}
