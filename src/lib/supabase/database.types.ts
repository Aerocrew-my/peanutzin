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
          hero_image_alt: string | null;
          published_at: string | null;
          event_start_at: string | null;
          event_end_at: string | null;
          event_location: string | null;
          source_name: string | null;
          source_url: string | null;
          event_url: string | null;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["articles"]["Row"], "id" | "created_at" | "updated_at" | "hero_image_alt"> & { id?: string; created_at?: string; updated_at?: string; hero_image_alt?: string | null };
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
          publisher:string|null; publication_year:number|null; language:string|null; genre:string|null;
          format:"physical"|"ebook"|"both"; ebook_price_cents:number|null;
          catalogue_type:"peanutzin"|"indie_author"|"independent_publisher";
          independent_publisher:boolean; emerging_author:boolean; preview_only:boolean;
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
      social_drafts: {
        Row: { id:string; source_article_id:string|null; title:string; master_brief:string; tone_notes:string|null; facebook_copy:string|null; instagram_copy:string|null; linkedin_copy:string|null; threads_copy:string|null; short_copy:string|null; hashtags:string|null; seo_title:string|null; seo_description:string|null; status:"draft"|"generated"|"reviewed"|"ready"; generation_model:string|null; generation_metadata:Json; created_by:string|null; created_at:string; updated_at:string };
        Insert: Partial<Database["public"]["Tables"]["social_drafts"]["Row"]> & {master_brief:string};
        Update: Partial<Database["public"]["Tables"]["social_drafts"]["Insert"]>;
        Relationships: [];
      };
      social_publications: {
        Row: { id:string; social_draft_id:string; platform:"facebook"|"instagram"|"linkedin"|"threads"; status:"pending"|"sent"|"published"|"failed"|"manual"; method:"make"|"manual"; attempt_reference:string; external_reference:string|null; error_message:string|null; published_at:string|null; created_by:string|null; created_at:string; updated_at:string };
        Insert: Omit<Database["public"]["Tables"]["social_publications"]["Row"],"id"|"created_at"|"updated_at"> & {id?:string;created_at?:string;updated_at?:string};
        Update: Partial<Database["public"]["Tables"]["social_publications"]["Insert"]>;
        Relationships: [];
      };
      orders: {
        Row: { id:string; order_number:string; confirmation_token_hash:string; customer_user_id:string|null; customer_name:string; customer_email:string; customer_phone:string; shipping_address_line1:string; shipping_address_line2:string|null; shipping_postcode:string; shipping_city:string; shipping_state:string; shipping_country:"MY"; subtotal_cents:number; shipping_cents:number; total_cents:number; currency:"MYR"; order_status:"pending"|"processing"|"shipped"|"completed"|"cancelled"; payment_status:"unpaid"|"pending"|"paid"|"failed"|"refunded"; payment_provider:string|null; payment_reference:string|null; stock_decremented_at:string|null; customer_notes:string|null; admin_notes:string|null; created_at:string; updated_at:string; paid_at:string|null; shipped_at:string|null; completed_at:string|null; cancelled_at:string|null };
        Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]> & { order_number:string; confirmation_token_hash:string; customer_name:string; customer_email:string; customer_phone:string; shipping_address_line1:string; shipping_postcode:string; shipping_city:string; shipping_state:string; subtotal_cents:number; shipping_cents:number; total_cents:number };
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>; Relationships: [];
      };
      order_items: {
        Row: { id:string; order_id:string; book_id:string|null; book_title:string; book_author:string|null; book_slug:string|null; unit_price_cents:number; quantity:number; line_total_cents:number; format:"physical"|"ebook"; created_at:string };
        Insert: Omit<Database["public"]["Tables"]["order_items"]["Row"],"id"|"created_at"> & {id?:string;created_at?:string}; Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>; Relationships: [];
      };
      newsletter_subscribers: {
        Row:{id:string;email:string;name:string|null;status:"subscribed"|"unsubscribed";source:string;created_at:string;updated_at:string};
        Insert:{id?:string;email:string;name?:string|null;status?:"subscribed"|"unsubscribed";source?:string;created_at?:string;updated_at?:string};
        Update:Partial<Database["public"]["Tables"]["newsletter_subscribers"]["Insert"]>;Relationships:[];
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_guest_order: { Args:{p_input:Json;p_items:Json;p_token_hash:string}; Returns:{order_id:string;order_number:string;subtotal_cents:number;shipping_cents:number;total_cents:number}[] };
      confirm_test_payment: { Args:{p_order_id:string;p_reference:string}; Returns:boolean };
      subscribe_newsletter:{Args:{p_email:string;p_name?:string|null;p_source?:string};Returns:string};
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
