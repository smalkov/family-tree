import React, { useRef, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import ReactFamilyTree from "react-family-tree";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import styles from "./MainTree.module.css";
import { FamilyNode } from "../FamilyNode";
import { FamilyTree } from "src/state/FamilyTree";

const WIDTH = 140;
const HEIGHT = 140;

const myID = "sergey";

const MainTreeProto = ({ familyTreeState }: any) => {
  const [rootId, setRootId] = React.useState(myID);
  const { tree, isLoading } = familyTreeState;
  console.log(isLoading);

  if (isLoading) {
    return <div style={{ textAlign: "center", marginTop: "100px" }}>Загрузка данных...</div>;
  }

  return (
    <div className={styles.root}>
      <TransformWrapper minScale={0.2} maxScale={3}>
        <TransformComponent contentClass={styles.wrapper} wrapperClass={styles.wrapper}>
          <ReactFamilyTree
            nodes={tree}
            rootId={rootId}
            width={WIDTH}
            height={HEIGHT}
            placeholders
            className={styles.tree}
            renderNode={(node) => {
              console.log("NODE", node);
              return (
                <FamilyNode
                  key={node.id}
                  isRoot={node.id === rootId}
                  node={node}
                  onSubClick={(id) => setRootId(id)}
                  handleNodeClick={(node) => console.log("click", node)}
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
    </div>
  );
};

export const MainTree = observer(MainTreeProto);
