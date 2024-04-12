// pages/api/search.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { countyName, stateName } = req.query;
  try {
    // Encode countyName and stateName to handle spaces and special characters
    const encodedCountyName = encodeURIComponent(countyName as string);
    const encodedStateName = encodeURIComponent(stateName as string);
    
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedCountyName}+County,${encodedStateName}&country=United States`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching county coordinates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
