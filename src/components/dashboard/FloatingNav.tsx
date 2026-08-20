import { motion } from 'framer-motion';
import { 
  FileText, 
  BookOpen, 
  Briefcase, 
  MessageSquare, 
  Target, 
  Route,
  Upload,
  Home
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/resume-screening', icon: Upload, label: 'Screen Resume' },
  { href: '/resume-builder', icon: FileText, label: 'Build Resume' },
  { href: '/skill-gap', icon: Target, label: 'Skill Gap' },
  { href: '/resources', icon: BookOpen, label: 'Resources' },
  { href: '/jobs', icon: Briefcase, label: 'Jobs' },
  { href: '/dashboard/chat-history', icon: MessageSquare, label: 'Chat' },
];

const FloatingNav = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', damping: 20 }}
      className="fixed inset-x-0 bottom-4 sm:bottom-6 z-40 flex justify-center px-3 md:pl-[280px]"
    >
      <div className="glass-card max-w-full px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-0.5 sm:gap-2 overflow-x-auto scrollbar-none">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1 px-2 sm:px-3 py-2 rounded-xl transition-all duration-200 shrink-0",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="floating-nav-active"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
              <item.icon className="w-5 h-5 relative z-10 shrink-0" />
              <span className="text-xs font-medium relative z-10 hidden md:block whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default FloatingNav;