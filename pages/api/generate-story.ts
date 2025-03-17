import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  story: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.status(405).json({ story: 'Method Not Allowed' });
    return;
  }

  const { genre, age, name, gender } = req.body;

  // Simulated story generation logic.
  const story = `Once upon a time in a ${genre} realm, there lived a ${age}-year-old ${gender} named ${name}. Their journey was filled with epic adventures and heartfelt moments.`;

  res.status(200).json({ story });
}
