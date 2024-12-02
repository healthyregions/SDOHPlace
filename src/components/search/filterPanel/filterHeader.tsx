import { AppDispatch } from "@/store";
import { setShowFilter } from "@/store/slices/uiSlice";
import { Box, IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";


export const FilterHeader = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Box display="flex" alignItems="center">
      <Box flexGrow={1}>
        <div className="text-s font-bold">Sort</div>
      </Box>
      <Box>
        <IconButton
          className="text-frenchviolet p-0"
          onClick={() => dispatch(setShowFilter(false))}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};