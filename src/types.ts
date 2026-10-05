export type ItemType = "yt" | "ys" | "ypl" | "lp" | "blog" | "email" | "tw" | "git" | "li" | "ig" | "igp" | "th" | "web" | "lab";

export interface BaseItem {
  id: number | string;
  type: ItemType;
  url: string;
  title: string;
  author: string;
  description: string;
  date: string;
  ts: number;
  starred: boolean;
  thumbnail?: string;
  isProtected?: boolean;
}

export interface YTItem extends BaseItem {
  type: "yt";
  duration?: string;
  topics?: string[];
  vid?: string;
}

export interface YSItem extends BaseItem {
  type: "ys";
  duration?: string;
  topics?: string[];
  vid?: string;
}

export interface YPLItem extends BaseItem {
  type: "ypl";
  count?: number | string;
  topics?: string[];
  pid?: string;
  vid?: string;
  videoList?: string[];
  progressStatus?: "not_started" | "in_progress" | "completed";
  completedVideos?: number;
  difficulty?: "Beginner" | "Intermediate" | "Advanced" | "Comprehensive";
  notes?: string;
}

export interface LIItem extends BaseItem {
  type: "li";
  company?: string;
  location?: string;
  skills?: string[];
}

export interface LPItem extends BaseItem {
  type: "lp";
  company?: string;
  postType?: string;
  tags?: string[];
  heading?: string;
}

export interface BlogItem extends BaseItem {
  type: "blog";
  platform?: string;
  tags?: string[];
}

export interface EmailItem extends BaseItem {
  type: "email";
  company?: string;
  email?: string;
  role?: string;
  tags?: string[];
}

export interface TWItem extends BaseItem {
  type: "tw";
  handle?: string;
  heading?: string;
  tags?: string[];
}

export interface GitItem extends BaseItem {
  type: "git";
  stars?: number;
  forks?: number;
  language?: string;
  topics?: string[];
}


export interface IGItem extends BaseItem {
  type: "ig";
  shortcode?: string;
  heading?: string;
  tags?: string[];
}

export interface IGPItem extends BaseItem {
  type: "igp";
  shortcode?: string;
  heading?: string;
  tags?: string[];
}

export interface ThreadsMediaItemType {
  url: string;
  type: "image" | "video";
  thumbnail?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface THItem extends BaseItem {
  type: "th";
  handle?: string;
  heading?: string;
  tags?: string[];
  shortcode?: string;
  media?: (ThreadsMediaItemType | string)[];
  images?: string[];
  videos?: string[];
  videoUrl?: string;
}


export interface WebItem extends BaseItem {
  type: "web";
  tags?: string[];
  domain?: string;
}

export interface LabItem extends BaseItem {
  type: "lab";
  tags?: string[];
  platform?: string;
  duration?: string;
  difficulty?: string;
}

export type HubItem = IGItem | IGPItem | YTItem | YSItem | YPLItem | LIItem | LPItem | BlogItem | EmailItem | TWItem | GitItem | THItem | WebItem | LabItem;

export interface HubDB {
  yt: YTItem[];
  ys: YSItem[];
  ypl: YPLItem[];
  li: LIItem[];
  lp: LPItem[];
  blog: BlogItem[];
  email: EmailItem[];
  
  tw: TWItem[];
  git: GitItem[];
  ig: IGItem[];
  igp: IGPItem[];
  th: THItem[];
  web: WebItem[];
  lab: LabItem[];
}

export interface UserProfile {
  uid: string;
  email?: string | null;
  name: string;
  role?: "admin" | "user";
  status?: "active" | "suspended" | "inactive";
  mobile_number: string | null;
  provider: "github" | "google" | "phone" | "password" | "email" | "phone_shadow";
  createdAt: any;
  last_login?: any;
  isDemo?: boolean;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  event_type: "login" | "logout" | "content_saved" | "content_opened" | "content_deleted" | "collection_created" | "search" | "profile_updated";
  resource_type?: string;
  resource_id?: string | number;
  metadata?: Record<string, any>;
  created_at: any;
}

export interface AccessLog {
  id: string;
  user_id?: string;
  user_email?: string;
  user_name?: string;
  login_time: any;
  auth_method: "google" | "github" | "phone" | "password";
  device_browser: string;
  ip_address?: string;
  status: "success" | "failed";
}

export interface UserProgress {
  userId: string;
  itemId: string | number;
  completed: boolean;
  completedAt: any;
}

export interface UserBookmark {
  userId: string;
  itemId: string | number;
  createdAt: any;
}

