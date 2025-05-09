import classNames from "clsx";
import { IconButton } from "@mui/material";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
interface IProps {
  node: any;
  isRoot: boolean;
  onSubClick: (id: string) => void;
  handleNodeClick?: (node: any) => void;
  style?: any;
}

import styles from "./FamilyNode.module.css";

export const FamilyNode = ({ node, isRoot, onSubClick, handleNodeClick, style }: IProps) => {
  return (
    <div className={styles.root} style={style}>
      <div
        onClick={() => handleNodeClick?.(node)}
        className={classNames(styles[node.DeathType], styles.inner, styles[node.gender], isRoot && styles.isRoot)}
      >
        <div className={styles.content}>
          <div className={styles.name}>{node.name}</div>
          <div className={styles.name}>{node.surname}</div>
          <div className={styles.name}>{node.patronymic}</div>
          {node.surnameTaken && <div className={styles.name}>({node.surnameTaken})</div>}
          <div className={styles.dates}>
            {node.age ? <span>{node.age}</span> : null}
            {node.marriage ? <span>{node.marriage}</span> : null}
            <br />
            {node.birthDate}
            {node.deathDate ? `- ${node.deathDate}` : ""}
          </div>
          {node.birt_place} - {node.deat_place}
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
