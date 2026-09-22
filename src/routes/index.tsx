import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock3, Flame, GraduationCap, RotateCcw, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metric, Page, ProgressBar, Surface, TrendChart } from "@/components/app-ui";
import { useTheme } from "@/hooks/use-theme";
import { useUserData } from "@/hooks/use-user-data";
import { cn } from "@/lib/utils";
import { questionsForMaterial } from "@/data/questions";
import {
  formatDuration,
  getActivitySeries,
  getContinueMaterial,
  getMaterialMastery,
  getOverview,
  getReviewQuestionIds,
  getStreak,
  getWeakMaterials,
} from "@/services/user-data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Home — FastLearner" }, { name: "description", content: "Your focused daily study plan and progress." }, { property: "og:title", content: "Home — FastLearner" }, { property: "og:description", content: "Your focused daily study plan and progress." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: HomePage,
});

function HomePage() {
  useUserData();
  const { targetInstitution, institutionThemeEnabled } = useTheme();
  const hasInstitution = Boolean(targetInstitution);
  const streak = getStreak();
  const week = getOverview("week");
  const reviewCount = getReviewQuestionIds().length;
  const continueMaterial = getContinueMaterial();
  const focus = getWeakMaterials(1)[0];
  const focusMaterial = focus?.material ?? continueMaterial;
  const focusCount = Math.min(15, questionsForMaterial(focusMaterial?.id ?? "").length);
  const mastery = continueMaterial ? getMaterialMastery(continueMaterial.id) : 0;
  const activity = getActivitySeries("week");
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return <Page>
    <section className={cn("relative mb-7 overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-soft transition-all duration-500 animate-rise md:p-9", institutionThemeEnabled && hasInstitution && "glass-primary border-primary/20")}>
      {targetInstitution && <div className="pointer-events-none absolute -right-8 -top-8 opacity-10 md:opacity-15"><img src={targetInstitution.logo} alt="" className="h-48 w-64 object-contain" /></div>}
      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary/90 px-3 py-1.5 text-sm font-semibold text-secondary-foreground backdrop-blur-sm"><Flame className="h-4 w-4 text-primary" /> {streak.current > 0 ? `${streak.current} day streak` : "Start your streak today"}</p>
          <h1 className="font-display text-3xl font-bold md:text-5xl">{greeting}.</h1>
          <p className="mt-2 text-muted-foreground">Pick up where you left off, or start a focused session.</p>
        </div>
        {targetInstitution && <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/80 p-3 shadow-soft backdrop-blur-md"><img src={targetInstitution.logo} alt={targetInstitution.shortName} className="h-10 w-10 object-contain" /><div><p className="text-xs font-bold uppercase text-muted-foreground">Target</p><p className="font-display text-sm font-bold">{targetInstitution.shortName}</p></div></div>}
      </div>
    </section>

    <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <Surface className="home-drill relative overflow-hidden border-primary/15 text-primary-foreground">
        <div className="home-drill-reflection pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex w-1/2 items-center justify-center">
          {targetInstitution ? <><div className="home-logo-glow absolute h-44 w-44 rounded-full md:h-64 md:w-64" /><img src={targetInstitution.logo} alt="" className="home-logo h-40 w-40 object-contain md:h-64 md:w-64" /></> : <GraduationCap className="home-logo h-36 w-36 md:h-56 md:w-56" strokeWidth={1} />}
        </div>
        <div className="relative z-10 flex min-h-64 max-w-[78%] flex-col justify-between sm:max-w-[64%]">
          <div><p className="text-sm font-semibold text-primary-foreground/80">CONTINUE LEARNING</p><h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">{continueMaterial?.name ?? "Start your first material"}</h2><p className="mt-2 text-primary-foreground/80">{continueMaterial ? `${continueMaterial.examId.toUpperCase()} · ${mastery}% mastery` : "Build your learning history one question at a time"}</p></div>
          <div className="mt-8 flex flex-wrap items-center gap-4"><span className="flex items-center gap-2 text-sm text-primary-foreground/80"><Clock3 className="h-4 w-4" /> {week.total ? `${week.total} answered this week` : "Ready when you are"}</span>{continueMaterial && <Button asChild size="lg"><Link to="/material/$materialId" params={{ materialId: continueMaterial.id }}>Continue <ArrowRight /></Link></Button>}</div>
        </div>
      </Surface>
      <Surface className="flex flex-col justify-between">
        <div><div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground"><Target className="h-5 w-5" /></div><p className="text-sm font-medium text-muted-foreground">Today’s Focus</p><h2 className="mt-2 font-display text-xl font-bold">{focus ? focus.material.name : "Build your baseline"}</h2><p className="mt-1 text-sm text-muted-foreground">{focus ? `${focus.accuracy}% accuracy · recommended practice` : "Practice a few questions to reveal your weak areas."}</p></div>
        <div className="mt-8">{focus && <><div className="mb-2 flex justify-between text-sm"><span>Mastery</span><strong>{focus.mastery}%</strong></div><ProgressBar value={focus.mastery} /></>}<Button asChild className="mt-5 w-full" disabled={!focusMaterial || focusCount === 0}><Link to="/question" search={{ source: "today", material: focusMaterial?.id, count: Math.max(1, focusCount), difficulty: "All", status: "All", challenge: false }}>Practice Focus <ArrowRight /></Link></Button></div>
      </Surface>
    </section>

    <section className="mt-5"><div className="mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /><h2 className="font-display font-bold">Quick Start</h2></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{[10,15,20].map((count) => <Button key={count} variant="outline" asChild><Link to="/question" search={{ source: "custom", count, difficulty: "All", status: "All", challenge: false }}>{count} Questions</Link></Button>)}<Button variant="outline" asChild><Link to="/question" search={{ source: "custom", count: 10, difficulty: "All", status: "All", challenge: true }}>60s Challenge</Link></Button></div></section>

    <section className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <Surface className="flex flex-col justify-between"><div><div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground"><RotateCcw className="h-5 w-5" /></div><h2 className="font-display text-xl font-bold">Needs Review</h2><p className="mt-2 text-muted-foreground">{reviewCount ? `${reviewCount} question${reviewCount === 1 ? "" : "s"} waiting for another look` : "Nothing is waiting for review."}</p></div>{reviewCount ? <Button asChild variant="outline" className="mt-7 w-full"><Link to="/question" search={{ source: "review", count: 10, difficulty: "All", status: "All", challenge: false }}>Review Now</Link></Button> : <Button type="button" variant="outline" className="mt-7 w-full" disabled>Review Now</Button>}</Surface>
      <Surface><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">This Week</p><h2 className="mt-1 font-display text-xl font-bold">{week.total ? "Your current pace" : "No activity yet"}</h2></div><BookOpen className="h-5 w-5 text-primary" /></div><div className="mt-7 grid grid-cols-3 gap-3"><Metric label="Accuracy" value={week.total ? `${week.accuracy}%` : "—"} /><Metric label="Questions" value={week.total} /><Metric label="Study time" value={formatDuration(week.studySeconds)} /></div><div className="mt-5 border-t border-border pt-5"><TrendChart label="Questions practiced this week" data={activity.map((day) => ({ label: day.date.slice(5), value: day.questions || null }))} /></div></Surface>
    </section>
  </Page>;
}