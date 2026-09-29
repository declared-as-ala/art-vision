import {
  FileText,
  CreditCard,
  QrCode,
  Palette,
  PenTool,
  Megaphone,
  AtSign,
  Hash,
  Image as ImageIcon,
  Calculator,
  Utensils,
  ListChecks,
  Stamp,
  Gift,
  Mail,
  ScanSearch,
  Ruler,
  PanelsTopLeft,
  Clock,
  Crop,
  CalendarDays,
  SwatchBook,
  BadgePercent,
  FileQuestion,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

// Maps the icon name stored in the tools registry to a lucide component.
const iconMap: Record<string, LucideIcon> = {
  FileText,
  CreditCard,
  QrCode,
  Palette,
  PenTool,
  Megaphone,
  Instagram: AtSign,
  Hash,
  Image: ImageIcon,
  Calculator,
  Utensils,
  ListChecks,
  Stamp,
  Gift,
  Mail,
  ScanSearch,
  Ruler,
  PanelsTopLeft,
  Clock,
  Crop,
  CalendarDays,
  SwatchBook,
  BadgePercent,
  FileQuestion,
};

export default function ToolIcon({
  name,
  size = 24,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = iconMap[name] || Sparkles;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
