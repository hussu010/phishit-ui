export interface AdventureCardProps {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

interface DocumentProps {
  _id: string;
  type: string;
  url: string;
}

export interface GuideRequestProps {
  _id: string;
  type: string;
  name: string;
  phoneNumber: string;
  email: string;
  message: string;
  address: string;
  documents: DocumentProps[];
  createdAt: string;
  updatedAt: string;
  status: string;
}

interface User {
  _id: string;
  username: string;
}

export interface Action {
  user: User;
  resource: string;
  action: string;
  resourceId: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Response {
  data: Action[];
  total: number;
  count: number;
  limit: number;
  offset: number;
}