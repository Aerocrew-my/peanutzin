export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          body: string | null;
          category: "news" | "gossip" | "event" | "feature";
          status: "draft" | "published";
          featured: boolean;
          trending_rank: number | null;
          hero_image_path: string | null;
          published_at: string | null;
          event_start_at: string | null;
          event_end_at: string | null;
          event_location: string | null;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["articles"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["articles"]["Insert"]>;
        Relationships: [];
      };
      books: {
        Row: {
          id: string;
          slug: string;
          title: string;
          author: string;
          description: string | null;
          price_cents: number;
          currency: "MYR";
          cover_image_path: string | null;
          featured: boolean;
          active: boolean;
          stock_quantity: number | null;
          isbn: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["books"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["books"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: { id: string; key: string; value: Json; updated_at: string };
        Insert: Omit<Database["public"]["Tables"]["site_settings"]["Row"], "id" | "updated_at"> & { id?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
        Relationships: [];
      };
      admin_users: {
        Row: { id: string; email: string | null; role: "admin" | "editor"; active: boolean; created_at: string; updated_at: string };
        Insert: { id: string; email?: string | null; role?: "admin" | "editor"; active?: boolean; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
