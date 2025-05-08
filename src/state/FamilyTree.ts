import { makeObservable, observable, action } from "mobx";
import type { Node, Relation } from "relatives-tree/lib/types";

const R = (id: string): Omit<Relation, "type"> => ({ id });

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
  public tree: Node[] | null = null;
  public isLoading = false;

  constructor() {
    makeObservable(this, {
      tree: observable,
      isLoading: observable,
      getTree: action,
      extractName: action,
      parseGrampsXml: action,
      setTree: action,
    });

    this.getTree();
  }

  setTree(nodes: Node[]) {
    this.tree = nodes;
  }

  extractName(personEl: Element): string {
    const first = personEl.querySelector("name > first")?.textContent?.trim();
    const surname = personEl.querySelector("name > surname")?.textContent?.trim();
    return [first, surname].filter(Boolean).join(" ") || personEl.getAttribute("id") || "Unknown";
  }

  async parseGrampsXml(xml: string): Promise<Node[]> {
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    console.log("DOC", doc);

    // ———————————————————————————————————————————————
    // 1. Читаем всех людей; мапа handle→Node‑заготовка
    // ———————————————————————————————————————————————
    interface PartialNode extends Omit<Node, "parents" | "children" | "siblings" | "spouses"> {
      parents: Set<string>;
      children: Set<string>;
      siblings: Set<string>;
      spouses: Set<string>;
    }

    const byHandle = new Map<string, PartialNode>();

    doc.querySelectorAll("person").forEach((p) => {
      const handle = p.getAttribute("handle")!; // всегда есть
      const id = p.getAttribute("id") || handle;
      const genderText = p.querySelector("gender")?.textContent?.trim();
      const gender: "M" | "F" | "U" = genderText === "M" ? "M" : genderText === "F" ? "F" : "U";
      const node: PartialNode = {
        id,
        gender,
        parents: new Set(),
        children: new Set(),
        siblings: new Set(),
        spouses: new Set(),
        // необязательные кастом‑поля можно сохранить сразу
        name: this.extractName(p),
      } as any;

      byHandle.set(handle, node);
    });

    // ———————————————————————————————————————————————
    // 2. Обрабатываем семьи → связи
    // ———————————————————————————————————————————————
    doc.querySelectorAll("family").forEach((f) => {
      const fatherHandle = f.querySelector("father")?.getAttribute("hlink") || undefined;
      const motherHandle = f.querySelector("mother")?.getAttribute("hlink") || undefined;
      const childrenHandles = Array.from(f.querySelectorAll("childref"))
        .map((c) => c.getAttribute("hlink")!)
        .filter(Boolean);

      // супружеские связи
      if (fatherHandle && motherHandle) {
        byHandle.get(fatherHandle)?.spouses.add(byHandle.get(motherHandle)!.id);
        byHandle.get(motherHandle)?.spouses.add(byHandle.get(fatherHandle)!.id);
      }

      // родители ↔ дети
      childrenHandles.forEach((chHandle) => {
        const childId = byHandle.get(chHandle)?.id;
        if (!childId) return;

        if (fatherHandle) byHandle.get(fatherHandle)!.children.add(childId);
        if (motherHandle) byHandle.get(motherHandle)!.children.add(childId);

        if (fatherHandle) byHandle.get(chHandle)!.parents.add(byHandle.get(fatherHandle)!.id);
        if (motherHandle) byHandle.get(chHandle)!.parents.add(byHandle.get(motherHandle)!.id);
      });

      // сиблинги: все дети одной семьи — друг другу братья/сёстры
      childrenHandles.forEach((c1) => {
        childrenHandles.forEach((c2) => {
          if (c1 !== c2) byHandle.get(c1)!.siblings.add(byHandle.get(c2)!.id);
        });
      });
    });

    //@ts-ignore
    const result: Node[] = Array.from(byHandle.values()).map((n) => ({
      id: n.id,
      gender: n.gender,
      parents: Array.from(n.parents).map(R),
      children: Array.from(n.children).map(R),
      siblings: Array.from(n.siblings).map(R),
      spouses: Array.from(n.spouses).map(R),
      // дополнительные поля (например, name) копируем как есть
      name: (n as any).name,
    }));

    return result;
  }

  async getTree() {
    try {
      this.isLoading = true;

      const xml = await fetch("./family-tree.gramps").then((r) => {
        return r.text();
      });

      const nodes = await this.parseGrampsXml(xml);
      console.log("nodes", nodes);

      this.setTree(nodes);

      console.log("tree in store", this.tree);
    } catch (err) {
      console.log("FamilyTree getTree error:", err);
    } finally {
      this.isLoading = false;
    }
  }
}
