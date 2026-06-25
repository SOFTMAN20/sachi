// ============================================================================
// Database types for the Supabase client. Hand-written to match the schema in
// supabase/migrations. Regenerate any time with:
//   npx supabase gen types typescript --local > types/database.ts
// ============================================================================

export type UserRole = 'tenant' | 'landlord' | 'agent' | 'property_manager' | 'admin';
export type PropertyTypeEnum = 'apartment' | 'house' | 'room' | 'hostel' | 'office' | 'commercial';
export type FurnishingStatus = 'furnished' | 'semi_furnished' | 'unfurnished';
export type ListingStatus = 'active' | 'rented' | 'pending_review';
export type LeadStatus = 'new' | 'contacted' | 'viewing_scheduled' | 'closed' | 'lost';
export type TenantStatus = 'active' | 'pending' | 'former';
export type PaymentStatus = 'paid' | 'due' | 'overdue';
export type CommissionStatus = 'paid' | 'pending';

export interface ProfileRow {
  id: string;
  role: UserRole | null;
  full_name: string | null;
  business_name: string | null;
  phone: string | null;
  whatsapp_phone: string | null;
  email: string | null;
  avatar_url: string | null;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyRow {
  id: string;
  owner_id: string;
  listed_as: UserRole | null;
  title: string;
  description: string;
  property_type: PropertyTypeEnum;
  furnishing: FurnishingStatus;
  bedrooms: number;
  bathrooms: number;
  monthly_rent: number;
  deposit_amount: number;
  estimated_utilities: number;
  address: string;
  neighbourhood: string;
  city: string;
  amenities: string[];
  status: ListingStatus;
  verified_phone: boolean;
  verified_id: boolean;
  images: string[];
  lat: number | null;
  lng: number | null;
  is_trending: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface LeadRow {
  id: string;
  property_id: string;
  owner_id: string;
  renter_id: string | null;
  name: string;
  avatar_url: string | null;
  message: string;
  source: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface TenantRow {
  id: string;
  owner_id: string;
  property_id: string | null;
  profile_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  rent_amount: number;
  move_in_date: string | null;
  lease_end: string | null;
  status: TenantStatus;
  created_at: string;
  updated_at: string;
}

export interface PaymentRow {
  id: string;
  owner_id: string;
  tenant_id: string | null;
  property_id: string | null;
  amount: number;
  due_date: string | null;
  method: string | null;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
}

export interface CommissionRow {
  id: string;
  agent_id: string;
  property_id: string | null;
  client_name: string;
  amount: number;
  status: CommissionStatus;
  earned_on: string;
  created_at: string;
}

export interface SavedPropertyRow {
  user_id: string;
  property_id: string;
  created_at: string;
}

export interface ConversationRow {
  id: string;
  property_id: string | null;
  participant_a: string;
  participant_b: string;
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  read: boolean;
  created_at: string;
}

type Row<T> = T;
type Insert<T, Optional extends keyof T> = Omit<T, Optional> & Partial<Pick<T, Optional>>;

type TableDef<R, I> = { Row: R; Insert: I; Update: Partial<I> };

export interface Database {
  public: {
    Tables: {
      profiles: TableDef<ProfileRow, Insert<ProfileRow, 'created_at' | 'updated_at' | 'rating' | 'role' | 'full_name' | 'business_name' | 'phone' | 'whatsapp_phone' | 'email' | 'avatar_url'>>;
      properties: TableDef<PropertyRow, Insert<PropertyRow, 'id' | 'created_at' | 'updated_at' | 'views_count' | 'is_trending' | 'status' | 'verified_phone' | 'verified_id' | 'amenities' | 'images' | 'lat' | 'lng' | 'listed_as' | 'description' | 'furnishing' | 'bedrooms' | 'bathrooms' | 'deposit_amount' | 'estimated_utilities' | 'address' | 'neighbourhood' | 'city'>>;
      leads: TableDef<LeadRow, Insert<LeadRow, 'id' | 'created_at' | 'updated_at' | 'status' | 'source' | 'message' | 'avatar_url' | 'renter_id'>>;
      tenants: TableDef<TenantRow, Insert<TenantRow, 'id' | 'created_at' | 'updated_at' | 'status' | 'property_id' | 'profile_id' | 'email' | 'phone' | 'rent_amount' | 'move_in_date' | 'lease_end'>>;
      payments: TableDef<PaymentRow, Insert<PaymentRow, 'id' | 'created_at' | 'status' | 'tenant_id' | 'property_id' | 'due_date' | 'method' | 'paid_at'>>;
      commissions: TableDef<CommissionRow, Insert<CommissionRow, 'id' | 'created_at' | 'status' | 'property_id' | 'earned_on'>>;
      saved_properties: TableDef<SavedPropertyRow, Insert<SavedPropertyRow, 'created_at'>>;
      conversations: TableDef<ConversationRow, Insert<ConversationRow, 'id' | 'created_at' | 'property_id' | 'last_message' | 'last_message_at'>>;
      messages: TableDef<MessageRow, Insert<MessageRow, 'id' | 'created_at' | 'read'>>;
    };
    Functions: {
      increment_property_views: { Args: { prop: string }; Returns: undefined };
    };
  };
}
