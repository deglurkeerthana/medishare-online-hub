
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
}
