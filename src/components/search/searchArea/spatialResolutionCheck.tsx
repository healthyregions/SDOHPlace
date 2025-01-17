import * as React from "react";
import CheckBoxObject from "../interface/CheckboxObject";
import { Checkbox } from "@mui/material";
import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import { RootState } from "@/store";
import { setSpatialResolution } from "@/store/slices/searchSlice";
import { useDispatch, useSelector } from "react-redux";
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
  const dispatch = useDispatch();
  const spatialResolution = useSelector(
    (state: RootState) => state.search.spatialResolution
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
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center ml-4 space-x-7`}>
      <div className="text-l whitespace-nowrap">Spatial Resolution:</div>
      <div className="flex flex-col sm:flex-row space-x-4">
        {Array.from(checkboxes).map((checkbox, index) => (
          <div key={index} className="flex items-center">
            <Checkbox
              id={`sr-checkbox-${index}`}
              checked={checkbox.checked}
              value={checkbox.value}
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
                handleSelectionChange(checkbox.value, !checkbox.checked)
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
