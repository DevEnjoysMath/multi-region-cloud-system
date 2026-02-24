import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  area: string;
  etaMins: number;
  price: "€" | "€€" | "€€€";
  rating: number; // 0-5
  blurb: string;
  tags: string[];
  image: string;
};

/**
 * RestaurantsPage
 * Lets the user pick from 6 restaurants (with search + cuisine filter) and routes to /menu.
 * (Later: use /menu/:id or store selected restaurant in state/context.)
 */
export function RestaurantsPage() {
  const navigate = useNavigate();

  const restaurants: Restaurant[] = [
    {
      id: "luna",
      name: "Luna Pasta Bar",
      cuisine: "Italian",
      area: "Dublin 2",
      etaMins: 25,
      price: "€€",
      rating: 4.6,
      blurb: "Fresh pasta, small plates, and a great wine list.",
      tags: ["Pasta", "Wine", "Date night"],
      image:
        "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: "saffron",
      name: "Saffron House",
      cuisine: "Indian",
      area: "Ranelagh",
      etaMins: 35,
      price: "€€",
      rating: 4.5,
      blurb: "Big flavours: tandoor specials, curries, and naan.",
      tags: ["Spicy", "Tandoor", "Comfort"],
      image:
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: "kyoto",
      name: "Kyoto Kitchen",
      cuisine: "Japanese",
      area: "Temple Bar",
      etaMins: 30,
      price: "€€€",
      rating: 4.7,
      blurb: "Sushi, ramen, and izakaya-style bites done properly.",
      tags: ["Sushi", "Ramen", "Izakaya"],
      image:
        "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: "camino",
      name: "El Camino",
      cuisine: "Mexican",
      area: "Smithfield",
      etaMins: 20,
      price: "€€",
      rating: 4.4,
      blurb: "Tacos, burritos, nachos — fast, loud, and tasty.",
      tags: ["Tacos", "Burritos", "Street food"],
      image:
        "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: "greenbowl",
      name: "Green Bowl",
      cuisine: "Healthy",
      area: "Grand Canal",
      etaMins: 18,
      price: "€€",
      rating: 4.3,
      blurb: "Protein bowls, salads, and smoothies — quick & clean.",
      tags: ["Bowls", "Salads", "High-protein"],
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: "forge",
      name: "Burger Forge",
      cuisine: "American",
      area: "Dublin 1",
      etaMins: 22,
      price: "€",
      rating: 4.2,
      blurb: "Smash burgers, crispy fries, and proper shakes.",
      tags: ["Burgers", "Fries", "Shakes"],
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=60",
    },
  ];

  const cuisines = useMemo(() => {
    const unique = Array.from(new Set(restaurants.map((r) => r.cuisine)));
    return ["All", ...unique];
  }, [restaurants]);

  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return restaurants
      .filter((r) => (cuisine === "All" ? true : r.cuisine === cuisine))
      .filter((r) => {
        if (!q) return true;
        return (
          r.name.toLowerCase().includes(q) ||
          r.area.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
        );
      });
  }, [restaurants, query, cuisine]);

  const goToMenu = (r: Restaurant) => {
    // simplest: go to /menu (later: /menu/:id)
    navigate("/menu");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header + Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Choose a restaurant
            </h1>
            <p className="text-slate-600 mt-2">
              Pick one to view the menu and start your order.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, area, or tag…"
                className="w-full rounded-2xl bg-white px-4 py-3 shadow-md outline-none
                           border border-slate-200 focus:ring-2 focus:ring-slate-300"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="rounded-2xl bg-white px-4 py-3 shadow-md outline-none
                         border border-slate-200 focus:ring-2 focus:ring-slate-300"
            >
              {cuisines.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => goToMenu(r)}
              className="group text-left rounded-3xl bg-white shadow-md hover:shadow-xl transition
                         hover:-translate-y-0.5 active:translate-y-0
                         border border-slate-100 overflow-hidden"
            >
              {/* Image */}
              <div className="h-40 w-full overflow-hidden bg-slate-100">
                <img
                  src={r.image}
                  alt={r.name}
                  className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {r.name}
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      {r.cuisine} • {r.area}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-slate-900 text-white text-xs px-3 py-1">
                    {r.price}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 text-slate-700 text-xs px-3 py-1">
                    ⭐ {r.rating.toFixed(1)}
                  </span>
                  <span className="rounded-full bg-slate-100 text-slate-700 text-xs px-3 py-1">
                    ⏱ {r.etaMins} mins
                  </span>
                </div>

                <p className="text-slate-700 mt-4 leading-relaxed">{r.blurb}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {r.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-slate-100 text-slate-700 text-xs px-3 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">
                    View menu →
                  </span>
                  <span className="text-sm text-slate-500 group-hover:text-slate-700">
                    Tap to continue
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="mt-10 rounded-3xl bg-white p-6 shadow-md border border-slate-100">
            <p className="text-slate-900 font-semibold">No results</p>
            <p className="text-slate-600 mt-1">
              Try a different search term or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCuisine("All");
              }}
              className="mt-4 rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}