import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CloseIcon from "@mui/icons-material/Close";
import tailwindConfig from "../../../../../tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

interface ShareModalProps {
  open: any;
  onClose: any;
  currentUrl: string;
}
const fullConfig = resolveConfig(tailwindConfig);
const useStyles = makeStyles((theme) => ({
  modal: {
    color: `${fullConfig.theme.colors["almostblack"]}`,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50rem",
    backgroundColor: `${fullConfig.theme.colors["white"]}`,
    border: "none",
    padding: "2rem",
  },
}));

const ShareModal = (props: ShareModalProps): JSX.Element => {
  const classes = useStyles();
  const currentUrl = window.location.href;
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    window.alert("URL copied to clipboard");
  };
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={`${classes.modal}`}>
        <p className="mb-2">Share this URL</p>
        <TextField
          value={currentUrl}
          variant="outlined"
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleCopyToClipboard}>
                <FileCopyIcon />
              </IconButton>
            ),
          }}
        />
        <Button
          variant="contained"
          onClick={props.onClose}
          startIcon={<CloseIcon />}
          sx={{
            mt: 2,
            background: `${fullConfig.theme.colors["frenchviolet"]}`,
            fontFamily: `${fullConfig.theme.fontFamily["sans"]}`,
          }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ShareModal;
