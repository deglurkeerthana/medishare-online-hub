
export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  dosage: string;
  sideEffects: string[];
  benefits: string[];
  usage: string;
  imageUrl: string;
  stock: number;
  category: string;
  requires_prescription: boolean;
  pharmacyId?: string;
  ownerId?: string;
  manufactureDate: string;
  expiryDate: string;
}
