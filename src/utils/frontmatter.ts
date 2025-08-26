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

export const hideMermaidCodeBlocksRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    visit(tree, 'element', function (node, index, parent) {
      // Look for pre elements with mermaid code
      if (node.tagName === 'pre' && node.children && node.children.length > 0) {
        const codeElement = node.children[0];
        if (codeElement && codeElement.type === 'element' && codeElement.tagName === 'code') {
          const dataLanguage = codeElement.properties?.['dataLanguage'] || codeElement.properties?.['data-language'];
          
          // Check if this is a mermaid code block
          if (dataLanguage === 'mermaid') {
            // Add a class to hide this pre element
            node.properties = node.properties || {};
            node.properties.className = (node.properties.className || []).concat(['mermaid-source-hidden']);
          }
        }
      }
    });
  };
};
