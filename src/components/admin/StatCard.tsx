import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, description, icon: Icon, trend }: StatCardProps) => {
  return (
    <Card className="rounded-2xl border-0 shadow-elegant hover:shadow-hover transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-accent/10">
          <Icon className="h-5 w-5 text-accent" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-serif">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
        {trend && (
          <p className={`text-xs mt-2 font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}% so với tháng trước
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;

