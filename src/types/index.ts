export type UserRole = 'tenant' | 'landlord' | 'agent' | 'property_manager' | 'admin';
export type PropertyType = 'apartment' | 'house' | 'room' | 'hostel' | 'office' | 'commercial';
export type FurnishingStatus = 'furnished' | 'semi_furnished' | 'unfurnished';
export type ListingStatus = 'active' | 'rented' | 'pending_review';

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  furnishing: FurnishingStatus;
  bedrooms: number;
  bathrooms: number;
  monthlyRent: number;
  depositAmount: number;
  estimatedUtilities: number;
  address: string;
  neighbourhood: string;
  city: string;
  amenities: string[];
  status: ListingStatus;
  verifiedPhone: boolean;
  verifiedId: boolean;
  images: string[];
  videoUrl?: string;
  lat: number;
  lng: number;
  ownerName: string;
  ownerAvatar: string;
  ownerRating: number;
  createdAt: string;
  isTrending?: boolean;
}

export interface MockMessage {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  otherParty: string;
  otherPartyAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}
