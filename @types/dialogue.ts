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
  stopped?: boolean;
  managerMessage?: string;
  accountId?: string;
  varUsername?: string;
  lead?: boolean;

  dateCreated: Date;
  dateUpdated: Date;
}
