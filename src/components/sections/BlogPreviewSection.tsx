"use client";
import { motion } from "framer-motion";
import { BentoGrid, BentoGridItem } from "@ui/bento-grid";
import { SectionHeading } from "@ui/section-heading";
import { Button } from "@ui/button";

interface BlogPost {
  title: string;
  description: string;
  href: string;
  image?: string;
  category?: string;
}

export const BlogPreviewSection = ({ posts }: { posts: BlogPost[] }) => {
  return (
    <section className="section-themed relative py-24">
      <div className="container mx-auto px-4">
        <SectionHeading title="Latest from our Blog" subtitle="Insights, tutorials, and news from the DUCA community" />

        <BentoGrid className="mt-12">
          {posts.slice(0, 5).map((post, i) => (
            <BentoGridItem
              key={post.href}
              title={post.title}
              description={post.description}
              href={post.href}
              header={
                <div
                  className="flex h-full min-h-24 w-full flex-1 rounded-xl bg-linear-to-br from-purple-900/50 to-slate-900"
                  style={{
                    backgroundImage: post.image ? `url(${post.image})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              }
              icon={
                post.category && (
                  <span className="text-xs font-medium tracking-wider text-purple-400 uppercase">{post.category}</span>
                )
              }
              className={i === 0 || i === 3 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Button href="/blog" variant="outline">
            View All Posts
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
