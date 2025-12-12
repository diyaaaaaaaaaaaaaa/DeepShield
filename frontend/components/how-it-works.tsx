export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload Image",
      description: "Drag and drop or select any image file from your device",
    },
    {
      number: "02",
      title: "Advanced Analysis",
      description: "Our AI processes the image using deep learning algorithms",
    },
    {
      number: "03",
      title: "Get Results",
      description: "Receive instant authenticity verdict with confidence score",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 border-t border-border/30 bg-gradient-to-b from-background to-card/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 text-balance">How It Works</h2>
          <p className="text-muted-foreground text-lg">Simple steps to verify your image authenticity</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="glass-card p-8 border border-border/30 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full border-2 border-primary/30 bg-background flex items-center justify-center">
                <span className="text-primary font-bold cyber-text">{step.number}</span>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <h3 className="text-xl font-semibold mb-3 mt-4 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
