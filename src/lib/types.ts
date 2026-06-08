export type WidgetSize = "1x1" | "2x1" | "1x2" | "2x2";
export type WidgetType =
  | "profile"
  | "social"
  | "link"
  | "showcase"
  | "newsletter"
  | "map"
  | "text";

export type SocialPlatform =
  | "instagram"
  | "linkedin"
  | "github"
  | "youtube"
  | "twitter"
  | "tiktok"
  | "website";

export interface WidgetContent {
  // social
  platform?: SocialPlatform;
  url?: string;
  // link
  title?: string;
  description?: string;
  // showcase
  image_url?: string;
  // newsletter
  heading?: string;
  cta?: string;
  // map
  location?: string;
  // text
  body?: string;
}

export interface Widget {
  id: string;
  profile_id: string;
  type: WidgetType;
  content: WidgetContent;
  position_index: number;
  size: WidgetSize;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio: string;
  avatar_url: string | null;
  tags: string[];
  location: string | null;
  created_at: string;
  updated_at: string;
}
