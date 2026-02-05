export async function GET(request, { params }) {
  try {
    const { id } = params;

    const res = await fetch(`https://dummyjson.com/posts/${id}`);

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch post", status: res.status },
        { status: 500 }
      );
    }

    const data = await res.json();
    return Response.json(data);

  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
