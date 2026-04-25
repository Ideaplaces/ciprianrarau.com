'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '@/lib/data/projects';

const COUNT = PROJECTS.length;
const BASE_PCT = 100 / COUNT;
const EXPANDED_PCT = 32;
const SHRUNK_PCT = (100 - EXPANDED_PCT) / (COUNT - 1);

export function ProjectCarousel() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="project-carousel">
      <div
        className="hidden md:flex relative w-full h-[480px] overflow-hidden rounded-xl shadow-xl border border-border-light"
        onMouseLeave={() => setHovered(null)}
      >
        {PROJECTS.map((project, index) => {
          const isHovered = hovered === index;
          const isOtherHovered = hovered !== null && hovered !== index;
          const widthPct = isHovered
            ? EXPANDED_PCT
            : isOtherHovered
              ? SHRUNK_PCT
              : BASE_PCT;

          return (
            <a
              key={project.slug}
              href={project.href}
              target={project.href.startsWith('http') ? '_blank' : undefined}
              rel={project.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="relative h-full overflow-hidden cursor-pointer transition-[width] duration-500 ease-in-out"
              style={{ width: `${widthPct}%` }}
              onMouseEnter={() => setHovered(index)}
              aria-label={`${project.title} — ${project.subtitle}`}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 35vw"
                className="object-cover"
                priority={index < 3}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-clay-900/90 via-clay-900/40 to-transparent" />
              {project.era === 'past' && (
                <div className="absolute top-4 right-4 inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-widest font-mono font-semibold rounded bg-clay-900/70 text-clay-50 whitespace-nowrap">
                  Track record
                </div>
              )}
              <div
                className={`absolute bottom-3 left-3 right-3 transition-all duration-500 ${
                  isHovered ? 'translate-y-0' : 'translate-y-0'
                }`}
              >
                <div className="bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-base tracking-tight truncate">
                        {project.title}
                      </h3>
                      <p className="text-xs text-foreground-muted truncate">
                        {project.subtitle}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className={`shrink-0 mt-0.5 text-foreground-muted transition-opacity duration-300 ${
                        isHovered ? 'opacity-100 text-primary' : 'opacity-0'
                      }`}
                    />
                  </div>
                  <div
                    className={`grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-in-out ${
                      isHovered ? 'grid-rows-[1fr]' : ''
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="mt-3 pt-3 border-t border-border-light space-y-1.5">
                        {project.details.map((detail) => (
                          <li
                            key={detail}
                            className="text-xs text-foreground flex items-start"
                          >
                            <span className="text-secondary mr-2">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Mobile stacked layout */}
      <div className="md:hidden grid sm:grid-cols-2 gap-3">
        {PROJECTS.map((project) => (
          <a
            key={project.slug}
            href={project.href}
            target={project.href.startsWith('http') ? '_blank' : undefined}
            rel={project.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="relative block h-56 overflow-hidden rounded-lg shadow-md group"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-clay-900/90 via-clay-900/40 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <div className="bg-background/95 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-heading font-bold text-sm tracking-tight truncate">
                      {project.title}
                    </h3>
                    <p className="text-xs text-foreground-muted truncate">
                      {project.subtitle}
                    </p>
                  </div>
                  <ArrowUpRight
                    size={14}
                    className="shrink-0 text-primary group-hover:translate-x-0.5 transition-transform"
                  />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
