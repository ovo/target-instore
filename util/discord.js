import fetch from 'node-fetch';

const sendWebhook = ({
  webhook,
  message,
}) => fetch(webhook, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    content: message,
  }),
});

export default sendWebhook;
