export type ItemType = "yt" | "ys" | "ypl" | "lp" | "blog" | "email" | "tw" | "git" | "li" | "ig";

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
  tags?: string[];
}

export type HubItem = IGItem | YTItem | YSItem | YPLItem | LIItem | LPItem | BlogItem | EmailItem | TWItem | GitItem;

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
}
