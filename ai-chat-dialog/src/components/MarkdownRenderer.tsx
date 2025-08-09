import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Box, Typography } from '@mui/material';
import 'highlight.js/styles/atom-one-dark.css';

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isUser = false }) => {
  return (
    <Box
      sx={{
        '& p': {
          margin: 0,
          lineHeight: 1.6,
          '&:not(:last-child)': {
            marginBottom: 1
          }
        },
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          margin: '16px 0 8px 0',
          fontWeight: 'bold',
          '&:first-of-type': {
            marginTop: 0
          }
        },
        '& h1': { fontSize: '1.5rem' },
        '& h2': { fontSize: '1.3rem' },
        '& h3': { fontSize: '1.1rem' },
        '& h4': { fontSize: '1rem' },
        '& ul, & ol': {
          margin: '8px 0',
          paddingLeft: '24px'
        },
        '& li': {
          marginBottom: '4px'
        },
        '& blockquote': {
          borderLeft: `4px solid ${isUser ? 'rgba(255,255,255,0.3)' : '#e2e8f0'}`,
          paddingLeft: '16px',
          margin: '16px 0',
          fontStyle: 'italic',
          color: isUser ? 'rgba(255,255,255,0.9)' : '#64748b'
        },
        '& code': {
          backgroundColor: isUser ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
          color: isUser ? '#fff' : '#1e293b',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.9em',
          fontFamily: 'Monaco, Consolas, "Courier New", monospace'
        },
        '& pre': {
          backgroundColor: isUser ? 'rgba(0,0,0,0.4)' : '#282c34',
          borderRadius: '12px',
          padding: '20px',
          margin: '16px 0',
          overflow: 'auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          width: '100%',
          maxWidth: '100%',
          position: 'relative',
          border: isUser ? 'none' : '1px solid #3a4454',
          '&::-webkit-scrollbar': {
            height: '8px',
            backgroundColor: 'rgba(0,0,0,0.1)'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '4px'
          },
          '& code': {
            backgroundColor: 'transparent',
            padding: 0,
            fontSize: '0.95em',
            lineHeight: 1.6,
            fontFamily: '"Fira Code", "JetBrains Mono", "SF Mono", "Monaco", "Consolas", monospace',
            whiteSpace: 'pre',
            wordBreak: 'normal',
            overflowWrap: 'normal',
            color: isUser ? 'inherit' : '#abb2bf',
            display: 'block'
          }
        },
        '& table': {
          borderCollapse: 'collapse',
          width: '100%',
          margin: '16px 0',
          fontSize: '0.9em'
        },
        '& th, & td': {
          border: `1px solid ${isUser ? 'rgba(255,255,255,0.3)' : '#e2e8f0'}`,
          padding: '8px 12px',
          textAlign: 'left'
        },
        '& th': {
          backgroundColor: isUser ? 'rgba(255,255,255,0.1)' : '#f8fafc',
          fontWeight: 'bold'
        },
        '& a': {
          color: isUser ? '#93c5fd' : '#3b82f6',
          textDecoration: 'underline',
          '&:hover': {
            color: isUser ? '#dbeafe' : '#1d4ed8'
          }
        },
        '& strong': {
          fontWeight: 'bold'
        },
        '& em': {
          fontStyle: 'italic'
        },
        '& hr': {
          border: 'none',
          height: '1px',
          backgroundColor: isUser ? 'rgba(255,255,255,0.3)' : '#e2e8f0',
          margin: '24px 0'
        },
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '8px',
          margin: '8px 0'
        }
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          p: ({ children }) => (
            <Typography variant="body1" component="p" sx={{ margin: 0, lineHeight: 1.6 }}>
              {children}
            </Typography>
          ),
          h1: ({ children }) => (
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', margin: '16px 0 8px 0' }}>
              {children}
            </Typography>
          ),
          h2: ({ children }) => (
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', margin: '16px 0 8px 0' }}>
              {children}
            </Typography>
          ),
          h3: ({ children }) => (
            <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 'bold', margin: '16px 0 8px 0' }}>
              {children}
            </Typography>
          ),
          pre: ({ children, ...props }) => {
            // 尝试从 className 中提取语言信息
            const className = (props as any)?.children?.props?.className || '';
            const language = className.replace('language-', '');
            
            return (
              <Box sx={{ position: 'relative' }}>
                {language && !isUser && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: 16,
                      backgroundColor: '#3a4454',
                      color: '#abb2bf',
                      px: 1,
                      py: 0.5,
                      borderRadius: '4px 4px 0 0',
                      fontSize: '0.75rem',
                      zIndex: 1
                    }}
                  >
                    {language}
                  </Typography>
                )}
                <pre {...props}>{children}</pre>
              </Box>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;