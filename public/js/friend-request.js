const sendRequest = document.getElementById('send-request-form');

sendRequest.addEventListener('submit', async function (event) {
  event.preventDefault();

  const username =  document.querySelector('input').value;
  const rows = await connection.execute('SELECT id FROM users WHERE username = ?', [username]);
  connection.end();
  const id = rows[0].id;

  try {
    const response = await fetch('/friend-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });

    const responseData = await response.json();

    if (response.ok) {
      alert('Friend request sent!');
    } else {
      alert(responseData.error);
    }
  } catch (error) {
    console.error(error);
    alert('Server error');
  }
});

async function loadReceivedRequests() {
  try {
    const response = await fetch('/friend-requests?status=pending');
    const requests = await response.json();
    const list = document.getElementById('received-requests-list');

    list.innerHTML = '';

    requests.forEach(request => {
      const li = document.createElement('li');
      li.textContent = `From: ${request.sender.name} (${request.sender.email})`;

      const acceptButton = document.createElement('button');
      acceptButton.classList.add('btn', 'btn-success');
      acceptButton.textContent = 'Accept';
      acceptButton.addEventListener('click', async () => {
        try {
          const acceptResponse = await fetch(`/friend-requests/${request.id}/accept`, { method: 'POST' });

          if (acceptResponse.ok) {
            alert('Friend request accepted!');
            li.remove();
          } else {
            alert('Failed to accept friend request');
          }
        } catch (err) {
          console.error(err);
          alert('Server error');
        }
      });

      const rejectButton = document.createElement('button');
      rejectButton.classList.add('btn', 'btn-danger', 'ml-2');
      rejectButton.textContent = 'Reject';
      rejectButton.addEventListener('click', async () => {
        try {
          const rejectResponse = await fetch(`/friend-requests/${request.id}/reject`, { method: 'POST' });

          if (rejectResponse.ok) {
            alert('Friend request rejected!');
            li.remove();
          }
        } catch (err) {
            console.error(err);
            alert('Server error');
        }
    });
    });
}};

