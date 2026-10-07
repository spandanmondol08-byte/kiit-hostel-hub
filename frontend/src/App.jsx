import StructureManager from "./components/StructureManager";
import StudentManager from "./components/StudentManager";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import "./App.css";

/* =========================================================
   AUTH SCREEN
========================================================= */

function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (mode === "signup") {
      if (!name.trim()) {
        setMessage("Please enter your full name.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          "Account created. Check your email if email confirmation is enabled."
        );
        setMode("login");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setMessage(error.message);
      }
    }

    setLoading(false);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand">
          <div className="brand-icon">K</div>

          <div>
            <h1>KIIT Hostel Hub</h1>
            <p>Smart Hostel Management</p>
          </div>
        </div>

        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
          >
            Login
          </button>

          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => {
              setMode("signup");
              setMessage("");
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="field">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="field">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create Student Account"}
          </button>
        </form>

        {message && <div className="auth-message">{message}</div>}

        <p className="auth-note">
          New accounts are automatically registered as students.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   STUDENT SIDEBAR
========================================================= */

function Sidebar({ activePage, setActivePage }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: "⌂" },
    { id: "mess", label: "Mess", icon: "🍽" },
    { id: "maintenance", label: "Maintenance", icon: "🔧" },
    { id: "lost", label: "Lost & Found", icon: "🔎" },
    { id: "travel", label: "Travel", icon: "✈" },
    { id: "assistant", label: "AI Assistant", icon: "✦" },
    { id: "profile", label: "Profile", icon: "◉" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon small">K</div>

        <div>
          <strong>KIIT Hostel Hub</strong>
          <span>Student Portal</span>
        </div>
      </div>

      <nav>
        {items.map((item) => (
          <button
            key={item.id}
            className={
              activePage === item.id ? "nav-item active" : "nav-item"
            }
            onClick={() => setActivePage(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

/* =========================================================
   ROOM CARD
========================================================= */

function RoomCard({ studentData }) {
  if (!studentData) {
    return (
      <div className="card room-card">
        <div className="card-heading">
          <span>🏠</span>
          <h2>Hostel Assignment</h2>
        </div>

        <div className="empty-state">
          <h3>No room assigned</h3>

          <p>
            Your student account exists, but a hostel room has not been
            assigned yet.
          </p>
        </div>
      </div>
    );
  }

  const { student, room, floor, block, hostel } = studentData;

  return (
    <div className="card room-card">
      <div className="card-heading">
        <span>🏠</span>
        <h2>My Hostel Room</h2>
      </div>

      <div className="room-number">{room.room_number}</div>

      <div className="location-path">
        {hostel?.name} <span>›</span> {block?.name} <span>›</span>{" "}
        {floor?.name} <span>›</span> {room.room_number}
      </div>

      <div className="room-details">
        <div className="detail">
          <span className="detail-icon">🏢</span>

          <div>
            <small>Block</small>
            <strong>{block?.name || "Unknown"}</strong>
          </div>
        </div>

        <div className="detail">
          <span className="detail-icon">🪜</span>

          <div>
            <small>Floor</small>
            <strong>{floor?.name || "Unknown"}</strong>
          </div>
        </div>

        <div className="detail">
          <span className="detail-icon">👥</span>

          <div>
            <small>Capacity</small>
            <strong>{room.capacity} students</strong>
          </div>
        </div>

        <div className="detail">
          <span className="detail-icon">❄️</span>

          <div>
            <small>Air Conditioning</small>
            <strong>{room.has_ac ? "Available" : "Not Available"}</strong>
          </div>
        </div>

        <div className="detail">
          <span className="detail-icon">🚿</span>

          <div>
            <small>Bathroom</small>

            <strong>
              {room.attached_bathroom ? "Attached" : "Not Attached"}
            </strong>
          </div>
        </div>

        <div className="detail">
          <span className="detail-icon">🎓</span>

          <div>
            <small>Student ID</small>
            <strong>{student.student_id}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STUDENT DASHBOARD
========================================================= */

function Dashboard({ profile, studentData, maintenanceCount }) {
  return (
    <div>
      <div className="welcome">
        <div>
          <p className="eyebrow">STUDENT DASHBOARD</p>

          <h1>
            Welcome back,{" "}
            <span>{profile?.full_name || "Student"}</span> 👋
          </h1>

          <p>
            Here's your hostel information and quick access to hostel
            services.
          </p>
        </div>

        <div className="status-pill">
          <span></span>
          Student Account
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>🏠</span>

          <div>
            <small>My Room</small>

            <strong>
              {studentData?.room?.room_number || "Not Assigned"}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <span>🏢</span>

          <div>
            <small>Block</small>

            <strong>
              {studentData?.block?.name || "Not Assigned"}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <span>🔧</span>

          <div>
            <small>Maintenance</small>
            <strong>{maintenanceCount} Active</strong>
          </div>
        </div>

        <div className="stat-card">
          <span>🍽</span>

          <div>
            <small>Mess Rating</small>
            <strong>Not Rated</strong>
          </div>
        </div>
      </div>

      <RoomCard studentData={studentData} />

      <div className="quick-grid">
        <div className="card quick-card">
          <span>🔧</span>

          <h3>Report Maintenance</h3>

          <p>
            Report electrical, plumbing, furniture, fan, AC, Wi-Fi or other
            hostel issues.
          </p>
        </div>

        <div className="card quick-card">
          <span>🍽</span>

          <h3>Mess Feedback</h3>

          <p>
            Rate your meals and submit anonymous feedback about the mess.
          </p>
        </div>

        <div className="card quick-card">
          <span>🔎</span>

          <h3>Lost & Found</h3>

          <p>Report lost belongings or check items reported as found.</p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAINTENANCE PAGE
========================================================= */

function MaintenancePage({
  studentData,
  complaints,
  categories,
  onRefresh,
}) {
  const [showForm, setShowForm] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const room = studentData?.room;
  const student = studentData?.student;

  const availableCategories = categories.filter(
    (category) => !category.requires_ac || room?.has_ac
  );

  async function submitComplaint(e) {
    e.preventDefault();

    if (!student || !room) {
      setMessage("You need an assigned room before reporting a complaint.");
      return;
    }

    if (!categoryId) {
      setMessage("Please select a category.");
      return;
    }

    if (!title.trim()) {
      setMessage("Please enter a complaint title.");
      return;
    }

    if (!description.trim()) {
      setMessage("Please describe the problem.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    const selectedCategory = availableCategories.find(
      (category) => category.id === categoryId
    );

    if (!selectedCategory) {
      setMessage("Invalid maintenance category.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("complaints").insert({
      student_id: student.id,
      room_id: room.id,
      category_id: selectedCategory.id,
      title: title.trim(),
      description: description.trim(),
      status: "pending",
      priority: "medium",
    });

    if (error) {
      console.error("Complaint submission error:", error);
      setMessage(error.message);
      setSubmitting(false);
      return;
    }

    setTitle("");
    setDescription("");
    setCategoryId("");
    setMessage("Complaint submitted successfully.");
    setSubmitting(false);
    setShowForm(false);

    await onRefresh();
  }

  function getStatusClass(status) {
    if (status === "resolved") return "status-resolved";
    if (status === "in_progress") return "status-progress";
    if (status === "rejected") return "status-rejected";
    return "status-pending";
  }

  function getStatusLabel(status) {
    if (status === "in_progress") return "In Progress";

    return status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "Pending";
  }

  return (
    <div className="page-section">
      <div className="page-header maintenance-header">
        <div>
          <p className="eyebrow">HOSTEL SERVICES</p>
          <h1>Maintenance</h1>
          <p>Report and track issues in your hostel room.</p>
        </div>

        <button
          className="primary-btn maintenance-report-btn"
          onClick={() => {
            setShowForm(!showForm);
            setMessage("");
          }}
          disabled={!room}
        >
          {showForm ? "Close Form" : "+ Report an Issue"}
        </button>
      </div>

      {message && (
        <div className="maintenance-message">
          {message}
        </div>
      )}

      {!room && (
        <div className="card empty-state">
          <h3>No room assigned</h3>

          <p>
            You cannot submit a maintenance complaint until a hostel room is
            assigned to your account.
          </p>
        </div>
      )}

      {showForm && room && (
        <div className="card maintenance-form-card">
          <div className="card-heading">
            <span>🛠️</span>
            <h2>Report a Maintenance Issue</h2>
          </div>

          <div className="room-assignment">
            <div>
              <small>Room</small>
              <strong>{room.room_number}</strong>
            </div>

            <div>
              <small>AC</small>
              <strong>{room.has_ac ? "Available" : "Not Available"}</strong>
            </div>

            <div>
              <small>Assignment</small>
              <strong>Automatically attached</strong>
            </div>
          </div>

          <form onSubmit={submitComplaint}>
            <div className="field">
              <label>Category</label>

              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select an issue category</option>

                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Title</label>

              <input
                type="text"
                placeholder="e.g. Fan is not working"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={150}
                required
              />
            </div>

            <div className="field">
              <label>Description</label>

              <textarea
                placeholder="Describe the problem in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                required
              />
            </div>

            <div className="maintenance-form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setShowForm(false);
                  setMessage("");
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="maintenance-list">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR REQUESTS</p>
            <h2>My Complaints</h2>
          </div>

          <span className="complaint-count">
            {complaints.length} total
          </span>
        </div>

        {complaints.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">🔧</div>

            <h3>No complaints yet</h3>

            <p>
              You haven't reported any maintenance issues. If something in
              your room needs attention, report it here.
            </p>
          </div>
        ) : (
          <div className="complaint-grid">
            {complaints.map((complaint) => (
              <div className="card complaint-card" key={complaint.id}>
                <div className="complaint-top">
                  <div>
                    <span className="complaint-category">
                      {complaint.category?.name || "Maintenance"}
                    </span>

                    <h3>{complaint.title}</h3>
                  </div>

                  <span
                    className={`complaint-status ${getStatusClass(
                      complaint.status
                    )}`}
                  >
                    {getStatusLabel(complaint.status)}
                  </span>
                </div>

                <p className="complaint-description">
                  {complaint.description}
                </p>

                <div className="complaint-meta">
                  <span>
                    🏠{" "}
                    {complaint.room?.room_number ||
                      room?.room_number}
                  </span>

                  <span>
                    📅{" "}
                    {new Date(
                      complaint.created_at
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {complaint.ai_summary && (
                  <div className="ai-summary">
                    <strong>AI Summary</strong>
                    <p>{complaint.ai_summary}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STUDENT PLACEHOLDER
========================================================= */

function PlaceholderPage({ title, icon, description }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon">{icon}</div>

      <p className="eyebrow">KIIT HOSTEL HUB</p>

      <h1>{title}</h1>

      <p>{description}</p>

      <div className="coming-soon">Module coming next</div>
    </div>
  );
}

/* =========================================================
   STUDENT PROFILE
========================================================= */

function ProfilePage({ profile, studentData }) {
  return (
    <div className="page-section">
      <div className="page-header">
        <p className="eyebrow">ACCOUNT</p>
        <h1>My Profile</h1>
        <p>Your personal and hostel information.</p>
      </div>

      <div className="profile-grid">
        <div className="card profile-card">
          <div className="profile-avatar">
            {(profile?.full_name || "S").charAt(0).toUpperCase()}
          </div>

          <h2>{profile?.full_name || "Student"}</h2>

          <p>{profile?.email}</p>

          <div className="role-badge">STUDENT</div>
        </div>

        <RoomCard studentData={studentData} />
      </div>
    </div>
  );
}

/* =========================================================
   HOSTEL ADMIN SIDEBAR
========================================================= */

function AdminSidebar({
  activePage,
  setActivePage,
  onLogout,
}) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: "⌂" },
    { id: "maintenance", label: "Maintenance", icon: "🔧" },
    { id: "lost", label: "Lost & Found", icon: "🔎" },
    { id: "students", label: "Students", icon: "👥" },
    { id: "blocks", label: "Blocks", icon: "🏢" },
    { id: "floors", label: "Floors", icon: "🪜" },
    { id: "rooms", label: "Rooms", icon: "🚪" },
    { id: "analytics", label: "Analytics", icon: "📊" },
  ];

  return (
    <aside className="sidebar admin-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon small">K</div>

        <div>
          <strong>KIIT Hostel Hub</strong>
          <span>Hostel Administration</span>
        </div>
      </div>

      <nav>
        {items.map((item) => (
          <button
            key={item.id}
            className={
              activePage === item.id
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActivePage(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <button
        className="nav-item admin-logout"
        onClick={onLogout}
      >
        <span>↪</span>
        Logout
      </button>
    </aside>
  );
}

/* =========================================================
   ADMIN STAT CARD
========================================================= */

function AdminStat({
  icon,
  label,
  value,
  description,
}) {
  return (
    <div className="stat-card admin-stat-card">
      <span>{icon}</span>

      <div>
        <small>{label}</small>
        <strong>{value}</strong>

        {description && (
          <em>{description}</em>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   HOSTEL ADMIN DASHBOARD
========================================================= */

function HostelAdminDashboard({
  profile,
  onLogout,
}) {
  const [activePage, setActivePage] = useState("dashboard");

  const [stats, setStats] = useState({
    students: 0,
    rooms: 0,
    complaints: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    urgent: 0,
  });

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  /* =====================================================
     MAINTENANCE FILTERS
  ===================================================== */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintHistory, setComplaintHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState({});

  /* =====================================================
     LOAD ADMIN DATA
  ===================================================== */

  async function loadAdminData() {
    setLoading(true);
    setMessage("");

    const [
      studentsResult,
      roomsResult,
      complaintsResult,
    ] = await Promise.all([
      supabase
        .from("students")
        .select("id", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("rooms")
        .select("id", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("complaints")
        .select(`
          id,
          student_id,
          room_id,
          category_id,
          title,
          description,
          status,
          priority,
          ai_category,
          ai_subcategory,
          ai_summary,
          ai_priority,
          assigned_to,
          created_at,
          updated_at,
          resolved_at,

          category:maintenance_categories (
            id,
            name,
            requires_ac
          ),

          room:rooms (
            id,
            room_number,
            capacity,
            has_ac,
            attached_bathroom,

            floor:floors (
              id,
              name,
              floor_number,

              block:blocks (
                id,
                name,
                code
              )
            )
          ),

          student:students (
            id,
            student_id,
            registration_number,
            course,
            branch,
            semester,
            user_id
          )
        `)
        .order("created_at", {
          ascending: false,
        }),
    ]);

    /* ===================================================
       STUDENT COUNT
    =================================================== */

    if (studentsResult.error) {
      console.error(
        "Admin student count error:",
        studentsResult.error
      );
    }

    /* ===================================================
       ROOM COUNT
    =================================================== */

    if (roomsResult.error) {
      console.error(
        "Admin room count error:",
        roomsResult.error
      );
    }

    /* ===================================================
       COMPLAINTS
    =================================================== */

    if (complaintsResult.error) {
      console.error(
        "Admin complaints error:",
        complaintsResult.error
      );

      setMessage(
        "Unable to load maintenance data. Check your Supabase admin policies."
      );

      setComplaints([]);
    } else {
      const complaintData =
        complaintsResult.data || [];

      setComplaints(complaintData);

      setStats({
        students:
          studentsResult.count || 0,

        rooms:
          roomsResult.count || 0,

        complaints:
          complaintData.length,

        pending:
          complaintData.filter(
            (item) =>
              item.status === "pending"
          ).length,

        inProgress:
          complaintData.filter(
            (item) =>
              item.status === "in_progress"
          ).length,

        resolved:
          complaintData.filter(
            (item) =>
              item.status === "resolved"
          ).length,

        urgent:
          complaintData.filter(
            (item) =>
              item.priority === "urgent"
          ).length,
      });
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  /* =====================================================
     UPDATE COMPLAINT STATUS
  ===================================================== */

  async function updateComplaintStatus(
    complaintId,
    newStatus
  ) {
    setMessage("");

    // Find the current complaint so we know the old status.
    const complaint = complaints.find(
      (item) => item.id === complaintId
    );

    if (!complaint) {
      setMessage("Complaint not found.");
      return;
    }

    const oldStatus = complaint.status;

    const adminNote =
      adminNotes[complaintId]?.trim() || "";

    // Nothing to do if the status hasn't changed.
    if (oldStatus === newStatus) {
      return;
    }

    const updateData = {
      status: newStatus,
    };

    if (newStatus === "resolved") {
      updateData.resolved_at =
        new Date().toISOString();
    } else {
      updateData.resolved_at = null;
    }

    // 1. Update the complaint status.
    const { error: complaintError } = await supabase
      .from("complaints")
      .update(updateData)
      .eq("id", complaintId);

    if (complaintError) {
      console.error(
        "Complaint status update error:",
        complaintError
      );

      setMessage(
        `Unable to update complaint: ${complaintError.message}`
      );

      return;
    }

    // 2. Create a permanent history record.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: historyError } = await supabase
      .from("complaint_updates")
      .insert({
        complaint_id: complaintId,
        updated_by: user?.id || null,
        old_status: oldStatus,
        new_status: newStatus,
        message:
          adminNote ||
          `Status changed from ${statusLabel(
            oldStatus
          )} to ${statusLabel(newStatus)}.`,
      });

    if (historyError) {
      console.error(
        "Complaint history error:",
        historyError
      );

      setMessage(
        `Complaint updated, but history could not be saved: ${historyError.message}`
      );

      await loadAdminData();
      return;
    }

    setAdminNotes((prev) => ({
      ...prev,
      [complaintId]: "",
    }));

    setMessage(
      "Complaint status updated successfully."
    );

    await loadAdminData();
  }

  /* =====================================================
     OPEN COMPLAINT DETAILS
  ===================================================== */

  async function openComplaintDetails(complaint) {
    setSelectedComplaint(complaint);
    setComplaintHistory([]);
    setHistoryLoading(true);

    const { data, error } = await supabase
      .from("complaint_updates")
      .select(`
        id,
        old_status,
        new_status,
        message,
        created_at,
        updated_by
      `)
      .eq("complaint_id", complaint.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Complaint history error:",
        error
      );
    } else {
      setComplaintHistory(data || []);
    }

    setHistoryLoading(false);
  }

  /* =====================================================
     STATUS LABEL
  ===================================================== */

  function statusLabel(status) {
    if (status === "in_progress") {
      return "In Progress";
    }

    if (status === "resolved") {
      return "Resolved";
    }

    if (status === "rejected") {
      return "Rejected";
    }

    return "Pending";
  }

  /* =====================================================
     PRIORITY CLASS
  ===================================================== */

  function priorityClass(priority) {
    if (priority === "urgent") {
      return "admin-priority urgent";
    }

    if (priority === "high") {
      return "admin-priority high";
    }

    if (priority === "low") {
      return "admin-priority low";
    }

    return "admin-priority medium";
  }

  /* =====================================================
     FILTER COMPLAINTS
  ===================================================== */

  const filteredComplaints =
    complaints.filter((complaint) => {
      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        complaint.title
          ?.toLowerCase()
          .includes(searchText) ||
        complaint.description
          ?.toLowerCase()
          .includes(searchText) ||
        complaint.room?.room_number
          ?.toLowerCase()
          .includes(searchText) ||
        complaint.student?.student_id
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        complaint.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        complaint.priority === priorityFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        complaint.category_id ===
          categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory
      );
    });

  /* =====================================================
     UNIQUE CATEGORIES
  ===================================================== */

  const complaintCategories =
    Array.from(
      new Map(
        complaints
          .filter(
            (complaint) =>
              complaint.category
          )
          .map((complaint) => [
            complaint.category.id,
            complaint.category,
          ])
      ).values()
    );

  /* =====================================================
     ADMIN PAGE RENDER
  ===================================================== */

  function renderAdminPage() {
    /* ===================================================
       DASHBOARD
    =================================================== */

    if (activePage === "dashboard") {
      return (
        <div className="page-section">

          <div className="page-header">
            <p className="eyebrow">
              HOSTEL ADMINISTRATION
            </p>

            <h1>
              Welcome,{" "}
              {profile?.full_name ||
                "Hostel Admin"}{" "}
              👋
            </h1>

            <p>
              Manage hostel operations,
              students, rooms and
              maintenance.
            </p>
          </div>

          {message && (
            <div className="maintenance-message">
              {message}
            </div>
          )}

          <div className="stats-grid admin-stats-grid">

            <AdminStat
              icon="👥"
              label="Students"
              value={stats.students}
              description="Registered students"
            />

            <AdminStat
              icon="🚪"
              label="Rooms"
              value={stats.rooms}
              description="Hostel rooms"
            />

            <AdminStat
              icon="🔧"
              label="Complaints"
              value={stats.complaints}
              description="All maintenance requests"
            />

            <AdminStat
              icon="🟡"
              label="Pending"
              value={stats.pending}
              description="Waiting for action"
            />

            <AdminStat
              icon="🔵"
              label="In Progress"
              value={stats.inProgress}
              description="Currently being handled"
            />

            <AdminStat
              icon="🟢"
              label="Resolved"
              value={stats.resolved}
              description="Completed complaints"
            />

            <AdminStat
              icon="🚨"
              label="Urgent"
              value={stats.urgent}
              description="Needs immediate attention"
            />

          </div>

          <div className="admin-section-grid">

            <div className="card admin-overview-card">

              <div className="card-heading">
                <span>🔧</span>
                <h2>Maintenance Overview</h2>
              </div>

              <div className="admin-overview-list">

                <div>
                  <span>
                    Pending complaints
                  </span>

                  <strong>
                    {stats.pending}
                  </strong>
                </div>

                <div>
                  <span>
                    In-progress complaints
                  </span>

                  <strong>
                    {stats.inProgress}
                  </strong>
                </div>

                <div>
                  <span>
                    Resolved complaints
                  </span>

                  <strong>
                    {stats.resolved}
                  </strong>
                </div>

                <div>
                  <span>
                    Urgent complaints
                  </span>

                  <strong>
                    {stats.urgent}
                  </strong>
                </div>

              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  setActivePage(
                    "maintenance"
                  )
                }
              >
                Manage Maintenance
              </button>

            </div>

            <div className="card admin-overview-card">

              <div className="card-heading">
                <span>🏠</span>
                <h2>Hostel Structure</h2>
              </div>

              <div className="admin-overview-list">

                <div>
                  <span>
                    Total rooms
                  </span>

                  <strong>
                    {stats.rooms}
                  </strong>
                </div>

                <div>
                  <span>
                    Blocks
                  </span>

                  <strong>
                    2
                  </strong>
                </div>

                <div>
                  <span>
                    Floors
                  </span>

                  <strong>
                    10
                  </strong>
                </div>

              </div>

              <button
                className="secondary-btn"
                onClick={() =>
                  setActivePage("rooms")
                }
              >
                Manage Rooms
              </button>

            </div>

          </div>
        </div>
      );
    }

    /* ===================================================
       MAINTENANCE
    =================================================== */

    if (activePage === "maintenance") {
      return (
        <div className="page-section">

          <div className="page-header maintenance-header">

            <div>
              <p className="eyebrow">
                HOSTEL ADMINISTRATION
              </p>

              <h1>
                Maintenance Management
              </h1>

              <p>
                Review, filter and manage
                student maintenance complaints.
              </p>
            </div>

            <button
              className="secondary-btn"
              onClick={loadAdminData}
              disabled={loading}
            >
              {loading
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>

          </div>

          {message && (
            <div className="maintenance-message">
              {message}
            </div>
          )}

          {/* =========================================
              FILTER BAR
          ========================================= */}

          <div className="card admin-filter-card">

            <div className="admin-filter-grid">

              <div className="field">
                <label>
                  Search
                </label>

                <input
                  type="text"
                  placeholder="Search title, room or student ID..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="field">
                <label>
                  Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                >
                  <option value="all">
                    All Statuses
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="in_progress">
                    In Progress
                  </option>

                  <option value="resolved">
                    Resolved
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>
                </select>
              </div>

              <div className="field">
                <label>
                  Priority
                </label>

                <select
                  value={priorityFilter}
                  onChange={(e) =>
                    setPriorityFilter(
                      e.target.value
                    )
                  }
                >
                  <option value="all">
                    All Priorities
                  </option>

                  <option value="urgent">
                    Urgent
                  </option>

                  <option value="high">
                    High
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="low">
                    Low
                  </option>
                </select>
              </div>

              <div className="field">
                <label>
                  Category
                </label>

                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(
                      e.target.value
                    )
                  }
                >
                  <option value="all">
                    All Categories
                  </option>

                  {complaintCategories.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  )}
                </select>
              </div>

            </div>

            <div className="admin-filter-bottom">

              <span>
                Showing{" "}
                <strong>
                  {filteredComplaints.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {complaints.length}
                </strong>{" "}
                complaints
              </span>

              <button
                className="secondary-btn"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setCategoryFilter("all");
                }}
              >
                Clear Filters
              </button>

            </div>

          </div>

          {/* =========================================
              COMPLAINT LIST
          ========================================= */}

          {loading ? (
            <div className="card empty-state">
              <h3>
                Loading complaints...
              </h3>
            </div>
          ) : filteredComplaints.length ===
            0 ? (
            <div className="card empty-state">

              <div className="empty-icon">
                🔧
              </div>

              <h3>
                No complaints found
              </h3>

              <p>
                No maintenance complaints
                match your current filters.
              </p>

            </div>
          ) : (
            <div className="admin-complaint-list">

              {filteredComplaints.map(
                (complaint) => (
                  <div
                    className="card admin-complaint-card"
                    key={complaint.id}
                  >

                    {/* =================================
                        HEADER
                    ================================= */}

                    <div className="admin-complaint-header">

                      <div>
                        <span className="complaint-category">
                          {complaint.category
                            ?.name ||
                            "Maintenance"}
                        </span>

                        <h2>
                          {complaint.title}
                        </h2>
                      </div>

                      <div className="admin-complaint-badges">

                        <span
                          className={`complaint-status ${
                            complaint.status ===
                            "resolved"
                              ? "status-resolved"
                              : complaint.status ===
                                "in_progress"
                              ? "status-progress"
                              : complaint.status ===
                                "rejected"
                              ? "status-rejected"
                              : "status-pending"
                          }`}
                        >
                          {statusLabel(
                            complaint.status
                          )}
                        </span>

                        <span
                          className={priorityClass(
                            complaint.priority
                          )}
                        >
                          {(
                            complaint.priority ||
                            "medium"
                          ).toUpperCase()}
                        </span>

                      </div>

                    </div>

                    {/* =================================
                        DESCRIPTION
                    ================================= */}

                    <p className="complaint-description">
                      {complaint.description}
                    </p>

                    {/* =================================
                        DETAILS
                    ================================= */}

                    <div className="admin-complaint-details">

                      <div>
                        <small>
                          Student ID
                        </small>

                        <strong>
                          {complaint.student
                            ?.student_id ||
                            "Unknown"}
                        </strong>
                      </div>

                      <div>
                        <small>
                          Room
                        </small>

                        <strong>
                          {complaint.room
                            ?.room_number ||
                            "Unknown"}
                        </strong>
                      </div>

                      <div>
                        <small>
                          Block
                        </small>

                        <strong>
                          {complaint.room
                            ?.floor
                            ?.block
                            ?.name ||
                            "Unknown"}
                        </strong>
                      </div>

                      <div>
                        <small>
                          Floor
                        </small>

                        <strong>
                          {complaint.room
                            ?.floor
                            ?.name ||
                            "Unknown"}
                        </strong>
                      </div>

                      <div>
                        <small>
                          Category
                        </small>

                        <strong>
                          {complaint.category
                            ?.name ||
                            "Unknown"}
                        </strong>
                      </div>

                      <div>
                        <small>
                          Reported
                        </small>

                        <strong>
                          {new Date(
                            complaint.created_at
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </strong>
                      </div>

                    </div>

                    {/* =================================
                        AI INFORMATION
                    ================================= */}

                    {(complaint.ai_category ||
                      complaint.ai_subcategory ||
                      complaint.ai_summary ||
                      complaint.ai_priority) && (
                      <div className="ai-summary">

                        <strong>
                          ✦ AI Analysis
                        </strong>

                        {complaint.ai_category && (
                          <p>
                            <strong>
                              Category:
                            </strong>{" "}
                            {
                              complaint.ai_category
                            }
                          </p>
                        )}

                        {complaint.ai_subcategory && (
                          <p>
                            <strong>
                              Subcategory:
                            </strong>{" "}
                            {
                              complaint.ai_subcategory
                            }
                          </p>
                        )}

                        {complaint.ai_priority && (
                          <p>
                            <strong>
                              AI Priority:
                            </strong>{" "}
                            {
                              complaint.ai_priority
                            }
                          </p>
                        )}

                        {complaint.ai_summary && (
                          <p>
                            <strong>
                              Summary:
                            </strong>{" "}
                            {
                              complaint.ai_summary
                            }
                          </p>
                        )}

                      </div>
                    )}

                    {/* =================================
                        STATUS CONTROL
                    ================================= */}

                    <div className="admin-complaint-actions">

                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() =>
                          openComplaintDetails(complaint)
                        }
                      >
                        View Details
                      </button>

                      <div className="status-update-group">
                        <span>Update Status</span>

                        <select
                          value={complaint.status}
                          onChange={(e) =>
                            updateComplaintStatus(
                              complaint.id,
                              e.target.value
                            )
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      <input
                        type="text"
                        className="admin-note-input"
                        placeholder="Add a note (optional)..."
                        value={adminNotes[complaint.id] || ""}
                        onChange={(e) =>
                          setAdminNotes((prev) => ({
                            ...prev,
                            [complaint.id]: e.target.value,
                          }))
                        }
                      />

                    </div>

                  </div>
                )
              )}

            </div>
          )}

          {selectedComplaint && (
            <div
              className="modal-overlay"
              onClick={() =>
                setSelectedComplaint(null)
              }
            >
              <div
                className="card complaint-detail-modal"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >
                <div className="modal-header">
                  <div>
                    <p className="eyebrow">
                      COMPLAINT DETAILS
                    </p>

                    <h2>
                      {selectedComplaint.title}
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="modal-close"
                    onClick={() =>
                      setSelectedComplaint(null)
                    }
                  >
                    ✕
                  </button>
                </div>

                <div className="complaint-detail-status">
                  <span
                    className={`complaint-status ${
                      selectedComplaint.status ===
                      "resolved"
                        ? "status-resolved"
                        : selectedComplaint.status ===
                          "in_progress"
                        ? "status-progress"
                        : selectedComplaint.status ===
                          "rejected"
                        ? "status-rejected"
                        : "status-pending"
                    }`}
                  >
                    {statusLabel(
                      selectedComplaint.status
                    )}
                  </span>

                  <span
                    className={priorityClass(
                      selectedComplaint.priority
                    )}
                  >
                    {(
                      selectedComplaint.priority ||
                      "medium"
                    ).toUpperCase()}
                  </span>
                </div>

                <div className="complaint-detail-section">
                  <h3>Description</h3>

                  <p>
                    {selectedComplaint.description}
                  </p>
                </div>

                <div className="complaint-detail-grid">

                  <div>
                    <small>Student ID</small>
                    <strong>
                      {selectedComplaint.student
                        ?.student_id ||
                        "Unknown"}
                    </strong>
                  </div>

                  <div>
                    <small>Room</small>
                    <strong>
                      {selectedComplaint.room
                        ?.room_number ||
                        "Unknown"}
                    </strong>
                  </div>

                  <div>
                    <small>Block</small>
                    <strong>
                      {selectedComplaint.room
                        ?.floor
                        ?.block
                        ?.name ||
                        "Unknown"}
                    </strong>
                  </div>

                  <div>
                    <small>Floor</small>
                    <strong>
                      {selectedComplaint.room
                        ?.floor?.name ||
                        "Unknown"}
                    </strong>
                  </div>

                  <div>
                    <small>Category</small>
                    <strong>
                      {selectedComplaint.category
                        ?.name ||
                        "Unknown"}
                    </strong>
                  </div>

                  <div>
                    <small>Reported</small>
                    <strong>
                      {new Date(
                        selectedComplaint.created_at
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                </div>

                {selectedComplaint.ai_summary && (
                  <div className="ai-summary">
                    <strong>
                      ✦ AI Analysis
                    </strong>

                    <p>
                      {selectedComplaint.ai_summary}
                    </p>
                  </div>
                )}

                <div className="complaint-history">

                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">
                        ACTIVITY
                      </p>

                      <h3>
                        Complaint History
                      </h3>
                    </div>
                  </div>

                  {historyLoading ? (
                    <p>
                      Loading history...
                    </p>
                  ) : complaintHistory.length ===
                    0 ? (
                    <p className="muted-text">
                      No status history has been
                      recorded yet.
                    </p>
                  ) : (
                    <div className="history-list">

                      {complaintHistory.map((update) => (
                        <div
                          className="history-item"
                          key={update.id}
                        >
                          <div>
                            <strong>
                              {statusLabel(update.new_status)}
                            </strong>

                            <p>
                              {update.message ||
                                `Status changed from ${statusLabel(
                                  update.old_status
                                )} to ${statusLabel(update.new_status)}.`}
                            </p>
                          </div>

                          <small>
                            {new Date(
                              update.created_at
                            ).toLocaleString("en-IN")}
                          </small>
                        </div>
                      ))}

                    </div>
                  )}

                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() =>
                      setSelectedComplaint(null)
                    }
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      );
    }

    /* ===================================================
       OTHER ADMIN MODULES
    =================================================== */

    if (activePage === "students") {
      return <StudentManager />;
    }

    if (activePage === "blocks") {
      return (
        <StructureManager
          activeSection="blocks"
        />
      );
    }

    if (activePage === "floors") {
      return (
        <StructureManager
          activeSection="floors"
        />
      );
    }

    if (activePage === "rooms") {
      return (
        <StructureManager
          activeSection="rooms"
        />
      );
    }

    if (activePage === "lost") {
      return (
        <AdminPlaceholder
          title="Lost & Found"
          icon="🔎"
          description="Manage lost items, found items and student claims."
        />
      );
    }

    if (activePage === "analytics") {
      return (
        <AdminPlaceholder
          title="Analytics"
          icon="📊"
          description="Analyze maintenance trends across blocks, floors and rooms."
        />
      );
    }

    return null;
  }

  /* =====================================================
     ADMIN LAYOUT
  ===================================================== */

  return (
    <div className="app-shell">

      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={onLogout}
      />

      <main className="main-content">

        <header className="topbar">

          <div className="mobile-title">
            Hostel Administration
          </div>

          <div className="topbar-right">

            <div className="user-mini">

              <div className="mini-avatar">
                {(
                  profile?.full_name ||
                  "A"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <strong>
                  {profile?.full_name ||
                    "Hostel Admin"}
                </strong>

                <span>
                  Hostel Administrator
                </span>

              </div>

            </div>

          </div>

        </header>

        <section className="content">
          {renderAdminPage()}
        </section>

      </main>

    </div>
  );
}

/* =========================================================
   ADMIN PLACEHOLDER
========================================================= */

function AdminPlaceholder({
  title,
  icon,
  description,
}) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon">
        {icon}
      </div>

      <p className="eyebrow">
        HOSTEL ADMINISTRATION
      </p>

      <h1>{title}</h1>

      <p>{description}</p>

      <div className="coming-soon">
        Module coming next
      </div>
    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [studentData, setStudentData] =
    useState(null);

  const [complaints, setComplaints] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [maintenanceCount, setMaintenanceCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [activePage, setActivePage] =
    useState("dashboard");

  /* =====================================================
     STUDENT DATA
  ===================================================== */

  async function loadStudentData(userId) {
    const { data, error } = await supabase
      .from("students")
      .select(`
        id,
        student_id,
        registration_number,
        course,
        branch,
        semester,
        room:rooms (
          id,
          room_number,
          capacity,
          has_ac,
          attached_bathroom,
          active,
          floor:floors (
            id,
            name,
            floor_number,
            block:blocks (
              id,
              name,
              code,
              hostel:hostels (
                id,
                name
              )
            )
          )
        )
      `)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error(
        "Student data error:",
        error
      );

      setStudentData(null);
      return;
    }

    if (!data || !data.room) {
      setStudentData(null);
      return;
    }

    setStudentData({
      student: data,
      room: data.room,
      floor: data.room.floor,
      block: data.room.floor?.block,
      hostel:
        data.room.floor?.block?.hostel,
    });
  }

  /* =====================================================
     PROFILE
  ===================================================== */

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error(
        "Profile error:",
        error
      );
      return;
    }

    setProfile(data);

    if (data.role === "student") {
      await loadStudentData(userId);
    }
  }

  /* =====================================================
     MAINTENANCE CATEGORIES
  ===================================================== */

  async function loadMaintenanceCategories() {
    const { data, error } = await supabase
      .from("maintenance_categories")
      .select("*")
      .eq("active", true)
      .order("name");

    if (error) {
      console.error(
        "Maintenance categories error:",
        error
      );

      return;
    }

    setCategories(data || []);
  }

  /* =====================================================
     STUDENT COMPLAINTS
  ===================================================== */

  async function loadComplaints(
    studentUuid
  ) {
    if (!studentUuid) {
      setComplaints([]);
      setMaintenanceCount(0);
      return;
    }

    const { data, error } = await supabase
      .from("complaints")
      .select(`
        id,
        title,
        description,
        status,
        priority,
        ai_summary,
        created_at,
        updated_at,
        category:maintenance_categories (
          id,
          name,
          requires_ac
        ),
        room:rooms (
          id,
          room_number
        )
      `)
      .eq("student_id", studentUuid)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Complaints error:",
        error
      );

      setComplaints([]);
      return;
    }

    const complaintData = data || [];

    setComplaints(complaintData);

    const activeStatuses = [
      "pending",
      "in_progress",
    ];

    setMaintenanceCount(
      complaintData.filter(
        (complaint) =>
          activeStatuses.includes(
            complaint.status
          )
      ).length
    );
  }

  async function refreshMaintenance() {
    if (!studentData?.student?.id) {
      return;
    }

    await loadComplaints(
      studentData.student.id
    );
  }

  /* =====================================================
     INITIALIZATION
  ===================================================== */

  useEffect(() => {
    loadMaintenanceCategories();
  }, []);

  useEffect(() => {
    if (studentData?.student?.id) {
      loadComplaints(
        studentData.student.id
      );
    } else {
      setComplaints([]);
      setMaintenanceCount(0);
    }
  }, [studentData]);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!mounted) return;

      setSession(session);

      if (session?.user) {
        await loadProfile(
          session.user.id
        );
      }

      setLoading(false);
    }

    initialize();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (!mounted) return;

          setSession(session);

          if (session?.user) {
            await loadProfile(
              session.user.id
            );
          } else {
            setProfile(null);
            setStudentData(null);
            setComplaints([]);
            setMaintenanceCount(0);
          }

          setLoading(false);
        }
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* =====================================================
     LOGOUT
  ===================================================== */

  async function logout() {
    await supabase.auth.signOut();

    setActivePage("dashboard");
    setProfile(null);
    setStudentData(null);
    setComplaints([]);
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          K
        </div>

        <p>
          Loading KIIT Hostel Hub...
        </p>
      </div>
    );
  }

  /* =====================================================
     NOT LOGGED IN
  ===================================================== */

  if (!session) {
    return <AuthScreen />;
  }

  /* =====================================================
     REAL ROLE ROUTING
  ===================================================== */

  if (profile?.role === "hostel_admin") {
    return (
      <HostelAdminDashboard
        profile={profile}
        onLogout={logout}
      />
    );
  }

  /* =====================================================
     STUDENT PAGES
  ===================================================== */

  function renderPage() {
    if (activePage === "dashboard") {
      return (
        <Dashboard
          profile={profile}
          studentData={studentData}
          maintenanceCount={
            maintenanceCount
          }
        />
      );
    }

    if (activePage === "profile") {
      return (
        <ProfilePage
          profile={profile}
          studentData={studentData}
        />
      );
    }

    if (activePage === "maintenance") {
      return (
        <MaintenancePage
          studentData={studentData}
          complaints={complaints}
          categories={categories}
          onRefresh={
            refreshMaintenance
          }
        />
      );
    }

    if (activePage === "mess") {
      return (
        <PlaceholderPage
          title="Mess"
          icon="🍽"
          description="View meals, rate food and submit anonymous mess feedback."
        />
      );
    }

    if (activePage === "lost") {
      return (
        <PlaceholderPage
          title="Lost & Found"
          icon="🔎"
          description="Report lost items and discover belongings reported as found."
        />
      );
    }

    if (activePage === "travel") {
      return (
        <PlaceholderPage
          title="Travel"
          icon="✈"
          description="Compare flights, trains and ride options."
        />
      );
    }

    if (activePage === "assistant") {
      return (
        <PlaceholderPage
          title="AI Hostel Assistant"
          icon="✦"
          description="Your intelligent assistant for hostel services and information."
        />
      );
    }

    return null;
  }

  /* =====================================================
     STUDENT PORTAL
  ===================================================== */

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-title">
            KIIT Hostel Hub
          </div>

          <div className="topbar-right">
            <div className="user-mini">
              <div className="mini-avatar">
                {(profile?.full_name ||
                  "S")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <strong>
                  {profile?.full_name ||
                    "Student"}
                </strong>

                <span>
                  Student
                </span>
              </div>
            </div>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </header>

        <section className="content">
          {renderPage()}
        </section>
      </main>
    </div>
  );
}

export default App;
