export interface User {
  id: number;
  name: string;
  // eslint-disable-next-line camelcase
  display_name: string;
  email?: string;
  avatar?: string;
  // eslint-disable-next-line camelcase
  social_provider?: string|null;
  // eslint-disable-next-line camelcase
  social_user?: object|null;
  // eslint-disable-next-line camelcase
  social_id?: string|null;
  // eslint-disable-next-line camelcase
  projects_url?: string|null;
  // eslint-disable-next-line camelcase
  created_at?: Date|string|null;
  // eslint-disable-next-line camelcase
  update_at?: Date|string|null;
}

export interface Comment {
  id: number;
  authorId: number;
  authorName?: string;
  body?: string;
  upVotes?: number;
  downVotes?: number;
  threadId: number;
  createdOn?: Date;
  updatedOn?: Date;
  hasVoted?: false;
  myVote?: string;
  voters?: Array<{ voterId: number; vote: string }>;
}

export interface Issue {
  id: number;
  userId: number;
  title: string;
  body?: string;
  labels?: Label[];
  assignees?: number[];
  severity?: number;
  status?: 'open' | 'closed';
  createdOn?: Date;
  updatedOn?: Date;
  project?: Project;
  meta?: {
    assignees: User[];
    participants: User[];
  }|null;
}

export interface Label {
  label: string;
  description?: string;
  value?: string;
  color?: string;
}

export interface Project {
  id: number;
  owner: number;
  ownerType: 'user' | 'org';
  label: string;
  value?: string;
  description?: string;
  website?: string;
  // eslint-disable-next-line camelcase
  is_public?: boolean;
  issues?: Issue[];
}

export interface IssueThread {
  id: number;
  author: User|null;
  createdOn?: Date;
  updatedOn?: Date;
  status?: 'unlocked' | 'locked';
  description?: Comment;
  comments?: Comment[];
  participants?: number[];
  labels?: Array<Label>;
  assignees?: number[];
  issueRef?: Issue;
  issue?: Issue|null;
}

export function createUser (d: object): User {
  return Object.assign({}, d) as User
}

export function createComment (d: object): Comment {
  return Object.assign({}, d) as Comment
}

export function createIssue (d: object): Issue {
  return Object.assign({}, d) as Issue
}

export function createLabel (d: object): Label {
  return Object.assign({}, d) as Label
}

export function createProject (d: object): Project {
  return Object.assign({}, d) as Project
}

export function createThread (d: object): IssueThread {
  return Object.assign({}, d) as IssueThread
}
