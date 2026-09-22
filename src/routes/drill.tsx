import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { Check, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Page, PageTitle, Surface } from "@/components/app-ui";
import {
  exams,
  materialsForSubtest,
  subtestsForExam,
  type ExamId,
} from "@/data/catalog";
import { countAvailable } from "@/services/session";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/drill")({ head: () => ({ meta: [{ title: "Custom Drill — FastLearner" }, { name: "description", content: "Create a focused drill from your chosen SKD materials." }, { property: "og:title", content: "Custom Drill — FastLearner" }, { property: "og:description", content: "Create a focused drill from your chosen SKD materials." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: DrillPage });

function SelectPills({ options, value, onChange }: { options: string[]; value: string; onChange: (value: string) => void }) { return <div className="flex flex-wrap gap-2">{options.map((option) => <Button key={option} type="button" variant={value === option ? "default" : "outline"} onClick={() => onChange(option)}>{value === option && <Check />}{option}</Button>)}</div>; }

function DrillPage() {
  const navigate = useNavigate({ from: "/drill" });
  const [exam, setExam] = useState<ExamId>("skd");
  const [subtest, setSubtest] = useState("skd-tiu");
  const [selected, setSelected] = useState<string[]>(["skd-tiu-4"]);
  const [count, setCount] = useState("15");
  const [difficulty, setDifficulty] = useState("All"); const [status, setStatus] = useState("All"); const [challenge, setChallenge] = useState(false);
  const availableSubtests = subtestsForExam(exam);
  const availableMaterials = materialsForSubtest(subtest);
  const availableQuestions = useMemo(() => countAvailable({
    source: "custom",
    exam,
    subtest,
    materials: selected,
    count: Number.MAX_SAFE_INTEGER,
    difficulty,
    status,
    challenge,
  }), [exam, subtest, selected, difficulty, status, challenge]);

  const chooseExam = (examId: string) => {
    const nextExam = examId as ExamId;
    const firstSubtest = subtestsForExam(nextExam)[0];
    setExam(nextExam);
    setSubtest(firstSubtest?.id ?? "");
    setSelected([]);
  };

  const chooseSubtest = (subtestId: string) => {
    setSubtest(subtestId);
    setSelected([]);
  };

  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return <Page narrow><PageTitle eyebrow="Build your session" title="Custom Drill" subtitle="Choose what to focus on. You can change any setting before starting." />
    <div className="space-y-4">
      <Surface><Step n="1" title="Choose Exam" /><SelectPills options={exams.map((item) => item.name)} value={exams.find((item) => item.id === exam)?.name ?? ""} onChange={(value) => { const next = exams.find((item) => item.name === value); if (next) chooseExam(next.id); }} /></Surface>
      <Surface><Step n="2" title="Choose Subtest" /><SelectPills options={availableSubtests.map((item) => item.name)} value={availableSubtests.find((item) => item.id === subtest)?.name ?? ""} onChange={(value) => { const next = availableSubtests.find((item) => item.name === value); if (next) chooseSubtest(next.id); }} /></Surface>
      <Surface><Step n="3" title="Choose Material" /><div className="grid gap-2 sm:grid-cols-2">{availableMaterials.map((item) => { const active = selected.includes(item.id); return <label key={item.id} className={cn("flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-colors", active ? "border-primary bg-accent text-accent-foreground" : "border-border bg-background text-foreground hover:bg-secondary")}><Checkbox checked={active} onCheckedChange={() => toggle(item.id)} /><span className="text-sm font-medium">{item.name}</span></label>; })}</div></Surface>
      <Surface><Step n="4" title="Drill Settings" /><div className="space-y-6"><Setting title="Number of Questions"><SelectPills options={["10", "15", "20", "30"]} value={count} onChange={setCount} /></Setting><Setting title="Difficulty"><SelectPills options={["All", "Easy", "Medium", "Hard"]} value={difficulty} onChange={setDifficulty} /></Setting><Setting title="Question Status"><SelectPills options={["All", "Unanswered", "Incorrect", "Needs Review", "Mastered"]} value={status} onChange={setStatus} /></Setting><div className="flex items-start justify-between gap-6 border-t border-border pt-5"><div><h3 className="font-semibold">Challenge Mode</h3><p className="mt-1 text-sm text-muted-foreground">60 sec / question. Questions that exceed the time limit are counted as incorrect.</p></div><Switch checked={challenge} onCheckedChange={setChallenge} aria-label="Challenge mode" className="mt-1" /></div></div></Surface>
    </div>
    <div className="sticky bottom-21 z-20 mt-6 rounded-2xl border border-border bg-background/90 p-3 shadow-float backdrop-blur-xl md:bottom-4"><Button size="lg" className="w-full" disabled={selected.length === 0 || availableQuestions === 0} onClick={() => navigate({ to: "/question", search: { source: "custom", exam, subtest, materials: selected.join(","), count: Number(count), difficulty, status, challenge } })}><SlidersHorizontal /> Start Drill · {Math.min(Number(count), availableQuestions)} Questions</Button>{selected.length > 0 && availableQuestions === 0 && <p className="mt-2 text-center text-sm text-muted-foreground">No questions match these settings.</p>}</div>
  </Page>;
}
function Step({ n, title, compact = false }: { n: string; title: string; compact?: boolean }) { return <div className={cn("flex items-center gap-3", !compact && "mb-5")}><span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">{n}</span><h2 className="font-display text-lg font-bold">{title}</h2></div>; }
function Setting({ title, children }: { title: string; children: ReactNode }) { return <div><h3 className="mb-3 text-sm font-semibold text-muted-foreground">{title}</h3>{children}</div>; }