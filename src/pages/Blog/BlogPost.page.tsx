import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadPostBySlug } from '../../content';
import { MDXProvider } from '@mdx-js/react';
import {
  Container,
  Typography,
  Link,
  Box,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useColorScheme,
} from '@mui/material';
import type { MDXComponents } from 'mdx/types';

type PostFrontmatter = {
  title?: string;
  date?: string;
  description?: string;
  tags?: string[];
};

type LoadedPost = {
  default: React.ComponentType<Record<string, unknown>>;
  frontmatter?: PostFrontmatter;
} | null;

export function BlogPostPage() {
  const { slug } = useParams();
  const [loaded, setLoaded] = useState<LoadedPost>(null);
  const [error, setError] = useState<string | null>(null);
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    let cancelled = false;
    if (!slug) return;
    loadPostBySlug(slug)
      .then((mod) => {
        if (!cancelled) setLoaded(mod);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e?.message || e));
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!slug) return null;

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load post. {error}
        </Alert>
        <Link href="/blog" underline="hover">
          Back to blog
        </Link>
      </Container>
    );
  }

  if (!loaded) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const MDXComponent = loaded.default;

  const mdxComponents: MDXComponents = {
    h1: (props) => (
      <Typography variant="h3" component="h1" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }} {...props} />
    ),
    h2: (props) => (
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4, mb: 2, fontWeight: 600 }} {...props} />
    ),
    h3: (props) => (
      <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 3, mb: 1.5, fontWeight: 600 }} {...props} />
    ),
    h4: (props) => (
      <Typography variant="h6" component="h4" gutterBottom sx={{ mt: 3, mb: 1.5, fontWeight: 600 }} {...props} />
    ),
    h5: (props) => (
      <Typography variant="subtitle1" component="h5" gutterBottom sx={{ mt: 2, mb: 1, fontWeight: 600 }} {...props} />
    ),
    h6: (props) => (
      <Typography variant="subtitle2" component="h6" gutterBottom sx={{ mt: 2, mb: 1, fontWeight: 600 }} {...props} />
    ),
    p: (props) => <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }} {...props} />,
    a: (props) => <Link underline="hover" {...props} />,
    ul: (props) => (
      <Box
        component="ul"
        sx={{
          pl: 4,
          mb: 2,
          '& li': { mb: 1 },
        }}
        {...props}
      />
    ),
    ol: (props) => (
      <Box
        component="ol"
        sx={{
          pl: 4,
          mb: 2,
          '& li': { mb: 1 },
        }}
        {...props}
      />
    ),
    li: (props) => <Box component="li" {...props} />,
    strong: (props) => <Box component="strong" sx={{ fontWeight: 700 }} {...props} />,
    em: (props) => <Box component="em" sx={{ fontStyle: 'italic' }} {...props} />,
    del: (props) => <Box component="del" sx={{ textDecoration: 'line-through' }} {...props} />,
    hr: () => <Divider sx={{ my: 4 }} />,
    img: (props) => (
      <Box
        component="img"
        sx={{
          display: 'block',
          maxWidth: '100%',
          height: 'auto',
          borderRadius: 1,
          my: 3,
          boxShadow: 1,
        }}
        {...props}
      />
    ),
    blockquote: (props) => {
      const { children, ...rest } = props ?? {};
      return (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            my: 3,
            pl: 3,
            borderLeft: 4,
            borderLeftColor: 'primary.main',
            bgcolor: 'action.hover',
            fontStyle: 'italic',
            '& p': { mb: 0 },
          }}
          {...rest}
        >
          {children}
        </Paper>
      );
    },
    code: (props) => (
      <Box
        component="code"
        sx={() => ({
          px: 1,
          py: 0.5,
          bgcolor: colorScheme === 'dark' ? 'action.hover' : 'grey.100',
          color: colorScheme === 'dark' ? 'error.light' : 'error.dark',
          borderRadius: 0.5,
          fontSize: '0.875em',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          ...((props as unknown as { className?: string }).className?.includes('language-') && {
            bgcolor: 'transparent',
            color: 'inherit',
            p: 0,
          }),
        })}
        {...props}
      />
    ),
    pre: (props) => (
      <Box
        component="pre"
        sx={() => ({
          p: 2,
          my: 3,
          overflow: 'auto',
          bgcolor: colorScheme === 'dark' ? 'grey.900' : 'grey.900',
          color: colorScheme === 'dark' ? 'grey.100' : 'grey.50',
          borderRadius: 1,
          fontSize: '0.875rem',
          lineHeight: 1.6,
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          border: 1,
          borderColor: colorScheme === 'dark' ? 'grey.800' : 'grey.700',
          '& code': {
            bgcolor: 'transparent',
            color: 'inherit',
            p: 0,
          },
        })}
        {...props}
      />
    ),
    table: (props) => {
      const { children, ...rest } = props ?? {};
      return (
        <TableContainer component={Paper} variant="outlined" sx={{ my: 3 }}>
          <Table size="small" {...rest}>
            {children}
          </Table>
        </TableContainer>
      );
    },
    thead: (props) => <TableHead {...props} />,
    tbody: (props) => <TableBody {...props} />,
    tr: (props) => <TableRow {...props} />,
    th: (props) => (
      <TableCell
        component="th"
        sx={{
          fontWeight: 700,
          bgcolor: 'action.hover',
        }}
        {...props}
      />
    ),
    td: (props) => <TableCell {...props} />,
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4, md: 6 } }}>
      <Stack spacing={2}>
        <Box sx={{ mb: 2 }}>
          <Link href="/blog" underline="hover" sx={{ display: 'inline-flex', alignItems: 'center', mb: 2 }}>
            ← Back to blog
          </Link>
          {loaded.frontmatter?.title && (
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
              {loaded.frontmatter.title}
            </Typography>
          )}
          {loaded.frontmatter?.date && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              {new Date(loaded.frontmatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          )}
          {loaded.frontmatter?.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {loaded.frontmatter.description}
            </Typography>
          )}
          <Divider />
        </Box>
        <Box component="article">
          <MDXProvider components={mdxComponents}>
            <MDXComponent />
          </MDXProvider>
        </Box>
      </Stack>
    </Container>
  );
}
