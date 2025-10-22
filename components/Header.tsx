"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background-card/80 backdrop-blur-lg border-b border-primary/20 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-glow">
              <span className="text-2xl font-bold text-black">A</span>
            </div>
            <span className="text-xl font-bold gradient-text">AetherCrown98</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-accent transition-colors duration-300">
              Home
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-accent transition-colors duration-300">
              Dashboard
            </Link>
            <Link href="/clones" className="text-gray-300 hover:text-accent transition-colors duration-300">
              Clones
            </Link>
            <Link href="/tasks" className="text-gray-300 hover:text-accent transition-colors duration-300">
              Tasks
            </Link>
            <Link href="/payments" className="text-gray-300 hover:text-accent transition-colors duration-300">
              Payments
            </Link>
            <Link href="/analytics" className="text-gray-300 hover:text-accent transition-colors duration-300">
              Analytics
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="btn-accent">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-accent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-accent transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-accent transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/clones"
                className="text-gray-300 hover:text-accent transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Clones
              </Link>
              <Link
                href="/tasks"
                className="text-gray-300 hover:text-accent transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Tasks
              </Link>
              <Link
                href="/payments"
                className="text-gray-300 hover:text-accent transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Payments
              </Link>
              <Link
                href="/analytics"
                className="text-gray-300 hover:text-accent transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Analytics
              </Link>
              <button className="btn-accent w-full">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
