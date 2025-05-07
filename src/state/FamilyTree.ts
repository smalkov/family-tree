import { makeObservable, observable, action } from "mobx";

const R = (id: string): any => ({ id });
const mock = [
  {
    id: "malkovded",
    name: "Малков Анатолий Михайлович",
    gender: "male",
    parents: [],
    siblings: [],
    spouses: [R("malkovbab")],
    children: [R("yuri")],
  },
  {
    id: "malkovbab",
    name: "Малкова Альбина Алексеевна",
    gender: "female",
    parents: [],
    siblings: [],
    spouses: [R("malkovded")],
    children: [R("yuri")],
  },
  {
    id: "yuri",
    name: "Малков Юрий Анатольевич",
    gender: "male",
    parents: [R("malkovded"), R("malkovbab")],
    siblings: [],
    spouses: [R("svetlana")],
    children: [R("sergey")],
  },
  {
    id: "tetenovded",
    name: "Тетенов Вячеслав Иванович",
    gender: "male",
    parents: [],
    siblings: [],
    spouses: [R("tetenovbab")],
    children: [R("svetlana")],
  },
  {
    id: "tetenovbab",
    name: "Тетенова Антонина Ивановна",
    gender: "female",
    parents: [],
    siblings: [],
    spouses: [R("tetenovded")],
    children: [R("svetlana")],
  },
  {
    id: "svetlana",
    name: "Малкова Светлана",
    gender: "female",
    parents: [R("tetenovbab"), R("tetenovded")],
    siblings: [],
    spouses: [R("yuri")],
    children: [R("sergey")],
  },
  {
    id: "sergey",
    name: "Малков Сергей Юрьевич",
    age: 29,
    birt_date: "01-03-1996",
    gender: "male",
    // родители — ссылки на объекты выше
    parents: [R("yuri"), R("svetlana")],
    siblings: [],
    spouses: [R("tatyana")],
    children: [],
  },
  {
    id: "eduard",
    name: "Иванов Эдуард Николаевич",
    gender: "male",
    parents: [],
    siblings: [],
    spouses: [R("nina")],
    children: [R("tatyana")],
  },
  {
    id: "nina",
    name: "Иванова Наталья Ивановна",
    gender: "female",
    parents: [],
    siblings: [],
    spouses: [R("eduard")],
    children: [R("tatyana")],
  },
  {
    id: "tatyana",
    age: 28,
    birt_date: "",
    name: "Малкова Татьяна Эдуардовна",
    gender: "female",
    parents: [R("eduard"), R("nina")],
    siblings: [],
    spouses: [R("sergey")],
    children: [],
  },
];

export class FamilyTree {
  tree: any = [];
  isLoading = false;

  constructor() {
    makeObservable(this, {
      tree: observable,
      isLoading: observable,
      getTree: action,
    });
    this.getTree();
  }

  getTree() {
    try {
      this.isLoading = true;

      this.tree = mock;
    } catch (err) {
      console.log("FamilyTree getTree error:", err);
    } finally {
      this.isLoading = false;
    }
  }
}
