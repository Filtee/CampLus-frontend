import { Link } from '@tanstack/react-router';
import {
  Bell,
  BookOpen,
  Compass,
  House,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { UserAvatar } from '@/components/common/user-avatar';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useMe } from '@/features/account/api/account';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  Icon: LucideIcon;
  exact?: boolean;
}

const NAV: NavItem[] = [
  { to: '/', label: '个人首页', Icon: House, exact: true },
  { to: '/courses', label: '课程', Icon: BookOpen },
  { to: '/discover', label: '选课评课', Icon: Compass },
  { to: '/orgs', label: '组织社团', Icon: Users },
  { to: '/notices', label: '行政通知', Icon: Bell },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="bg-primary font-heading text-primary-foreground flex size-8 items-center justify-center rounded-lg text-base font-bold shadow-sm">
        C
      </span>
      <span className="font-heading text-lg font-semibold tracking-tight">CampLus</span>
    </Link>
  );
}

const navBase =
  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors';
const navActive = 'bg-sidebar-accent text-sidebar-accent-foreground';
const navInactive =
  'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground';

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={{ exact: item.exact }}
          className={navBase}
          activeProps={{ className: navActive, 'aria-current': 'page' }}
          inactiveProps={{ className: navInactive }}
          onClick={onNavigate}
        >
          <item.Icon className="size-4.5 shrink-0" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function GlobalSearch() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="border-input bg-muted/40 text-muted-foreground hover:bg-muted flex h-9 w-full max-w-md items-center gap-2 rounded-lg border px-3 text-sm transition-colors"
        >
          <Search className="size-4" />
          <span className="flex-1 text-left">搜索课程、组织、通知…</span>
          <kbd className="border-border bg-background text-muted-foreground hidden rounded border px-1.5 font-mono text-[10px] sm:inline">
            ⌘K
          </kbd>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>全站搜索</DialogTitle>
          <DialogDescription>
            意图驱动的搜索（设计原则
            5）将在后续里程碑接入——支持按课程代码、院系、组织、通知来源检索。
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function UserMenu() {
  const { data: me } = useMe();
  if (!me) return <div className="bg-muted size-8 animate-pulse rounded-full" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="ring-ring rounded-full outline-none focus-visible:ring-2">
          <UserAvatar name={me.realName} src={me.avatarUrl} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{me.realName}</span>
          <span className="text-muted-foreground font-mono text-xs font-normal">
            {me.studentId}
          </span>
          <span className="text-muted-foreground text-xs font-normal">{me.department}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings className="size-4" />
          账户设置
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <LogOut className="size-4" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-background min-h-svh">
      {/* 桌面侧栏 */}
      <aside className="border-sidebar-border bg-sidebar fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r lg:flex">
        <div className="flex h-16 items-center px-5">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <SidebarNav />
        </div>
        <div className="border-sidebar-border text-muted-foreground border-t px-5 py-3 text-xs">
          学生自治 · 实名可追溯
        </div>
      </aside>

      <div className="flex flex-col lg:pl-60">
        {/* 顶栏 */}
        <header className="border-border bg-background/80 sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-md sm:px-6">
          {/* 移动端：抽屉触发 */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="打开导航">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">主导航</SheetTitle>
              <div className="flex h-16 items-center px-5">
                <Logo />
              </div>
              <div className="px-3 py-2">
                <SidebarNav onNavigate={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex flex-1 justify-center lg:justify-start">
            <GlobalSearch />
          </div>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
