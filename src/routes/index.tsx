import { createFileRoute } from "@tanstack/react-router";
import {
  Box,
  ChevronDown,
  CircleDollarSign,
  ExternalLink,
  FileText,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  Settings,
  RefreshCw,
  Sun,
  Moon,
  ShieldCheck,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";

const AFILIPRO_LOGO = "/afilipro-logo.svg";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard de Afiliados — AFILIPRO IA" },
      { name: "description", content: "Visão geral de vendas, comissões e produtos da AFILIPRO IA." },
      { property: "og:title", content: "Dashboard de Afiliados — AFILIPRO IA" },
      { property: "og:description", content: "Acompanhe o desempenho da sua conta de afiliado AFILIPRO IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

// Dashboard inicial: métricas zeradas e saudação dinâmica; valores reais entram posteriormente via dados da conta\nconst chartData = [
  { day: "Seg", value: 0 },
  { day: "Ter", value: 0 },
  { day: "Qua", value: 0 },
  { day: "Qui", value: 0 },
  { day: "Sex", value: 0 },
  { day: "Sáb", value: 0 },
  { day: "Dom", value: 0 },
];

const links: Array<[string, string, string]> = [
  ["Gerador de Links", "0 cliques · 0 conv.", "R$ 0,00"],
  ["Encurtador de URL", "0 cliques · 0 conv.", "R$ 0,00"],
  ["QR Code", "0 cliques · 0 conv.", "R$ 0,00"],
  ["Landing Page Automática", "0 cliques · 0 conv.", "R$ 0,00"],
  ["Comparador de Preços", "0 cliques · 0 conv.", "R$ 0,00"],
];

const nav: Array<[LucideIcon, string]> = [
  [LayoutDashboard, "Dashboard"],
  [Box, "Produtos"],
  [Users, "Grupos Facebook"],
  [CircleDollarSign, "Grupos WhatsApp"],
  [FileText, "Scripts de Divulgação"],
];

function Logo() {
  return (
    <div className="flex items-center gap-2 font-bold text-foreground">
      <img src={AFILIPRO_LOGO} alt="AFILIPRO IA" className="h-9 w-40 object-contain object-left" />
    </div>
  );
}

function Sidebar({ open, close }: { open: boolean; close: () => void }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-sidebar px-4 py-5 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="mb-8 flex items-center justify-between px-2">
        <Logo />
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={close} aria-label="Fechar menu">
          <X className="size-5" />
        </Button>
      </div>
      <nav className="space-y-1">
        {nav.map(([Icon, label], i) => (
          <button
            key={label}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${i === 0 ? "bg-accent text-foreground" : "text-sidebar-foreground hover:bg-accent/60 hover:text-foreground"}`}
          >
            <Icon className={`size-4 ${i === 0 ? "text-primary" : ""}`} />
            {label}
          </button>
        ))}
      </nav>
      <p className="mb-2 mt-7 px-3 text-[10px] font-semibold uppercase text-muted-foreground">Administração</p>
      <nav className="space-y-1">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-accent">
          <ShieldCheck className="size-4" />
          Gerenciar Usuários
        </button>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-accent">
          <User className="size-4" />
          Minha Conta
        </button>
      </nav>
      <button className="mt-auto flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground hover:text-foreground">
        <LogOut className="size-4" />
        Sair
      </button>
    </aside>
  );
}

function Metric({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: LucideIcon }) {
  return (
    <div className="min-w-0 border-r border-border px-5 py-5 last:border-r-0 first:pl-0 max-md:border-b max-md:border-r-0 max-md:first:pl-5">
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase text-muted-foreground">
        <span>{label}</span>
        <Icon className="size-3.5" />
      </div>
      <strong className="mt-3 block text-2xl font-semibold tracking-normal text-foreground">{value}</strong>
      <span className="mt-1 block text-[11px] text-muted-foreground">{note}</span>
    </div>
  );
}

function getStoredUserIdentity() {
  const keys = ["user", "currentUser", "profile", "auth_user", "userEmail", "email"];

  for (const key of keys) {
    const raw = window.localStorage.getItem(key) ?? window.sessionStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw) as {
        email?: string;
        name?: string;
        full_name?: string;
        user_metadata?: { name?: string; full_name?: string };
      };

      const email = parsed.email;
      const name =
        parsed.user_metadata?.full_name ??
        parsed.user_metadata?.name ??
        parsed.full_name ??
        parsed.name;

      if (email) return { email, name: name ?? "" };
      if (name) return { email: "", name };
    } catch {
      if (raw.includes("@")) return { email: raw, name: "" };
    }
  }

  return { email: "", name: "" };
}

function formatName(identity: { email: string; name: string }) {
  const source = identity.name.trim() || identity.email.split("@")[0] || "Afiliado";

  return source
    .replace(/[._-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [period, setPeriod] = useState("Mês");
  const [identity, setIdentity] = useState(() => ({ email: "", name: "" }));
  const [now, setNow] = useState(() => new Date());
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());

  useEffect(() => {
    setIdentity(getStoredUserIdentity());
    const savedTheme = window.localStorage.getItem("afilipro-theme");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);

    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("afilipro-theme", theme);
  }, [theme]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastUpdated(new Date());
    window.setTimeout(() => setIsRefreshing(false), 650);
  };

  const greeting = useMemo(() => {
    const hour = now.getHours();

    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, [now]);

  const displayName = useMemo(() => formatName(identity), [identity]);
  const periodOptions = ["Semana", "Mês", "Ano"];

  const periodConfig = useMemo(() => {
    if (period === "Semana") return { summary: "Resumo da Semana", labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] };
    if (period === "Ano") return { summary: "Resumo do Ano", labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"] };
    return { summary: "Resumo do Mês", labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5"] };
  }, [period]);

  const periodChartData = useMemo(
    () => periodConfig.labels.map((day) => ({ day, value: 0 })),
    [periodConfig],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar open={menuOpen} close={() => setMenuOpen(false)} />
      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-background/80 lg:hidden" onClick={() => setMenuOpen(false)} />
      )}

      <main className="lg:pl-60">
        <header className="flex h-16 items-center justify-between border-b border-border px-5 lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
              <Menu className="size-5" />
            </Button>
            <Logo />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
              title={theme === "dark" ? "Tema claro" : "Tema escuro"}
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button variant="ghost" size="icon" aria-label="Configurações">
              <Settings className="size-4" />
            </Button>
            <div className="ml-2 hidden items-center gap-2 pl-3 text-xs text-muted-foreground sm:flex">
              <span className="flex size-7 items-center justify-center rounded-full bg-accent font-semibold text-primary">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <span>{identity.email || displayName}</span>
              <ChevronDown className="size-3" />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-5 py-7 lg:px-16 lg:py-9">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-xl font-semibold">
                {greeting}, {displayName}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">{periodConfig.summary}</p>
              <span className="mt-1 block text-[10px] text-muted-foreground">
                Atualizado às {lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1 rounded-md bg-card p-1">
              {periodOptions.map((option) => (
                <Button
                  key={option}
                  variant="ghost"
                  size="sm"
                  onClick={() => setPeriod(option)}
                  className={period === option ? "bg-accent text-foreground" : ""}
                >
                  {option}
                </Button>
              ))}
              <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`size-3 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Atualizando..." : "Atualizar"}
              </Button>
            </div>
          </div>

          <section className="mt-7 grid border-y border-border md:grid-cols-2 xl:grid-cols-4">
            <Metric label="Aberturas no mês" value="0" note="Total de cliques em Abrir no ML" icon={ExternalLink} />
            <Metric label="Conversões" value="0" note="Período selecionado" icon={ChevronDown} />
            <Metric label="Comissões" value="R$ 0,00" note="Período selecionado" icon={CircleDollarSign} />
            <Metric label="Produtos ativos" value="0" note="Links ativos" icon={Link2} />
          </section>

          <section className="grid gap-8 border-b border-border py-8 xl:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
            <div className="min-w-0">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Comissões</h2>
                  <p className="text-[11px] text-muted-foreground">Período selecionado</p>
                </div>
                <strong className="text-lg">R$ 0,00</strong>
              </div>

              <div className="h-64 w-full lg:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={periodChartData} margin={{ left: -28, right: 5 }}>
                    <defs>
                      <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--dashboard-line)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--dashboard-line)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                    />
                    <Area
                      isAnimationActive={false}
                      type="linear"
                      dataKey="value"
                      stroke="var(--dashboard-line)"
                      strokeWidth={2}
                      fill="url(#area)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Status das comissões</h2>
                <span className="text-[10px] text-muted-foreground">0 comissões</span>
              </div>

              {[
                ["Comissão pendente", 0, "bg-warning"],
                ["Aprovada", 0, "bg-primary"],
                ["Paga", 0, "bg-success"],
                ["Cancelada", 0, "bg-destructive"],
              ].map(([name, count, color]) => (
                <div key={String(name)} className="mb-5 flex items-center gap-3 text-xs">
                  <span className={`size-2 rounded-full ${color}`} />
                  <span className="text-muted-foreground">{name}</span>
                  <strong className="ml-auto">{count}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-10 py-8 xl:grid-cols-2">
            <DataList title="Top links de afiliado" action="Ver catálogo">
              {links.map(([name, details, value]) => (
                <div
                  key={name}
                  className="grid grid-cols-[24px_1fr_auto] items-center gap-3 border-b border-border/60 py-3 last:border-0"
                >
                  <span className="text-xs font-semibold text-muted-foreground">0</span>
                  <div>
                    <strong className="block text-xs font-semibold">{name}</strong>
                    <span className="text-[10px] text-muted-foreground">{details}</span>
                  </div>
                  <strong className="text-xs">{value}</strong>
                </div>
              ))}
            </DataList>

            <DataList title="Últimas conversões" action="Ver todas">
              <div className="border-b border-border/60 py-6 text-xs text-muted-foreground">
                Nenhuma conversão registrada
              </div>
            </DataList>
          </section>
        </div>
      </main>
    </div>
  );
}

function DataList({ title, action, children }: { title: string; action: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px]">
          {action}
        </Button>
      </div>
      {children}
    </div>
  );
}
