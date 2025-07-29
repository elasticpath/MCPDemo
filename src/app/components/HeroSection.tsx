import React from "react";

/**
 * HeroSection – prominent marketing copy placed above the product grid.
 * Loosely inspired by https://iso.elasticpath.solutions hero section.
 */
export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-10">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight max-w-4xl">
        <span className="font-extrabold text-red-600">ISO</span>: Global{" "}
        <span className="font-extrabold">standards</span> for trusted goods and
        services
      </h1>

      <p className="text-lg sm:text-xl text-gray-700 max-w-3xl">
        Standards define what great looks like, setting consistent benchmarks
        for businesses and consumers alike — ensuring
        <span className="font-semibold"> reliability</span>,
        <span className="font-semibold"> building trust</span>, and
        <span className="font-semibold"> simplifying choices</span>.
      </p>

      <p className="text-2xl sm:text-3xl font-semibold text-gray-900 max-w-3xl">
        Making lives easier, safer and better.
      </p>
    </section>
  );
}
