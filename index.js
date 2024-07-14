import { join } from 'node:path';

import cors from 'cors';
import express from 'express';

import { Resend } from 'resend';

import 'dotenv/config';

const app = express();

// middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve index.html file from public directory
app.use(express.static(join(process.cwd(), 'public')));

const resend = new Resend(process.env.RESEND_API_KEY);

// server index.html file
app.get('/', (_, res) => {
  res.sendFile('index.html', { root: path.join(pwd, 'public') });
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
      <p>Coordinates: ${visit.coordinates.latitude}, ${visit.coordinates.longitude}
      </p>
      <p>
      Google Maps: <a href="https://www.google.com/maps/dir/?api=1&origin=current+location&destination=${visit.coordinates.latitude},${visit.coordinates.longitude}">Ver en Google Maps</a>
      </p>
    `,
  });

  if (error) {
    return console.error({ error });
  }

  return res.json({ message: data });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});
