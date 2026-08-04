"use client";

import { useState, useEffect } from 'react';
import { Loader2, Play, CheckCircle2, AlertCircle, Activity, Newspaper, ShieldCheck, Cpu, FileText, Image as ImageIcon } from 'lucide-react';

function Button({ children, className = '', disabled, ...props }: any) {
  return <button disabled={disabled} className={`inline-flex items-center justify-center px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors disabled:opacity-50 bg-black text-white hover:bg-[#c41e1a] ${className}`} {...props}>{children}</button>;
}

export default function AdminDashboard() {
  const [topic, setTopic] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [liveStats, setLiveStats] = useState({ total: 0, breaking: 0 });

  async function fetchJobs() {
    const res = await fetch('/api/admin/jobs');
    if (res.ok) {
      const data = await res.json();
      setJobs(data);
    }
  }

  async function fetchLiveStats() {
    try {
      const res = await fetch('/api/live');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.breaking || [];
        setLiveStats({ total: Array.isArray(data) ? data.length : list.length, breaking: list.filter((a:any)=>a.isBreaking).length });
      }
    } catch {}
  }

  useEffect(() => {
    fetchJobs();
    fetchLiveStats();
    const interval = setInterval(() => { fetchJobs(); fetchLiveStats(); }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function triggerPipeline() {
    if (!topic) return;
    setIsRunning(true);
    try {
      const res = await fetch('/api/admin/trigger', {
        method: 'POST',
        body: JSON.stringify({ topic }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        setTopic('');
        fetchJobs();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  }

  const agents = [
    { name: 'Breaking News Agent', icon: Newspaper, desc: 'Scanning RSS, Reddit, X, YouTube, official sites every 60s', status: 'Active • 12s ago' },
    { name: 'Verification Agent', icon: ShieldCheck, desc: 'Cross-checking 3-5 independent trusted sources • Confidence scoring', status: 'Active • verifying 2 stories' },
    { name: 'Research Agent', icon: FileText, desc: 'Building timelines, background, related coverage, licensing', status: 'Idle' },
    { name: 'Writing Agent', icon: FileText, desc: 'Generating SEO title, headline, summary, FAQs, schema JSON-LD', status: 'Idle' },
    { name: 'Editor Agent', icon: FileText, desc: 'Grammar, readability, duplicate & bias detection', status: 'Idle' },
    { name: 'Media Agent', icon: ImageIcon, desc: 'OG images, thumbnails, social graphics', status: 'Active' },
    { name: 'SEO Agent', icon: Cpu, desc: 'Internal links, canonicals, sitemap, RSS, robots', status: 'Active' },
  ];

  return (
    <div className="bg-[#fefcf8] min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-[1400px]">
        <div className="border-b-[4px] border-black pb-6 mb-8 flex flex-wrap justify-between gap-4 items-end">
          <div>
            <h1 className="text-[32px] md:text-[48px] font-black tracking-tighter uppercase leading-none">AI Control Room</h1>
            <p className="font-serif text-[16px] opacity-70 mt-2 max-w-2xl">Orchestrate the 7 autonomous agents that power DayToNightNews. Every minute, the pipeline discovers, verifies, researches, writes, edits, enriches, and publishes.</p>
          </div>
          <div className="flex gap-2 text-[11px] font-black tracking-widest uppercase">
            <span className="bg-[#c41e1a] text-white px-3 py-1.5">7 AGENTS ONLINE</span>
            <span className="bg-black text-white px-3 py-1.5">{liveStats.total} LIVE STORIES</span>
            <span className="border border-black px-3 py-1.5">{liveStats.breaking} BREAKING</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="border-2 border-black bg-white p-5">
              <h2 className="font-black uppercase tracking-widest text-[12px] border-b-2 border-black pb-2 mb-4 flex items-center gap-2"><Play className="h-4 w-4" />Manual Trigger</h2>
              <label className="text-[11px] font-bold tracking-widest uppercase opacity-60">Story Topic / Keyword / URL</label>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Quantum Computing Breakthrough 2025" className="w-full mt-2 border border-black/20 px-3 py-2.5 text-sm font-serif bg-[#fffefb] focus:outline-none focus:border-black" />
              <p className="text-[11px] opacity-50 mt-2 font-serif">Agent will discover, verify against 5 sources, require corroboration, flag uncertain for review.</p>
              <Button onClick={triggerPipeline} disabled={isRunning || !topic} className="w-full mt-4">
                {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Start Full Pipeline (Discover → Verify → Research → Write → Edit → Publish)
              </Button>
              <div className="mt-4 p-3 bg-[#f6f1e8] text-[11px] font-serif">
                <strong>Core Principles:</strong> Never fabricate facts. Attribute claims. Prefer official. Require corroboration. Flag uncertain for human review.
              </div>
            </div>

            <div className="border border-black/10 bg-[#fffefb] p-5">
              <h3 className="font-black uppercase tracking-widest text-xs mb-4">Agent Status Board</h3>
              <div className="space-y-4">
                {agents.map((a, i) => (
                  <div key={i} className="flex gap-3">
                    <a.icon className="h-5 w-5 mt-0.5 text-[#c41e1a] shrink-0" />
                    <div>
                      <div className="font-bold text-[13px] leading-tight">{a.name}</div>
                      <div className="text-[11px] opacity-60 font-serif leading-snug mt-1">{a.desc}</div>
                      <div className="text-[10px] font-bold tracking-widest uppercase mt-1 opacity-50">{a.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black text-white p-5">
              <h4 className="font-black uppercase tracking-widest text-xs mb-3">Automation Workflow (n8n)</h4>
              <ol className="text-[12px] space-y-2 font-mono">
                <li>1. Discover → RSS + Reddit + YouTube + X</li>
                <li>2. Verify → 3-5 sources + confidence score</li>
                <li>3. Research → Timeline + background</li>
                <li>4. Write → SEO + schema.org</li>
                <li>5. Edit → Bias + duplicate check</li>
                <li>6. Media → OG + thumbnails</li>
                <li>7. Publish → DB + CDN</li>
                <li>8. Notify → Push + Email</li>
                <li>9. Social → X + LinkedIn</li>
                <li>10. Analytics → Track views</li>
              </ol>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="border-2 border-black bg-white">
              <div className="border-b border-black/10 p-4 flex items-center justify-between">
                <h2 className="font-black uppercase tracking-widest text-[13px] flex items-center gap-2"><Activity className="h-4 w-4" /> Pipeline Job Monitor — Real Time</h2>
                <span className="text-[10px] bg-black text-white px-2 py-1 font-bold tracking-widest">{jobs.length} JOBS</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="bg-[#f6f1e8] border-b border-black/10 text-left uppercase tracking-widest text-[10px] font-black">
                      <th className="px-4 py-3">Job ID</th>
                      <th className="px-4 py-3">Agent</th>
                      <th className="px-4 py-3">Input / Topic</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Completed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 font-serif">
                    {jobs.map((job, i) => (
                      <tr key={i} className="hover:bg-[#fffefb]">
                        <td className="px-4 py-3 font-mono text-[11px]">{job.id.slice(0, 12)}…</td>
                        <td className="px-4 py-3 font-bold uppercase text-[11px] tracking-wide">{job.agentType}</td>
                        <td className="px-4 py-3 max-w-[200px] truncate opacity-70">{JSON.stringify(job.inputData)?.slice(0, 80)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black tracking-widest uppercase ${job.status === 'completed' ? 'bg-black text-white' : job.status === 'failed' ? 'bg-[#c41e1a] text-white' : 'bg-[#f6f1e8] border border-black/10'}`}>
                            {job.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
                            {job.status === 'failed' && <AlertCircle className="h-3 w-3" />}
                            {job.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 opacity-60">{job.completedAt ? new Date(job.completedAt).toLocaleTimeString() : '…'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {jobs.length === 0 && <div className="text-center py-16 font-serif opacity-60">No active AI jobs — trigger a story to see the 7-agent pipeline in action.</div>}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-bold uppercase tracking-widest">
              <div className="border border-black p-4 bg-[#fffefb]"><div className="opacity-50">Lighthouse Target</div><div className="text-2xl font-black mt-1">&gt;95</div></div>
              <div className="border border-black p-4 bg-[#fffefb]"><div className="opacity-50">Publish Latency</div><div className="text-2xl font-black mt-1">&lt;60s</div></div>
              <div className="border border-black p-4 bg-[#fffefb]"><div className="opacity-50">Verification Depth</div><div className="text-2xl font-black mt-1">5 Sources</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
