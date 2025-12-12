export default function AboutProject() {
  return (
    <section id="about" className="py-20 border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold mb-8 text-balance">About the Project</h2>

          <div className="glass-card p-8 border border-border/30 mb-8">
            <p className="text-muted-foreground leading-relaxed mb-4">
              CyberScan leverages cutting-edge deep learning technology to detect AI-generated images with remarkable
              accuracy. Our sophisticated neural networks have been trained on millions of images to identify subtle
              artifacts and patterns that distinguish synthetic content from authentic photography.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              In an era where AI image generation has become increasingly sophisticated, having reliable verification
              tools is crucial. Whether you're a journalist, content creator, or simply concerned about misinformation,
              CyberScan provides the transparency and confidence you need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "⚡", label: "Fast", desc: "Instant results in seconds" },
              { icon: "🎯", label: "Accurate", desc: "98%+ detection accuracy" },
              { icon: "🔒", label: "Private", desc: "Your images stay secure" },
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-6 border border-border/30 text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold mb-2 text-foreground">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
