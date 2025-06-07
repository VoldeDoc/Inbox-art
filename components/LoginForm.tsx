import React, { useState } from "react"
import { loginUser } from "../lib/database"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    // Use user-agent as deviceInfo for demo
    const deviceInfo = typeof window !== "undefined" ? window.navigator.userAgent : "unknown"
    const user = await loginUser(email, password, deviceInfo)
    if (user) {
      setLoggedIn(true)
      setMessage("Login successful!")
    } else {
      setMessage("Login failed. Check your credentials.")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {message && <div>{message}</div>}
      {loggedIn && <div>Welcome!</div>}
    </form>
  )
}
