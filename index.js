import cors from 'cors';
import express from 'express';

import { Resend } from 'resend';

import 'dotenv/config';

const app = express();

// middleware
app.use(express.json());
app.use(cors());

const resend = new Resend(process.env.RESEND_API_KEY);

// server index.html file
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

app.post('/visit', async (req, res) => {
  const visit = req.body;
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [process.env.RECEIVER_EMAIL],
    subject: `Nueva visita desde ${visit.city.name}`,
    html: `
      <h1>Nueva Visita</h1>
      <p>IP: ${visit.ip.address}</p>
      <p>City: ${visit.city.name}</p>
      <p>Número de la ciudad: ${visit.city.numeric}</p>
      <p>Country: ${visit.country.name}</p>
      <p>Continent: ${visit.continent.name}</p>
      <p>Capital: ${visit.capitals[0].name}</p>
      <p>Language: ${visit.languages[0].name}</p>
      <p>Timezone: ${visit.timezone}</p>
      <p>Airport: ${visit.airport.name}</p>
      <p>Coordinates: ${visit.coordinates.latitude}, ${visit.coordinates.longitude}</p>
    `,
  });

  if (error) {
    return console.error({ error });
  }

  return res.json({ message: data });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
