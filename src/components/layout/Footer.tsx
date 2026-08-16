import Link from 'next/link';
import NewsletterForm from './NewsletterForm';

export default function Footer() {
  return (
    <footer className="mt-16 border-t-[6px] border-black bg-[#111] text-[#f5f2ec]">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <h2 className="masthead-title text-3xl mb-3">DAY TO NIGHT NEWS</h2>
            <p className="text-sm leading-relaxed opacity-70 max-w-md font-serif">
              The world's fastest AI-assisted newsroom. We discover breaking stories every minute, verify across 5 independent primary sources, and publish with transparent confidence scores. No fabrication. Always attributed.
            </p>
            <div className="mt-6 flex gap-3 text-[10px] tracking-widest uppercase">
              <span className="border border-white/20 px-3 py-1">AI Agents: 7 Active</span>
              <span className="border border-white/20 px-3 py-1">Verified Sources: 2,400+</span>
              <span className="border border-white/20 px-3 py-1">Latency: &lt;60s</span>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold uppercase tracking-widest text-xs mb-4 opacity-90">Sections</h4>
            <ul className="space-y-2 text-sm opacity-60">
              <li>World • U.S. • Politics</li>
              <li>Business • Finance • Crypto</li>
              <li>Technology • AI • Science</li>
              <li>Health • Sports • Culture</li>
              <li>Gaming • Video • Podcasts</li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold uppercase tracking-widest text-xs mb-4 opacity-90">AI Transparency</h4>
            <ul className="space-y-2 text-sm opacity-60">
              <li><Link href="/admin" className="hover:text-white">Agent Dashboard</Link></li>
              <li><a href="#" className="hover:text-white">Verification Method</a></li>
              <li><a href="#" className="hover:text-white">Confidence Scoring</a></li>
              <li><a href="#" className="hover:text-white">Source Reliability</a></li>
              <li><a href="#" className="hover:text-white">Corrections Log</a></li>
            </ul>
          </div>

          <div id="newsletter" className="lg:col-span-3">
            <h4 className="font-bold uppercase tracking-widest text-xs mb-4 opacity-90">Subscribe to the Briefing</h4>
            <p className="text-xs opacity-60 mb-3">Get the top 5 AI-verified stories at 7AM, 12PM, 7PM ET.</p>
            <NewsletterForm />
            <p className="text-[10px] opacity-40 mt-3 tracking-wide">No spam • Unsubscribe anytime • AI will never sell your data</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-[11px] opacity-40 tracking-wide">
          <span>© {new Date().getFullYear()} DayToNightNews • A journalism experiment — building the fastest verified news platform.</span>
          <span className="flex gap-4">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">AI Ethics Charter</a>
            <a href="#">Sitemap</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
