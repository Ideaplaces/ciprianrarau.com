export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-3xl px-6 py-32">
        <div className="flex items-center gap-3 mb-8 text-sm uppercase tracking-widest text-foreground-muted font-mono">
          <span className="inline-block h-px w-10 bg-secondary" />
          <span>ciprianrarau.com · refactor in progress</span>
        </div>
        <h1 className="font-heading text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-8">
          I run a portfolio of products.
        </h1>
        <p className="text-xl md:text-2xl leading-relaxed text-foreground-muted max-w-2xl mb-12">
          Across my own ventures and the companies I build with, the same problems keep showing up. Three instances of the same problem becomes a product.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded transition-colors hover:bg-primary-dark"
          >
            See what I&apos;m building
          </a>
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 border border-border text-foreground font-semibold rounded transition-colors hover:bg-background-alt"
          >
            Read the blog
          </a>
        </div>
        <div className="mt-24 pt-12 border-t border-border-light">
          <div className="text-xs uppercase tracking-widest text-foreground-muted font-mono mb-4">
            Palette · Clay &amp; Code
          </div>
          <div className="flex gap-2">
            {[
              ['Primary', '#21517C'],
              ['Primary Dark', '#143553'],
              ['Secondary', '#A45C36'],
              ['Accent', '#F29E4C'],
              ['Surface', '#F3EEE9'],
              ['Foreground', '#252422'],
            ].map(([label, hex]) => (
              <div key={hex} className="flex flex-col items-start">
                <div
                  className="w-16 h-16 rounded-md border border-border-light"
                  style={{ background: hex }}
                />
                <span className="mt-2 text-xs font-mono text-foreground-muted">{hex}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
