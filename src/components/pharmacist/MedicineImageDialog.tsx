
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { updateMedicineImage } from "../../services/medicineService";
import { Medicine } from "../../types/medicine";

interface MedicineImageDialogProps {
  medicine: Medicine | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedMedicine: Medicine) => void;
}

const MedicineImageDialog = ({ medicine, open, onOpenChange, onSuccess }: MedicineImageDialogProps) => {
  const [medicineImage, setMedicineImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedicineImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!medicine || !imagePreview) return;

    try {
      const updatedMedicine = await updateMedicineImage(medicine.id, imagePreview);
      if (updatedMedicine) {
        onSuccess(updatedMedicine);
        toast({
          title: "Image Updated",
          description: "Medicine image has been updated successfully",
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error updating medicine image:", error);
      toast({
        title: "Error",
        description: "Failed to update medicine image",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Medicine Image</DialogTitle>
          <DialogDescription>
            Choose a new image for {medicine?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {(imagePreview || medicine?.imageUrl) && (
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={imagePreview || medicine?.imageUrl}
                alt={medicine?.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}

          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!imagePreview}>
            Update Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicineImageDialog;
