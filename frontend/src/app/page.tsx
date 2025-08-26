'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Code, 
  Database, 
  Shield, 
  Zap, 
  Globe,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);

  // Backend-Verbindung testen
  const testBackendConnection = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://project-foundation-production.up.railway.app';
      const response = await fetch(`${apiUrl}/health`);
      const data = await response.json();
      console.log('✅ Backend verbunden:', data);
      alert(`✅ Backend verbunden!\nStatus: ${data.status}\nZeit: ${data.timestamp}`);
    } catch (error) {
      console.error('❌ Backend-Verbindung fehlgeschlagen:', error);
      alert('❌ Backend-Verbindung fehlgeschlagen!\nFehler: ' + error.message);
    }
  };

  const features = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Schnelle Entwicklung',
      description: 'Moderne Tech-Stack für schnelle und skalierbare Anwendungen',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'TypeScript First',
      description: 'Vollständige TypeScript-Unterstützung für bessere Code-Qualität',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'Moderne Datenbank',
      description: 'Prisma ORM mit PostgreSQL für robuste Datenverwaltung',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Sicherheit',
      description: 'JWT-Authentifizierung und Rollen-basierte Zugriffskontrolle',
      color: 'from-red-500 to-orange-500'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Performance',
      description: 'Next.js 14 mit App Router und Server Components',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Multi-Tenant',
      description: 'Unterstützung für mehrere Organisationen und Workspaces',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const benefits = [
    'Vollständige TypeScript-Unterstützung',
    'Moderne API mit Fastify',
    'Responsive UI mit Tailwind CSS',
    'Authentifizierung & Autorisierung',
    'Multi-Tenant-Architektur',
    'Swagger API-Dokumentation',
    'Docker-Containerisierung',
    'CI/CD mit GitHub Actions'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8"
            >
              <Star className="w-4 h-4 mr-2" />
              Universal Foundation für alle Projekte
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Project Foundation
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Eine moderne, skalierbare Grundlage für alle Ihre Projekte. 
              Mit TypeScript, Fastify, Next.js und Supabase.
            </p>
            
            {/* Backend-Test Button */}
            <div className="mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={testBackendConnection}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mr-4"
              >
                Backend-Verbindung testen
              </motion.button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-4"
              >
                Jetzt starten
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline text-lg px-8 py-4"
              >
                Dokumentation
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Warum Project Foundation?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Eine durchdachte Architektur, die Ihnen Zeit spart und 
              professionelle Ergebnisse liefert.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="card hover:shadow-large transition-all duration-300 h-full">
                  <div className="card-content">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Alle Vorteile auf einen Blick
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Unsere Foundation bietet alles, was Sie für moderne 
                Webanwendungen benötigen.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="card p-8 bg-white">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Code className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">100%</div>
                      <div className="text-sm text-gray-600">TypeScript</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">10x</div>
                      <div className="text-sm text-gray-600">Schneller</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">Enterprise</div>
                      <div className="text-sm text-gray-600">Ready</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Bereit für den nächsten Schritt?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Starten Sie noch heute mit Project Foundation und 
              beschleunigen Sie Ihre Entwicklung.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
              >
                Projekt starten
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
              >
                Mehr erfahren
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Project Foundation</h3>
              <p className="text-gray-400">
                Eine moderne Grundlage für alle Ihre Projekte.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Technologien
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>TypeScript</li>
                <li>Fastify</li>
                <li>Next.js 14</li>
                <li>Supabase</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Features
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>Authentication</li>
                <li>RBAC</li>
                <li>Multi-Tenant</li>
                <li>API Docs</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Support
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>Dokumentation</li>
                <li>GitHub</li>
                <li>Issues</li>
                <li>Community</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Project Foundation. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
