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

Add logic to get challenge from server. Once get the `authResult`, send the result to the server ffor verification.

```tsx
import { AuthButton, useAuthWindow } from "openaccount-connect";


  // authResult is the return value of the signature
const { authResult } = useAuthWindow();


// get challenge from server
// const challenge = await fetch("/api/challenge");
const challenge = crypto.getRandomValues(new Uint8Array(32)).toString();


useEffect(() => {
if (authResult && (authResult as any).signature) {
    // got user signature, handle user login here
}
}, [authResult]);

```

## Server side

Verify OpenAccount user signature.

```tsx
import { verifySignature } from "openaccount-connect";


const authResult = req.body.authResult;

// Call the validation signature function
const status = await verifySignature(authResult);

if (status) {
    console.log(authResult.fullChallenge.account)
}

```
