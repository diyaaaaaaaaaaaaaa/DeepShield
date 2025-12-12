export default function Navigation() {
  return (
    <nav className="border-b border-border/30 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">CS</span>
          </div>
          <span className="text-xl font-bold text-foreground cyber-text">CyberScan</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
            About Project
          </a>
        </div>

        <button className="w-8 h-8 rounded-lg border border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all">
          <span className="text-xs text-primary">≡</span>
        </button>
      </div>
    </nav>
  )
}
