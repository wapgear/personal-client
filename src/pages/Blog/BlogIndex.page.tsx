import { Container, Typography, List, ListItem, Stack, Link } from '@mui/material';
import { getAllPostsMeta } from '../../content';

export function BlogIndexPage() {
  const posts = getAllPostsMeta();

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4, md: 6 } }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
        Blog
      </Typography>
      <List disablePadding>
        {posts.map((p) => (
          <ListItem key={p.slug} disableGutters sx={{ py: 2 }} divider>
            <Stack spacing={1} width="100%">
              <Link href={`/blog/${p.slug}`} variant="h6" underline="hover" sx={{ fontWeight: 600 }}>
                {p.frontmatter.title}
              </Link>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {new Date(p.frontmatter.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
              {p.frontmatter.description && (
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
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
