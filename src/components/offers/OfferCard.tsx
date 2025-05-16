
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { OfferStatus } from "@/types/tender";
import { Download } from "lucide-react";

interface OfferCardProps {
  id: string;
  tender_id: string;
  user_id: string;
  price: number;
  delivery_time: number;
  message: string;
  file_url?: string | null;
  status: OfferStatus;
  created_at: string;
  isOwner?: boolean;
  canRespond?: boolean;
}

export default function OfferCard({
  id,
  tender_id,
  user_id,
  price,
  delivery_time,
  message,
  file_url,
  status,
  created_at,
  isOwner = false,
  canRespond = false,
}: OfferCardProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const statusColors = {
    pending: "bg-status-pending",
    accepted: "bg-status-accepted",
    rejected: "bg-status-rejected",
  };

  const statusLabels = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
  };

  const updateOfferStatus = useMutation({
    mutationFn: async ({ offerId, newStatus }: { offerId: string; newStatus: OfferStatus }) => {
      const { data, error } = await supabase
        .from('offers')
        .update({ status: newStatus })
        .eq('id', offerId)
        .select();

      if (error) throw error;

      // If accepting an offer, update the tender status to awarded
      if (newStatus === 'accepted') {
        const { error: tenderError } = await supabase
          .from('tenders')
          .update({ status: 'awarded' })
          .eq('id', tender_id);

        if (tenderError) throw tenderError;

        // Reject all other pending offers for this tender
        const { error: rejectError } = await supabase
          .from('offers')
          .update({ status: 'rejected' })
          .eq('tender_id', tender_id)
          .neq('id', offerId)
          .eq('status', 'pending');

        if (rejectError) throw rejectError;
      }

      return data[0];
    },
    onSuccess: (_, variables) => {
      const action = variables.newStatus === 'accepted' ? 'accepted' : 'rejected';
      toast({
        title: `Offer ${action}`,
        description: `You have successfully ${action} this offer.`
      });
      queryClient.invalidateQueries({ queryKey: ['offers', tender_id] });
      queryClient.invalidateQueries({ queryKey: ['tender', tender_id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating offer",
        description: error.message || "There was a problem updating the offer status.",
        variant: "destructive"
      });
    }
  });

  const handleAccept = () => {
    updateOfferStatus.mutate({ offerId: id, newStatus: 'accepted' });
  };

  const handleReject = () => {
    updateOfferStatus.mutate({ offerId: id, newStatus: 'rejected' });
  };

  const createdAtDate = new Date(created_at);
  const timeAgo = formatDistance(createdAtDate, new Date(), { addSuffix: true });

  const isPending = status === 'pending';

  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-bold">${Number(price).toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">
              Delivery in {delivery_time} {delivery_time === 1 ? 'day' : 'days'}
            </div>
          </div>
          <Badge className={statusColors[status]}>
            {statusLabels[status]}
          </Badge>
        </div>

        <div className="text-sm whitespace-pre-wrap">{message}</div>

        {file_url && (
          <div className="flex items-center pt-2">
            <a 
              href={file_url} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary flex items-center hover:underline"
            >
              <Download className="h-4 w-4 mr-1" />
              Download attachment
            </a>
          </div>
        )}

        <div className="flex justify-between items-center pt-2 text-xs text-muted-foreground">
          <div>Submitted {timeAgo}</div>
          
          {isOwner && canRespond && isPending && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-500 hover:text-red-700"
                onClick={handleReject}
                disabled={updateOfferStatus.isPending}
              >
                Reject
              </Button>
              <Button 
                size="sm" 
                onClick={handleAccept}
                disabled={updateOfferStatus.isPending}
              >
                Accept
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
