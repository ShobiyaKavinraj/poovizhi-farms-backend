require('dotenv').config();
const twilio = require('twilio');

const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

client.messages
  .create({
    from: 'whatsapp:+14155238886',
    to: 'whatsapp:+919944772593', // your phone number
    body: '✅ Test message from Poovizhi Farms!',
  })
  .then((msg) => console.log('Message SID:', msg.sid))
  .catch((err) => console.error('❌ Error:', err.message));
