export async function GET() {
  try {
    // ✔ Fix Windows TLS issue
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const res = await fetch("https://dummyjson.com/posts");

    if (!res.ok) {
      return Response.json(
        { error: "Failed to fetch products", status: res.status },
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
