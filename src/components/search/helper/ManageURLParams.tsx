import { useRouter } from "next/router";

type RouterType = ReturnType<typeof useRouter>;

export const updateSearchParams = (
  router: RouterType,
  currentParams: URLSearchParams,
  currentPath: string,
  key: string,
  value: string,
  action: "add" | "remove" | "overwrite"
) => {
  const params = new URLSearchParams(Array.from(currentParams.entries()));
  const existing = params.get(key);
  if (action === "overwrite") {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  } else if (action === "add") {
    // if a valid has been provided and there is no value for this param yet,
    // then simply set it.
    if (!existing && value) {
      params.set(key, value);
    }
    // if there is already a value for this param, split it by , (to account
    // for multiple values), add the new value to the list, and then join and set
    if (existing) {
      const vals = existing.split("|");
      if (vals.indexOf(value) < 0) {
        vals.push(value);
      }
      params.set(key, vals.join("|"));
    }
  } else {
    const vals = existing ? existing.split("|") : [];
    // if there is an existing value for this param, assume it is a list,
    // split by , and then remove this value from the list
    const validVals = vals.filter(function (v) {
      return v !== value;
    });
    // if the remaining list still has items, join and set the param again
    if (validVals.length > 0) {
      params.set(key, validVals.join("|"));
    } else {
      // otherwise, delete the key from the params list altogether
      params.delete(key);
    }
  }
  router.replace(`${currentPath}?${params.toString()}`);
};
