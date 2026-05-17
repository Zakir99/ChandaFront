import { Turnstile } from "@marsidev/react-turnstile";
import { useState } from "react";

export default function LoginForm() {
  const [token, setToken] = useState(null);

  return (
    <form>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />

      <Turnstile
        siteKey="YOUR_SITE_KEY"
        onSuccess={(token) => setToken(token)}
      />

      <button type="submit">Login</button>
    </form>
  );
}