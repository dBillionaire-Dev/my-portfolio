import { useQuery } from "@tanstack/react-query";
import { api, type BlogPost } from "@shared/routes";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

export default function Blog() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-24 pt-32">
        <motion.div
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
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="bg-card/50 border-primary/10">
                  <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              posts?.map((post) => (
                <motion.div
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
                          {/* <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                          </div> */}
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
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
