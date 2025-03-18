import { Box } from "@mui/material";
import ThemeIcons from "../helper/themeIcons";

export const ThemeOptions = (): JSX.Element => {
  return (
    <Box className="mt-6">
      <Box className="text-s font-bold" sx={{ mb: 1 }}>
        Theme
      </Box>
      <Box className="flex flex-col sm:flex-row flex-wrap gap-4">
        <ThemeIcons />
      </Box>
    </Box>
  );
};
