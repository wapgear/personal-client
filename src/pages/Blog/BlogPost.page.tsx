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
} from '@mui/material';

type LoadedPost = {
  default: React.ComponentType<Record<string, unknown>>;
  frontmatter?: Record<string, unknown>;
} | null;

export function BlogPostPage() {
  const { slug } = useParams();
  const [loaded, setLoaded] = useState<LoadedPost>(null);
  const [error, setError] = useState<string | null>(null);

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

  const mdxComponents = {
    h1: (props: any) => <Typography variant="h3" component="h1" gutterBottom {...props} />,
    h2: (props: any) => <Typography variant="h4" component="h2" gutterBottom {...props} />,
    h3: (props: any) => <Typography variant="h5" component="h3" gutterBottom {...props} />,
    h4: (props: any) => <Typography variant="h6" component="h4" gutterBottom {...props} />,
    h5: (props: any) => <Typography variant="subtitle1" component="h5" gutterBottom {...props} />,
    h6: (props: any) => <Typography variant="subtitle2" component="h6" gutterBottom {...props} />,
    p: (props: any) => <Typography variant="body1" paragraph {...props} />,
    a: (props: any) => <Link {...props} underline="hover" />,
    ul: (props: any) => <Box component="ul" sx={{ pl: 3, mb: 2 }} {...props} />,
    ol: (props: any) => <Box component="ol" sx={{ pl: 3, mb: 2 }} {...props} />,
    li: (props: any) => <Box component="li" sx={{ mb: 0.5 }} {...props} />,
    strong: (props: any) => <Box component="strong" sx={{ fontWeight: 700 }} {...props} />,
    em: (props: any) => <Box component="em" sx={{ fontStyle: 'italic' }} {...props} />,
    del: (props: any) => <Box component="del" sx={{ textDecoration: 'line-through' }} {...props} />,
    hr: () => <Divider sx={{ my: 3 }} />,
    img: (props: any) => (
      <Box
        component="img"
        sx={{ display: 'block', maxWidth: '100%', height: 'auto', borderRadius: 1, my: 2 }}
        {...props}
      />
    ),
    blockquote: (props: any) => <Paper variant="outlined" sx={{ p: 2, my: 2 }} {...props} />,
    code: (props: any) => (
      <Box component="code" sx={{ px: 0.5, py: 0.25, bgcolor: 'action.hover', borderRadius: 0.5 }} {...props} />
    ),
    pre: (props: any) => (
      <Box component="pre" sx={{ p: 2, overflow: 'auto', bgcolor: 'action.hover', borderRadius: 1 }} {...props} />
    ),
    table: (props: any) => {
      const { children, ...rest } = props ?? {};
      return (
        <TableContainer component={Paper} sx={{ my: 2 }}>
          <Table size="small" {...rest}>
            {children}
          </Table>
        </TableContainer>
      );
    },
    thead: (props: any) => <TableHead {...props} />,
    tbody: (props: any) => <TableBody {...props} />,
    tr: (props: any) => <TableRow {...props} />,
    th: (props: any) => <TableCell component="th" sx={{ fontWeight: 600 }} {...props} />,
    td: (props: any) => <TableCell {...props} />,
  } as const;

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Stack spacing={3}>
        <MDXProvider components={mdxComponents as any}>
          <MDXComponent />
        </MDXProvider>
        <Box>
          <Link href="/blog" underline="hover">
            ← Back to blog
          </Link>
        </Box>
      </Stack>
    </Container>
  );
}
