import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false });
    return;
  }

  // Simulate processing payment with Klarna.
  setTimeout(() => {
    res.status(200).json({ success: true });
  }, 1000);
}
