"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedDiv from "@/components/AnimatedDiv";
import { Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const API_BASE = "http://localhost:4000";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  imageUrl?: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const res = await fetch(`${API_BASE}/api/blog`, { next: { revalidate: 60 }, signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.warn('Failed to fetch blog posts from backend:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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

          {loading ? (
            <div className="grid gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-card/50 border-primary/10">
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Blog posts loading...</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {posts.map((post) => (
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
          )}
        </AnimatedDiv>
      </main>
      <Footer />
    </div>
  );
}
