import { MainTree } from "./components/MainTree";
import { FamilyTree } from "./state/FamilyTree";

import "./styles.css";

const familyTreeState = new FamilyTree();
function App() {
  return <MainTree familyTreeState={familyTreeState} />;
}

export default App;
