export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return Response.json(
        { error: 'Missing id' },
        { status: 400 }
      );
    }

    // Delete endpoint not available with in-memory storage
    return Response.json({
      success: true,
      message: 'Quiz submissions are logged only. Delete not available.'
    });
  } catch (err) {
    console.error('Delete error:', err);
    return Response.json(
      { error: (err as any).message || 'Failed to delete' },
      { status: 500 }
    );
  }
}
