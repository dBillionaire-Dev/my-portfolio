import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBlogPostSchema, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Link as LinkIcon } from "lucide-react";
import { z } from "zod";
// import { useState } from "react";

interface BlogFormProps {
  post?: BlogPost;
  onSubmit: (data: InsertBlogPost) => void;
  isLoading: boolean;
}

const formSchema = insertBlogPostSchema.extend({
  tagsString: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function BlogForm({ post, onSubmit, isLoading }: BlogFormProps) {
  // const [isUploading, setIsUploading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      slug: post?.slug || "",
      imageUrl: post?.imageUrl || "",
      references: post?.references || "",
      tags: post?.tags || [],
      tagsString: post?.tags?.join(", ") || "",
      publishedAt: post?.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : new Date().toISOString(),
    },
  });

  // const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   setIsUploading(true);
  //   const reader = new FileReader();
  //   reader.onloadend = async () => {
  //     const base64data = reader.result as string;
  //     try {
  //       const res = await fetch("/api/upload", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ name: file.name, data: base64data, type: file.type })
  //       });
  //       const data = await res.json();
  //       form.setValue("imageUrl", data.url);
  //     } catch (err) {
  //       console.error("Upload failed", err);
  //     } finally {
  //       setIsUploading(false);
  //     }
  //   };
  //   reader.readAsDataURL(file);
  // };

  const handleSubmit = (values: FormValues) => {
    const tags = values.tagsString 
      ? values.tagsString.split(",").map(t => t.trim()).filter(Boolean)
      : values.tags;

    const { tagsString, ...rest } = values;
    onSubmit({ ...rest, tags });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Blog Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="blog-title-slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publishedAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publication Date</FormLabel>
                <FormControl>
                  <Input 
                    type="datetime-local" 
                    {...field} 
                    value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                    onChange={(e) => field.onChange(new Date(e.target.value).toISOString())}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image</FormLabel>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input
                    type="file"
                    className="hidden"
                    id="blog-upload"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    asChild 
                    disabled={isUploading}
                  >
                    <label htmlFor="blog-upload" className="cursor-pointer">
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                      {field.value ? "Change Image" : "Upload from device"}
                    </label>
                  </Button>
                </div>
              </div>
              {field.value && (
                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                  <Upload className="w-3 h-3" /> Image uploaded successfully
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>

              <FormControl>
                <Input
                  placeholder="https://example.com/cover-image.png"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <LinkIcon className="w-4 h-4" />
                <a
                  href="https://cloudinary.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  Upload image elsewhere and paste URL here
                </a>
              </div>

              {field.value && (
                <div className="mt-3">
                  <img
                    src={field.value}
                    alt="Blog cover preview"
                    className="max-h-48 rounded-md border object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (Markdown supported)</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your post content here..." className="min-h-[300px] font-mono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="references"
          render={({ field }) => (
            <FormItem>
              <FormLabel>References & Additional Info</FormLabel>
              <FormControl>
                <Textarea placeholder="List your references or additional notes..." className="h-24" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagsString"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="AI, Backend, Engineering" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {post ? "Update Post" : "Publish Post"}
        </Button>
      </form>
    </Form>
  );
}
