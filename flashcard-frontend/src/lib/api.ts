const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function getTopics() {
  const res = await fetch(`${API_BASE}/topics`);
  return res.json();
}

export async function getTopicDetails(id: string) {
  const res = await fetch(`${API_BASE}/topics/${id}`);
  return res.json();
}
