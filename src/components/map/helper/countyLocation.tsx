import countyData from "./us_latlng.json";
import stateMatch from "./state_match.json";

interface CountyData {
  lat: number;
  lng: number;
}

interface StateData {
  counties: { [key: string]: CountyData };
}

interface CountyDataJson {
  [key: string]: StateData;
}

/**
 * Note the json referred is from https://github.com/hiddentao/us_latlng_json
 * @param state Full state name
 * @param county Carmel case county name
 * @returns lat and lng
 */
export default function getCountyGeo(
  state: string,
  county: string
): CountyData | null {
  const stateAbbr: string | undefined = stateMatch[state.trim().toLowerCase()];
  const stateData: CountyDataJson = countyData;
  if (stateData[stateAbbr].counties.hasOwnProperty(county.trim())) {
    return stateData[stateAbbr].counties[county];
  }
  return null;
}
