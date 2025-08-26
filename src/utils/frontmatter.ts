import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';
import type { RehypePlugin, RemarkPlugin } from '@astrojs/markdown-remark';

export const readingTimeRemarkPlugin: RemarkPlugin = () => {
  return function (tree, file) {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

    if (typeof file?.data?.astro?.frontmatter !== 'undefined') {
      file.data.astro.frontmatter.readingTime = readingTime;
    }
  };
};

export const responsiveTablesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];

      if (child.type === 'element' && child.tagName === 'table') {
        tree.children[i] = {
          type: 'element',
          tagName: 'div',
          properties: {
            style: 'overflow:auto',
          },
          children: [child],
        };

        i++;
      }
    }
  };
};

export const lazyImagesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    visit(tree, 'element', function (node) {
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy';
      }
    });
  };
};

export const hideMermaidCodeBlocksRemarkPlugin: RemarkPlugin = () => {
  return function (tree) {
    let indicesToRemove = [];
    
    // Find all mermaid code blocks
    tree.children.forEach((node, index) => {
      if (node.type === 'code' && node.lang === 'mermaid') {
        // Mark this node for removal
        indicesToRemove.push(index);
      }
    });
    
    // Remove mermaid code blocks (in reverse order to maintain indices)
    for (let i = indicesToRemove.length - 1; i >= 0; i--) {
      tree.children.splice(indicesToRemove[i], 1);
    }
  };
};
