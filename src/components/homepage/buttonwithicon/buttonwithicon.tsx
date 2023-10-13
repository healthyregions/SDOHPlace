import type { NextPage } from "next";
import { SvgIcon, Button, Icon } from "@mui/material";
import dataDiscoveryIcon from "../../../../public/logos/data-discovery-icon.svg";
import Image from "next/image";

const ButtonWithIcon: NextPage = () => {
  return (
    <div>
      {/* <SvgIcon component={dataDiscoveryIcon} viewBox="0 0 24 24"/> */}
      <Button className="h-[3.75rem] rounded-[6.25rem]"
        variant="contained"
        startIcon={
          <Image
            priority
            src={dataDiscoveryIcon}
            alt="The SDOH & Place project logo"
          />
        }
      >
        Data Discovery
      </Button>
    </div>
  );
};

export default ButtonWithIcon;
