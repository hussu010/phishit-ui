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
}
