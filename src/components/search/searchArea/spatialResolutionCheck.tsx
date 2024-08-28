import * as React from "react";
import CheckBoxObject from "../interface/CheckboxObject";
import { Checkbox, Typography } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import {
  GetAllParams,
  reGetFilterQueries,
  updateAll,
} from "../helper/ParameterList";
import tailwindConfig from "tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

interface SpatialResolutionCheck {
  value: string;
  display_name: string;
}
interface Props {
  src: SpatialResolutionCheck[];
  handleSearch(params: any, value: string, filterQueries: any): void;
}
const fullConfig = resolveConfig(tailwindConfig);

const SpatialResolutionCheck = (props: Props): JSX.Element => {
  let params = GetAllParams();

  let tempSRChecboxes = new Set<CheckBoxObject>();
  props.src.forEach((option) => {
    tempSRChecboxes.add({
      attribute: "spatial_resolution",
      value: option.value,
      checked: params.visLyrs.includes(option.value),
      displayName: option.display_name,
    });
  });
  const [sRCheckboxes, setSRCheckboxes] = React.useState(
    new Set<CheckBoxObject>(tempSRChecboxes)
  );
  const handleSRSelectionChange = (event) => {
    const { value, checked } = event.target;
    const newList = checked
      ? params.visLyrs.concat(value)
      : params.visLyrs.filter((item) => item !== value);
    newList.length > 0 ? params.setVisLyrs(newList) : params.setVisLyrs(null);
    const updatedSet = new Set(
      Array.from(sRCheckboxes).map((obj) => {
        if (obj.value === value) {
          return { ...obj, checked: checked };
        }
        return obj;
      })
    );

    // update filer queries based on the newList
    const filterQueries = reGetFilterQueries(params);
    const newFilterQueries = newList
      .map((i) => {
        return { attribute: "spatial_resolution", value: i };
      })
      .concat(
        filterQueries.filter((i) => i.attribute !== "spatial_resolution")
      );
    const query = params.query ? params.query : "*";
    props.handleSearch(params, query, newFilterQueries);
    setSRCheckboxes(updatedSet);
  };
  return (
    <div className={`flex items-center space-x-10 md:ml-[6em]`}>
      <div className="text-l whitespace-nowrap">Spatial Resolution:</div>
      <div className="flex space-x-4">
        {Array.from(sRCheckboxes).map((checkbox, index) => (
          <div key={index} className="flex items-center space-x-1">
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
              className="text-l cursor-pointer select-none"
              style={{ letterSpacing: 0.5 }}
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
