"use client"

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedDiv from "@/components/AnimatedDiv";
import { Tag } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default async function Blog() {
  let posts = [];
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API_BASE}/api/blog`, { next: { revalidate: 60 }, signal: controller.signal });
    clearTimeout(timeoutId);
    posts = res.ok ? await res.json() : [];
  } catch (error) {
    console.warn('Failed to fetch blog posts from backend:', error);
    posts = [];
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24 pt-32">
        <AnimatedDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Engineering Insights
          </h1>
          <p className="text-muted-foreground mb-12 text-lg">
            Thoughts on backend architecture, AI integration, and the future of full-stack engineering.
          </p>

          <div className="grid gap-8">
            {posts?.map((post: any) => (
              <AnimatedDiv
                key={post.id}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card className="bg-card/50 border-primary/10 cursor-pointer hover:border-primary/30 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-2xl hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          {post.tags.join(", ")}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3">
                        {post.content}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedDiv>
            ))}
          </div>
        </AnimatedDiv>
      </main>
      <Footer />
    </div>
  );
}
