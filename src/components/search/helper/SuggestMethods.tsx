export const isLocationTerm = (suggest) => {
  const stateNames = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const statePattern = new RegExp(
    `^[A-Za-z\\s.'()-]+ (${stateNames.join("|")})$`
  );

  return (
    /^[A-Za-z\s.'()-]+,\s[A-Za-z\s]+$/.test(suggest.term) ||
    statePattern.test(suggest.term) || // for South coast Alaska
    /^(North|South|West|East)\s[A-Za-z\s]+$/.test(suggest.term)
  );
};

export const containsYear = (text) => {
  return /\([12][0-9]{3}\)/.test(text);
};
