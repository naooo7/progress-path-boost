import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Page({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return <div className={cn("mx-auto w-full px-5 py-8 md:px-8 md:py-12", narrow ? "max-w-3xl" : "max-w-6xl")}>{children}</div>;
}

export function PageTitle({ eyebrow, title, subtitle, back }: { eyebrow?: string; title: string; subtitle?: string; back?: string }) {
  return <div className="mb-8 animate-rise md:mb-10">
    {back && <Link to={back} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</Link>}
    {eyebrow && <p className="mb-2 text-sm font-semibold text-primary">{eyebrow}</p>}
    <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{title}</h1>
    {subtitle && <p className="mt-2 max-w-2xl text-base text-muted-foreground">{subtitle}</p>}
  </div>;
}

export function Surface({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-border/80 bg-card p-5 shadow-soft md:p-6", className)}>{children}</div>;
}

export function ProgressBar({ value }: { value: number }) {
  return <div className="h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value}%` }} /></div>;
}

export function Metric({ label, value }: { label: string; value: string | number }) {
  return <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 font-display text-2xl font-bold text-foreground">{value}</p></div>;
}

export function MiniLine({ values, height = 100 }: { values: number[]; height?: number }) {
  const min = Math.min(...values) - 4;
  const max = Math.max(...values) + 4;
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${height - ((value - min) / (max - min)) * height}`).join(" ");
  return <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="h-28 w-full overflow-visible" aria-label="Accuracy trend"><polyline points={points} fill="none" stroke="var(--primary)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function LinkRow({ to, title, subtitle, trailing }: { to: string; title: string; subtitle?: string; trailing?: ReactNode }) {
  return <Link to={to} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft">
    <div className="min-w-0 flex-1"><p className="font-semibold text-foreground">{title}</p>{subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}</div>
    {trailing}<ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
  </Link>;
}

export function PrimaryLink({ to, children }: { to: string; children: ReactNode }) {
  return <Button asChild size="lg"><Link to={to}>{children}<ArrowRight /></Link></Button>;
}