"use client";

import { useId, useState } from "react";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

type FAQProps = {
  items?: FAQItem[];
};

const defaultFAQs: FAQItem[] = [
  {
    id: "find-schedule",
    question: "How do I find my area's load shedding schedule?",
    answer:
      "Choose your area in the schedule section. You can also select a date to narrow down the results.",
  },
  {
    id: "report-outage",
    question: "How can I report an unexpected power outage?",
    answer:
      "Sign in to your customer account, open the Reports section, and submit the affected area with a short description.",
  },
  {
    id: "restoration-time",
    question: "Are estimated restoration times guaranteed?",
    answer:
      "No. Estimates may change as technicians investigate the problem and complete repairs.",
  },
  {
    id: "pay-bill",
    question: "Where can I view and pay my electricity bills?",
    answer:
      "Sign in to your customer dashboard and open Bills to view your records and available payment options.",
  },
  {
    id: "missing-area",
    question: "Why is my area missing from the schedule list?",
    answer:
      "There may be no published schedule for that area in the available results. A missing entry does not guarantee uninterrupted power.",
  },
];

export default function FAQ({ items = defaultFAQs }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const prefix = useId();

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
            Need answers?
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h2>

          <p className="mt-4 text-slate-600">
            A little guidance to help you get started.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {items.map((item, index) => {
            const isOpen = openId === item.id;
            const buttonId = `${prefix}-question-${index}`;
            const panelId = `${prefix}-answer-${index}`;

            return (
              <div
                key={item.id}
                className={`overflow-hidden rounded-2xl border bg-white ${
                  isOpen ? "border-emerald-400" : "border-slate-200"
                }`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenId((current) =>
                        current === item.id ? null : item.id,
                      )
                    }
                    className="flex w-full items-center justify-between gap-5 p-5 text-left font-semibold text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-emerald-600 sm:p-6"
                  >
                    {item.question}

                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xl text-emerald-700"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="px-5 pb-6 text-sm leading-7 text-slate-600 sm:px-6"
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}