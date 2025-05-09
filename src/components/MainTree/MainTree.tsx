import React, { useMemo, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import ReactFamilyTree from "react-family-tree";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import calcTree from "relatives-tree";
import { Dialog, DialogTitle, DialogContent, DialogContentText, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import styles from "./MainTree.module.css";
import { FamilyNode } from "../FamilyNode";

const Viewport = ({ className, children }: { className: string; children: React.ReactNode }) => (
  <div style={{ width: "100%", height: "100dvh", overflow: "hidden" }} className={className}>
    {children}
  </div>
);

const WIDTH = 160;
const HEIGHT = 170;

const myID = "I0000";

const MainTreeProto = ({ familyTreeState }: any) => {
  const [rootId, setRootId] = React.useState(myID);
  const { tree, isLoading } = familyTreeState;
  const [selected, setSelected] = useState<any>(null);

  const handleNodeClick = (n: any) => setSelected(n);
  const handleClose = () => setSelected(null);

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
    <Viewport className={styles.root}>
      <TransformWrapper minScale={0.2} maxScale={4} limitToBounds centerOnInit centerZoomedOut smooth>
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%" }}
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
    </Viewport>
  );
};

export const MainTree = observer(MainTreeProto);
