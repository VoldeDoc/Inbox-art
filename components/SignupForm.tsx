import React, { useState } from "react"
import { createUser } from "../lib/auth"

export default function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    const user = await createUser(email, password , name || "User")
    if (user) {
      setMessage("Signup successful! Please check your email for a welcome message.")
    } else {
      setMessage("Signup failed. Email may already be registered.")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
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
      <button type="submit">Sign Up</button>
      {message && <div>{message}</div>}
    </form>
  )
}
