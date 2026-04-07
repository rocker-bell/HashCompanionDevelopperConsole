// // app.ts

// declare const gapi: any;
// declare const google: any;

// const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
// const SCOPES = 'https://www.googleapis.com/auth/drive.file';

// let tokenClient: any;

// // ---------------- INIT ----------------
// function initApp() {
//   renderUI();

//   gapi.load('client', async () => {
//     await gapi.client.init({
//       discoveryDocs: [
//         'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
//       ],
//     });
//   });

//   tokenClient = google.accounts.oauth2.initTokenClient({
//     client_id: CLIENT_ID,
//     scope: SCOPES,
//     callback: async (tokenResponse: any) => {
//       gapi.client.setToken(tokenResponse);
//       await listFiles();
//     },
//   });
// }

// // ---------------- UI ----------------
// function renderUI() {
//   document.body.innerHTML = `
//     <h2>Google Drive App</h2>
//     <button id="loginBtn">Login with Google</button>
//     <br/><br/>
//     <input type="file" id="fileInput" />
//     <h3>Files:</h3>
//     <div id="files"></div>
//   `;

//   document
//     .getElementById('loginBtn')!
//     .addEventListener('click', login);

//   document
//     .getElementById('fileInput')!
//     .addEventListener('change', (e: any) => {
//       const file = e.target.files[0];
//       if (file) uploadFile(file);
//     });
// }

// // ---------------- LOGIN ----------------
// function login() {
//   tokenClient.requestAccessToken();
// }

// // ---------------- UPLOAD ----------------
// async function uploadFile(file: File) {
//   const metadata = {
//     name: file.name,
//     mimeType: file.type,
//   };

//   const form = new FormData();
//   form.append(
//     'metadata',
//     new Blob([JSON.stringify(metadata)], {
//       type: 'application/json',
//     })
//   );
//   form.append('file', file);

//   await fetch(
//     'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
//     {
//       method: 'POST',
//       headers: {
//         Authorization: 'Bearer ' + gapi.client.getToken().access_token,
//       },
//       body: form,
//     }
//   );

//   await listFiles();
// }

// // ---------------- LIST FILES ----------------
// async function listFiles() {
//   const res = await gapi.client.drive.files.list({
//     pageSize: 20,
//     fields: 'files(id, name)',
//   });

//   const files = res.result.files;
//   const container = document.getElementById('files')!;

//   container.innerHTML = '';

//   if (!files || files.length === 0) {
//     container.innerHTML = '<p>No files found</p>';
//     return;
//   }

//   files.forEach((file: any) => {
//     const div = document.createElement('div');

//     const name = document.createElement('span');
//     name.textContent = file.name;

//     const btn = document.createElement('button');
//     btn.textContent = 'Download';
//     btn.onclick = () => downloadFile(file.id, file.name);

//     div.appendChild(name);
//     div.appendChild(btn);

//     container.appendChild(div);
//   });
// }

// // ---------------- DOWNLOAD ----------------
// async function downloadFile(fileId: string, fileName: string) {
//   const token = gapi.client.getToken().access_token;

//   const res = await fetch(
//     `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   const blob = await res.blob();
//   const url = URL.createObjectURL(blob);

//   const a = document.createElement('a');
//   a.href = url;
//   a.download = fileName;
//   a.click();

//   URL.revokeObjectURL(url);
// }

// // expose init globally
// (window as any).initApp = initApp;


// GoogleDrive.ts
declare const gapi: any;
declare const google: any;

const CLIENT_ID = '253506927067-6e4r5gmdsldj41kcbe2f9v4r3k803hm2.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let tokenClient: any;

/**
 * Initialize the Drive module.
 * Call this once in your app (e.g., in App.tsx useEffect)
 */
export function initDrive() {
  gapi.load('client', async () => {
    await gapi.client.init({
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    });
  });

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (tokenResponse: any) => {
      gapi.client.setToken(tokenResponse);
    },
  });
}

/** Trigger Google login */
export function login() {
  tokenClient.requestAccessToken();
}

/** Upload a file to Google Drive */
export async function uploadFile(file: File, folderId?: string) {
  const metadata: any = { name: file.name };
  if (folderId) metadata.parents = [folderId];

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + gapi.client.getToken().access_token,
    },
    body: form,
  });

  return res.json();
}

/** List files in Drive or in a specific folder */
export async function listFiles(folderId?: string) {
  let q = '';
  if (folderId) q = `'${folderId}' in parents`;

  const res = await gapi.client.drive.files.list({
    pageSize: 20,
    fields: 'files(id, name)',
    q,
  });

  return res.result.files || [];
}

/** Download a file from Drive */
export async function downloadFile(fileId: string, fileName: string) {
  const token = gapi.client.getToken().access_token;

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}