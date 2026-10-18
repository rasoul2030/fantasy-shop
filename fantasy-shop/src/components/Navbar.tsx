'use client';

import { Search, Settings, Film } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onAdminClick: () => void;
  isAdmin: boolean;
}

export default function Navbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAdminClick,
  isAdmin,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-fantasy-border bg-fantasy-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
            <Film className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-white hidden sm:block">محصولات فانتزی</h1>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fantasy-muted" />
          <Input
            placeholder="جستجوی محصول..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 border-fantasy-border bg-fantasy-surface pr-10 text-white placeholder:text-fantasy-muted focus-visible:ring-primary/50"
          />
        </div>

        {/* Filters & Admin */}
        <div className="flex items-center gap-2 shrink-0">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-10 w-auto min-w-[120px] border-fantasy-border bg-fantasy-surface text-white">
              <SelectValue placeholder="وضعیت" />
            </SelectTrigger>
            <SelectContent className="border-fantasy-border bg-fantasy-surface">
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="airing">در حال فروش</SelectItem>
              <SelectItem value="completed">تمام شده</SelectItem>
              <SelectItem value="upcoming">به زودی</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={isAdmin ? 'default' : 'outline'}
            size="sm"
            onClick={onAdminClick}
            className={
              isAdmin
                ? 'bg-primary hover:bg-primary/90 text-white'
                : 'border-fantasy-border bg-fantasy-surface text-fantasy-muted hover:bg-fantasy-card hover:text-white'
            }
          >
            <Settings className="h-4 w-4 ml-1" />
            {isAdmin ? 'بازگشت' : 'مدیریت'}
          </Button>
        </div>
      </div>
    </nav>
  );
}