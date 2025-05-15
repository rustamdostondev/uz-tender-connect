
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OfferCardProps {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  price: number;
  deliveryTime: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  matchScore?: number; // For the AI feature in phase 2
  canRespond?: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function OfferCard({
  id,
  user,
  price,
  deliveryTime,
  message,
  status,
  createdAt,
  matchScore,
  canRespond = false,
  onAccept,
  onReject
}: OfferCardProps) {
  const statusColors = {
    pending: "bg-status-pending",
    accepted: "bg-status-accepted",
    rejected: "bg-status-rejected"
  };

  return (
    <Card className="mb-4 hover:shadow-sm transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center uppercase font-medium">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <Badge className={`${statusColors[status]} capitalize`}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Price</div>
            <div className="font-bold">${price.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Delivery Time</div>
            <div>{deliveryTime}</div>
          </div>
        </div>
        
        {matchScore !== undefined && (
          <div className="mb-4">
            <div className="text-sm text-muted-foreground mb-1">Match Score</div>
            <div className="w-full bg-secondary rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${matchScore}%` }}
              ></div>
            </div>
            <div className="text-right text-xs mt-1">{matchScore}%</div>
          </div>
        )}
        
        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-1">Message</div>
          <div className="text-sm">{message}</div>
        </div>
      </CardContent>
      
      {canRespond && status === 'pending' && (
        <CardFooter className="border-t pt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onReject?.(id)}>
            Reject
          </Button>
          <Button onClick={() => onAccept?.(id)}>
            Accept
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
