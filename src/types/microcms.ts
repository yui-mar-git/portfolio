export interface MicroCMSImage {
  url: string;
  width: number;
  height: number;
}

export interface MicroCMSListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}

export interface MicroCMSSettings {
  name: string;
  title: string;
  bio: string;
  avatar?: MicroCMSImage;
}

export interface MicroCMSProfile {
  id: string;
  name: string;
  category: string[];
  acquired_date?: string;
  status: string[];
}

export interface MicroCMSPortfolio {
  id: string;
  title: string;
  description: string;
  thumbnail?: MicroCMSImage;
  tags?: string;
  url?: string;
}

export interface MicroCMSCredits {
  id: string;
  name: string;
  author?: string;
  url?: string;
  category: string[];
  usage?: string;
  license?: string;
}
