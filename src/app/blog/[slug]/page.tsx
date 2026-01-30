"use client"

import Link from "next/link";
import { type BlogPost } from "@shared/routes";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedDiv from "@/components/AnimatedDiv";
import { ArrowLeft, Tag, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let res;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    res = await fetch(`${API_BASE}/api/blog/${params.slug}`, { next: { revalidate: 60 }, signal: controller.signal });
    clearTimeout(timeoutId);
  } catch (error) {
    console.warn('Failed to fetch blog post from backend:', error);
  }
  
  if (!res || !res.ok) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link href="/blog">
            <Button variant="outline">Back to Blog</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const post: BlogPost = await res.json();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-24 pt-32">
        <AnimatedDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Link href="/blog">
            <Button variant="ghost" className="mb-8 hover:bg-primary/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {post.imageUrl && (
            <div className="relative w-full h-64 md:h-[400px] mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
            </div>
          )}

          <header className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 text-foreground leading-[1.1] tracking-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-muted-foreground border-y border-white/5 py-6">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                <div className="flex gap-2">
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="text-xs bg-white/5 px-2 py-1 rounded border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-primary prose-code:text-primary/80">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {post.references && (
            <section className="mt-16 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-xl font-bold font-display">References & Further Reading</h3>
              </div>
              <div className="bg-white/5 rounded-xl p-8 border border-white/5 prose prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.references}
                </ReactMarkdown>
              </div>
            </section>
          )}
        </AnimatedDiv>
      </main>
      <Footer />
    </div>
  );
}
