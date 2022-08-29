export interface MessageInterface<T> {
  sender: T;
  content: string;
  chat: T;
  readBy: Array<T>;
};