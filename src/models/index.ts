export interface User {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
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
  labels?: Array<Label>;
  assignees?: number[];
  projectId?: number;
  severity?: number;
  status?: 'open' | 'closed';
  createdOn?: Date;
  updatedOn?: Date;
  projectRef?: Project;
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
}

export interface IssueThread {
  id: number;
  author: number;
  createdOn?: Date;
  updatedOn?: Date;
  status?: 'unlocked' | 'locked';
  description?: Comment;
  comments?: Array<Comment>;
  participants?: number[];
  labels?: Array<Label>;
  assignees?: number[];
  issueRef?: Issue;
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
