
export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "pharmacist" | "admin";
  phone?: string;
  address?: string;
  imageUrl?: string;
  pharmacyId?: string;
}

