async function request(path, init) {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.error || `UI Commentor request failed (${response.status}).`);
  }

  return body;
}

const devReviewCommentService = {
  list: () => request('/api/dev/comments'),
  create: async (payload) => {
    const body = await request('/api/dev/comments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return body.comment || body;
  },
  update: async (id, payload) => {
    const body = await request(`/api/dev/comments/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return body.comment || body;
  },
  remove: (id) => request(`/api/dev/comments/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }),
};

export default devReviewCommentService;
