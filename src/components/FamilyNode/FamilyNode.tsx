import classNames from "clsx";

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
          <div className={styles.dates}>
            {node.age ? <span>{node.age}</span> : null}
            <br />
            {node.birt_date}
            {node.deat_date ? `- ${node.deat_date}` : ""}
          </div>
          {/* <div className={styles.dates}>
            {node.birt_hebdate} - {node.deat_hebdate}
          </div> */}
          {node.birt_place} - {node.deat_place}
        </div>
        {node.hasSubTree && node.id && (
          <div
            className={classNames(styles.sub, styles[node.gender])}
            onClick={(e) => {
              e.stopPropagation();
              onSubClick(node.id);
            }}
          />
        )}
      </div>
    </div>
  );
};
