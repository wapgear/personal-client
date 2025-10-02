import { Container, Typography, List, ListItem, Stack, Link } from '@mui/material';
import { getAllPostsMeta } from '../../content';

export function BlogIndexPage() {
  const posts = getAllPostsMeta();

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Blog
      </Typography>
      <List disablePadding>
        {posts.map((p) => (
          <ListItem key={p.slug} disableGutters sx={{ py: 1.5 }} divider>
            <Stack spacing={0.5} width="100%">
              <Link href={`/blog/${p.slug}`} variant="h6" underline="hover">
                {p.frontmatter.title}
              </Link>
              <Typography variant="caption" color="text.secondary">
                {new Date(p.frontmatter.date).toLocaleDateString()}
              </Typography>
              {p.frontmatter.description && (
                <Typography variant="body2" color="text.secondary">
                  {p.frontmatter.description}
                </Typography>
              )}
            </Stack>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
