const RECIPIENT = 'lolaquinn@shehandy.com';

const FIELD_LABELS = {
  estimate: [
    ['name', 'Name'], ['phone', 'Phone'], ['email', 'Email'],
    ['service', 'Service needed'], ['timeframe', 'Preferred timeframe'],
    ['address', 'Address / service area'], ['message', 'Project description']
  ],
  career: [
    ['name', 'Full name'], ['phone', 'Phone'], ['email', 'Email'],
    ['address', 'Address'], ['experience', 'Experience'], ['transport', 'Reliable transportation']
  ]
};

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const formType = data.formType === 'career' ? 'career' : 'estimate';
  const fields = FIELD_LABELS[formType];

  const subject = formType === 'career'
    ? 'New career application — ' + (data.name || 'unnamed')
    : 'New estimate request — ' + (data.name || 'unnamed');

  let body = fields
    .map(([key, label]) => label + ': ' + (data[key] || '—'))
    .join('\n');

  if (data.photosSkippedCount) {
    body += '\n\n(' + data.photosSkippedCount + ' photo(s) were too large to attach automatically — follow up with the customer directly for photos.)';
  }

  const message = {
    to: RECIPIENT,
    replyTo: data.email || RECIPIENT,
    subject: subject,
    body: body
  };

  if (data.photos && data.photos.length) {
    message.attachments = data.photos.map(function (p) {
      return Utilities.newBlob(Utilities.base64Decode(p.data), p.type || 'image/jpeg', p.name || 'photo.jpg');
    });
  }

  MailApp.sendEmail(message);

  return ContentService.createTextOutput('OK');
}
