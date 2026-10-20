export interface ContentSection {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
}

export function ContentSections({ sections }: { sections: ContentSection[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-12 px-4 py-16">
      {sections.map((section, index) => (
        <section key={index}>
          {section.heading ? (
            <h2 className="font-display text-2xl font-bold text-navy">{section.heading}</h2>
          ) : null}
          <div className="mt-4 space-y-4 text-slate-body">
            {section.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          {section.bullets ? (
            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-body">
              {section.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}
