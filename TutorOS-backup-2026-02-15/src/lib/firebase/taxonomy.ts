import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { db } from "./config";
import {
  TaxonomyDomain,
  TaxonomyTopic,
  TaxonomySubTopic,
  TaxonomyDomainType,
  TaxonomyNode,
} from "@/types/taxonomy";
import { OPENSTAX_ALGEBRA_TOC } from "@/data/openstax-toc";

// --- Fetching ---

export const getDomains = async (): Promise<TaxonomyDomain[]> => {
  const q = query(collection(db, "taxonomy_domains"), orderBy("order"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as TaxonomyDomain);
};

export const getTopics = async (domainId: string): Promise<TaxonomyTopic[]> => {
  const q = query(
    collection(db, "taxonomy_topics"),
    where("domainId", "==", domainId),
    orderBy("order"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as TaxonomyTopic);
};

export const getSubTopics = async (
  topicId: string,
): Promise<TaxonomySubTopic[]> => {
  const q = query(
    collection(db, "taxonomy_subtopics"),
    where("topicId", "==", topicId),
    orderBy("order"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as TaxonomySubTopic);
};

// --- Seeding ---

export const seedInitialTaxonomy = async () => {
  const batch = writeBatch(db);

  // 1. Create Math Domain
  const mathDomainRef = doc(db, "taxonomy_domains", "math-core");
  const mathDomain: TaxonomyDomain = {
    id: "math-core",
    name: "Mathematics",
    type: TaxonomyDomainType.MATH,
    order: 1,
  };
  batch.set(mathDomainRef, mathDomain);

  // 2. Create Topics (Algebra 1, Geometry, Algebra 2)
  const topics = [
    { id: "alg-1", name: "Algebra 1", order: 1 },
    { id: "geo", name: "Geometry", order: 2 },
    { id: "alg-2", name: "Algebra 2", order: 3 },
    { id: "pre-calc", name: "Pre-Calculus", order: 4 },
  ];

  for (const topic of topics) {
    const topicRef = doc(db, "taxonomy_topics", topic.id);
    const topicData: TaxonomyTopic = {
      id: topic.id,
      domainId: mathDomain.id,
      name: topic.name,
      order: topic.order,
    };
    batch.set(topicRef, topicData);

    // 3. Create Sample Subtopics for each
    const subtopics = getSampleSubtopics(topic.id);
    subtopics.forEach((st, index) => {
      const stRef = doc(db, "taxonomy_subtopics", `${topic.id}-${index}`);
      const stData: TaxonomySubTopic = {
        id: `${topic.id}-${index}`,
        topicId: topic.id,
        name: st,
        order: index + 1,
      };
      batch.set(stRef, stData);
    });
  }

  await batch.commit();
  console.log("Taxonomy seeding complete.");
};

export const seedOpenStaxTaxonomy = async () => {
  const batch = writeBatch(db);
  const domainId = "math-openstax";

  // 1. Create Domain
  const domainRef = doc(db, "taxonomy_domains", domainId);
  batch.set(domainRef, {
    id: domainId,
    name: "Mathematics (OpenStax)",
    type: TaxonomyDomainType.MATH,
    order: 0, // Prioritize this
  });

  // 2. Create Topic (The Book)
  const topicId = "alg-trig-2e";
  const topicRef = doc(db, "taxonomy_topics", topicId);
  batch.set(topicRef, {
    id: topicId,
    domainId,
    name: OPENSTAX_ALGEBRA_TOC.title,
    order: 0,
    description: "Standard Curriculum",
  });

  // 3. Create Subtopics (Chapters)
  let chapterIndex = 0;
  for (const chapter of OPENSTAX_ALGEBRA_TOC.chapters) {
    chapterIndex++;
    const subTopicId = `alg-ch-${chapterIndex}`;
    const subTopicRef = doc(db, "taxonomy_subtopics", subTopicId);

    batch.set(subTopicRef, {
      id: subTopicId,
      topicId,
      name: `${chapterIndex}. ${chapter.title}`,
      order: chapterIndex,
      // We can't store complex objects like 'user_tags' on the strict interface unless we update the type
      // so for now we'll just store the name.
      // Ideally we would double-nest (Topics -> Subtopics -> Sections) but our UI is 3-levels deep only.
      // So we stop here.
    });
  }

  await batch.commit();
  console.log("OpenStax Taxonomy seeded via Batch.");
};

function getSampleSubtopics(topicId: string): string[] {
  switch (topicId) {
    case "alg-1":
      return [
        "Linear Equations",
        "Inequalities",
        "Functions",
        "Exponents",
        "Polynomials",
        "Quadratics",
      ];
    case "geo":
      return [
        "Points, Lines, Planes",
        "Angles",
        "Triangles",
        "Quadrilaterals",
        "Circles",
        "3D Geometry",
      ];
    case "alg-2":
      return [
        "Complex Numbers",
        "Polynomial Functions",
        "Rational Exponents",
        "Logarithms",
        "Transformations",
      ];
    case "pre-calc":
      return ["Trigonometry", "Conics", "Vectors", "Matrices", "Limits"];
    default:
      return [];
  }
}
// --- Unified Node System (New) ---

export const getNodes = async (
  parentId: string | null = null,
): Promise<TaxonomyNode[]> => {
  const q = query(
    collection(db, "taxonomy_nodes"),
    where("parentId", "==", parentId),
    orderBy("order"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as TaxonomyNode[];
};

export const addNode = async (
  node: Omit<TaxonomyNode, "id">,
): Promise<string> => {
  const nodeRef = doc(collection(db, "taxonomy_nodes"));
  await setDoc(nodeRef, node);
  return nodeRef.id;
};

export const updateNode = async (
  id: string,
  updates: Partial<TaxonomyNode>,
): Promise<void> => {
  const nodeRef = doc(db, "taxonomy_nodes", id);
  await setDoc(nodeRef, updates, { merge: true });
};

export const deleteNode = async (id: string): Promise<void> => {
  const nodeRef = doc(db, "taxonomy_nodes", id);
  // Hard delete — at this stage, soft-deletes add complexity without a
  // clear product requirement for undo/recovery. Can be introduced later
  // if needed. Note: this does not recursively delete children.
  await deleteDoc(nodeRef);
};
