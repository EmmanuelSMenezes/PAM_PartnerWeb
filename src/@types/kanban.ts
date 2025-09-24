// ----------------------------------------------------------------------

import { ReactNode } from 'react';

export type IKanbanComment = {
  id: string;
  avatar: string;
  name: string;
  createdAt: Date | string | number;
  messageType: 'image' | 'text';
  message: string;
};

export type IKanbanProducts = {
  cards: Record<string, IKanbanOrder> | any[];
  columns: Record<string, IKanbanColumn>;
  columnOrder: string[];
};

export type IKanbanAssignee = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  address: string;
  phone: string;
  email: string;
  lastActivity: Date | string;
  status: string;
  role: string;
};

export type IKanbanCard = {
  order_number: ReactNode;
  status_name: ReactNode;
  order_itens: any;
  order_id: string;
  order_status_id?: any;
  consumer: any;
  created_at: string;
  product_name: string;
  status: string;
  idClient: string;
  date: string;
  id: string;
  name: string;
  description: string;
  assignee: IKanbanAssignee[];
  due: [Date | null, Date | null];
  attachments: string[] | undefined;
  comments: IKanbanComment[];
  completed: boolean;
};

export type IKanbanOrder = {
  order_id: string;
  order_number: number;
  amount: number;
  payment_local_name: string;
  description: string;
  freight: number;
  order_status_id: string;
  status_name: string;
  consumer: Consumer;
  partner: Partner;
  order_itens: OrderIten[];
  created_at: string;
  updated_at: string;
};

export interface Consumer {
  user_id: string;
  consumer_id: string;
  legal_name: string;
}

export interface Partner {
  user_id: string;
  partner_id: string;
  identifier: number;
  fantasy_name: string;
  branch_id: string;
  branch_name: string;
  avatar: string;
}

export interface OrderIten {
  order_item_id: string;
  product_name: string;
  quantity: number;
  product_value: number;
  product_id: string;
  image_default: string;
  url: string;
}

export type IKanbanColumn = {
  id: string;
  name: string;
  cardIds: string[];
};

export type IKanbanBoard = {
  cards: IKanbanOrder[];
  columns: IKanbanColumn[];
  columnOrder: string[];
};

// ----------------------------------------------------------------------

export type IKanbanState = {
  isLoading: boolean;
  error: Error | string | null;
  board: {
    cards: Record<string, IKanbanOrder> | any;
    columns: Record<string, IKanbanColumn>;
    columnOrder: string[];
  };
};
