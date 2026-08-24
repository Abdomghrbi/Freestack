export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  image_url: string | null;
  price: 'free' | 'paid' | 'freemium';
  created_at: string;
}

export interface Review {
  id: string;
  tool_id: string;
  user_id: string;
  visitor_id: string | null;
  ip_address: string | null;
  rating: number;
  comment: string | null;
  helpful_count: number;
  created_at: string;
}

export interface Suggestion {
  id: string;
  user_id: string;
  name: string;
  url: string;
  description: string | null;
  category: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
