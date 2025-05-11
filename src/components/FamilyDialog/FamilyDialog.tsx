import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, IconButton, Link } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IFamilyNode } from "src/state/FamilyTree";
import { CONTACT_LINK_WATSAPP } from "../consts";

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
            <strong>ФИО: </strong>
            {selected?.name} {selected?.surname} {surnameTaken} {selected?.patronymic}
          </p>
        </DialogContentText>

        <DialogContentText>
          <strong>Дата рождения: </strong>
          {selected?.birthDate || "-"}

          {selected?.deathDate && (
            <p>
              <strong>Дата смерти: </strong>
              {selected?.deathDate}
            </p>
          )}
        </DialogContentText>

        <DialogContentText
          sx={{
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {
            <p>
              <strong>Что известно: </strong>
              {selected?.note ?? (
                <p>
                  Пока ничего. Сообщите любую известную информацию{" "}
                  <Link underline="none" target="_blank" href={CONTACT_LINK_WATSAPP}>
                    автору
                  </Link>
                  .
                </p>
              )}
            </p>
          }
        </DialogContentText>

        <DialogContentText>
          <p style={{ fontSize: "14px", textAlign: "right", margin: "40px 0 0 0" }}>
            Можете сообщить подробности, поделиться фото? Свяжитесь с{" "}
            {
              <Link underline="none" target="_blank" href={CONTACT_LINK_WATSAPP}>
                автором
              </Link>
            }
            .
          </p>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
