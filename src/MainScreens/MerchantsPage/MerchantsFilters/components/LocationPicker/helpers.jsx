export const getNameById = (id, locations) => {
  // Find the location object by id
  const location = locations.find((item) => item.id === id);

  // If no location is found, return null
  if (!location) return null;

  // Extract the main name of the location
  const mainName = location?.name || "";

  // Safely extract names from short_names if the array is not empty
  const shortNames =
    Array.isArray(location?.short_names) && location.short_names.length > 0
      ? location.short_names.map((shortName) => shortName.name).filter(Boolean) // Filter to exclude any falsy values
      : [];

  // Combine the main name and short names into a single string
  const allNames = [mainName, ...shortNames].join(", ") + ".";

  return allNames;
};
