'use client';

import Link from "next/link";
import Hero3DScene from "@/components/Hero3DScene";
import { useEffect, useState } from "react";
import {
  MessageSquare,
  BarChart3,
  RefreshCw,
  Upload,
  Share2,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Database,
  Cpu
} from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f1c] overflow-hidden relative">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-grid opacity-50" />

      {/* Gradient Orbs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[150px] animate-pulse-glow" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="fixed top-1/2 right-1/3 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/50 rounded-xl blur-lg group-hover:bg-cyan-400/60 transition-all" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Gen<span className="text-cyan-400">UI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-400 hover:text-white transition-colors text-sm">Features</a>
            <a href="#demo" className="text-slate-400 hover:text-white transition-colors text-sm">Demo</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Docs</a>
          </div>

          <Link
            href="/chat"
            className="group px-5 py-2.5 glass-sm text-white font-medium rounded-xl transition-all hover:bg-white/10 flex items-center gap-2"
          >
            <span className="text-sm">Launch App</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </nav>

        {/* Hero Section */}
        <main className="px-6 lg:px-12 pt-16 lg:pt-24 pb-20 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass-sm mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-sm text-slate-300">Powered by AI • 30+ Components</span>
              </div>

              {/* Main Heading */}
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
              >
                <span className="text-white">Build Analytics</span>
                <br />
                <span className="text-gradient-cyan">Dashboards</span>
                <br />
                <span className="text-white">in Seconds</span>
              </h1>

              {/* Subtitle */}
              <p
                className={`text-base lg:text-lg text-slate-400 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
              >
                Describe your dashboard in plain English. GenUI generates beautiful,
                interactive data visualizations with charts, tables, and KPIs.
                <span className="text-cyan-400 font-medium"> No coding required.</span>
              </p>

              {/* CTA Buttons */}
              <div
                className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
              >
                <Link
                  href="/chat"
                  className="group btn-primary px-8 py-4 text-white font-semibold rounded-xl flex items-center justify-center gap-3"
                >
                  <Zap className="w-5 h-5" />
                  Start Building
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#demo"
                  className="btn-ghost px-8 py-4 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  Watch Demo
                </a>
              </div>

              {/* Stats */}
              <div
                className={`flex gap-8 lg:gap-12 mt-12 justify-center lg:justify-start transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
              >
                <StatItem value="30+" label="Components" />
                <StatItem value="<3s" label="Generation" />
                <StatItem value="100%" label="No-Code" />
              </div>
            </div>

            {/* Right - 3D Scene */}
            <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
              <Hero3DScene />
            </div>
          </div>
        </main>

        {/* Trusted By Section */}
        <section className="px-6 lg:px-12 py-16 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-sm text-slate-500 mb-8">Trusted by data teams at</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-40">
              {['Startup', 'Analytics Co', 'Data Labs', 'Insight AI', 'Metric'].map((name) => (
                <span key={name} className="text-lg font-semibold text-slate-400">{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 lg:px-12 py-24 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need for{' '}
              <span className="text-gradient-cyan">powerful analytics</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              From natural language input to stunning visualizations, GenUI provides all the tools you need to build professional dashboards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6" />}
              title="Natural Language"
              description="Just describe what you want. Our AI understands context, intent, and generates the perfect layout."
              color="cyan"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Rich Visualizations"
              description="Line charts, bar graphs, pie charts, heatmaps, gauges, KPIs, and 25+ more component types."
              color="blue"
            />
            <FeatureCard
              icon={<RefreshCw className="w-6 h-6" />}
              title="Iterative Refinement"
              description="Not perfect? Just say 'make it bigger' or 'change the colors'. Refine until it's right."
              color="purple"
            />
            <FeatureCard
              icon={<Upload className="w-6 h-6" />}
              title="Upload Your Data"
              description="Drop in a CSV or JSON file. We'll auto-detect columns and suggest the best visualizations."
              color="emerald"
            />
            <FeatureCard
              icon={<Share2 className="w-6 h-6" />}
              title="Save & Share"
              description="Save your dashboards locally. Generate shareable links for your team to view."
              color="amber"
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6" />}
              title="Component Library"
              description="Access 30+ pre-built components. Mix and match to create your perfect dashboard."
              color="rose"
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 lg:px-12 py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />
          <div className="max-w-6xl mx-auto relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How it works
              </h2>
              <p className="text-slate-400">Three simple steps to your dashboard</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <StepCard
                step="01"
                icon={<MessageSquare className="w-8 h-8" />}
                title="Describe"
                description="Tell GenUI what kind of dashboard you need in plain English."
              />
              <StepCard
                step="02"
                icon={<Cpu className="w-8 h-8" />}
                title="Generate"
                description="Our AI instantly creates a fully functional dashboard with real components."
              />
              <StepCard
                step="03"
                icon={<TrendingUp className="w-8 h-8" />}
                title="Refine & Deploy"
                description="Tweak the design with natural language and share with your team."
              />
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="px-6 lg:px-12 py-24 max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden glass p-8 lg:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-purple-600/10" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-slate-500 text-sm">genui.app/chat</span>
              </div>

              {/* Mock Chat */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-end">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-5 py-3 rounded-2xl rounded-tr-md max-w-md text-sm">
                    Create a sales dashboard with revenue trend and top products
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="glass-sm text-white px-5 py-3 rounded-2xl rounded-tl-md max-w-md flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm">Here's your sales dashboard with a line chart for revenue trends and a bar chart for top products. I've also added key metrics at the top...</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 btn-primary px-8 py-4 text-white font-semibold rounded-xl"
                >
                  Try it yourself
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 lg:px-12 py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to build your first dashboard?
            </h2>
            <p className="text-slate-400 mb-10">
              Join thousands of data teams using GenUI to create stunning analytics in seconds.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-3 btn-primary px-10 py-5 text-white font-semibold rounded-2xl text-lg"
            >
              <Zap className="w-6 h-6" />
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 lg:px-12 py-12 border-t border-white/5">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-400">GenUI Analytics Dashboard Builder</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
            </div>
            <p className="text-slate-600 text-sm">
              Built with Next.js, React & AI
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center lg:text-left">
      <div className="text-2xl md:text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-slate-500 text-sm">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'cyan' | 'blue' | 'purple' | 'emerald' | 'amber' | 'rose';
}) {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
    rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/20 text-rose-400',
  };

  return (
    <div className={`group relative p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color].split(' ').slice(0, 2).join(' ')} border ${colorClasses[color].split(' ')[2]} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] card-hover`}>
      <div className={`mb-4 ${colorClasses[color].split(' ')[3]}`}>{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, icon, title, description }: {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative p-6 rounded-2xl glass border border-white/5 text-center">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-xs font-bold text-white">
        {step}
      </div>
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4 mt-2 text-cyan-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}
