import * as React from "react";
import CheckBoxObject from "../interface/CheckboxObject";
import { Checkbox, Typography } from "@mui/material";

import { GetAllParams, reGetFilterQueries } from "../helper/ParameterList";
import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
interface SpatialResolutionCheck {
  value: string;
  display_name: string;
}
interface Props {
  src: SpatialResolutionCheck[];
  handleSearch(params: any, value: string, filterQueries: any): void;
  filterQueries: any;
}
const fullConfig = resolveConfig(tailwindConfig);
const SpatialResolutionCheck = (props: Props): JSX.Element => {
  let params = GetAllParams();
  let currentParams = reGetFilterQueries(params);
  const stableCurrentSR = React.useMemo(() => {
    return JSON.stringify(params.spatialResolution || []);
  }, [params.spatialResolution]);
  React.useEffect(() => {
    const tempSRChecboxes = new Set<CheckBoxObject>();
    props.src.forEach((option) => {
      const checked = stableCurrentSR.includes(option.value.toString().trim());
      tempSRChecboxes.add({
        attribute: "spatial_resolution",
        value: option.value,
        checked: checked,
        displayName: option.display_name,
      });
    });
    const currentStateString = JSON.stringify(Array.from(sRCheckboxes));
    const newStateString = JSON.stringify(Array.from(tempSRChecboxes));
    if (currentStateString !== newStateString) {
      setSRCheckboxes(new Set(tempSRChecboxes));
    }
    props.handleSearch(
      params,
      currentParams.find((p) => p.attribute === "query")
        ? currentParams.find((p) => p.attribute === "query").value
        : "*",
      currentParams
    );
  }, [props.src, stableCurrentSR]);
  //
  const [sRCheckboxes, setSRCheckboxes] = React.useState(
    new Set<CheckBoxObject>()
  );
  const handleSRSelectionChange = (event) => {
    params.setPrevAction("filter");
    params.setShowDetailPanel(null);
    const { value, checked } = event.target;
    const newList = checked
      ? [...(params.spatialResolution || []), value]
      : params.spatialResolution.filter((item) => item !== value);
    params.setSpatialResolution(newList.length > 0 ? newList : null);
    params.setVisLyrs(newList.length > 0 ? newList : null);
    const updatedSet = new Set(
      Array.from(sRCheckboxes).map((obj) => {
        if (obj.value === value) {
          return { ...obj, checked: checked };
        }
        return obj;
      })
    );
    setSRCheckboxes(updatedSet);
    const filterQueries = reGetFilterQueries(params);
    const newFilterQueries = [
      ...newList.map((i) => ({
        attribute: "spatial_resolution",
        value: i,
      })),
      ...filterQueries.filter((i) => i.attribute !== "spatial_resolution"),
    ];
    const q = newFilterQueries.find((f) => f.attribute === "query")
      ? newFilterQueries.find((f) => f.attribute === "query").value
      : "*";
    props.handleSearch(params, q, newFilterQueries);
  };

  const onChange = () => {

  }
  return (
    <div className={`flex flex-col sm:flex-row items-center space-x-7`}>
      <div className="text-l whitespace-nowrap">Spatial Resolution:</div>
      <div className="flex flex-col sm:flex-row space-x-4">
        {Array.from(sRCheckboxes).map((checkbox, index) => (
          <div key={index} className="flex items-center">
            <Checkbox
              id={`sr-checkbox-${index}`}
              checked={checkbox.checked}
              value={checkbox.value}
              onChange={(event) =>
                handleSRSelectionChange({
                  target: {
                    value: checkbox.value,
                    checked: event.target.checked,
                  },
                })
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
              onClick={(event) =>
                handleSRSelectionChange({
                  target: {
                    value: checkbox.value,
                    checked: !checkbox.checked,
                  },
                })
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
