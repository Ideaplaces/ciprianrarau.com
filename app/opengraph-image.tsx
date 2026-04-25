import { ImageResponse } from 'next/og';

export const alt = 'Ciprian (Chip) Rarau — Founder, building a portfolio of products';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#F5F4F1',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px 80px',
          fontFamily: 'system-ui',
          color: '#252422',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 8,
            background: '#21517C',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 56,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              background: '#21517C',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="40" height="40" viewBox="0 0 32 32">
              <path
                d="M 21 9.5 A 8 8 0 1 0 21 22.5"
                stroke="#F5F4F1"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#7C746B',
            }}
          >
            ciprianrarau.com
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            marginTop: 'auto',
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#252422',
              maxWidth: 1040,
            }}
          >
            I run a portfolio of products.
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              color: '#7C746B',
              maxWidth: 900,
            }}
          >
            Across my own ventures and the companies I build with, the same problems keep showing up. Three instances becomes a product.
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginTop: 12,
              fontSize: 22,
              color: '#A45C36',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            <div
              style={{
                width: 36,
                height: 4,
                background: '#F29E4C',
                borderRadius: 2,
              }}
            />
            Ciprian (Chip) Rarau
          </div>
        </div>
      </div>
    ),
    size,
  );
}
