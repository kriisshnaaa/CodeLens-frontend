import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UploadBox from "./components/UploadBox";
import FolderTree from "./components/FolderTree";
import CodeViewer from "./components/CodeViewer";
import MyLearnings from "./components/MyLearnings";
import CodeLensLogo from "./components/CodeLensLogo";
import IntroOverlay from "./components/IntroOverlay";
import AuthSuccess from "./pages/AuthSuccess";

import "./styles/theme.css";
import { getCurrentUser, loginWithGoogle, logout } from "./api/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("FILES");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [showIntro, setShowIntro] = useState(
    !sessionStorage.getItem("introPlayed")
  );
  const [showIntroLogo, setShowIntroLogo] = useState(showIntro);

  const introLogoRef = useRef(null);
  const headerLogoRef = useRef(null);
  const [tree, setTree] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [explaining, setExplaining] = useState(false);
  const [avatarError, setAvatarError] = useState(false);


  /* ---------------- AUTH ---------------- */
/* ---------------- AUTH ---------------- */
useEffect(() => {
  const initAuth = async () => {
    // 1️⃣ Check token from redirect URL
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);

      // clean URL (remove ?token=...)
      window.history.replaceState({}, document.title, "/");
    }

    // 2️⃣ Fetch user using JWT
    const user = await getCurrentUser();
    setUser(user);
  };

  initAuth();
}, []);

  

useEffect(() => {
  setAvatarError(false);
}, [user?.id]);


  useLayoutEffect(() => {
    if (!showIntro) return;

    const logo = introLogoRef.current;
    const header = headerLogoRef.current;
    if (!logo || !header) return;

    const startX = window.innerWidth / 2 - 80;
    const startY = window.innerHeight / 2 - 80;
    const target = header.getBoundingClientRect();

    logo.style.left = `${startX}px`;
    logo.style.top = `${startY}px`;

    requestAnimationFrame(() => {
      logo.style.transform = `
        translate(${target.left - startX}px, ${target.top - startY}px)
        scale(0.35)
      `;
      logo.style.opacity = "1";
    });

    setTimeout(() => {
      setShowIntroLogo(false);
      setShowIntro(false);
      sessionStorage.setItem("introPlayed", "true");
    }, 1800);
  }, [showIntro]);

  /* ---------------- HELPERS ---------------- */
  const getProjectName = () => {
    if (!tree || tree.length === 0) return "Untitled Project";
    return tree[0].name;
  };

  const countNodes = (nodes) => {
    let files = 0;
    let folders = 0;

    const walk = (list) => {
      list.forEach((n) => {
        if (n.type === "folder") {
          folders++;
          walk(n.children || []);
        } else {
          files++;
        }
      });
    };

    walk(nodes);
    return { files, folders };
  };

  const stats = tree ? countNodes(tree) : null;

  /* ---------------- FILE READ ---------------- */
  const handleFileClick = async (filePath) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/read-file`, {

        method: "POST",
        credentials:"include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath })
      });

      const data = await res.json();
      setSelectedFile(filePath);
      setCode(data.content);
      setExplanation("");
    } catch (err) {
      console.error("Read file error:", err);
    }
  };

  /* ---------------- AI ---------------- */
  const handleExplain = async () => {
    if (!code) return;

    setExplaining(true);
    setExplanation("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/explain`, {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });

      const data = await res.json();
      setExplanation(data.explanation);
    } catch (err) {
      console.error(err);
    } finally {
      setExplaining(false);
    }
  };

  /* ---------------- SAVE ---------------- */
  const handleSaveLearning = async () => {
    if (!selectedFile || !explanation) return;
    if (!user) return (loginWithGoogle());

    const projectName = selectedFile.split("/")[0];

    await fetch(`${import.meta.env.VITE_API_URL}/save/save`, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        projectName,
        filePath: selectedFile,
        explanation,
        code
      })
    });

    
  };

  /* ---------------- UI ---------------- */
  return (
      <BrowserRouter>
    <Routes>
      {/* 🔐 OAuth success route */}
      <Route
        path="/auth/success"
        element={
          <AuthSuccess setUser={setUser} />
        }
      />

      {/* 🏠 Main App */}
      <Route
        path="/*"
        element={
    <>
      <IntroOverlay show={showIntro} />
      {showIntroLogo && (
        <div
          ref={introLogoRef}
          style={{
            position: "fixed",
            width: 160,
            height: 160,
            zIndex: 9999,
            transition:
              "transform 1.8s cubic-bezier(.22,1,.36,1), opacity 0.3s ease",
            pointerEvents: "none",
            opacity: 1
          }}
        >
          <CodeLensLogo size={160} />
          <div
            style={{
              marginTop: 12,
              textAlign: "center",
              fontSize: 28,
              fontWeight: 1000,
              color: "black"
            }}
          >
            CodeLens
          </div>
        </div>
      )}

      <div
        className={darkMode ? "app dark" : "app"}
        style={{ display: "flex", height: "100vh" }}
      >
        {/* SIDEBAR */}
        <aside
          style={{
            width: 240,
            padding: 16,
            borderRight: "1px solid #e5e7eb",
            background:"f8fafc",  
            display: "flex",
            flexDirection: "column",
            gap: 15
          }}
        >
          <h3>Workspace</h3>

          <button
            onClick={() => setActiveTab("FILES")}
            style={sidebarBtn(activeTab === "FILES")}
          >
            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 7h5l2 3h11v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              Files
            </span>
          </button>

          <button
            onClick={() => setActiveTab("LEARNINGS")}
            style={sidebarBtn(activeTab === "LEARNINGS")}
          >
            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              </svg>
              My Learnings
            </span>
          </button>

         <button
  onClick={() => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  }}
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: darkMode ? "#0f172a" : "#f8fafc",
    cursor: "pointer",
    transition: "all 0.25s ease"
  }}
>
  <span style={{ fontWeight: 500 }}>
    {darkMode ? "Dark Mode" : "Light Mode"}
  </span>

  {/* Toggle */}
  <div
    style={{
      width: 44,
      height: 24,
      borderRadius: 999,
      background: darkMode ? "#2563eb" : "#cbd5f5",
      position: "relative",
      transition: "background 0.25s ease"
    }}
  >
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "#fff",
        position: "absolute",
        top: 2,
        left: darkMode ? 22 : 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "left 0.25s ease"
      }}
    >
      {darkMode ? (
        /* Moon SVG */
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
            fill="#2563eb"
          />
        </svg>
      ) : (
        /* Sun SVG */
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" fill="#f59e0b" />
        </svg>
      )}
    </div>
  </div>
</button>


          <div style={{ marginTop: "auto", padding: 12 }}>
            {!user ? (
              <button
                onClick={loginWithGoogle}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: 16,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease"
                }}
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  style={{ width: 20, height: 20 }}
                />
                <span>Continue with Google</span>
              </button>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "5px 8px",
                  borderRadius: 12,
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb"
                }}
              >
                {user.avatar && !avatarError ? (
<img
  src={user.avatar}
  alt={user.name}
  referrerPolicy="no-referrer"
  crossOrigin="anonymous"
  onError={() => setAvatarError(true)}
  style={{
    width: 30,
    height: 30,
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0
  }}
/>

) : (
  <div
    style={{
      width: 36,
      height: 36,
      borderRadius: "50%",
      background: "#6366f1",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      fontSize: 14,
      flexShrink: 0
    }}
  >
    {user.name?.charAt(0).toUpperCase()}
  </div>
)}

                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    Logged in
                  </div>
                </div>

                <button
                  onClick={logout}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    fontSize: 30,
                    fontWeight: 600
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1 }}>
          <header
            style={{
              height: 64,
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: "1px solid #e5e7eb",
              background: "#fff"
            }}
          >
            <div ref={headerLogoRef}>
              <CodeLensLogo size={28} />
            </div>
            <div>
              <strong>CodeLens</strong>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                See through any codebase. Instantly.
              </div>
              
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
  {/* GitHub */}
  <a
    href="https://github.com/kriisshnaaa"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "#000", display: "flex", alignItems: "center" }}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.11 3.29 9.44 7.86 10.97.58.11.79-.25.79-.56v-2.02c-3.2.7-3.87-1.54-3.87-1.54-.53-1.35-1.3-1.71-1.3-1.71-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.71 5.4-5.29 5.69.42.36.8 1.08.8 2.18v3.23c0 .31.21.68.8.56a11.52 11.52 0 0 0 7.85-10.97C23.5 5.74 18.27.5 12 .5z" />
    </svg>
  </a>

  {/* LinkedIn */}
  <a
    href="https://linkedin.com/in/kriiisshnaaa"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "#0a66c2", display: "flex", alignItems: "center" }}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0zM8 8h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6 5.05 0 5.98 3.32 5.98 7.64V24h-5v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24H8z" />
    </svg>
  </a>
</div>

          </header>

          <section
            style={{
              height: "calc(100vh - 64px)",
              display: "flex",
              gap: 24,
              padding: 24
            }}
          >
            <div style={{ flex: tree ? 2 : 1 }}>
              {activeTab === "FILES" && (
                <>
                  {!tree && <UploadBox onResult={setTree} />}
                  {tree && (
                    <div className="upload-card">
                      <button
                        onClick={() => {
                          setTree(null);
                          setSelectedFile(null);
                        }}
                        style={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          border: "1px solid #e0e0e0",
                          background: "#FFE5E5",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          transition: "all 0.2s ease"
                        }}
                      >
                       ←
                      </button>

                      <h2>{getProjectName()}</h2>
                      <p>
                        {stats.files} files • {stats.folders} folders
                      </p>

                      <div
                        style={{
                          marginTop: 16,
                          maxHeight: 360,
                          overflowY: "auto",
                          paddingRight: 6
                        }}
                      >
                        <FolderTree
                          tree={tree}
                          onFileClick={handleFileClick}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === "LEARNINGS" && <MyLearnings />}
            </div>

            {activeTab === "FILES" && selectedFile && (
              <div
                style={{
                  width: tree ? 500 : 360,
                  height: "100%",
                  display: "flex"
                }}
              >
                <CodeViewer
                  file={selectedFile}
                  code={code}
                  explanation={explanation}
                  explaining={explaining}
                  onExplain={handleExplain}
                  onSave={handleSaveLearning}
                  onAppendExplanation={(text) =>
                    setExplanation((prev) => prev + text)
                  }
                />
              </div>
            )}
          </section>
        </main>
      </div>
    </>
        }
        />
        </Routes>
        </BrowserRouter>
  );
}

/* ---------------- STYLES ---------------- */

const sidebarBtn = (active) => ({
  padding: "12px 14px",
  borderRadius: 10,
  border: active ? "1px solid #2563eb" : "1px solid #e5e7eb",
  textAlign: "left",
  background: active ? "#2563eb" : "#ffffff",
  color: active ? "#ffffff" : "#0f172a",
  cursor: "pointer",
  boxShadow: active
    ? "0 4px 10px rgba(37,99,235,0.25)"
    : "0 1px 3px rgba(0,0,0,0.06)",
  transition: "all 0.2s ease"
});

