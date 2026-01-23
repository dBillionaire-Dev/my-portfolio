import { motion } from "framer-motion";
import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/ProjectCard";
import Navigation from "@/components/Navigation";
import { Loader2 } from "lucide-react";

export default function Projects() {
  const { projects, isLoading } = useProjects();
  
  // Sort by priority (descending) and then id
  const sortedProjects = projects?.sort((a, b) => (b.priority || 0) - (a.priority || 0)) || [];

  return (
    <div className="bg-background text-foreground">
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">All Projects</h1>
          <p className="text-muted-foreground max-w-xl">
            A collection of web applications, experiments, and tools I've built.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sortedProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
