export interface Dialogue {
  username: string;
  href: string;

  blocked?: boolean;
  bio?: string;
  groupId?: number;
  messages?: Array<string>;
  phone?: string;
  title?: string;
  viewed?: boolean;

  dateCreated: string;
  dateUpdated: string;
}
