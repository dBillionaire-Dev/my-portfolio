import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth, hashPassword } from "./auth";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  setupAuth(app);

  // === Projects ===
  app.get(api.projects.list.path, async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  });

  app.post(api.projects.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.projects.create.input.parse(req.body);
      const project = await storage.createProject(input);
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.projects.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.projects.update.input.parse(req.body);
      const project = await storage.updateProject(Number(req.params.id), input);
      res.json(project);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.delete(api.projects.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    await storage.deleteProject(Number(req.params.id));
    res.status(204).send();
  });

  // === Blog ===
  app.get(api.blog.list.path, async (_req, res) => {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  });

  app.get(api.blog.get.path, async (req, res) => {
    const post = await storage.getBlogPostBySlug(String(req.params.slug));
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  });

  app.post(api.blog.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.blog.create.input.parse(req.body);
      const post = await storage.createBlogPost(input);
      res.status(201).json(post);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.patch(api.blog.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.blog.update.input.parse(req.body);
      const post = await storage.updateBlogPost(Number(req.params.id), input);
      res.json(post);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  // === File Uploads ===
  app.post("/api/upload", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    // In a real app, use multer. For this prototype, we'll accept base64 in JSON
    // or simulate a successful upload for the UI.
    const { data } = req.body;
    if (!data) return res.status(400).json({ message: "No data provided" });
    
    // For simplicity in this environment, we'll just return the base64 data as the URL
    // so it can be stored and displayed immediately.
    res.json({ url: data });
  });

  app.delete(api.blog.delete.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    await storage.deleteBlogPost(Number(req.params.id));
    res.status(204).send();
  });

  // === Messages ===
  app.post(api.messages.create.path, async (req, res) => {
    try {
      const input = api.messages.create.input.parse(req.body);
      const message = await storage.createMessage(input);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  app.get(api.messages.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.delete("/api/messages/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    await storage.deleteMessage(Number(req.params.id));
    res.status(204).send();
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const users = await storage.getUserByUsername("nexa");
  if (!users) {
    const password = await hashPassword("D'Billionaire");
    await storage.createUser({ username: "nexa", password, role: "admin" });
  }

  const projects = await storage.getProjects();
  if (projects.length === 0) {
    await storage.createProject({
      title: "Medical Unit Conversion App",
      description: "A PWA for medical professionals to convert units instantly. Built with React and offline capabilities.",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070",
      projectUrl: "#",
      tags: ["React", "PWA", "Medical"],
      priority: 10,
      featured: true
    });
    await storage.createProject({
      title: "Portfolio Dashboard",
      description: "Interactive tile system portfolio with comprehensive admin dashboard.",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2015",
      projectUrl: "#",
      tags: ["Next.js", "TypeScript", "Tailwind"],
      priority: 9,
      featured: true
    });
  }

  const posts = await storage.getBlogPosts();
  if (posts.length === 0) {
    await storage.createBlogPost({
      title: "The AI Revolution in Full-stack Engineering",
      slug: "ai-revolution-fullstack",
      content: "As a backend-heavy fullstack engineer, integrating AI into your workflow is no longer optional. From Vector databases to LLM orchestration with LangChain, the stack is evolving. In this post, we explore how to build robust, AI-powered applications that scale.",
      tags: ["AI", "Full-stack", "LLM", "Next.js"],
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070"
    });
    await storage.createBlogPost({
      title: "Mastering the Modern Backend",
      slug: "mastering-modern-backend",
      content: "Node.js, Express, and PostgreSQL form the bedrock of many high-performance applications. This guide dives deep into advanced patterns for session management, database optimization, and secure API design.",
      tags: ["Node.js", "Express", "PostgreSQL", "Backend"],
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2068"
    });
  }
}
