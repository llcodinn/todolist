import { useState, useEffect } from "react"
import { supabase } from "./supabase"

function formatDateTime(date) {
  return new Date(date).toLocaleString("en-SG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  })
}

function Login() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const sendMagicLink = async () => {
    if (!email.trim()) return
    await supabase.auth.signInWithOtp({ email })
    setSent(true)
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "48px 24px", fontFamily: "Georgia, serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 400, marginBottom: 8, letterSpacing: "-0.5px" }}>My Tasks</h1>
      <p style={{ color: "#aaa", fontSize: 14, marginBottom: 40 }}>Sign in to access your tasks</p>

      {sent ? (
        <p style={{ color: "#222", fontSize: 16 }}>✅ Check your email for the magic link!</p>
      ) : (
        <div>
          <input
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMagicLink()}
            placeholder="your@email.com"
            style={{
              width: "100%", fontSize: 18, border: "none", outline: "none",
              borderBottom: "1.5px solid #eee", paddingBottom: 12, marginBottom: 24,
              fontFamily: "Georgia, serif", boxSizing: "border-box"
            }}
          />
          <button onClick={sendMagicLink} style={{
            width: "100%", padding: "14px", background: "#222", color: "white",
            border: "none", borderRadius: 12, fontSize: 15, cursor: "pointer"
          }}>Send Magic Link</button>
        </div>
      )}
    </div>
  )
}

function Tasks({ user }) {
  const [tasks, setTasks] = useState([])
  const [completed, setCompleted] = useState([])
  const [input, setInput] = useState("")
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const { data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true })

    if (data) {
      setTasks(data.filter(t => !t.is_completed))
      setCompleted(data.filter(t => t.is_completed))
    }
    setLoading(false)
  }

  const addTask = async () => {
    if (!input.trim()) return
    const { data } = await supabase
      .from("tasks")
      .insert({ text: input.trim(), user_id: user.id })
      .select()
      .single()

    if (data) setTasks(prev => [...prev, data])
    setInput("")
    setShowAdd(false)
  }

  const completeTask = async (task) => {
    const completedAt = new Date().toISOString()
    await supabase
      .from("tasks")
      .update({ is_completed: true, completed_at: completedAt })
      .eq("id", task.id)

    setTasks(prev => prev.filter(t => t.id !== task.id))
    setCompleted(prev => [{ ...task, is_completed: true, completed_at: completedAt }, ...prev])
  }

  const uncompleteTask = async (task) => {
    await supabase
      .from("tasks")
      .update({ is_completed: false, completed_at: null })
      .eq("id", task.id)

    setCompleted(prev => prev.filter(t => t.id !== task.id))
    setTasks(prev => [...prev, { ...task, is_completed: false, completed_at: null }])
  }

  const sortedCompleted = [...completed].sort((a, b) =>
    new Date(b.completed_at) - new Date(a.completed_at)
  )

  if (loading) return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "48px 24px", fontFamily: "Georgia, serif", color: "#ccc" }}>
      Loading...
    </div>
  )

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "48px 24px", fontFamily: "Georgia, serif" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 400, letterSpacing: "-0.5px", margin: 0 }}>My Tasks</h1>
        <button onClick={() => supabase.auth.signOut()} style={{
          background: "none", border: "none", color: "#ccc", fontSize: 12, cursor: "pointer", marginTop: 6
        }}>Sign out</button>
      </div>
      <p style={{ color: "#aaa", fontSize: 14, marginBottom: 40 }}>{tasks.length} remaining</p>

      {/* Task List */}
      {tasks.map((task) => (
        <div key={task.id} onClick={() => completeTask(task)} style={{
          display: "flex", alignItems: "flex-start", gap: 14,
          padding: "14px 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer"
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: "50%", marginTop: 2,
            border: "1.5px solid #ccc", flexShrink: 0
          }} />
          <div>
            <span style={{ fontSize: 16, color: "#222", display: "block" }}>{task.text}</span>
            <span style={{ fontSize: 11, color: "#ccc", marginTop: 3, display: "block" }}>
              Created {formatDateTime(task.created_at)}
            </span>
          </div>
        </div>
      ))}

      {/* Completed Section */}
      {sortedCompleted.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <p style={{ fontSize: 12, color: "#bbb", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
            Completed · {sortedCompleted.length}
          </p>
          {sortedCompleted.map((task) => (
            <div key={task.id} onClick={() => uncompleteTask(task)} style={{
              display: "flex", alignItems: "flex-start", gap: 14,
              padding: "14px 0", borderBottom: "1px solid #f9f9f9", cursor: "pointer"
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", marginTop: 2,
                border: "1.5px solid #ddd", background: "#f5f5f5", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <span style={{ fontSize: 10, color: "#bbb" }}>✓</span>
              </div>
              <div>
                <span style={{ fontSize: 16, color: "#bbb", textDecoration: "line-through", display: "block" }}>
                  {task.text}
                </span>
                <span style={{ fontSize: 11, color: "#ccc", marginTop: 3, display: "block" }}>
                  Created {formatDateTime(task.created_at)} · Completed {formatDateTime(task.completed_at)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button onClick={() => setShowAdd(true)} style={{
        position: "fixed", bottom: 32, right: 32,
        width: 52, height: 52, borderRadius: "50%",
        background: "#222", color: "white", fontSize: 24,
        border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
      }}>+</button>

      {/* Bottom Sheet */}
      {showAdd && (
        <div>
          <div onClick={() => setShowAdd(false)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)"
          }} />
          <div style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            background: "white", borderRadius: "20px 20px 0 0",
            padding: "24px 24px 40px", boxShadow: "0 -4px 40px rgba(0,0,0,0.1)"
          }}>
            <p style={{ fontSize: 13, color: "#aaa", marginBottom: 16 }}>New task</p>
            <input
              autoFocus
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTask()}
              placeholder="What needs to be done?"
              style={{
                width: "100%", fontSize: 18, border: "none", outline: "none",
                borderBottom: "1.5px solid #eee", paddingBottom: 12, marginBottom: 24,
                fontFamily: "Georgia, serif", boxSizing: "border-box"
              }}
            />
            <button onClick={addTask} style={{
              width: "100%", padding: "14px", background: "#222", color: "white",
              border: "none", borderRadius: 12, fontSize: 15, cursor: "pointer"
            }}>Add Task</button>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    supabase.auth.onAuthStateChange((_event, session) => setSession(session))
  }, [])

  if (session === undefined) return null
  return session ? <Tasks user={session.user} /> : <Login />
}

export default App