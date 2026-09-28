import { useState, useRef } from "react"
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "motion/react"
import { Link } from "react-router-dom"
import { List, X, GithubLogo, SquaresFour, Users, CheckCircle, WarningCircle, Calendar, Plus, User, ChartLineUp, EnvelopeSimple, Sun, Moon, Monitor, Kanban } from "@phosphor-icons/react"
import { useTheme } from "@/app/theme-provider"
import { BlurText } from "@/components/reactbits/BlurText"
import { Magnet } from "@/components/reactbits/Magnet"
import { SpotlightCard } from "@/components/reactbits/SpotlightCard"
import { CountUp } from "@/components/reactbits/CountUp"
import { Aurora } from "@/components/reactbits/Aurora"
// import { AnimatedList } from "@/components/reactbits/AnimatedList"

// ---- MOCK DATA & MICRO-COMPONENTS ----
const MockIssueCard = ({ title, status, priority, id }: any) => (
  <div className="bg-surface p-4 rounded-[16px] border border-border shadow-sm mb-3">
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs text-text-muted font-mono">{id}</span>
      {status === 'Open' && <span className="bg-status-open/10 text-status-open text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide uppercase">Open</span>}
      {status === 'In Progress' && <span className="bg-status-in-progress/10 text-status-in-progress text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide uppercase">In Progress</span>}
      {status === 'Closed' && <span className="bg-status-closed/10 text-status-closed text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide uppercase">Closed</span>}
    </div>
    <h4 className="text-sm font-medium text-text mb-3">{title}</h4>
    <div className="flex items-center gap-2 text-xs text-text-muted">
      {priority === 'High' && <span className="flex items-center gap-1 text-red-500"><WarningCircle size={14}/> High</span>}
      <span className="flex items-center gap-1"><Calendar size={14}/> Today</span>
    </div>
  </div>
)

const MockKanban = () => (
  <div className="flex gap-6 p-6 bg-surface-elevated rounded-[16px] border border-border shadow-2xl h-[500px] overflow-hidden">
    <div className="flex-1 flex flex-col">
      <h3 className="font-semibold text-text mb-4 text-sm flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-status-open" />
        Open
      </h3>
      <MockIssueCard id="TRK-14" title="Fix authentication bug" status="Open" priority="High" />
      <MockIssueCard id="TRK-15" title="Update user profile UI" status="Open" />
      <MockIssueCard id="TRK-18" title="Add empty states" status="Open" />
    </div>
    <div className="flex-1 flex flex-col">
      <h3 className="font-semibold text-text mb-4 text-sm flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-status-in-progress" />
        In Progress
      </h3>
      <MockIssueCard id="TRK-12" title="Implement new dashboard" status="In Progress" priority="High" />
      <MockIssueCard id="TRK-13" title="Stripe integration" status="In Progress" />
    </div>
    <div className="flex-1 flex flex-col opacity-60">
      <h3 className="font-semibold text-text mb-4 text-sm flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-status-closed" />
        Closed
      </h3>
      <MockIssueCard id="TRK-10" title="Setup repository" status="Closed" />
      <MockIssueCard id="TRK-11" title="Initial deployment" status="Closed" />
    </div>
  </div>
)

// ---- NAV ----
const Nav = ({ onContactClick }: { onContactClick: () => void }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const { scrollY } = useScroll()
  const { theme, setTheme } = useTheme()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20)
  })

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div
          className={`relative flex items-center justify-between h-16 px-6 transition-all duration-300 ${
            scrolled
              ? "bg-surface-elevated/70 backdrop-blur-md border border-border shadow-sm rounded-full"
              : "bg-transparent"
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold font-mono tracking-tight text-text">
            <Kanban size={24} className="text-primary" weight="duotone" />
            TrackLy
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <a href="#features" className="text-sm font-medium text-text-muted hover:text-text transition-colors">Features</a>
            <button onClick={onContactClick} className="text-sm font-medium text-text-muted hover:text-text transition-colors">Contact</button>
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex bg-background border border-border rounded-lg p-0.5 mr-2">
              <button onClick={() => setTheme("light")} className={`p-1.5 rounded-md ${theme === "light" ? "bg-surface" : "text-text-muted hover:text-text"}`}><Sun size={16} /></button>
              <button onClick={() => setTheme("system")} className={`p-1.5 rounded-md ${theme === "system" ? "bg-surface" : "text-text-muted hover:text-text"}`}><Monitor size={16} /></button>
              <button onClick={() => setTheme("dark")} className={`p-1.5 rounded-md ${theme === "dark" ? "bg-surface" : "text-text-muted hover:text-text"}`}><Moon size={16} /></button>
            </div>
            <Link to="/login" className="text-sm font-medium text-text-muted hover:text-text transition-colors px-4 py-2 rounded-[10px]">
              Log in
            </Link>
            <Magnet strength={10}>
              <Link to="/register" className="text-sm font-medium bg-primary text-on-primary px-5 py-2.5 rounded-[10px] shadow-sm hover:bg-primary-hover transition-colors">
                Sign up
              </Link>
            </Magnet>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-text" onClick={() => setMobileMenu(true)}>
            <List size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-background z-50 flex flex-col p-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="flex items-center gap-2 text-xl font-bold font-mono text-text">
                <Kanban size={24} className="text-primary" weight="duotone" />
                TrackLy
              </span>
              <button onClick={() => setMobileMenu(false)} className="text-text">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-6 text-xl">
              <a href="#features" onClick={() => setMobileMenu(false)} className="font-medium text-text">Features</a>
              <button onClick={() => { setMobileMenu(false); onContactClick(); }} className="font-medium text-text text-left">Contact</button>
              
              <div className="flex bg-surface-elevated border border-border rounded-lg p-1 self-start mt-2">
                <button onClick={() => setTheme("light")} className={`p-2 rounded-md ${theme === "light" ? "bg-surface shadow-sm text-text" : "text-text-muted"}`}><Sun size={20} /></button>
                <button onClick={() => setTheme("system")} className={`p-2 rounded-md ${theme === "system" ? "bg-surface shadow-sm text-text" : "text-text-muted"}`}><Monitor size={20} /></button>
                <button onClick={() => setTheme("dark")} className={`p-2 rounded-md ${theme === "dark" ? "bg-surface shadow-sm text-text" : "text-text-muted"}`}><Moon size={20} /></button>
              </div>

              <hr className="border-border my-4" />
              <Link to="/login" className="font-medium text-text">Log in</Link>
              <Link to="/register" className="font-medium text-primary">Sign up</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// ---- HERO ----
const Hero = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // 3D Transform values
  const rotateX = useTransform(scrollYProgress, [0, 1], [14, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1])
  const y = useTransform(scrollYProgress, [0, 1], [60, 0])

  return (
    <section ref={containerRef} className="relative pt-32 pb-24 min-h-[100dvh] flex flex-col items-center overflow-hidden">
      <div className="hidden lg:block absolute inset-0 z-0">
        <Aurora />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center mt-12 mb-20">
        <BlurText 
          text="Track issues. Ship faster."
          delay={0}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-text justify-center mb-6"
        />
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto"
        >
          The lightweight, gorgeous issue tracker for students and small teams. Keep your projects organized without the enterprise bloat.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="flex items-center justify-center gap-4"
        >
          <Magnet strength={15}>
            <Link to="/register" className="bg-primary text-on-primary px-8 py-3.5 rounded-[10px] font-medium shadow-md hover:bg-primary-hover transition-colors text-lg">
              Get Started for Free
            </Link>
          </Magnet>
          <Link to="/login" className="bg-surface text-text px-8 py-3.5 rounded-[10px] font-medium border border-border shadow-sm hover:bg-surface-elevated transition-colors text-lg hidden sm:block">
            Log In
          </Link>
        </motion.div>
      </div>

      <motion.div 
        style={{ rotateX, scale, y }}
        className="w-full max-w-6xl mx-auto px-4 md:px-6 perspective-1000 z-20"
      >
        <MockKanban />
      </motion.div>
      
      {/* Wash overlay to fade out bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-30 pointer-events-none" />
    </section>
  )
}

// ---- FEATURES BENTO ----
const FeaturesBento = () => {
  return (
    <section id="features" className="py-24 md:py-32 max-w-7xl mx-auto px-4 md:px-6">
      <div className="mb-16 md:text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text mb-4">Everything you need</h2>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">TrackLy brings focus to your workflow with five essential features.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 auto-rows-[250px]">
        {/* Cell 1: 2x2 */}
        <SpotlightCard className="md:col-span-2 md:row-span-2 bg-surface border border-border rounded-[16px] p-8 flex flex-col group">
          <h3 className="text-xl font-semibold text-text mb-2">Track Status</h3>
          <p className="text-text-muted mb-8">Move your work seamlessly from Open to Closed.</p>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="absolute w-[120%] h-[120%] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <motion.div 
              animate={{ 
                x: [0, 40, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-full max-w-xs z-10"
            >
              <MockIssueCard id="TRK-99" title="Interactive mockups" status="In Progress" priority="High" />
            </motion.div>
          </div>
        </SpotlightCard>

        {/* Cell 2: 1x1 */}
        <SpotlightCard className="bg-surface border border-border rounded-[16px] p-6 flex flex-col relative overflow-hidden group">
          <h3 className="text-lg font-semibold text-text mb-2 z-10">Create & Edit</h3>
          <p className="text-text-muted text-sm z-10">Fast forms without the friction.</p>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 border border-border/50 rounded-[16px] bg-background/50 p-4 transform rotate-12 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
            <div className="h-2 w-12 bg-border rounded-full mb-3" />
            <div className="h-2 w-24 bg-border rounded-full mb-6" />
            <div className="h-8 w-full bg-surface-elevated rounded-[10px]" />
          </div>
        </SpotlightCard>

        {/* Cell 3: 1x1 */}
        <SpotlightCard className="bg-surface border border-border rounded-[16px] p-6 flex flex-col group">
          <h3 className="text-lg font-semibold text-text mb-2">Assign Owners</h3>
          <p className="text-text-muted text-sm mb-6">Know exactly who is working on what.</p>
          <div className="flex -space-x-3 mt-auto justify-center group-hover:space-x-2 transition-all duration-500">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-surface-elevated border-2 border-surface flex items-center justify-center shadow-sm">
                <User size={20} className="text-text-muted" />
              </div>
            ))}
          </div>
        </SpotlightCard>

        {/* Cell 4: 1x1 */}
        <SpotlightCard className="bg-surface border border-border rounded-[16px] p-6 flex flex-col relative overflow-hidden">
          <h3 className="text-lg font-semibold text-text mb-2 z-10">Discuss</h3>
          <p className="text-text-muted text-sm z-10 mb-6">Keep comments in context.</p>
          <div className="mt-auto flex flex-col gap-2 relative z-10">
            <div className="bg-surface-elevated p-3 rounded-[16px] rounded-tl-sm text-xs text-text border border-border w-[85%]">
              This is looking great!
            </div>
            <div className="bg-primary/10 p-3 rounded-[16px] rounded-tr-sm text-xs text-text border border-primary/20 w-[85%] self-end">
              Thanks! Just merged.
            </div>
          </div>
        </SpotlightCard>

        {/* Cell 5: 1x1 */}
        <SpotlightCard className="bg-surface border border-border rounded-[16px] p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-text mb-2">See Counts</h3>
          <p className="text-text-muted text-sm mb-6">Metrics that matter.</p>
          <div className="mt-auto flex justify-between items-end">
            <div>
              <div className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Open Issues</div>
              <div className="text-4xl font-mono font-bold text-text">
                <CountUp to={42} duration={2.5} />
              </div>
            </div>
            <ChartLineUp size={32} className="text-primary opacity-20" weight="duotone" />
          </div>
        </SpotlightCard>
      </div>
    </section>
  )
}

// ---- HOW WORK MOVES ----
const ScrollSplit = () => {
  return (
    <section className="py-24 md:py-32 max-w-7xl mx-auto px-4 md:px-6">
      <div className="md:grid md:grid-cols-2 md:gap-16 items-start relative">
        <div className="hidden md:block sticky top-32">
          <div className="bg-surface-elevated p-8 rounded-[16px] border border-border shadow-2xl">
            <MockIssueCard id="TRK-101" title="Feature: Dark Mode" status="In Progress" priority="High" />
            <div className="mt-6 flex flex-col gap-3">
              <div className="h-2 w-3/4 bg-border rounded-full" />
              <div className="h-2 w-full bg-border rounded-full" />
              <div className="h-2 w-5/6 bg-border rounded-full" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-24 py-12">
          <div>
            <div className="w-12 h-12 rounded-[16px] bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Plus size={24} weight="bold" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-4">1. Report</h3>
            <p className="text-text-muted text-lg leading-relaxed">Quickly file bugs and feature requests. Our streamlined form ensures you capture exactly what's needed without endless required fields.</p>
          </div>
          <div>
            <div className="w-12 h-12 rounded-[16px] bg-accent/10 text-accent flex items-center justify-center mb-6">
              <Users size={24} weight="bold" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-4">2. Assign</h3>
            <p className="text-text-muted text-lg leading-relaxed">Assign issues to yourself or teammates. Clear ownership means nothing falls through the cracks.</p>
          </div>
          <div>
            <div className="w-12 h-12 rounded-[16px] bg-status-in-progress/10 text-status-in-progress flex items-center justify-center mb-6">
              <SquaresFour size={24} weight="bold" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-4">3. Track</h3>
            <p className="text-text-muted text-lg leading-relaxed">Move cards across the board. The Kanban view gives you a bird's eye perspective on your entire project's health.</p>
          </div>
          <div>
            <div className="w-12 h-12 rounded-[16px] bg-status-closed/10 text-status-closed flex items-center justify-center mb-6">
              <CheckCircle size={24} weight="bold" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-4">4. Close</h3>
            <p className="text-text-muted text-lg leading-relaxed">Mark as done. Bask in the dopamine hit of a cleared queue. Then grab a coffee.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---- CTA BAND ----
const CTABand = () => (
  <section className="py-32 relative overflow-hidden flex flex-col items-center justify-center">
    <div className="absolute inset-0 bg-primary/5 z-0" />
    <div className="relative z-10 text-center px-4">
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text mb-6">Ready to ship faster?</h2>
      <p className="text-xl text-text-muted mb-10">Join TrackLy today. Free forever for individuals.</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Magnet strength={15}>
          <Link to="/register" className="bg-primary text-on-primary px-8 py-3.5 rounded-[10px] font-medium shadow-md hover:bg-primary-hover transition-colors text-lg w-full sm:w-auto text-center">
            Sign Up Now
          </Link>
        </Magnet>
        <Link to="/login" className="bg-surface text-text px-8 py-3.5 rounded-[10px] font-medium border border-border shadow-sm hover:bg-surface-elevated transition-colors text-lg w-full sm:w-auto text-center">
          Log In
        </Link>
      </div>
    </div>
  </section>
)

// ---- FOOTER ----
const Footer = ({ onContactClick }: { onContactClick: () => void }) => (
  <footer className="border-t border-border bg-background py-6 px-4 md:px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-xl font-bold font-mono tracking-tight text-text">
          <Kanban size={24} className="text-primary" weight="duotone" />
          TrackLy
        </div>
        <span className="text-text-muted text-sm border-l border-border pl-2 ml-2">© {new Date().getFullYear()}</span>
      </div>
      <div className="flex items-center gap-6">
        <a href="#" className="text-sm font-medium text-text-muted hover:text-text transition-colors">Terms</a>
        <a href="#" className="text-sm font-medium text-text-muted hover:text-text transition-colors">Privacy</a>
        <button onClick={onContactClick} className="text-sm font-medium text-text-muted hover:text-text transition-colors">Contact</button>
        <a href="https://github.com/karanks6" target="_blank" rel="noreferrer" className="text-text-muted hover:text-text transition-colors">
          <GithubLogo size={24} weight="regular" />
        </a>
      </div>
    </div>
  </footer>
)

const ContactModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
          onClick={onClose} 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-surface border border-border rounded-[16px] p-8 shadow-2xl w-full max-w-md"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text"><X size={20}/></button>
          <h3 className="text-2xl font-bold text-text mb-6">Contact Me</h3>
          <div className="flex flex-col gap-4">
            <a href="mailto:suvarnakaran77@gmail.com" className="flex items-center gap-3 p-4 rounded-xl bg-surface-elevated border border-border hover:border-primary transition-colors text-text group">
              <EnvelopeSimple size={24} className="text-primary group-hover:scale-110 transition-transform" />
              <span className="font-medium">suvarnakaran77@gmail.com</span>
            </a>
            <a href="https://github.com/karanks6" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-surface-elevated border border-border hover:border-primary transition-colors text-text group">
              <GithubLogo size={24} className="text-primary group-hover:scale-110 transition-transform" />
              <span className="font-medium">github.com/karanks6</span>
            </a>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
)

// ---- PAGE COMPONENT ----
export function Landing() {
  const [showContact, setShowContact] = useState(false)
  
  return (
    <div className="bg-background min-h-[100dvh] flex flex-col">
      <Nav onContactClick={() => setShowContact(true)} />
      <main className="flex-1">
        <Hero />
        <FeaturesBento />
        <ScrollSplit />
        <CTABand />
      </main>
      <Footer onContactClick={() => setShowContact(true)} />
      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
    </div>
  )
}
