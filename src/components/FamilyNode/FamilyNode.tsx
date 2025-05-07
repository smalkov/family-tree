import classNames from "clsx";

interface IProps {
  node: any;
  isRoot: boolean;
  onSubClick: (id: string) => void;
  openDialog?: () => void;
  style?: any;
}

import styles from "./FamilyNode.module.css";

export const FamilyNode = ({ node, isRoot, onSubClick, openDialog, style }: IProps) => {
  return (
    <div className={styles.root} style={style}>
      <div
        // onClick={() => openDialog(node)}
        className={classNames(styles[node.DeathType], styles.inner, styles[node.gender], isRoot && styles.isRoot)}
      >
        <div className={styles.content}>
          <div className={styles.name}>{node.name} </div>
          {/* <ReactImageFallback
            alt={node.name}
            src={`http://digisoft.co.il/ftree/${node.img}.jpg`}
            height={70}
          /> */}
          <div className={styles.dates}>
            {node.occu}
            {node.age ? <span>&nbsp;גיל {node.age}</span> : null}
            <br />
            {node.birt_date} - {node.deat_date}
          </div>
          <div className={styles.dates}>
            {node.birt_hebdate} - {node.deat_hebdate}
          </div>
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
