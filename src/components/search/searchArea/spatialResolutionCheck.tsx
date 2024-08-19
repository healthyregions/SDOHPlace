import * as React from "react";
import CheckBoxObject from "../interface/CheckboxObject";
import { Checkbox } from "@mui/material";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { styled } from "@mui/material/styles";

interface SpatialResolutionCheck {
  value: string;
  display_name: string;
}
interface Props {
  src: SpatialResolutionCheck[];
}

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  "&.Mui-checked": {
    color: "transparent",
    "& .MuiSvgIcon-root": {
      backgroundColor: "#7E1CC4",
      borderRadius: "4px",
      border: "1px solid #7E1CC4",
      padding: "0px",
    },
    "& .MuiSvgIcon-root path": {
      display: "none",
    },
  },
  "& .MuiSvgIcon-root": {
    borderRadius: "4px",
    border: "1px solid #7E1CC4",
  },
  color: "transparent",
}));

const SpatialResolutionCheck = (props: Props): JSX.Element => {
  const [resetStatus, setResetStatus] = React.useState(true);
  const [visLyrs, setVisLyrs] = useQueryState(
    "layers",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  let tempSRChecboxes = new Set<CheckBoxObject>();
  props.src.forEach((option) => {
    tempSRChecboxes.add({
      attribute: "special_resolution",
      value: option.value,
      checked: visLyrs.includes(option.value),
      displayName: option.display_name,
    });
  });
  const [sRCheckboxes, setSRCheckboxes] = React.useState(
    new Set<CheckBoxObject>(tempSRChecboxes)
  );
  const handleSRSelectionChange = (event) => {
    const { value, checked } = event.target;
    const newList = checked
      ? visLyrs.concat(value)
      : visLyrs.filter((item) => item !== value);
    newList.length > 0 ? setVisLyrs(newList) : setVisLyrs(null);
    const updatedSet = new Set(
      Array.from(sRCheckboxes).map((obj) => {
        if (obj.value === value) {
          return { ...obj, checked: checked };
        }
        return obj;
      })
    );
    setSRCheckboxes(updatedSet);
    setResetStatus(!resetStatus);
  };
  return (
    // <div style={{ minWidth: props.minWidth }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4">
    <div className="flex flex-row flex-wrap flex-left md:ml-[6em]">
      {Array.from(sRCheckboxes).map((checkbox, index) => (
        <div key={index}>
          <div className="flex flex-col items-center justify-center flex-grow mr-[1em] md:mr-[2.68em]">
            <CustomCheckbox
              checked={checkbox.checked}
              value={checkbox.value}
              onChange={handleSRSelectionChange}
            />
            <div className="text-center text-l" style={{ letterSpacing: 0.5 }}>
              {checkbox.displayName}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default SpatialResolutionCheck;
