import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock3, Flame, GraduationCap, RotateCcw, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metric, MiniLine, Page, ProgressBar, Surface } from "@/components/app-ui";
import { progress } from "@/data/mock-data";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Home — FastLearner" }, { name: "description", content: "Your focused daily study plan and progress." }, { property: "og:title", content: "Home — FastLearner" }, { property: "og:description", content: "Your focused daily study plan and progress." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: HomePage,
});

function HomePage() {
  const { targetInstitution, institutionThemeEnabled } = useTheme();
  const showInstitution = institutionThemeEnabled && targetInstitution;

  return <Page>
    <section className={cn(
      "relative mb-9 overflow-hidden rounded-3xl p-6 transition-all duration-500 animate-rise md:p-10",
      showInstitution ? "glass-primary border border-primary/20" : ""
    )}>
      {showInstitution && (
        <div className="pointer-events-none absolute -right-8 -top-8 opacity-10 md:opacity-15">
          <img src={targetInstitution.logo} alt="" className="h-48 w-64 object-contain" />
        </div>
      )}
      
      <div className="relative z-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-secondary/80 px-3 py-1.5 text-sm font-semibold text-foreground backdrop-blur-sm">
              <Flame className="h-4 w-4 text-primary" /> 7 day streak
            </p>
            <h1 className="font-display text-3xl font-bold md:text-5xl">Good afternoon, Nao.</h1>
            <p className="mt-2 text-muted-foreground">A focused session is ready when you are.</p>
          </div>
          
          {showInstitution && (
            <div className="flex items-center gap-3 rounded-2xl bg-card/40 p-3 backdrop-blur-md md:mb-1">
              <img src={targetInstitution.logo} alt={targetInstitution.shortName} className="h-10 w-10 object-contain" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Target</p>
                <p className="font-display text-sm font-bold">{targetInstitution.shortName}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>

    <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <Surface className="home-drill relative overflow-hidden border-primary/15 bg-foreground text-primary-foreground">
        <div className="home-drill-reflection pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex w-3/5 items-center justify-center sm:w-1/2">
          {showInstitution ? <>
            <div className="home-logo-glow absolute h-48 w-48 rounded-full md:h-64 md:w-64" />
            <img src={targetInstitution.logo} alt="" className="home-logo h-44 w-44 object-contain md:h-64 md:w-64" />
          </> : <GraduationCap className="home-logo h-40 w-40 md:h-56 md:w-56" strokeWidth={1} />}
        </div>
        <div className="relative z-10 flex h-full min-h-64 max-w-[72%] flex-col justify-between sm:max-w-[62%]">
          <div><p className="text-sm font-semibold text-primary-foreground/65">TODAY'S DRILL</p><h2 className="mt-3 font-display text-3xl font-bold">15 Questions</h2><p className="mt-2 text-primary-foreground/70">Based on your weak areas</p></div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4"><span className="flex items-center gap-2 text-sm text-primary-foreground/75"><Clock3 className="h-4 w-4" /> ~12 min</span><Button asChild size="lg" className="bg-card text-foreground shadow-none hover:bg-card/90"><Link to="/question" search={{ source: "today", material: "skd-tiu-4", count: 10, difficulty: "All", status: "All", challenge: false }}>Start Drill <ArrowRight /></Link></Button></div>
        </div>
      </Surface>
      <Surface className="flex flex-col justify-between">
        <div><div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary"><BookOpen className="h-5 w-5" /></div><p className="text-sm font-medium text-muted-foreground">Continue Learning</p><h2 className="mt-2 font-display text-xl font-bold">Numerik Berhitung</h2><p className="mt-1 text-sm text-muted-foreground">SKD · TIU</p></div>
        <div className="mt-8"><div className="mb-2 flex justify-between text-sm"><span>Mastery</span><strong>72%</strong></div><ProgressBar value={72} /><Button asChild variant="ghost" className="mt-4 px-0 text-primary"><Link to="/material/$materialId" params={{ materialId: "skd-tiu-4" }}>Continue <ArrowRight /></Link></Button></div>
      </Surface>
    </section>

    <section className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <Surface className="flex flex-col justify-between"><div><div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground"><RotateCcw className="h-5 w-5" /></div><h2 className="font-display text-xl font-bold">Needs Review</h2><p className="mt-2 text-muted-foreground">12 questions across 4 topics</p></div><Button asChild variant="outline" className="mt-7 w-full"><Link to="/question" search={{ source: "review", material: "skd-tiu-4", count: 10, difficulty: "All", status: "All", challenge: false }}>Review Now</Link></Button></Surface>
      <Surface><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">This Week</p><h2 className="mt-1 font-display text-xl font-bold">Steady progress</h2></div><Target className="h-5 w-5 text-primary" /></div><div className="mt-7 grid grid-cols-3 gap-4"><Metric label="Accuracy" value="76%" /><Metric label="Questions" value="184" /><Metric label="Study time" value="5h 12m" /></div><div className="mt-5 border-t border-border pt-5"><MiniLine values={progress.weeklyAccuracy} height={70} /></div></Surface>
    </section>
  </Page>;
}
