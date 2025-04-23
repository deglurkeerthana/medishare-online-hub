
export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  ownerId?: string;
  ownerImage?: string;
  openingHours?: string;
  distance?: string;
  reviews?: PharmacyReview[];
}

export interface PharmacyReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

