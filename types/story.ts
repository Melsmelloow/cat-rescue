export type TStory = {
  _id: string;
  caption: string;
  coverImage: string;
  slug: string;
  likes: number;
  featured: boolean;
  cats: { _id: string; name: string }[];
  createdAt: string;
};
