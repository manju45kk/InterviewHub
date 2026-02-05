// app/posts/[id]/page.js

export async function generateStaticParams() {
  const res = await fetch("http://localhost:3000/api/posts");
  const data = await res.json();

  return data.posts.map((post) => ({
    id: post.id.toString(),
  }));
}

export default async function PostDetails({ params }) {
    console.log('params', params)
  const res = await fetch(`http://localhost:3000/api/posts/${1}`);
  const post = await res.json();

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}
