import fetch from 'node-fetch';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

export default function sendMessage({
  apiKey, apiSecret, accessToken, accessSecret, recipient, message,
}) {
  const url = 'https://api.twitter.com/1.1/direct_messages/events/new.json';
  const body = {
    event: {
      type: 'message_create',
      message_create: {
        target: {
          recipient_id: recipient,
        },
        message_data: {
          text: message,
        },
      },
    },
  };
  const oauth = OAuth({
    consumer: {
      key: apiKey,
      secret: apiSecret,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(baseString, key) {
      return crypto
        .createHmac('sha1', key)
        .update(baseString)
        .digest('base64');
    },
  });
  const headers = {
    ...oauth.toHeader(oauth.authorize({
      url,
      method: 'POST',
    }, {
      key: accessToken,
      secret: accessSecret,
    })),
    'Content-Type': 'application/json',
  };

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  });
}
