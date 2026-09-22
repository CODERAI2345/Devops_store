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
  count?: number;
  topics?: string[];
  pid?: string;
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
