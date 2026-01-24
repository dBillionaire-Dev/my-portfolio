import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Code2, Database, Layout, Terminal } from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/ProjectCard";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { projects, isLoading } = useProjects();
  
  const featuredProjects = projects?.filter(p => p.featured).sort((a, b) => (b.priority || 0) - (a.priority || 0)) || [];

  return (
    <div className="bg-background text-foreground selection:bg-white/20">
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="min-h-[70vh] lg:max-h-[70vh] flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter mb-8 leading-[0.9]">
                Building scalable <br/>
                <span className="text-zinc-500">digital </span> <br/>
                architectures.
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                Full-stack engineer specializing in robust backend architectures, 
                AI-driven applications, and high-performance web interfaces.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/projects">
                  <Button size="lg" className="rounded-full px-8 text-base">
                    View Work
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="rounded-full px-8 text-base">
                    Contact Me
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-square shadow-2xl group">
                  <img 
                    src="/avatar.png" 
                    alt="Ebenezer" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h2 className="text-3xl font-display font-bold">About Me</h2>
              <div className="prose prose-invert prose-zinc max-w-none text-muted-foreground leading-relaxed">
                <p>
                  I'm a backend-heavy fullstack engineer with a passion for building scalable, high-performance applications. 
                  My expertise lies in crafting robust Node.js architectures, working with complex PostgreSQL data models, 
                  and integrating cutting-edge AI features into production workflows.
                </p>
                <p>
                  I specialize in the "AI Stack", from LLM orchestration and vector databases to deploying 
                  fine-tuned models at scale. I believe in clean code, rigorous testing, and architecting systems 
                  that solve real-world problems.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex-1">
                  <div className="text-primary font-bold text-2xl mb-1">3+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Years Experience</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex-1">
                  <div className="text-primary font-bold text-2xl mb-1">10+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Projects Delivered</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/5 p-8 rounded-2xl border border-white/5 group hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-4 mb-4 text-primary">
                  <Terminal className="w-6 h-6" />
                  <h3 className="font-bold">Backend Mastery</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Node.js, Express.js, Nest.js, and Python, FastAPI. Expert in building low-latency APIs and microservices.
                </p>
              </div>
              <div className="bg-white/5 p-8 rounded-2xl border border-white/5 group hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-4 mb-4 text-primary">
                  <Database className="w-6 h-6" />
                  <h3 className="font-bold">Data Architecture</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  PostgreSQL, Redis, MongoDB (Mongoose). Scalable schema design.
                </p>
              </div>
              <div className="bg-white/5 p-8 rounded-2xl border border-white/5 group hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-4 mb-4 text-primary">
                  <Code2 className="w-6 h-6" />
                  <h3 className="font-bold">AI Integration</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  LLM Agents, RAG pipelines, and AI-driven automation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Marquee (simplified as grid for now) */}
        <section className="py-20 border-t border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50">
            <div className="flex items-center gap-3">
              <Layout className="w-6 h-6" />
              <span className="font-mono text-sm">React / Next.js, Tailwind CSS, Radix ui, Shadcn/ui</span>
            </div>
            <div className="flex items-center gap-3">
              <Terminal className="w-6 h-6" />
              <span className="font-mono text-sm">TypeScript, JavaScript, Python</span>
            </div>
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6" />
              <span className="font-mono text-sm">PostgreSQL, MongoDB</span>
            </div>
            <div className="flex items-center gap-3">
              <Code2 className="w-6 h-6" />
              <span className="font-mono text-sm">Node.js, FastAPI, Express.js, Nest.js, CI/CD, Docker, AWS, Kubernates</span>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-20">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Featured Work</h2>
              <p className="text-muted-foreground">Selected projects and experiments</p>
            </div>
            <Link href="/projects">
              <a className="hidden md:flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </a>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map(i => (
                <div key={i} className="aspect-video bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
          
          <div className="mt-8 md:hidden">
            <Link href="/projects">
              <Button variant="ghost" className="w-full justify-between group">
                View All Projects 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
