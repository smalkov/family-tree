import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import ReactFamilyTree from "react-family-tree";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import calcTree from "relatives-tree";

import styles from "./MainTree.module.css";
import { FamilyNode } from "../FamilyNode";
import { FamilyDialog } from "../FamilyDialog";
import { IFamilyNode } from "src/state/FamilyTree";

const WIDTH = 160;
const HEIGHT = 190;

const myID = "I0000";

interface IState {
  tree: IFamilyNode[];
  isLoading: boolean;
}
interface IProps {
  familyTreeState: IState;
}

const MainTreeProto = ({ familyTreeState }: IProps) => {
  const [rootId, setRootId] = React.useState(myID);
  const [selected, setSelected] = useState<IFamilyNode | null>(null);

  const { tree, isLoading } = familyTreeState;

  const handleNodeClick = (n: IFamilyNode) => setSelected(n);

  if (isLoading) {
    return <div style={{ textAlign: "center", marginTop: "100px" }}>Загрузка данных...</div>;
  }

  if (!tree?.length) {
    return <div style={{ textAlign: "center", marginTop: "100px" }}>Нет данных</div>;
  }
  console.log("full tree", toJS(tree));

  const { nodes, canvas } = calcTree(tree, { rootId: rootId });

  const contentW = canvas.width * (WIDTH / 2);
  const contentH = canvas.height * (HEIGHT / 2);

  return (
    <div className={styles.root}>
      <TransformWrapper minScale={0.2} maxScale={4} limitToBounds centerOnInit centerZoomedOut smooth>
        <TransformComponent
          wrapperClass={styles.wrapper}
          contentStyle={{ width: contentW, height: contentH, position: "relative" }}
        >
          <ReactFamilyTree
            nodes={nodes}
            rootId={rootId}
            width={WIDTH}
            height={HEIGHT}
            className={styles.tree}
            renderNode={(node) => {
              return (
                <FamilyNode
                  key={`${node.id}-${node.left}-${node.top}`}
                  isRoot={node.id === rootId}
                  node={node}
                  onSubClick={(id) => {
                    setRootId(id);
                  }}
                  handleNodeClick={handleNodeClick}
                  style={{
                    width: WIDTH,
                    height: HEIGHT,
                    transform: `translate(${node.left * (WIDTH / 2)}px, ${node.top * (HEIGHT / 2)}px)`,
                  }}
                />
              );
            }}
          />
        </TransformComponent>
      </TransformWrapper>

      <FamilyDialog selected={selected} setSelected={setSelected} />
    </div>
  );
};

export const MainTree = observer(MainTreeProto);
