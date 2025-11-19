# GraphQL API Documentation

## Overview

This application now includes a GraphQL API with full Schema Definition Language (SDL) support. The API is accessible at `/api/graphql`.

## GraphQL Endpoint

**URL**: `http://localhost:3000/api/graphql` (development)  
**Method**: POST (for queries/mutations) or GET (for introspection)

## Accessing GraphQL Playground

You can access the GraphQL API in several ways:

1. **Apollo Sandbox** (recommended): Visit your endpoint at `http://localhost:3000/api/graphql` in your browser
2. **GraphQL Playground**: Use any GraphQL client like Insomnia, Postman, or Apollo Studio
3. **Programmatically**: Use Apollo Client or any GraphQL client library

## Schema Overview

The schema includes three main types:
- **Project**: Corruption cases and infrastructure projects
- **Article**: News updates, publications, and videos
- **Category**: Categories for organizing content

## Example Queries

### Fetch All Projects

```graphql
query GetProjects {
  projects {
    id
    title
    country
    corruptionType
    details
    latitude
    longitude
    publishDate
    status
  }
}
```

### Fetch Projects by Country

```graphql
query GetProjectsByCountry($country: String!) {
  projectsByCountry(country: $country) {
    id
    title
    country
    details
  }
}

# Variables:
# {
#   "country": "Philippines"
# }
```

### Fetch a Single Project

```graphql
query GetProject($id: ID!) {
  project(id: $id) {
    id
    title
    country
    corruptionType
    details
    latitude
    longitude
    publishDate
  }
}

# Variables:
# {
#   "id": "1"
# }
```

### Fetch News Articles

```graphql
query GetNews($category: String, $limit: Int) {
  news(category: $category, limit: $limit) {
    id
    slug
    title
    description
    imageUrl
    category
    tags
    publishDate
  }
}

# Variables (optional):
# {
#   "category": "Investigations",
#   "limit": 10
# }
```

### Fetch Publications

```graphql
query GetPublications($limit: Int) {
  publications(limit: $limit) {
    id
    slug
    title
    description
    imageUrl
    documentNames
    downloadCount
    publishDate
  }
}
```

### Fetch Videos

```graphql
query GetVideos($category: String) {
  videos(category: $category) {
    id
    slug
    title
    description
    imageUrl
    videoUrl
    category
    publishDate
  }
}
```

### Search Projects

```graphql
query SearchProjects($query: String!) {
  searchProjects(query: $query) {
    id
    title
    country
    details
  }
}

# Variables:
# {
#   "query": "corruption"
# }
```

### Search Articles

```graphql
query SearchArticles($query: String!) {
  searchArticles(query: $query) {
    id
    title
    description
    category
  }
}

# Variables:
# {
#   "query": "infrastructure"
# }
```

### Get Article by Slug

```graphql
query GetArticleBySlug($slug: String!) {
  articleBySlug(slug: $slug) {
    id
    slug
    title
    description
    imageUrl
    category
    tags
    publishDate
  }
}

# Variables:
# {
#   "slug": "article-slug-here"
# }
```

### Fetch Categories

```graphql
query GetCategories {
  newsCategories {
    id
    name
  }
  publicationTypes {
    id
    name
  }
  videoCategories {
    id
    name
  }
}
```

## Example Mutations

### Create a Project

```graphql
mutation CreateProject($input: ProjectInput!) {
  createProject(input: $input) {
    id
    title
    country
    latitude
    longitude
  }
}

# Variables:
# {
#   "input": {
#     "country": "Philippines",
#     "title": "Metro Manila Infrastructure Project",
#     "corruptionType": "Bid Rigging",
#     "details": "Details about the corruption case...",
#     "latitude": 14.5995,
#     "longitude": 120.9842,
#     "status": "PUBLISHED"
#   }
# }
```

### Update a Project

```graphql
mutation UpdateProject($input: ProjectUpdateInput!) {
  updateProject(input: $input) {
    id
    title
    details
  }
}

# Variables:
# {
#   "input": {
#     "id": "1",
#     "title": "Updated Title",
#     "details": "Updated details..."
#   }
# }
```

### Delete a Project

```graphql
mutation DeleteProject($id: ID!) {
  deleteProject(id: $id)
}

# Variables:
# {
#   "id": "1"
# }
```

### Create an Article

```graphql
mutation CreateArticle($input: ArticleInput!) {
  createArticle(input: $input) {
    id
    slug
    title
    description
  }
}

# Variables:
# {
#   "input": {
#     "category": "Investigations",
#     "title": "New Investigation Report",
#     "description": "Full description of the investigation...",
#     "imageUrl": "https://example.com/image.jpg",
#     "tagColor": "blue",
#     "tags": ["corruption", "infrastructure"],
#     "publishDate": "2024-01-15",
#     "status": "PUBLISHED"
#   }
# }
```

### Update an Article

```graphql
mutation UpdateArticle($input: ArticleUpdateInput!) {
  updateArticle(input: $input) {
    id
    title
    description
  }
}

# Variables:
# {
#   "input": {
#     "id": "1",
#     "title": "Updated Article Title",
#     "description": "Updated description..."
#   }
# }
```

### Delete an Article

```graphql
mutation DeleteArticle($id: ID!) {
  deleteArticle(id: $id)
}

# Variables:
# {
#   "id": "1"
# }
```

### Create a Category

```graphql
mutation CreateCategory($name: String!, $type: String!) {
  createCategory(name: $name, type: $type) {
    id
    name
  }
}

# Variables:
# {
#   "name": "Investigations",
#   "type": "news"
# }
```

### Update a Category

```graphql
mutation UpdateCategory($oldName: String!, $newName: String!, $type: String!) {
  updateCategory(oldName: $oldName, newName: $newName, type: $type) {
    id
    name
  }
}

# Variables:
# {
#   "oldName": "Investigations",
#   "newName": "In-Depth Investigations",
#   "type": "news"
# }
```

### Delete a Category

```graphql
mutation DeleteCategory($name: String!, $type: String!) {
  deleteCategory(name: $name, type: $type)
}

# Variables:
# {
#   "name": "Investigations",
#   "type": "news"
# }
```

## Filtering and Pagination

Most queries support optional filtering and pagination parameters:

```graphql
query GetFilteredProjects($status: ProjectStatus, $limit: Int, $offset: Int) {
  projects(status: $status, limit: $limit, offset: $offset) {
    id
    title
    status
  }
}

# Variables:
# {
#   "status": "PUBLISHED",
#   "limit": 10,
#   "offset": 0
# }
```

## Error Handling

GraphQL errors will be returned in the following format:

```json
{
  "errors": [
    {
      "message": "Error description",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["fieldName"]
    }
  ]
}
```

## Testing with curl

You can test the API using curl:

```bash
# Query example
curl -X POST http://localhost:3000/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ projects { id title country } }"}'

# Mutation example
curl -X POST http://localhost:3000/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { createProject(input: { country: \"Philippines\", title: \"Test\", corruptionType: \"Test\", details: \"Test\", latitude: 14.5, longitude: 120.9 }) { id title } }"}'
```

## Integration with Frontend

To use GraphQL in your Next.js frontend, you can install Apollo Client:

```bash
npm install @apollo/client graphql
```

Then create an Apollo Client instance:

```typescript
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: '/api/graphql',
  }),
  cache: new InMemoryCache(),
});
```

## Schema File Location

The full GraphQL schema is available at: `/graphql/schema.graphql`

You can view this file to see all available types, queries, and mutations with their complete field definitions.
