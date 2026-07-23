"use client";

import { useState } from "react";

export default function Home() {
  const [mood, setMood] = useState("");
  const [category, setCategory] = useState("All");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!mood) return;
    setLoading(true);
    try {
      // Pass both mood and selected category to the backend
      const res = await fetch(
        `http://127.0.0.1:8000/api/recommend?mood=${encodeURIComponent(mood)}&category=${encodeURIComponent(category)}`
      );
      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Failed to fetch recommendations", error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-neutral-50 p-8 font-sans text-neutral-900">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4 mt-12">
          <h1 className="text-4xl font-bold tracking-tight">
            UI Design System Matcher
          </h1>
          <p className="text-lg text-neutral-600">
            Select an industry category and enter a project mood to get exact UI matches.
          </p>
        </div>

        {/* Search & Category Filter Section */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto bg-white p-2 rounded-2xl border border-neutral-200 shadow-sm">
          {/* Industry Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 rounded-xl bg-neutral-100 text-neutral-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer"
          >
            <option value="All">All Industries</option>
            <option value="Corporate & Finance">Corporate & Finance</option>
            <option value="Healthcare & Medical">Healthcare & Medical</option>
            <option value="E-Commerce & Retail">E-Commerce & Retail</option>
            <option value="Gaming & Cyberpunk">Gaming & Entertainment</option>
            <option value="Tech & SaaS Startup">Tech & SaaS</option>
            <option value="Food & Hospitality">Food & Hospitality</option>
            <option value="Education & Kids">Education & Learning</option>
          </select>

          {/* Mood Input Box */}
          <input
            type="text"
            className="flex-1 p-3 rounded-xl border-none text-base focus:outline-none"
            placeholder="e.g., minimalist dark mode dashboard..."
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />

          {/* Generate Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-neutral-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? "Searching..." : "Generate"}
          </button>
        </div>

        {/* Results Section */}
        <div className="space-y-12 mt-12">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100"
            >
              <h2 className="text-2xl font-bold mb-6 capitalize">
                {rec.mood_industry}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Colors */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-neutral-500 uppercase tracking-wider text-sm">
                    Color Palette
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { name: "Primary", hex: rec.primary_color },
                      { name: "Secondary", hex: rec.secondary_color },
                      { name: "Background", hex: rec.background_color },
                      { name: "Text", hex: rec.text_color },
                      { name: "Accent", hex: rec.accent_color },
                    ].map((color) => (
                      <div key={color.name} className="space-y-2">
                        <div
                          className="w-16 h-16 rounded-full shadow-inner border border-black/10"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="text-center">
                          <p className="text-xs font-medium">{color.name}</p>
                          <p className="text-xs text-neutral-500">{color.hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-neutral-500 uppercase tracking-wider text-sm">
                    Typography Pairing
                  </h3>
                  <div className="p-6 rounded-xl bg-neutral-50 space-y-4 border border-neutral-100">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Heading Font</p>
                      <p
                        className="text-2xl font-bold"
                        style={{ fontFamily: rec.heading_font }}
                      >
                        {rec.heading_font}
                      </p>
                    </div>
                    <div className="h-px bg-neutral-200 w-full" />
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Body Font</p>
                      <p
                        className="text-lg"
                        style={{ fontFamily: rec.body_font }}
                      >
                        {rec.body_font}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}