import { NullableType } from './helpers';

export interface Entity {
  id: string;
}

export interface UserBasic extends Entity {
  bio: NullableType<string>;
  first_name: string;
  instagram_username: NullableType<string>;
  last_name: NullableType<string>;
  links: {
    followers: string;
    following: string;
    html: string;
    likes: string;
    photos: string;
    portfolio: string;
    self: string;
  };
  location: NullableType<string>;
  name: string;
  portfolio_url: NullableType<string>;
  profile_image: {
    small: string;
    medium: string;
    large: string;
  };
  total_collections: number;
  total_likes: number;
  total_photos: number;
  twitter_username: NullableType<string>;
  updated_at: string;
  username: string;
}

export interface VeryBasic extends Entity {
  created_at: string;
  updated_at: string;
  urls: {
    full: string;
    raw: string;
    regular: string;
    small: string;
    thumb: string;
  };
}

export interface Basic extends VeryBasic {
  alt_description: NullableType<string>;
  blur_hash: NullableType<string>;
  color: NullableType<string>;
  description: NullableType<string>;
  height: number;
  likes: number;
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  promoted_at: NullableType<string>;
  width: number;
  user: UserBasic;
}

export type UnsplashPhoto = Basic;
