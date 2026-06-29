import { Edit3, Plus, Minus } from "lucide-react";

type UpdateProps = {
  additions?: string[];
  removals?: string[];
  changes?: string[];
  date: Date;
  notes?: string;
};

function ListSection({
  title,
  items,
  icon,
}: {
  title: string;
  items?: string[];
  icon: React.ReactNode;
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-kprimarylight/70 p-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
        {icon}
        <span>{title}</span>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2 text-sm text-slate-600"
          >
            <span className="mt-0.5 text-slate-400">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function UpdatePost({
  additions,
  removals,
  changes,
  date,
  notes,
}: UpdateProps) {
  return (
    <div className="rounded-3xl border border-kprimarylight/50 bg-kprimarylight/70 p-4 shadow-sm ring-1 ring-black/5">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
              Update
            </p>
            <h3 className="text-lg font-semibold text-slate-900">
              {date.toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
          </div>
          <div className=" rounded-full border border-slate-200 bg-kprimarylight px-3 py-1 text-sm font-medium text-slate-600">
            Alex
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <ListSection
            title="Additions"
            items={additions}
            icon={<Plus className="h-4 w-4 text-emerald-600" />}
          />
          <ListSection
            title="Changes"
            items={changes}
            icon={<Edit3 className="h-4 w-4 text-purple-600" />}
          />
          <ListSection
            title="Removals"
            items={removals}
            icon={<Minus className="h-4 w-4 text-rose-600" />}
          />
        </div>

        {notes ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-kprimarylight/70 p-3 text-sm text-slate-700">
            <div className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Dev Notes
            </div>
            <p>{notes}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
