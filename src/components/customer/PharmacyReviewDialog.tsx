
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";
import { addPharmacyReview } from "../../services/pharmacyService";
import { Pharmacy } from "../../types/pharmacy";
import { useAuth } from "../../contexts/AuthContext";

interface PharmacyReviewDialogProps {
  pharmacy: Pharmacy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedPharmacy: Pharmacy) => void;
}

const PharmacyReviewDialog = ({ pharmacy, open, onOpenChange, onSuccess }: PharmacyReviewDialogProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!pharmacy || !user) return;

    try {
      const review = {
        userId: user.id,
        userName: user.name,
        rating,
        comment
      };

      const updatedPharmacy = await addPharmacyReview(pharmacy.id, review);
      if (updatedPharmacy) {
        onSuccess(updatedPharmacy);
        toast({
          title: "Review Submitted",
          description: "Thank you for your feedback!",
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate & Review</DialogTitle>
          <DialogDescription>
            Share your experience with {pharmacy?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer ${
                  star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <Textarea
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!comment}>
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PharmacyReviewDialog;
