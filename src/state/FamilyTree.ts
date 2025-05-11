import { makeObservable, observable, action } from "mobx";
import type { ExtNode, Relation, Gender } from "relatives-tree/lib/types";
import { XMLParser } from "fast-xml-parser";

const R = (id: string): Omit<Relation, "type"> => ({ id });

export interface IFamilyNode extends ExtNode {
  note?: string;
  birthDate?: string;
  deathDate?: string;
  marriage?: string;
  name?: string;
  surname?: string;
  surnameTaken?: string;
  patronymic?: string;
}

const toArray = <T>(x: T | T[] | undefined): T[] => (Array.isArray(x) ? x : x ? [x] : []);
const uniq = (arr: any[]) => Array.from(new Set(arr));

export class FamilyTree {
  public tree: IFamilyNode[] | null = null;
  public isLoading = false;

  constructor() {
    makeObservable(this, {
      tree: observable,
      isLoading: observable,
      parseGramps: action,
      setTree: action,
    });

    this.getTree();
  }

  setTree(nodes: IFamilyNode[]) {
    this.tree = nodes;
  }

  parseGramps(db: any): IFamilyNode[] {
    const people = toArray(db.database.people.person);
    const families = toArray(db.database.families.family);
    const notes = toArray(db.database.notes.note);
    const events = toArray(db.database.events.event);

    const handleToId = new Map<string, string>();
    const idToHandle = new Map<string, string>();
    people.forEach((p) => {
      handleToId.set(p.handle, p.id);
      idToHandle.set(p.id, p.handle);
    });

    const childInFamily = new Map<string, any[]>();
    const parentInFamily = new Map<string, any[]>();

    families.forEach((fam) => {
      ["father", "mother"].forEach((role) => {
        const h = fam[role]?.hlink;
        if (h) {
          const arr = parentInFamily.get(h) ?? [];
          arr.push(fam);
          parentInFamily.set(h, arr);
        }
      });

      toArray(fam.childref).forEach((child: any) => {
        const h = child.hlink;
        if (h) {
          const arr = childInFamily.get(h) ?? [];
          arr.push(fam);
          childInFamily.set(h, arr);
        }
      });
    });

    const parsedNotes = people.map<any>((person: any) => {
      const hSelf = person.handle;

      const parentsHandles = (childInFamily.get(hSelf) ?? [])
        .flatMap((fam) => [fam.father?.hlink, fam.mother?.hlink])
        .filter(Boolean) as string[];

      const childrenHandles = (parentInFamily.get(hSelf) ?? []).flatMap((fam) =>
        toArray(fam.childref).map((c: any) => c.hlink)
      );

      const siblingsHandles = (childInFamily.get(hSelf) ?? []).flatMap((fam) =>
        toArray(fam.childref)
          .map((c: any) => c.hlink)
          .filter((h: string) => h !== hSelf)
      );

      const spousesHandles = (parentInFamily.get(hSelf) ?? []).flatMap((fam) => {
        const other =
          fam.father?.hlink === hSelf ? fam.mother?.hlink : fam.mother?.hlink === hSelf ? fam.father?.hlink : undefined;
        return other ? [other] : [];
      });

      const first = person.name.first as string;

      let surname = "";
      let patronymic = "";
      let surnameTaken = "";
      if (Array.isArray(person.name.surname)) {
        const taken = person.name.surname.find((s: any) => s.derivation === "Taken");
        const given = person.name.surname.find((s: any) => s.derivation === "Given");
        const patron = person.name.surname.find((s: any) => s.derivation === "Patronymic");
        surname = (given?.["#text"] ?? "") as string;
        surnameTaken = (taken?.["#text"] ?? "") as string;
        patronymic = patron?.["#text"] ?? "";
      } else if (typeof person.name.surname === "object") {
        surname = person.name.surname["#text"] as string;
      } else {
        surname = person.name.surname as string;
      }

      const eventsForPerson = events.find((note) => {
        return note.handle === person?.eventref?.hlink;
      });

      return {
        id: person.id,
        gender: (person.gender ?? "").toLowerCase() as Gender,
        name: first,
        surname,
        patronymic,
        surnameTaken,
        parents: uniq(parentsHandles).map((id) => ({ id: handleToId.get(id)! })),
        children: uniq(childrenHandles).map((id) => ({ id: handleToId.get(id)! })),
        siblings: uniq(siblingsHandles).map((id) => ({ id: handleToId.get(id)! })),
        spouses: uniq(spousesHandles).map((id) => ({ id: handleToId.get(id)! })),
        note: notes.find((note) => {
          return note.handle === person?.noteref?.hlink;
        })?.text,
        birthDate: eventsForPerson?.type === "Birth" ? eventsForPerson?.dateval?.val : "",
        deathDate: eventsForPerson?.type === "Death" ? eventsForPerson?.dateval?.val : "",
        marriage: eventsForPerson?.type === "Marriage" ? eventsForPerson?.dateval?.val : "",
      };
    });

    return parsedNotes as IFamilyNode[];
  }

  async getTree() {
    try {
      this.isLoading = true;
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "",
      });

      const xml = await fetch("./static/family-tree.gramps").then((r) => {
        return r.text();
      });
      const jsObj = parser.parse(xml);
      console.log(jsObj);

      const nodes = await this.parseGramps(jsObj);

      this.setTree(nodes);
    } catch (err) {
      console.error("FamilyTree getTree error:", err);
    } finally {
      this.isLoading = false;
    }
  }
}
