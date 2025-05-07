export function FamilyNode({ node, isRoot, onSubClick, openDialog, style, markHolucost }: any) {
  return (
    <div>
      <div>
        <div>
          <div>{node.name} </div>
          <div>
            {node.occu}
            {node.age ? <span>&nbsp;גיל {node.age}</span> : null}
            <br />
            {node.birt_date} - {node.deat_date}
          </div>
          <div>
            {node.birt_hebdate} - {node.deat_hebdate}
          </div>
          {node.birt_place} - {node.deat_place}
        </div>
        {node.hasSubTree && node.id && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSubClick(node.id);
            }}
          />
        )}
      </div>
    </div>
  );
}
