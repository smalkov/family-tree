import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, IconButton, Link } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IFamilyNode } from "src/state/FamilyTree";

interface IProps {
  selected: IFamilyNode;
  setSelected: Dispatch<SetStateAction<IFamilyNode | null>>;
}

export const FamilyDialog = ({ selected, setSelected }: IProps) => {
  const surnameTaken = selected?.surnameTaken ? `(${selected?.surnameTaken})` : "";
  const handleClose = () => setSelected(null);

  console.log("selected", selected);

  return (
    <Dialog open={!!selected} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <strong>ID:</strong> {selected?.id} {selected?.name ?? " - "} {selected?.patronymic ?? " - "}
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText component="div">
          <p>
            {selected?.name} {selected?.surname} {surnameTaken} {selected?.patronymic}
          </p>
        </DialogContentText>

        <DialogContentText>
          <strong>Дата рождения: </strong>
          {selected?.birthDate}

          {selected?.birthDate && (
            <>
              <strong>Дата смерти: </strong>
              {selected?.deathDate}
            </>
          )}
        </DialogContentText>

        <DialogContentText>{selected?.note && <p>{selected?.note}</p>}</DialogContentText>

        <DialogContentText>
          <p style={{ fontSize: "14px", textAlign: "right", margin: "20px 0 0 0" }}>
            Можете сообщить подробности? Свяжитесь с{" "}
            {
              <Link underline="none" target="_blank" href={"https://wa.me/+79650723020"}>
                автором
              </Link>
            }
          </p>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
