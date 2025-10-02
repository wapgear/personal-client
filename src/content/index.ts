import type { ComponentType } from 'react';

export type PostFrontmatter = {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  draft?: boolean;
};

export type EagerPostModule = {
  default: ComponentType<Record<string, unknown>>;
  frontmatter?: Record<string, unknown>;
};

const eagerPostModules = import.meta.glob('./posts/**/*.mdx', { eager: true }) as Record<string, EagerPostModule>;

const lazyPostModules = import.meta.glob('./posts/**/*.mdx');

export type PostListItem = {
  slug: string;
  path: string;
  frontmatter: PostFrontmatter;
};

function deriveSlugFromPath(filePath: string): string {
  const withoutExt = filePath.replace(/\.(md|mdx)$/i, '');
  const parts = withoutExt.split('/');
  return parts[parts.length - 1];
}

export function getAllPostsMeta(): PostListItem[] {
  const items: PostListItem[] = Object.entries(eagerPostModules)
    .map(([path, mod]) => {
      const frontmatter = (mod.frontmatter || {}) as PostFrontmatter;
      const slug = deriveSlugFromPath(path);
      return {
        slug,
        path,
        frontmatter,
      } as PostListItem;
    })
    .filter((p) => !p.frontmatter.draft);

  items.sort((a, b) => {
    const ad = new Date(a.frontmatter.date).getTime();
    const bd = new Date(b.frontmatter.date).getTime();
    return bd - ad;
  });

  return items;
}

export async function loadPostBySlug(slug: string) {
  const match = Object.keys(lazyPostModules).find((key) => key.endsWith(`/${slug}.mdx`) || key.endsWith(`/${slug}.md`));
  if (!match) return null;
  const loader = lazyPostModules[match];
  const mod = (await loader()) as EagerPostModule;
  return mod;
}
