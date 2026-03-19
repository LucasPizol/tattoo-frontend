export type InstagramComment = {
  id: number;
  text: string;
  username: string;
  createdAt: string;
  post: { id: number; caption: string; url: string; permalink: string };
  account: { id: number; username: string };
};
