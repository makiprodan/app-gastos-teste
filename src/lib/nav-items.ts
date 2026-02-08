import {
  LayoutDashboard,
  ArrowLeftRight,
  Tags,
  Repeat,
  Wallet,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transacoes", label: "Transações", icon: ArrowLeftRight },
  { href: "/categorias", label: "Categorias", icon: Tags },
  { href: "/recorrentes", label: "Recorrentes", icon: Repeat },
  { href: "/orcamento", label: "Orçamento", icon: Wallet },
] as const;
