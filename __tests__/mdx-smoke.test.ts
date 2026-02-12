import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

// Get all MDX files
const getMdxFiles = () => {
  const files = fs.readdirSync(POSTS_DIR);
  return files.filter(file => file.endsWith('.mdx'));
};

describe('MDX Smoke Tests', () => {
  const mdxFiles = getMdxFiles();

  it('should find MDX files', () => {
    expect(mdxFiles.length).toBeGreaterThan(0);
    console.log(`Found ${mdxFiles.length} MDX files to test`);
  });

  describe.each(mdxFiles)('%s', (filename) => {
    const filePath = path.join(POSTS_DIR, filename);
    let fileContent: string;
    let frontmatter: any;
    let mdxContent: string;

    beforeAll(() => {
      fileContent = fs.readFileSync(filePath, 'utf-8');
      const parsed = matter(fileContent);
      frontmatter = parsed.data;
      mdxContent = parsed.content;
    });

    it('should have valid frontmatter', () => {
      expect(frontmatter).toBeDefined();
      expect(frontmatter.title).toBeDefined();
      expect(frontmatter.slug).toBeDefined();
      expect(frontmatter.date).toBeDefined();
    });

    it('should have required frontmatter fields', () => {
      expect(typeof frontmatter.title).toBe('string');
      expect(frontmatter.title.length).toBeGreaterThan(0);

      expect(typeof frontmatter.slug).toBe('string');
      expect(frontmatter.slug.length).toBeGreaterThan(0);

      expect(typeof frontmatter.date).toBe('string');
      expect(frontmatter.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should have non-empty content', () => {
      expect(mdxContent.trim().length).toBeGreaterThan(0);
    });

    it('should not have unclosed JSX tags', () => {
      // Basic check for common JSX tag issues
      const openTags = (mdxContent.match(/<[A-Z][a-zA-Z]*[^/>]*>/g) || []).length;
      const closeTags = (mdxContent.match(/<\/[A-Z][a-zA-Z]*>/g) || []).length;
      const selfClosingTags = (mdxContent.match(/<[A-Z][a-zA-Z]*[^>]*\/>/g) || []).length;

      // Self-closing tags shouldn't need close tags
      expect(openTags).toBeLessThanOrEqual(closeTags + selfClosingTags);
    });

    it('should have balanced code block markers', () => {
      const codeBlockMarkers = mdxContent.match(/```/g) || [];
      expect(codeBlockMarkers.length % 2).toBe(0);
    });

    it('should not have common MDX syntax errors', () => {
      // Check for unescaped curly braces outside of JSX and code blocks
      const lines = mdxContent.split('\n');
      let inCodeBlock = false;

      lines.forEach((line, index) => {
        // Track if we're inside a code block
        if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          return;
        }

        // Skip lines inside code blocks
        if (inCodeBlock) return;

        // Check for standalone opening curly braces (might indicate broken JSX)
        const hasStandaloneOpenBrace = /^\s*\{\s*$/.test(line);
        if (hasStandaloneOpenBrace) {
          throw new Error(`Line ${index + 1}: Standalone opening curly brace detected`);
        }
      });
    });

    it('should have valid author information if present', () => {
      if (frontmatter.author) {
        expect(frontmatter.author).toHaveProperty('name');
        expect(frontmatter.author).toHaveProperty('slug');
      }
    });

    it('should not have broken image paths', () => {
      const imageRegex = /!\[.*?\]\((.*?)\)/g;
      const images = [...mdxContent.matchAll(imageRegex)];

      images.forEach(match => {
        const imagePath = match[1];
        // Check that image paths are properly formatted
        expect(imagePath).toBeTruthy();
        expect(imagePath).not.toMatch(/undefined|null/);
      });
    });
  });

  describe('Component Usage', () => {
    it('should only use defined custom components', () => {
      const definedComponents = ['Slideshare']; // Add more as you create them
      const componentRegex = /<([A-Z][a-zA-Z]*)/g;

      mdxFiles.forEach(filename => {
        const filePath = path.join(POSTS_DIR, filename);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { content: mdxContent } = matter(content);

        const matches = [...mdxContent.matchAll(componentRegex)];
        matches.forEach(match => {
          const componentName = match[1];
          expect(definedComponents).toContain(componentName);
        });
      });
    });
  });

  describe('Code Block Quality', () => {
    it('should have properly formatted code blocks', () => {
      mdxFiles.forEach(filename => {
        const filePath = path.join(POSTS_DIR, filename);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { content: mdxContent } = matter(content);

        const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/g;
        const codeBlocks = [...mdxContent.matchAll(codeBlockRegex)];

        codeBlocks.forEach((match, index) => {
          const language = match[1];
          const code = match[2];

          // Check that code blocks have content
          expect(code.trim().length).toBeGreaterThan(0);

          // Check that language is specified
          expect(language).toBeTruthy();
          expect(language.length).toBeGreaterThan(0);

          // Check PHP blocks start with <?php (unless they're very short snippets)
          if (language === 'php' && code.split('\n').length > 2) {
            const hasPhpTag = code.trim().startsWith('<?php');
            const hasComment = code.trim().startsWith('//') || code.trim().startsWith('/*');
            const isHtmlTemplate = code.includes('<!');

            if (!hasPhpTag && !hasComment && !isHtmlTemplate) {
              console.warn(`${filename}: PHP block #${index + 1} missing <?php tag`);
            }
          }
        });
      });
    });
  });
});
