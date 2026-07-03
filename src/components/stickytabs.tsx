import { Key } from "lucide-react";

type StickyTabProps = {
  currentTab: string | undefined;
  values: string[];
  onTabSelect: (tabID: string | undefined) => void;
};

export function StickyTab({ currentTab, values, onTabSelect }: StickyTabProps) {
  return (
    <div className="p-2 rounded h-12 w-100 mx-auto sticky flex top-20 bg-kprimarylight justify-center justify-items-center shadow-md  ">
      <div className="rounded flex gap-3 border-black justify-center justify-items-center">
        {values.map((s) => (
          <button
            key={s}
            onClick={() => {
              onTabSelect(s);
              document!
                .getElementById(s)!
                .scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className={`bg-ksecondarydark transition-all delay-15 duration-300  rounded-sm shadow-sm text-white hover:bg-kprimarylight ${
              currentTab === s
                ? "bg-ksecondarylight text-white shadow-md rounded-sm p-1 justify-text-center "
                : "bg-amber-400"
            }
            `}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
