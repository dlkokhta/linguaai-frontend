export interface QuizQuestion {
  template: string;
  answer: string;
}

export const TENSES_QUIZ: Record<string, QuizQuestion[]> = {
  "present-simple": [
    { template: "She ___ coffee every morning.",        answer: "drinks"   },
    { template: "They ___ in Tbilisi.",                 answer: "live"     },
    { template: "Water ___ at 100 degrees.",            answer: "boils"    },
  ],
  "present-continuous": [
    { template: "I ___ English right now.",             answer: "am studying"  },
    { template: "She ___ from home this week.",         answer: "is working"   },
    { template: "They ___ a new school.",               answer: "are building" },
  ],
  "present-perfect": [
    { template: "I ___ London twice.",                  answer: "have visited" },
    { template: "She has already ___ her homework.",    answer: "finished"     },
    { template: "They have never ___ Georgian food.",   answer: "tried"        },
  ],
  "present-perfect-continuous": [
    { template: "I ___ English for two years.",         answer: "have been learning"  },
    { template: "She ___ here since 2020.",             answer: "has been working"    },
    { template: "They ___ for an hour.",                answer: "have been waiting"   },
  ],
  "past-simple": [
    { template: "I ___ my grandmother yesterday.",      answer: "visited" },
    { template: "She ___ at a bank for five years.",    answer: "worked"  },
    { template: "They ___ a movie last night.",         answer: "watched" },
  ],
  "past-continuous": [
    { template: "I ___ when she called.",               answer: "was reading"  },
    { template: "They ___ football at 5 pm.",           answer: "were playing" },
    { template: "She ___ dinner all evening.",          answer: "was cooking"  },
  ],
  "past-perfect": [
    { template: "She ___ before I arrived.",            answer: "had left"   },
    { template: "They ___ dinner when we called.",      answer: "had finished" },
    { template: "I had never ___ snow before that day.", answer: "seen"       },
  ],
  "past-perfect-continuous": [
    { template: "I ___ for an hour when she arrived.",           answer: "had been waiting"  },
    { template: "He ___ for hours before the exam started.",     answer: "had been studying" },
    { template: "They ___ for a year before they got married.",  answer: "had been dating"   },
  ],
  "future-simple": [
    { template: "I ___ you tomorrow.",                  answer: "will call"  },
    { template: "She will probably ___ the exam.",      answer: "pass"       },
    { template: "They ___ help us move next week.",     answer: "will"       },
  ],
  "future-continuous": [
    { template: "I ___ at 9 am tomorrow.",              answer: "will be working"    },
    { template: "She ___ her project when you arrive.", answer: "will be presenting" },
    { template: "They ___ this time next week.",        answer: "will be traveling"  },
  ],
  "future-perfect": [
    { template: "I ___ the report by Friday.",          answer: "will have finished"  },
    { template: "She ___ by next summer.",              answer: "will have graduated" },
    { template: "They ___ the house by December.",      answer: "will have built"     },
  ],
  "future-perfect-continuous": [
    { template: "By June, I ___ English for three years.",       answer: "will have been studying" },
    { template: "She ___ here for a decade by 2030.",            answer: "will have been working"  },
    { template: "They ___ together for five years next month.",  answer: "will have been living"   },
  ],
};
