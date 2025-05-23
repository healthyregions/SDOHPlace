import * as React from "react";
import CheckBoxObject from "../interface/CheckboxObject";
import { Checkbox } from "@mui/material";
import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { RootState, AppDispatch } from "@/store";
import { setSpatialResolution } from "@/store/slices/searchSlice";
import { useDispatch, useSelector } from "react-redux";
import {usePlausible} from "next-plausible";
import {EventType} from "@/lib/event";

interface SpatialResolutionCheck {
  value: string;
  display_name: string;
}
interface Props {
  src: SpatialResolutionCheck[];
  schema: any;
}
const fullConfig = resolveConfig(tailwindConfig);

const SpatialResolutionCheck = (props: Props): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const plausible = usePlausible();
  const spatialResolution = useSelector(
    (state: RootState) => state.search.spatialResolution
  );
  const isSearching = useSelector(
    (state: RootState) => state.search.isSearching
  );
  const [checkboxes, setCheckboxes] = React.useState(new Set<CheckBoxObject>());

  React.useEffect(() => {
    const tempCheckboxes = new Set<CheckBoxObject>();
    props.src.forEach((option) => {
      const checked =
        spatialResolution?.includes(option.value.toString().trim()) || false;
      tempCheckboxes.add({
        attribute: "spatial_resolution",
        value: option.value,
        checked,
        displayName: option.display_name,
      });
    });
    setCheckboxes(tempCheckboxes);
  }, [props.src, spatialResolution]);

  const handleSelectionChange = (value: string, checked: boolean) => {
    if (isSearching) return;
    
    const updatedCheckboxes = new Set(
      Array.from(checkboxes).map((obj) => ({
        ...obj,
        checked: obj.value === value ? checked : obj.checked,
      }))
    );
    setCheckboxes(updatedCheckboxes);
    
    const selectedValues = Array.from(updatedCheckboxes)
      .filter((box) => box.checked)
      .map((box) => box.value);
      
    dispatch(setSpatialResolution(selectedValues));
    
    plausible(EventType.ChangedSpatialResolution, {
      props: {
        spatialResolution: selectedValues.join(', '),
      },
    });
  };

  return (
    <div className={`flex flex-col items-start ml-4`}>
      <div className="text-sm whitespace-nowrap">Filter by:</div>
      <div className="flex flex-col sm:flex-row flex-wrap">
        {Array.from(checkboxes).map((checkbox, index) => (
          <div key={index} className="flex items-center">
            <Checkbox
              id={`sr-checkbox-${index}`}
              checked={checkbox.checked}
              value={checkbox.value}
              disabled={isSearching}
              onChange={(event) =>
                handleSelectionChange(checkbox.value, event.target.checked)
              }
              icon={
                <span
                  style={{
                    borderRadius: "4px",
                    border: `2px solid ${fullConfig.theme.colors["frenchviolet"]}`,
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "transparent",
                  }}
                ></span>
              }
              checkedIcon={
                <span
                  style={{
                    borderRadius: "4px",
                    border: `2px solid ${fullConfig.theme.colors["frenchviolet"]}`,
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `${fullConfig.theme.colors["frenchviolet"]}`,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: "16px", height: "16px" }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              }
            />

            <div
              className="text-l cursor-pointer select-none pl-1 pr-2"
              style={{ letterSpacing: 0.5 }}
              onClick={() =>
                !isSearching && handleSelectionChange(checkbox.value, !checkbox.checked)
              }
            >
              {checkbox.displayName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SpatialResolutionCheck;