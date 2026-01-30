import {
  users, projects, messages, blogPosts,
  type User, type InsertUser, type UpdateUser,
  type Project, type InsertProject, type UpdateProjectRequest,
  type Message, type InsertMessage,
  type BlogPost, type InsertBlogPost, type UpdateBlogPostRequest
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import { db } from "./db";

export interface IStorage {
  // Auth
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: UpdateUser): Promise<User>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: UpdateProjectRequest): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  // Blog
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, updates: UpdateBlogPostRequest): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;

  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
  deleteMessage(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // In-memory session store for express-session
  sessionStore: session.MemoryStore = new session.MemoryStore();

  // Auth
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: UpdateUser): Promise<User> {
    const [user] = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.priority));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: number, updates: UpdateProjectRequest): Promise<Project> {
    const [project] = await db.update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Blog
  // async getBlogPosts(): Promise<BlogPost[]> {
  //   return await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  // }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.title));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(insertPost).returning();
    return post;
  }

  async updateBlogPost(id: number, updates: UpdateBlogPostRequest): Promise<BlogPost> {
    const [post] = await db.update(blogPosts)
      .set(updates)
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Messages
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  async deleteMessage(id: number): Promise<void> {
    await db.delete(messages).where(eq(messages.id, id));
  }
}

class InMemoryStorage implements IStorage {
  sessionStore: session.MemoryStore = new session.MemoryStore();
  private _users: User[] = [];
  private _projects: Project[] = [];
  private _messages: Message[] = [];
  private _posts: BlogPost[] = [];
  private _id = 1;

  // Auth
  async getUser(id: number) {
    return this._users.find(u => u.id === id);
  }

  async getUserByUsername(username: string) {
    return this._users.find(u => u.username === username);
  }

  async createUser(user: InsertUser) {
    const newUser = { id: this._id++, ...user } as unknown as User;
    this._users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, updates: UpdateUser) {
    const idx = this._users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error("User not found");
    this._users[idx] = { ...this._users[idx], ...updates } as User;
    return this._users[idx];
  }

  // Projects
  async getProjects() {
    return [...this._projects].sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  async getProject(id: number) {
    return this._projects.find(p => p.id === id);
  }

  async createProject(project: InsertProject) {
    const newProject = { id: this._id++, ...project } as unknown as Project;
    this._projects.push(newProject);
    return newProject;
  }

  async updateProject(id: number, updates: UpdateProjectRequest) {
    const idx = this._projects.findIndex(p => p.id === id);
    if (idx === -1) throw new Error("Not found");
    this._projects[idx] = { ...this._projects[idx], ...updates } as Project;
    return this._projects[idx];
  }

  async deleteProject(id: number) {
    this._projects = this._projects.filter(p => p.id !== id);
  }

  // Blog
  async getBlogPosts() {
    return [...this._posts];
  }

  async getBlogPostBySlug(slug: string) {
    return this._posts.find(p => p.slug === slug);
  }

  async getBlogPostById(id: number) {
    return this._posts.find(p => p.id === id);
  }

  async createBlogPost(post: InsertBlogPost) {
    const newPost = { id: this._id++, ...post } as unknown as BlogPost;
    this._posts.push(newPost);
    return newPost;
  }

  async updateBlogPost(id: number, updates: UpdateBlogPostRequest) {
    const idx = this._posts.findIndex(p => p.id === id);
    if (idx === -1) throw new Error("Not found");
    this._posts[idx] = { ...this._posts[idx], ...updates } as BlogPost;
    return this._posts[idx];
  }

  async deleteBlogPost(id: number) {
    this._posts = this._posts.filter(p => p.id !== id);
  }

  // Messages
  async createMessage(message: InsertMessage) {
    const newMsg = { id: this._id++, ...message } as unknown as Message;
    this._messages.push(newMsg);
    return newMsg;
  }

  async getMessages() {
    return [...this._messages];
  }

  async deleteMessage(id: number) {
    this._messages = this._messages.filter(m => m.id !== id);
  }
}

export const storage = db ? new DatabaseStorage() : new InMemoryStorage();
