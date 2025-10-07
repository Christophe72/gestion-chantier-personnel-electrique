"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-4xl font-extrabold text-blue-700 text-center mb-2 drop-shadow">
          Gestion Chantier Personnel Électrique
        </h1>
        <p className="text-lg text-gray-700 text-center mb-8">
          Bienvenue ! Gérez vos clients, électriciens, interventions et factures
          en toute simplicité.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/clients" className="group">
            <div className="bg-blue-100 hover:bg-blue-200 transition rounded-xl p-6 flex flex-col items-center shadow cursor-pointer">
              <svg
                className="w-10 h-10 mb-2 text-blue-600 group-hover:text-blue-800"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A4 4 0 017 16h10a4 4 0 011.879.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="font-semibold text-blue-700 group-hover:text-blue-900">
                Clients
              </span>
            </div>
          </Link>
          <Link href="/electricians" className="group">
            <div className="bg-yellow-100 hover:bg-yellow-200 transition rounded-xl p-6 flex flex-col items-center shadow cursor-pointer">
              <svg
                className="w-10 h-10 mb-2 text-yellow-600 group-hover:text-yellow-800"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m4 0h-1v-4h-1m-4 0h-1v-4h-1"
                />
              </svg>
              <span className="font-semibold text-yellow-700 group-hover:text-yellow-900">
                Électriciens
              </span>
            </div>
          </Link>
          <Link href="/interventions" className="group">
            <div className="bg-green-100 hover:bg-green-200 transition rounded-xl p-6 flex flex-col items-center shadow cursor-pointer">
              <svg
                className="w-10 h-10 mb-2 text-green-600 group-hover:text-green-800"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6"
                />
              </svg>
              <span className="font-semibold text-green-700 group-hover:text-green-900">
                Interventions
              </span>
            </div>
          </Link>
          <Link href="/invoices" className="group">
            <div className="bg-purple-100 hover:bg-purple-200 transition rounded-xl p-6 flex flex-col items-center shadow cursor-pointer">
              <svg
                className="w-10 h-10 mb-2 text-purple-600 group-hover:text-purple-800"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6"
                />
              </svg>
              <span className="font-semibold text-purple-700 group-hover:text-purple-900">
                Factures
              </span>
            </div>
          </Link>
        </div>
        <div className="text-center text-gray-500 text-sm mt-6">
          <span>
            Application Next.js 15, React 19, Prisma &amp; Tailwind CSS
          </span>
        </div>
      </div>
    </div>
  );
}
