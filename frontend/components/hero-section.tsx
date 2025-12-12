export default function HeroSection() {
  return (
    <section id="home" className="text-center py-20 md:py-32">
      <div className="max-w-3xl mx-auto">
        <div className="inline-block mb-6 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur">
          <span className="text-sm text-primary cyber-text">AI Detection Technology</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
          AI Image{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
            Authenticity Analyzer
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-4 text-balance">
          Upload any image to check if it is AI-generated or real.
        </p>

        <p className="text-sm text-muted-foreground max-w-2xl mx-auto text-balance">
          Advanced deep learning models analyze your images with precision to determine authenticity. Experience the
          future of image verification today.
        </p>

        <div className="mt-12 h-64 md:h-80 relative rounded-xl overflow-hidden glass-card border border-primary/20 p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-primary/30 flex items-center justify-center animate-pulse">
              <div className="w-12 h-12 rounded-full border-2 border-secondary/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
