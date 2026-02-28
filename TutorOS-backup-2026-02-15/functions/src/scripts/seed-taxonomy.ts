import { db } from "../db";

/**
 * Seeds taxonomy data into the correct Firestore collections.
 *
 * Frontend reads from: taxonomy_domains, taxonomy_topics, taxonomy_subtopics
 * This script must write to those same collections to be useful.
 *
 * Previously this wrote everything into a flat "taxonomy_concepts" collection
 * that nothing in the app queried — that collection was a dead end.
 */

const TAXONOMY_DATA = [
  {
    domain: { id: "math-core", name: "Mathematics", type: "MATH", order: 1 },
    topics: [
      {
        id: "alg-1",
        name: "Algebra 1",
        order: 1,
        subTopics: [
          "Linear Equations",
          "Quadratic Equations",
          "Factoring",
          "Inequalities",
          "Functions & Relations",
        ],
      },
      {
        id: "geo",
        name: "Geometry",
        order: 2,
        subTopics: [
          "Circles",
          "Triangles",
          "Area and Circumference",
          "Coordinate Geometry",
          "Transformations",
        ],
      },
      {
        id: "alg-2",
        name: "Algebra 2",
        order: 3,
        subTopics: [
          "Polynomials",
          "Rational Expressions",
          "Exponential Functions",
          "Logarithms",
          "Sequences and Series",
        ],
      },
    ],
  },
];

export async function seedTaxonomy() {
  const batch = db.batch();

  for (const entry of TAXONOMY_DATA) {
    // 1. Write domain
    const domainRef = db.collection("taxonomy_domains").doc(entry.domain.id);
    batch.set(domainRef, entry.domain);
    console.log(`Seeding domain: ${entry.domain.name}`);

    // 2. Write topics + subtopics
    for (const topic of entry.topics) {
      const topicRef = db.collection("taxonomy_topics").doc(topic.id);
      batch.set(topicRef, {
        id: topic.id,
        domainId: entry.domain.id,
        name: topic.name,
        order: topic.order,
      });
      console.log(`  Seeding topic: ${topic.name}`);

      // 3. Write subtopics
      topic.subTopics.forEach((st, index) => {
        const stId = `${topic.id}-${index}`;
        const stRef = db.collection("taxonomy_subtopics").doc(stId);
        batch.set(stRef, {
          id: stId,
          topicId: topic.id,
          name: st,
          order: index + 1,
        });
      });
    }
  }

  await batch.commit();
  console.log("Taxonomy seeding complete.");
}
