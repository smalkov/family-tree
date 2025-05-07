import { useRef, useState, useEffect } from "react";
import Tree, { RawNodeDatum } from "react-d3-tree";
import styles from "./MainTree.module.css";

function renderNode({ nodeDatum }: { nodeDatum: RawNodeDatum }) {
  if (nodeDatum.name === "__ROOT__") {
    return <g className="virtual-root" />;
  }
  const color = nodeDatum.attributes?.gender === "F" ? "#F6AEBC" : "#90CDF4";
  return (
    <g>
      <circle r={16} fill={color} />
      <text x={22} dy={5} fontSize={12}>
        {nodeDatum.name}
      </text>
    </g>
  );
}

const HEIGHT = 520;
const WIDTH = 820;
const myID = "0";
export const MainTree = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (wrapperRef.current) {
      const { width } = wrapperRef.current.getBoundingClientRect();
      setTranslate({ x: 500, y: 200 });
    }
  }, []);

  const familyData: any = {
    name: "__ROOT__",
    children: [
      {
        name: "Иван (дед)",
        attributes: { gender: "M", born: 1945 },
        children: [
          {
            name: "Алексей (отец)",
            attributes: { gender: "M", born: 1970 },
            children: [
              { name: "Сергей (я)", attributes: { gender: "M", born: 1995 } },
              { name: "Ольга (сестра)", attributes: { gender: "F", born: 1998 } },
              { name: "Дмитрий (брат)", attributes: { gender: "M", born: 2003 } },
            ],
          },
        ],
      },
      {
        name: "Мария (бабушка)",
        attributes: { gender: "F", born: 1947 },
        children: [
          { name: "Сергей (я)", attributes: { gender: "M", born: 1995 } },
          { name: "Ольга (сестра)", attributes: { gender: "F", born: 1998 } },
          { name: "Дмитрий (брат)", attributes: { gender: "M", born: 2003 } },
        ],
      },
    ],
  };

  console.log("familyData", familyData);

  return (
    <div ref={wrapperRef} className={styles.root}>
      <Tree
        data={familyData}
        orientation="vertical"
        translate={translate} // ← небольшое смещение вместо width/2
        collapsible={true}
        zoomable={true} // включено по‑умолчанию, но на всякий случай
        separation={{ siblings: 10, nonSiblings: 20 }}
        renderCustomNodeElement={renderNode}
      />
    </div>
  );
};
