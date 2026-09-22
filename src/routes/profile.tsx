import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, ChevronRight, Database, Flame, MoonStar, type LucideIcon } from "lucide-react";
import { Metric, Page, PageTitle, Surface } from "@/components/app-ui";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { institutionById, institutions } from "@/data/institutions";
import { useTheme, type ThemePreference } from "@/hooks/use-theme";
import { useUserData } from "@/hooks/use-user-data";
import { formatDuration, getOverview, getStreak } from "@/services/user-data";

export const Route = createFileRoute("/profile")({ head: () => ({ meta: [{ title: "Profile — FastLearner" }, { name: "description", content: "View your FastLearner profile, study totals, and preferences." }, { property: "og:title", content: "Profile — FastLearner" }, { property: "og:description", content: "View your FastLearner profile, study totals, and preferences." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: ProfilePage });

function ProfilePage() {
  useUserData();
  const { preference, setPreference, targetInstitutionId, setTargetInstitutionId, institutionThemeEnabled, setInstitutionThemeEnabled } = useTheme();
  const target = institutionById(targetInstitutionId);
  const overview = getOverview("all");
  const streak = getStreak();
  const settings: Array<{ Icon: LucideIcon; label: string; value: string }> = [
    { Icon: MoonStar, label: "Appearance", value: (preference[0] ?? "").toUpperCase() + preference.slice(1) },
    { Icon: Bell, label: "Notifications", value: "On" },
    { Icon: Database, label: "Data", value: "Saved on this device" },
  ];
  const themeOptions: Array<{ value: ThemePreference; label: string }> = [{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }, { value: "system", label: "System" }];

  return <Page narrow>
    <PageTitle title="Profile" />
    <div className="mb-5 flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground font-display text-xl font-bold text-primary-foreground">FL</div><div><h2 className="font-display text-2xl font-bold">Your Profile</h2><p className="text-muted-foreground">Your activity stays on this device</p></div><div className="ml-auto hidden items-center gap-2 rounded-full bg-secondary px-3 py-2 text-sm font-semibold sm:flex"><Flame className="h-4 w-4 text-primary" />{streak.current} day streak</div></div>
    <Surface><div className="grid grid-cols-2 gap-7"><Metric label="Questions Answered" value={overview.total} /><Metric label="Accuracy" value={overview.total ? `${overview.accuracy}%` : "—"} /><Metric label="Study Time" value={formatDuration(overview.studySeconds)} /><Metric label="Longest Streak" value={`${streak.longest} day${streak.longest === 1 ? "" : "s"}`} /></div></Surface>
    <h2 className="mb-3 mt-9 font-display text-lg font-bold">Target Institution</h2>
    <Surface>{target && <div className="relative mb-5 flex min-h-24 items-center gap-4 overflow-hidden rounded-xl bg-secondary p-4"><img src={target.logo} alt="" className="absolute -right-4 h-28 w-36 object-contain opacity-10" /><img src={target.logo} alt={`${target.shortName} logo`} className="h-14 w-16 shrink-0 object-contain" /><div className="relative min-w-0"><p className="text-sm text-muted-foreground">Selected institution</p><p className="mt-1 font-display text-lg font-bold">{target.shortName}</p><p className="text-sm text-muted-foreground">{target.name}</p></div></div>}
      <div className="grid gap-2 sm:grid-cols-2">{institutions.map((institution) => { const active = targetInstitutionId === institution.id; return <Button key={institution.id} type="button" variant={active ? "default" : "outline"} className="h-auto min-h-16 justify-start whitespace-normal px-3 py-2.5 text-left" onClick={() => setTargetInstitutionId(institution.id)}><img src={institution.logo} alt="" className="h-9 w-10 shrink-0 rounded-sm bg-card object-contain p-1" /><span className="min-w-0"><span className="block font-semibold">{institution.shortName}</span><span className="block text-xs opacity-75">{institution.name}</span></span>{active && <Check className="ml-auto" />}</Button>; })}</div>
      <div className="mt-5 flex items-center gap-4 border-t border-border pt-5"><div className="min-w-0 flex-1"><label htmlFor="institution-theme" className="font-semibold">Gunakan Tema Institusi</label><p className="mt-0.5 text-sm text-muted-foreground">Gunakan warna institusi pilihan sebagai aksen aplikasi.</p></div><Switch id="institution-theme" checked={institutionThemeEnabled} onCheckedChange={setInstitutionThemeEnabled} aria-label="Gunakan Tema Institusi" /></div>
    </Surface>
    <h2 className="mb-3 mt-9 font-display text-lg font-bold">Settings</h2>
    <Surface className="p-2 md:p-2">{settings.map(({ Icon, label, value }) => label === "Appearance" ? <div key={label} className="rounded-xl p-4"><div className="flex items-center gap-4"><Icon className="h-5 w-5 text-muted-foreground" /><span className="flex-1 font-medium">{label}</span><span className="text-sm text-muted-foreground">{value}</span></div><div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-secondary p-1">{themeOptions.map((option) => <Button key={option.value} type="button" size="sm" variant={preference === option.value ? "secondary" : "ghost"} onClick={() => setPreference(option.value)}>{preference === option.value && <Check className="h-3.5 w-3.5" />}{option.label}</Button>)}</div></div> : <Button key={label} type="button" variant="ghost" className="h-auto w-full justify-start gap-4 rounded-xl p-4 text-left"><Icon className="h-5 w-5 text-muted-foreground" /><span className="flex-1 font-medium">{label}</span><span className="text-sm text-muted-foreground">{value}</span><ChevronRight className="h-4 w-4 text-muted-foreground" /></Button>)}</Surface>
  </Page>;
}