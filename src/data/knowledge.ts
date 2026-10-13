import { profile } from "./profile";

// Extra facts for the "ask about deni" AI assistant, on top of everything in
// profile.ts. None of this is shown on the site, but the assistant may repeat any
// of it to visitors, so only add what you're happy to share publicly.
//
// When the assistant replies "I don't have information about …", add the answer
// here as a question and answer, then push. No training needed: it reads this
// file on every chat, and the question doesn't have to match word for word.

export const faq: { q: string; a: string }[] = [
  { q: "How old is Deni?", a: "Deni is 24." },
  {
    q: "Does Deni need visa sponsorship to work in the U.S.?",
    a: "No, Deni doesn't need visa sponsorship. He plans to move to the U.S. soon and live there.",
  },
  { q: "When can Deni start a new job?", a: "Deni can start a new role in May 2027." },
  {
    q: "What kind of work is Deni looking for?",
    a: "Deni is open to everything: full-time, contract or freelance, and remote, hybrid or on-site.",
  },
  {
    q: "What are Deni's salary or rate expectations?",
    a: `Deni prefers to discuss salary and rates directly by email at ${profile.email}.`,
  },
  {
    q: "Which hours can Deni work? Does he overlap with U.S. time zones?",
    a: "Deni is based in Sarajevo (Central European Time) and is flexible: his working hours depend on what's agreed with the team. He has worked with U.S.-based teams since 2023.",
  },
  {
    q: "What does Deni do outside of work? What are his hobbies?",
    a: "Deni played professional basketball in Bosnia, Turkey, Serbia and Philadelphia (USA). He also enjoys volleyball, soccer, chess, paintball, table tennis, pool and darts, loves nature and listens to all kinds of music.",
  },
  {
    q: "Why does Deni work in AI? What does he enjoy most about it?",
    a: "Curiosity and a passion for keeping up with new trends. Deni loves AI and sees it as the future of his career.",
  },
  {
    q: "What are Deni's biggest strengths?",
    a: "Being 100% correct and precise, being on time, staying persistent until the job is done, and not wasting time. He's a constant learner, works smoothly with remote U.S.-based teams, and ships fast: he took Carina from requirements to a deployed V1 in under two days.",
  },
];

// Topics the assistant must never discuss, even when asked directly.
export const offLimits = [
  "Deni's family or relationships, including whether he has a wife or kids",
  "exact money figures: salary, rates, earnings or prices",
  "specific internal details of his projects beyond what's on this site",
];
