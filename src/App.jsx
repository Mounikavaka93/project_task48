import { useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { LibraryProvider } from "./context/LibraryContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Watch from "./pages/Watch";
import Browse from "./pages/Browse";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyList from "./pages/MyList";
import Account from "./pages/Account";
import Plans from "./pages/Plans";
import NotFound from "./pages/NotFound";
import Entrance from "./components/Entrance";

function ScrollManager() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    const pathChanged = previousPath.current !== location.pathname;
    previousPath.current = location.pathname;
    if (pathChanged || location.pathname !== "/search") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [location.pathname, location.search]);

  return null;
}

function Frame() {
  const location = useLocation();
  const bare = location.pathname === "/login" || location.pathname === "/signup" || location.pathname.startsWith("/watch");

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] font-sans text-[var(--text)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-copper-400 focus:px-4 focus:py-2 focus:text-ink-950"
      >
        Skip to content
      </a>
      {!bare && <Navbar />}
      {location.pathname === "/" && <Entrance />}
      <main id="main" className="flex-1">
        <div key={location.pathname} className="page-enter">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/title/:id" element={<Details />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/list" element={<MyList />} />
            <Route path="/account" element={<Account />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      {!bare && <Footer />}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LibraryProvider>
          <BrowserRouter>
            <ScrollManager />
            <Frame />
          </BrowserRouter>
        </LibraryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
