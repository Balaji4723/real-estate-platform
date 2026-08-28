import { useEffect, useMemo, useState } from "react";
import { ToastProvider } from "./context/ToastContext.jsx";
import { useProperties, useMeta } from "./hooks/useProperties.js";
import { useDebouncedValue } from "./hooks/useDebounce.js";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import FilterBar from "./components/FilterBar.jsx";
import PropertyGrid from "./components/PropertyGrid.jsx";
import PropertyModal from "./components/PropertyModal.jsx";
import AddPropertyForm from "./components/AddPropertyForm.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import Footer from "./components/Footer.jsx";
import { Lock } from "lucide-react";

function parsePriceBand(band) {
  if (!band) return { minPrice: undefined, maxPrice: undefined };
  const [min, max] = band.split("-");
  return {
    minPrice: min ? Number(min) : undefined,
    maxPrice: max ? Number(max) : undefined,
  };
}

function AppContent() {
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "paper";
    return window.localStorage.getItem("sitemap-mode") || "paper";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "blueprint") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
    window.localStorage.setItem("sitemap-mode", mode);
  }, [mode]);

  // Admin auth — token stored in sessionStorage (cleared on tab close)
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem("admin_token") || null);
  const [showLogin, setShowLogin] = useState(false);

  function handleLogin(token) {
    setAdminToken(token);
    sessionStorage.setItem("admin_token", token);
  }

  function handleLogout() {
    setAdminToken(null);
    sessionStorage.removeItem("admin_token");
  }

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [priceBand, setPriceBand] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);

  const debouncedSearch = useDebouncedValue(search, 300);
  const { minPrice, maxPrice } = parsePriceBand(priceBand);

  const filters = useMemo(
    () => ({ search: debouncedSearch, location, type, minPrice, maxPrice, bedrooms }),
    [debouncedSearch, location, type, minPrice, maxPrice, bedrooms]
  );

  const { properties, loading, error, refetch } = useProperties(filters);
  const meta = useMeta();

  const hasActiveFilters = Boolean(search || location || type || priceBand || bedrooms);

  function resetFilters() {
    setSearch(""); setLocation(""); setType(""); setPriceBand(""); setBedrooms("");
  }

  return (
    <div key={mode} className="min-h-screen flex flex-col">
      <Navbar
        mode={mode}
        onToggleMode={() => setMode((m) => (m === "paper" ? "blueprint" : "paper"))}
        isAdmin={!!adminToken}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
      />
      <Hero />

      <main className="flex-1 max-w-6xl mx-auto px-5 sm:px-8 w-full">
        <section id="listings" className="pt-14 sm:pt-20">
          <div className="flex items-end justify-between gap-3 mb-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass mb-2">Available now</p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink dark:text-paper">Browse listings</h2>
            </div>
          </div>

          <FilterBar
            search={search} onSearchChange={setSearch}
            location={location} onLocationChange={setLocation} locations={meta.locations}
            type={type} onTypeChange={setType} types={meta.types}
            priceBand={priceBand} onPriceBandChange={setPriceBand}
            bedrooms={bedrooms} onBedroomsChange={setBedrooms}
            onReset={resetFilters} hasActiveFilters={hasActiveFilters}
          />

          <div className="mt-6">
            <PropertyGrid
              properties={properties} loading={loading} error={error}
              onOpen={setSelectedProperty} onReset={resetFilters}
            />
          </div>
        </section>

        <section id="add-property" className="pt-20 sm:pt-28 pb-20">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass mb-2">New sheet</p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink dark:text-paper mb-6">List a property</h2>

          {adminToken ? (
            <AddPropertyForm onCreated={refetch} token={adminToken} />
          ) : (
            <div className="border border-dashed border-ink/20 dark:border-chalk/25 p-10 text-center">
              <Lock size={24} className="mx-auto text-brass mb-3" />
              <p className="font-display text-lg text-ink dark:text-paper mb-1">Admin access required</p>
              <p className="text-sm text-ink/60 dark:text-paper/60 mb-5">Login to add or manage listings.</p>
              <button
                onClick={() => setShowLogin(true)}
                className="bg-brass hover:bg-brass-light text-navy-deep font-medium px-5 py-2.5 transition-colors"
              >
                Login as Admin
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <PropertyModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onDeleted={() => { refetch(); }}
        token={adminToken}
        onLoginNeeded={() => setShowLogin(true)}
      />

      {showLogin && (
        <AdminLogin onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
