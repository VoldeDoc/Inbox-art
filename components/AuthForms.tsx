"use client"
import React, { useState } from "react"
import { createUser, loginUser } from "../lib/auth"
import { logoutUser } from "../lib/database"
export default function AuthForms() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [user, setUser] = useState<any>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    const newUser = await createUser(email, password, name || "User")
    if (newUser) {
      setMessage("Signup successful! Please check your email for a welcome message.")
      setUser(newUser)
    } else {
      setMessage("Signup failed. Email may already be registered.")
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    const deviceInfo = typeof window !== "undefined" ? window.navigator.userAgent : "unknown"
    const loggedInUser = await loginUser(email, password, deviceInfo)
    if (loggedInUser) {
      setUser(loggedInUser)
      setMessage("Login successful!")
    } else {
      setMessage("Login failed. Check your credentials.")
    }
  }

  const handleLogout = async () => {
    if (user?.id) {
      await logoutUser(user.id)
    }
    setUser(null)
    setEmail("")
    setPassword("")
    setMessage("Logged out.")
  }

  if (user) {
    return (
      <div>
        <div>Welcome, {user.email}!</div>
        <button onClick={handleLogout}>Logout</button>
        {message && <div>{message}</div>}
      </div>
    )
  }

  return (
    <div>
      <div>
        <button
          onClick={() => { setMode("login"); setMessage(""); }}
          disabled={mode === "login"}
        >
          Login
        </button>
        <button
          onClick={() => { setMode("signup"); setMessage(""); }}
          disabled={mode === "signup"}
        >
          Sign Up
        </button>
      </div>
      {mode === "signup" ? (
        <form onSubmit={handleSignup}>
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
        </form>
      ) : (
        <form onSubmit={handleLogin}>
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
        </form>
      )}
      {message && <div>{message}</div>}
      <div style={{ marginTop: 16 }}>
        <b>Demo Account:</b> demo@demo.com / password
      </div>
    </div>
  )
}
