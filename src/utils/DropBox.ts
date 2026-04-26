// async function refreshDropboxToken() {
//   const res = await fetch("https://api.dropbox.com/oauth2/token", {
    
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams({
//       grant_type: "refresh_token",
//       refresh_token: import.meta.env.VITE_DROPBOX_REFRESH_TOKEN,
//       client_id: import.meta.env.VITE_DROPBOX_CLIENT_ID,
//       client_secret: import.meta.env.VITE_DROPBOX_CLIENT_SECRET,
//     }),
    
//   });

//   const data = await res.json();

//   console.log("DROPBOX REFRESH RESPONSE:", data); // 👈 IMPORTANT

//   return data;
// }

// export const getDropboxToken = async () => {
//   const data = await refreshDropboxToken();

//   if (!data.access_token) {
//     console.error("INVALID DROPBOX RESPONSE:", data);
//     throw new Error("Failed to get access_token from Dropbox");
//   }

//   return data.access_token;
// };


// utils/DropBox.ts


// utils/DropBox.ts

async function refreshDropboxToken() {
  const res = await fetch("https://api.dropbox.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: import.meta.env.VITE_DROPBOX_REFRESH_TOKEN,
      client_id: import.meta.env.VITE_DROPBOX_CLIENT_ID,
      client_secret: import.meta.env.VITE_DROPBOX_CLIENT_SECRET,
    }),
  });

  const data = await res.json();
  
  // Log the response for debugging
  console.log("Dropbox Token Refresh Response:", data);
  console.log("Client ID:", import.meta.env.VITE_DROPBOX_CLIENT_ID);
console.log("Client Secret:", import.meta.env.VITE_DROPBOX_CLIENT_SECRET);
console.log("Refresh Token:", import.meta.env.VITE_DROPBOX_REFRESH_TOKEN);

  if (data.error) {
    throw new Error(`Dropbox token refresh failed: ${data.error}`);
  }

  return data.access_token;  // This should be the fresh access token
}

export const getDropboxToken = async () => {
  try {
    const token = await refreshDropboxToken();
    return token;
  } catch (err) {
    console.error("Error in getting Dropbox token:", err);
    throw err;  // Re-throw the error for further handling in the upload function
  }
};