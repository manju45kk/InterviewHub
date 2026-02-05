export const revalidate = 10; // seconds

export default async function Posts() {
  const res = await fetch("http://localhost:3000/api/posts", {
    next: { revalidate: 5 }
  });

  const data = await res.json();

  return (
    <div>
      <h1>ISR Posts</h1>
      {data.posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}