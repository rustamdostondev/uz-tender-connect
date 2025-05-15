
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistance } from "date-fns";

type TenderStatus = 'open' | 'pending' | 'accepted' | 'rejected' | 'closed';

interface TenderCardProps {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  category: string;
  status: TenderStatus;
  createdAt: string;
  offersCount?: number;
}

export default function TenderCard({ 
  id, 
  title, 
  description, 
  budget, 
  deadline, 
  category, 
  status, 
  createdAt,
  offersCount = 0
}: TenderCardProps) {
  const statusColors: Record<TenderStatus, string> = {
    open: "bg-status-open",
    pending: "bg-status-pending",
    accepted: "bg-status-accepted",
    rejected: "bg-status-rejected",
    closed: "bg-status-closed"
  };

  const statusLabels: Record<TenderStatus, string> = {
    open: "Open",
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
    closed: "Closed"
  };
  
  const deadlineDate = new Date(deadline);
  const createdAtDate = new Date(createdAt);
  const timeLeft = formatDistance(deadlineDate, new Date(), { addSuffix: true });
  const timeAgo = formatDistance(createdAtDate, new Date(), { addSuffix: true });

  return (
    <Link to={`/tenders/${id}`}>
      <Card className="h-full hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-medium line-clamp-2">{title}</CardTitle>
            <Badge className={`${statusColors[status]} whitespace-nowrap`}>
              {statusLabels[status]}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">{category}</div>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground mb-2">{description}</p>
          <div className="flex flex-col gap-1 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Budget:</span>
              <span className="text-sm font-bold">${budget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Deadline:</span>
              <span className="text-sm">{timeLeft}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
          <span>Posted {timeAgo}</span>
          <span>{offersCount} {offersCount === 1 ? 'offer' : 'offers'}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
