export interface INotification {
  notification_id: string;
  title: string;
  description: string;
  read_at?: Date | null;
  user_id: string;
  type: string;
  aux_content?: string;
  created_at: Date;
}

export interface INewNotification {
  title: string;
  description: string;
  user_id: string;
  type: string;
}

export interface IChat {
  chat_id: string;
  description: string;
  created_at: Date;
  updated_at?: Date;
  created_by: string;
  members: string[];
  membersProfile: Member[];
  lastMessage: LastMessage;
  messages: Message[];
  unReadCountMessages: number;
  closed_by: string;
  closed?: Date;
  order_id?: string;
}

export interface Member {
  user_id: string;
  avatar: string;
  name: string;
}

export interface LastMessage {
  content: string;
  read_at?: Date;
  created_at: Date;
  sender_id: string;
  message_id?: string;
  messageType: string;
}

export interface Message {
  content: string;
  read_at?: Date;
  created_at: Date;
  sender_id: string;
  chat_id?: string;
  message_id?: string;
  messageType: string;
}
