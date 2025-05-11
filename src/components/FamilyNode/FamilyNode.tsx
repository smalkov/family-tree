import classNames from "clsx";
import { IconButton } from "@mui/material";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";

interface IProps {
  node: IFamilyNode;
  isRoot: boolean;
  onSubClick: (id: string) => void;
  handleNodeClick?: (node: IFamilyNode) => void;
  style?: Record<string & number, string>;
}

import styles from "./FamilyNode.module.css";
import { IFamilyNode } from "src/state/FamilyTree";

export const FamilyNode = ({ node, isRoot, onSubClick, handleNodeClick, style }: IProps) => {
  const birthDate = node.birthDate ? node.birthDate : "-";
  const surname = node.surnameTaken ? node.surnameTaken : node.surname;
  const surnameTakenTech = `${node.surname ? `(${node.surname})` : ""}`;
  const surnameTaken = node.surnameTaken === "" ? "" : surnameTakenTech;

  return (
    <div className={styles.root} style={style}>
      <div
        onClick={() => handleNodeClick?.(node)}
        className={classNames(styles.inner, styles[node.gender], isRoot && styles.isRoot)}
      >
        <div>
          <div className={styles.name}>{node.name}</div>
          <div className={styles.name}>{surname}</div>
          <div className={styles.name}>{node.patronymic}</div>
          <div className={styles.name}>{surnameTaken}</div>
          <div>
            {node.marriage ? <span>{node.marriage}</span> : null}
            <br />
            {birthDate}
            {node.deathDate ? `- ${node.deathDate}` : ""}
          </div>
        </div>
        {node.hasSubTree && node.id && (
          <div className={styles.sub}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onSubClick(node.id);
              }}
            >
              <AccountTreeOutlinedIcon />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};
