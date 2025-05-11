import { Dialog, DialogTitle, DialogContent, DialogContentText, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface IProps {
  selected: any;
  setSelected: any;
}

export const FamilyDialog = ({ selected, setSelected }: IProps) => {
  const handleClose = () => setSelected(null);

  return (
    <Dialog open={!!selected} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {selected?.name ?? selected?.id}
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText component="div">
          <p>
            <strong>ID:</strong> {selected?.id}
          </p>
          <p>
            <strong>Name:</strong> {selected?.name} {selected?.patronymic}
          </p>
          {selected?.note && (
            <p>
              <strong>Заметка:</strong> {selected?.note}
            </p>
          )}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
