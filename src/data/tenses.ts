export type TenseGroup = "present" | "past" | "future";
export type TenseDifficulty = "basic" | "intermediate" | "advanced";

export interface TenseExample {
  en: string;
  ka: string;
}

export interface Tense {
  id: string;
  name: string;
  group: TenseGroup;
  difficulty: TenseDifficulty;
  formula: string;
  whenToUse: string;
  georgianExplanation: string;
  examples: TenseExample[];
}

export const TENSES: Tense[] = [
  {
    id: "present-simple",
    name: "Present Simple",
    group: "present",
    difficulty: "basic",
    formula: "Subject + V1 (s/es for he/she/it)",
    whenToUse: "Use for habits, routines, facts, and general truths.",
    georgianExplanation:
      "გამოიყენება ჩვეულებრივი მოქმედებებისთვის, რუტინებისთვის, ფაქტებისთვის და ზოგადი ჭეშმარიტებებისთვის. მაგ: მზე ამოდის აღმოსავლეთიდან.",
    examples: [
      { en: "She drinks coffee every morning.", ka: "ის ყოველ დილა სვამს ყავას." },
      { en: "They live in Tbilisi.", ka: "ისინი თბილისში ცხოვრობენ." },
      { en: "Water boils at 100 degrees.", ka: "წყალი დუღს 100 გრადუსზე." },
    ],
  },
  {
    id: "present-continuous",
    name: "Present Continuous",
    group: "present",
    difficulty: "basic",
    formula: "Subject + am/is/are + V-ing",
    whenToUse: "Use for actions happening right now or temporary situations.",
    georgianExplanation:
      "გამოიყენება მოქმედებებისთვის, რომლებიც ახლა, ამ მომენტში ხდება, ან დროებითი სიტუაციებისთვის. მაგ: ის ახლა სწავლობს.",
    examples: [
      { en: "I am studying English right now.", ka: "ახლა ვსწავლობ ინგლისურს." },
      { en: "She is working from home this week.", ka: "ის ამ კვირაში სახლიდან მუშაობს." },
      { en: "They are building a new school.", ka: "ისინი ახალ სკოლას აშენებენ." },
    ],
  },
  {
    id: "present-perfect",
    name: "Present Perfect",
    group: "present",
    difficulty: "intermediate",
    formula: "Subject + have/has + V3 (past participle)",
    whenToUse:
      "Use for past actions with a connection to the present, or experiences.",
    georgianExplanation:
      "გამოიყენება წარსულ მოქმედებებზე, რომლებიც დაკავშირებულია აწმყოსთან. ასევე გამოცდილებების გამოხატვისთვის. მაგ: მე ვნახე ეს ფილმი (და ახლაც მახსოვს).",
    examples: [
      { en: "I have visited London twice.", ka: "ლონდონი ორჯერ მქონია მონახულებული." },
      { en: "She has already finished her homework.", ka: "მას უკვე დაუმთავრებია საშინაო დავალება." },
      { en: "They have never tried Georgian food.", ka: "მათ არასოდეს გაუსინჯავთ ქართული საჭმელი." },
    ],
  },
  {
    id: "present-perfect-continuous",
    name: "Present Perfect Continuous",
    group: "present",
    difficulty: "advanced",
    formula: "Subject + have/has + been + V-ing",
    whenToUse:
      "Use to show how long an action has been in progress up to now.",
    georgianExplanation:
      "გამოიყენება იმის საჩვენებლად, თუ რამდენ ხანს გრძელდება მოქმედება წარსულიდან დღემდე. მაგ: ის 2 საათია სწავლობს.",
    examples: [
      { en: "I have been learning English for two years.", ka: "ინგლისურს ორი წელია ვსწავლობ." },
      { en: "She has been working here since 2020.", ka: "ის 2020 წლიდან მუშაობს აქ." },
      { en: "They have been waiting for an hour.", ka: "ისინი ერთი საათია ელodebian." },
    ],
  },
  {
    id: "past-simple",
    name: "Past Simple",
    group: "past",
    difficulty: "basic",
    formula: "Subject + V2 (past form)",
    whenToUse:
      "Use for completed actions at a specific time in the past.",
    georgianExplanation:
      "გამოიყენება დასრულებული მოქმედებებისთვის, რომლებიც წარსულში კონკრეტულ დროს მოხდა. მაგ: გუშინ ვისაუზმე.",
    examples: [
      { en: "I visited my grandmother yesterday.", ka: "გუშინ ბებიას ვეწვიე." },
      { en: "She worked at a bank for five years.", ka: "მან ბანკში ხუთი წელი იმუშავა." },
      { en: "They watched a movie last night.", ka: "გუშინ საღამოს ფილმი ნახეს." },
    ],
  },
  {
    id: "past-continuous",
    name: "Past Continuous",
    group: "past",
    difficulty: "intermediate",
    formula: "Subject + was/were + V-ing",
    whenToUse:
      "Use for an action that was in progress at a specific moment in the past.",
    georgianExplanation:
      "გამოიყენება მოქმედებისთვის, რომელიც წარსულში კონკრეტულ მომენტში მიმდინარეობდა. მაგ: გუშინ 8 საათზე ვსაუზმობდი.",
    examples: [
      { en: "I was reading when she called.", ka: "მე ვკითხულობდი, როდესაც მან დარეკა." },
      { en: "They were playing football at 5 pm.", ka: "ისინი 5 საათზე ფეხბურთს თამაშობდნენ." },
      { en: "She was cooking dinner all evening.", ka: "ის მთელ საღამოს სადილს ამზადებდა." },
    ],
  },
  {
    id: "past-perfect",
    name: "Past Perfect",
    group: "past",
    difficulty: "intermediate",
    formula: "Subject + had + V3 (past participle)",
    whenToUse:
      "Use for an action that happened before another past action.",
    georgianExplanation:
      "გამოიყენება მოქმედებისთვის, რომელიც სხვა წარსულ მოქმედებამდე მოხდა. მაგ: სანამ ის მოვიდოდა, მე უკვე წავსულიყავი.",
    examples: [
      { en: "She had left before I arrived.", ka: "ის წასულიყო სანამ მე მოვიდოდი." },
      { en: "They had finished dinner when we called.", ka: "ჩვენს დარეკვამდე მათ სადილი დაემთავრებინათ." },
      { en: "I had never seen snow before that day.", ka: "იმ დღემდე თოვლი არასოდეს მენახა." },
    ],
  },
  {
    id: "past-perfect-continuous",
    name: "Past Perfect Continuous",
    group: "past",
    difficulty: "advanced",
    formula: "Subject + had + been + V-ing",
    whenToUse:
      "Use to show how long an action had been in progress before another past event.",
    georgianExplanation:
      "გამოიყენება იმის საჩვენებლად, თუ რამდენ ხანს გრძელდებოდა მოქმედება სხვა წარსულ მოქმედებამდე. მაგ: ის 3 საათი სწავლობდა სანამ დაიძინებდა.",
    examples: [
      { en: "I had been waiting for an hour when she arrived.", ka: "ერთი საათი ვიცდიდი, სანამ ის მოვიდა." },
      { en: "He had been working all day before he got sick.", ka: "ის მთელი დღე მუშაობდა სანამ დაავადდა." },
      { en: "They had been dating for a year before they got married.", ka: "ისინი ერთი წელი ხვდებოდნენ ერთმანეთს ქორწინებამდე." },
    ],
  },
  {
    id: "future-simple",
    name: "Future Simple",
    group: "future",
    difficulty: "basic",
    formula: "Subject + will + V1",
    whenToUse:
      "Use for decisions made at the moment of speaking, predictions, or promises.",
    georgianExplanation:
      "გამოიყენება სპონტანური გადაწყვეტილებებისთვის, პროგნოზებისთვის ან დაპირებებისთვის. მაგ: ახლა გადავწყვიტე — წავა!",
    examples: [
      { en: "I will call you tomorrow.", ka: "ხვალ დაგირეკავ." },
      { en: "She will probably pass the exam.", ka: "ის ალბათ ჩააბარებს გამოცდას." },
      { en: "They will help us move next week.", ka: "ისინი მომავალ კვირაში გადასვლაში დაგვეხმარებიან." },
    ],
  },
  {
    id: "future-continuous",
    name: "Future Continuous",
    group: "future",
    difficulty: "intermediate",
    formula: "Subject + will + be + V-ing",
    whenToUse:
      "Use for an action that will be in progress at a specific time in the future.",
    georgianExplanation:
      "გამოიყენება მოქმედებისთვის, რომელიც მომავალში კონკრეტულ დროს მიმდინარეობს. მაგ: ხვალ 8 საათზე ვისაუზმებ (ამ დროს პროცესში ვიქნები).",
    examples: [
      { en: "I will be working at 9 am tomorrow.", ka: "ხვალ 9 საათზე მუშაობაში ვიქნები." },
      { en: "She will be sleeping when you arrive.", ka: "შენი მოსვლისას ის ეძინება." },
      { en: "They will be traveling this time next week.", ka: "მომავალ კვირაში ამ დროს ისინი მოგზაურობაში იქნებიან." },
    ],
  },
  {
    id: "future-perfect",
    name: "Future Perfect",
    group: "future",
    difficulty: "advanced",
    formula: "Subject + will + have + V3 (past participle)",
    whenToUse:
      "Use for an action that will be completed before a specific time in the future.",
    georgianExplanation:
      "გამოიყენება მოქმედებისთვის, რომელიც მომავალში კონკრეტულ დრომდე დასრულდება. მაგ: ხვალ 5 საათისთვის უკვე დავამთავრებ.",
    examples: [
      { en: "I will have finished the report by Friday.", ka: "პარასკევისთვის ანგარიში დამეწერება." },
      { en: "She will have graduated by next summer.", ka: "მომავალ ზაფხულამდე ის დაამთავრებს სწავლას." },
      { en: "They will have built the house by December.", ka: "დეკემბრისთვის სახლი აშენებული იქნება." },
    ],
  },
  {
    id: "future-perfect-continuous",
    name: "Future Perfect Continuous",
    group: "future",
    difficulty: "advanced",
    formula: "Subject + will + have + been + V-ing",
    whenToUse:
      "Use to show how long an action will have been in progress by a specific future time.",
    georgianExplanation:
      "გამოიყენება იმის საჩვენებლად, თუ რამდენ ხანს გრძელდება მოქმედება მომავლის კონკრეტულ მომენტამდე. მაგ: ხვალ 5 საათისთვის 3 საათი ვიქნები სწავლაში.",
    examples: [
      { en: "By June, I will have been studying English for three years.", ka: "ივნისისთვის სამი წელი იქნება, რაც ინგლისურს ვსწავლობ." },
      { en: "She will have been working here for a decade by 2030.", ka: "2030 წლისთვის ის ათი წელი იქნება, რაც აქ მუშაობს." },
      { en: "They will have been living together for five years next month.", ka: "მომავალ თვეს ხუთი წელი იქნება, რაც ისინი ერთად ცხოვრობენ." },
    ],
  },
];

export const TENSE_GROUPS: { label: string; value: TenseGroup }[] = [
  { label: "Present", value: "present" },
  { label: "Past", value: "past" },
  { label: "Future", value: "future" },
];

export const DIFFICULTY_LABELS: Record<TenseDifficulty, string> = {
  basic: "Basic",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const DIFFICULTY_COLORS: Record<TenseDifficulty, string> = {
  basic: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20",
  intermediate: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20",
  advanced: "text-rose-600 bg-rose-50 dark:text-rose-600 dark:bg-rose-900/20",
};

export const GROUP_COLORS: Record<TenseGroup, string> = {
  present: "from-emerald-500 to-teal-500",
  past: "from-amber-500 to-orange-500",
  future: "from-violet-500 to-purple-500",
};
