import AnimatedDiv from "@/components/AnimatedDiv";
import { ProjectCard } from "@/components/ProjectCard";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default async function Projects() {
  let projects = [];
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${API_BASE}/api/projects`, { next: { revalidate: 60 }, signal: controller.signal });
    clearTimeout(timeoutId);
    projects = res.ok ? await res.json() : [];
  } catch (error) {
    console.warn('Failed to fetch projects from backend:', error);
    projects = [];
  }

  const sortedProjects = projects?.sort((a: any, b: any) => (b.priority || 0) - (a.priority || 0)) || [];

  return (
    <div className="bg-background text-foreground">
      <Navigation />
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <AnimatedDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">All Projects</h1>
          <p className="text-muted-foreground max-w-xl">
            A collection of web applications, experiments, and tools I've built.
          </p>
        </AnimatedDiv>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {sortedProjects.map((project: any, index: number) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
