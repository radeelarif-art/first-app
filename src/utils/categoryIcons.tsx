import React from 'react';
import {
  ShoppingBag,
  Zap,
  Flame,
  Fuel,
  Utensils,
  Home,
  Wifi,
  GraduationCap,
  HeartPulse,
  Coins,
  Shirt,
  HeartHandshake,
  Wrench,
  HelpCircle,
  Briefcase,
  TrendingUp,
  Laptop,
  Building,
  PiggyBank,
  Gift,
  CreditCard,
  Banknote,
  Building2,
  Smartphone,
  ShieldCheck,
  MoonStar,
} from 'lucide-react';

export function getCategoryIcon(iconName: string, className = 'w-5 h-5'): React.ReactElement {
  switch (iconName) {
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Fuel':
      return <Fuel className={className} />;
    case 'Utensils':
      return <Utensils className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Wifi':
      return <Wifi className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'Coins':
      return <Coins className={className} />;
    case 'Shirt':
      return <Shirt className={className} />;
    case 'HeartHandshake':
      return <HeartHandshake className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'Building':
      return <Building className={className} />;
    case 'PiggyBank':
      return <PiggyBank className={className} />;
    case 'Gift':
      return <Gift className={className} />;
    case 'CreditCard':
      return <CreditCard className={className} />;
    case 'Banknote':
      return <Banknote className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'MoonStar':
      return <MoonStar className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
}
