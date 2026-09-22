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
  ShieldCheck,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";

const AFILIPRO_LOGO = "data:image/webp;base64,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";

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
      <img src={AFILIPRO_LOGO} alt="AFILIPRO IA" className="h-10 w-28 object-contain" />
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

  useEffect(() => {
    setIdentity(getStoredUserIdentity());

    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const greeting = useMemo(() => {
    const hour = now.getHours();

    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, [now]);

  const displayName = useMemo(() => formatName(identity), [identity]);
  const periodOptions = ["Semana", "Mês", "Ano"];

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
            <Button variant="ghost" size="icon" aria-label="Tema">
              <Sun className="size-4" />
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
              <p className="mt-1 text-xs text-muted-foreground">Resumo de afiliado</p>
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
              <Button variant="ghost" size="sm">
                <RefreshCw className="size-3" />
                Atualizar
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
                  <AreaChart data={chartData} margin={{ left: -28, right: 5 }}>
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
