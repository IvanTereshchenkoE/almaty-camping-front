import * as React from "react";
import { format, addDays, startOfDay } from "date-fns";
import { ru, kk, enUS } from "date-fns/locale";
import type { Locale } from "date-fns";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { useTranslation } from "react-i18next";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  className?: string;
}

const dateFnsLocales: Record<string, Locale> = {
  ru,
  kk,
  en: enUS,
};

function toDate(str: string): Date | undefined {
  if (!str) return undefined;
  const d = new Date(str);
  return isNaN(d.getTime()) ? undefined : d;
}

function toString(date: Date | undefined): string {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
}

export const DateRangePicker = ({ startDate, endDate, onChange, className }: DateRangePickerProps) => {
  const { t, i18n } = useTranslation('catalog');
  const [open, setOpen] = React.useState(false);
  const locale = dateFnsLocales[i18n.language] || ru;

  const selected: DateRange | undefined = React.useMemo(() => {
    const from = toDate(startDate);
    const to = toDate(endDate);
    return from ? { from, to: to || from } : undefined;
  }, [startDate, endDate]);

  const handleSelect = (range: DateRange | undefined) => {
    if (!range?.from) {
      onChange("", "");
      return;
    }
    const from = toString(range.from);
    const to = range.to ? toString(range.to) : from;
    onChange(from, to);
    if (range.to) setOpen(false);
  };

  const daysCount = React.useMemo(() => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    return Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
  }, [startDate, endDate]);

  const quickActions = [
    { label: t('dateRange.today', 'Сегодня'), action: () => { const t = startOfDay(new Date()); onChange(toString(t), toString(t)); setOpen(false); } },
    { label: t('dateRange.tomorrow', 'Завтра'), action: () => { const t = startOfDay(addDays(new Date(), 1)); onChange(toString(t), toString(t)); setOpen(false); } },
    { label: t('dateRange.week', 'На неделю'), action: () => { const t = startOfDay(new Date()); onChange(toString(t), toString(addDays(t, 6))); setOpen(false); } },
    { label: t('dateRange.weekend', 'На выходные'), action: () => { const t = startOfDay(new Date()); const sat = addDays(t, (6 - t.getDay() + 7) % 7); onChange(toString(sat), toString(addDays(sat, 1))); setOpen(false); } },
  ];

  return (
    <div className={cn("flex flex-wrap gap-3 items-end", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate && endDate ? (
              <span>
                {format(toDate(startDate)!, "d MMM", { locale })} — {format(toDate(endDate)!, "d MMM yyyy", { locale })}
              </span>
            ) : (
              <span className="text-muted-foreground">{t('datePanel.subtitle')}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex flex-wrap gap-1">
              {quickActions.map((a) => (
                <Button key={a.label} size="sm" variant="secondary" onClick={a.action}>
                  {a.label}
                </Button>
              ))}
            </div>
          </div>
          <DayPicker
            mode="range"
            selected={selected}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={locale}
            disabled={{ before: new Date() }}
            classNames={{
              months: "flex flex-col sm:flex-row gap-4",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border rounded-md flex items-center justify-center",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:rounded-md",
              day_range_end: "day-range-end rounded-r-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              day_range_start: "day-range-start rounded-l-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_hidden: "invisible",
            }}
            components={{
              IconLeft: () => <ChevronLeft className="h-4 w-4" />,
              IconRight: () => <ChevronRight className="h-4 w-4" />,
            }}
          />
        </PopoverContent>
      </Popover>
      {startDate && endDate && (
        <p className="text-sm text-muted-foreground pb-2">
          {t('datePanel.days')} <span className="font-medium">{daysCount}</span>
        </p>
      )}
    </div>
  );
};
