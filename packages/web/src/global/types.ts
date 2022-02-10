export interface IState {
  adminPassword?: string;
  tags: ITag[];
  items: IItem[];
}

export interface ITag {
  id: string;
  shopId: string;
  name: string;
  variations: string[];
}

export interface IItem {
  id: string;
  tagId: string;
  name: string;
  description: string;
  price: number;
}
