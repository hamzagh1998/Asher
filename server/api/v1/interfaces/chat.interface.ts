export interface ChatInterface<T> {
  chatName: string;
  isGroupChat: boolean;
  users: Array<T>;
  latestMessage: T;
  groupAdmin: T;
};