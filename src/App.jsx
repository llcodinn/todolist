import { useState } from "react"

function formatDateTime(date) {
  return date.toLocaleString("en-SG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  })
}

function App() {
  const [tasks, setTasks] = useState([])
  const [completed, setCompleted] = useState([])
  const [input, setInput] = useState("")
  const [showAdd, setShowAdd] = useState(false)

  const addTask = () => {
    if (!input.trim()) return
    setTasks([...tasks, { text: input.trim(), createdAt: new Date() }])
    setInput("")
    setShowAdd(false)
  }

  const completeTask = (i) => {
    const task = tasks[i]
    setCompleted(prev => [{ ...task, completedAt: new Date() }, ...prev])
    setTasks(tasks.filter((_, idx) => idx !== i))
  }

  const uncompleteTask = (i) => {
    const task = completed[i]
    setTasks([...tasks, { text: task.text, createdAt: task.createdAt }])
    setCompleted(completed.filter((_, idx) => idx !== i))
  }

  const sortedCompleted = [...completed].sort((a, b) => b.completedAt - a.completedAt)

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "48px 24px", fontFamily: "Georgia, serif" }}>

      {/* Header */}
      <h1 style={{ fontSize: 28, fontWeight: 400, marginBottom: 8, letterSpacing: "-0.5px" }}>My Tasks</h1>
      <p style={{ color: "#aaa", fontSize: 14, marginBottom: 40 }}>{tasks.length} remaining</p>

      {/* Task List */}
      {tasks.map((task, i) => (
        <div key={i} onClick={() => completeTask(i)} style={{
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
              Created {formatDateTime(task.createdAt)}
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
          {sortedCompleted.map((task, i) => (
            <div key={i} onClick={() => uncompleteTask(completed.indexOf(task))} style={{
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
                  Created {formatDateTime(task.createdAt)} · Completed {formatDateTime(task.completedAt)}
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

export default App