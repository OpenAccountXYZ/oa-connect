## OA-Connect

OA-Connect is OpenAccount SDK that helps APP to easily integrate "Sign in with OpenAccount".

Install:

```
npm i openaccount-connect
```

## Client Side
 
Add `AuthButton` to the page:

```tsx
<div className="">
 <AuthButton challenge={challenge}></AuthButton>
</div>
```

Add logic to get challenge from server. Once get the `authResult`, send the result to the server for verification.

```tsx
import { AuthButton, useAuthWindow } from "openaccount-connect";

// authResult is the return value of the signature
// It has the following structure:
// AuthResult: {
//   fullChallenge: {
//     challenge: string,    // The random challenge string
//     statement: string,    // Optional statement for the user to sign
//     requestID: string | null,  // Optional request ID
//     expireTime: number | null, // Optional expiration time of the challenge
//     version: string,      // Version of the challenge format
//     origin: string,       // Origin of the request
//     uri: string,          // URI of the request
//     account: string,      // User's account address
//     chainID: number,      // Chain ID of the network
//     issueTime: number,    // Timestamp when the challenge was issued
//     notBefore: number | null  // Optional timestamp before which the challenge is not valid
//   },
//   signature: string       // The signature produced by the user's wallet
// }
const { authResult } = useAuthWindow();

// Challenge is a random string used to prevent replay attacks
// It should be generated on the server side and sent to the client
// Here's how you might fetch it from your server:
// const challenge = await fetch("/api/challenge").then(res => res.text());

// For demonstration purposes, we're generating it client-side
// In a real application, ALWAYS generate and validate the challenge on the server
const challenge = crypto.getRandomValues(new Uint8Array(32)).toString();

useEffect(() => {
if (authResult && (authResult as any).signature) {
    // User has successfully authenticated with OpenAccount
    // At this point, you should:
    // 1. Send the authResult to your server for verification
    // 2. If verification is successful, create a session for the user
    // 3. Update your app's state to reflect the user is logged in
    
    // Example of sending authResult to server:
    // async function verifyAuthentication() {
    //   try {
    //     const response = await fetch('/api/verify', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ authResult })
    //     });
    //     if (response.ok) {
    //       // Authentication verified by server
    //       // Proceed with user login (e.g., set user state, redirect to dashboard)
    //     } else {
    //       // Handle authentication failure
    //     }
    //   } catch (error) {
    //     console.error('Error verifying authentication:', error);
    //   }
    // }
    // verifyAuthentication();
}
}, [authResult]);
```

## Server Side

Verify OpenAccount user signature.

```tsx
import { verifySignature } from "openaccount-connect";

const authResult = req.body.authResult;

// Before verifying the signature, you should implement challenge validation here
// This typically involves:
// 1. Checking if the challenge in authResult matches the one you sent to the client
// 2. Ensuring the challenge hasn't been used before (to prevent replay attacks)
// 3. Verifying that the challenge hasn't expired if you're using time-based challenges

// Example (pseudo-code):
// if (!validateChallenge(authResult.fullChallenge.challenge)) {
//     return res.status(400).json({ error: 'Invalid or expired challenge' });
// }

// Call the validation signature function
const status = await verifySignature(authResult);

if (status) {
  // Signature is valid
  // At this point, you should:
  // 1. Create or update a user session
  // 2. Generate and send back a session token or JWT
  // 3. Store relevant user information (e.g., account address) in your database
  
  console.log('Authenticated account:', authResult.fullChallenge.account);
  
  // Example of creating a session (pseudo-code):
  // const sessionToken = generateSessionToken(authResult.fullChallenge.account);
  // storeSession(sessionToken, authResult.fullChallenge.account);
  // return res.json({ sessionToken });
} else {
  // Signature is invalid
  // Return an error response
  // return res.status(401).json({ error: 'Invalid signature' });
}
```
