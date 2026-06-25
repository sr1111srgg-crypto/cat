import React from 'react';
import { CatConfig } from '../types';

interface CatPreviewProps {
  config: CatConfig;
  className?: string;
  isAnimated?: boolean;
}

export default function CatPreview({ config, className = 'w-64 h-64', isAnimated = true }: CatPreviewProps) {
  const { breed, colors, eyeType, expression, accessories } = config;

  // Render accessories
  const hasAccessory = (id: string) => accessories.includes(id);

  // Determine actual color parameters
  const bodyColor = colors.primary;
  const secondaryColor = colors.secondary;
  const eyeColor = colors.eyes;
  const stripesColor = colors.stripes || 'rgba(0,0,0,0.15)';

  return (
    <div className={`relative select-none flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>
            {`
              @keyframes tailWiggle {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(15deg); }
              }
              @keyframes earTwitchL {
                0%, 90%, 100% { transform: rotate(0deg); }
                92%, 96% { transform: rotate(-10deg); }
              }
              @keyframes earTwitchR {
                0%, 85%, 100% { transform: rotate(0deg); }
                87%, 91% { transform: rotate(10deg); }
              }
              @keyframes breathe {
                0%, 100% { transform: scaleY(1) translateY(0px); }
                50% { transform: scaleY(1.02) translateY(-1px); }
              }
              @keyframes eyesBlink {
                0%, 48%, 52%, 100% { transform: scaleY(1); }
                50% { transform: scaleY(0.1); }
              }
              @keyframes floatWings {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-3px) rotate(3deg); }
              }
              @keyframes bounceAccessory {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-1px); }
              }

              .animate-tail {
                transform-origin: 145px 145px;
                animation: ${isAnimated ? 'tailWiggle 2.5s ease-in-out infinite' : 'none'};
              }
              .animate-ear-l {
                transform-origin: 75px 55px;
                animation: ${isAnimated ? 'earTwitchL 4s ease-in-out infinite' : 'none'};
              }
              .animate-ear-r {
                transform-origin: 125px 55px;
                animation: ${isAnimated ? 'earTwitchR 4.2s ease-in-out infinite' : 'none'};
              }
              .animate-body {
                transform-origin: 100px 170px;
                animation: ${isAnimated ? 'breathe 3s ease-in-out infinite' : 'none'};
              }
              .animate-eye {
                transform-origin: 100px 85px;
                animation: ${isAnimated && eyeType !== 'sleepy' ? 'eyesBlink 5s ease-in-out infinite' : 'none'};
              }
              .animate-wing-l {
                transform-origin: 65px 120px;
                animation: ${isAnimated ? 'floatWings 2s ease-in-out infinite' : 'none'};
              }
              .animate-wing-r {
                transform-origin: 135px 120px;
                animation: ${isAnimated ? 'floatWings 2s ease-in-out infinite reverse' : 'none'};
              }
            `}
          </style>

          {/* Radial shadow filter for soft look */}
          <radialGradient id="shadow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0, 0, 0, 0.18)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>
        </defs>

        {/* 1. GROUND SHADOW */}
        <ellipse cx="100" cy="175" rx="55" ry="10" fill="url(#shadow-grad)" />

        {/* 2. ANGEL WINGS ACCESSORY (BACK) */}
        {hasAccessory('angel_wings') && (
          <g>
            {/* Left wing */}
            <path
              className="animate-wing-l"
              d="M 65 120 C 40 100, 20 110, 15 130 C 15 145, 35 150, 50 142 C 45 150, 48 158, 58 152 C 65 145, 68 135, 65 120 Z"
              fill="#F0F4F8"
              stroke="#D2E2F0"
              strokeWidth="2"
            />
            {/* Right wing */}
            <path
              className="animate-wing-r"
              d="M 135 120 C 160 100, 180 110, 185 130 C 185 145, 165 150, 150 142 C 155 150, 152 158, 142 152 C 135 145, 132 135, 135 120 Z"
              fill="#F0F4F8"
              stroke="#D2E2F0"
              strokeWidth="2"
            />
          </g>
        )}

        {/* 3. TAIL (Wiggle!) */}
        <g className="animate-tail">
          {/* Base Tail Path */}
          <path
            d="M 138 148 C 165 155, 180 135, 175 110 C 170 85, 188 70, 185 60 C 182 50, 170 52, 168 62 C 165 75, 158 95, 161 115 C 164 130, 152 142, 138 143 Z"
            fill={bodyColor}
          />
          {/* Siamese Tail Point */}
          {breed === 'siamese' && (
            <path
              d="M 175 110 C 170 85, 188 70, 185 60 C 182 50, 170 52, 168 62 C 165 75, 162 88, 163 100 Z"
              fill={secondaryColor}
            />
          )}
          {/* Tabby Tail Stripes */}
          {(breed === 'tabby' || breed === 'orange') && (
            <g opacity="0.6">
              <path d="M 171 100 Q 174 98 177 101" stroke={stripesColor} strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 168 85 Q 172 82 176 86" stroke={stripesColor} strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 172 70 Q 177 67 182 72" stroke={stripesColor} strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}
          {/* Calico Tail Spots */}
          {breed === 'calico' && (
            <g>
              <path d="M 171 95 C 175 90, 180 100, 174 105 Z" fill="#D97706" />
              <path d="M 167 78 C 172 73, 175 80, 170 85 Z" fill="#1F2937" />
            </g>
          )}
        </g>

        {/* 4. MAIN BODY (Breathing!) */}
        <g className="animate-body">
          {/* Main Torso */}
          <rect
            x="60"
            y="110"
            width="80"
            height="60"
            rx="30"
            fill={bodyColor}
          />

          {/* Siamese Points on Paws */}
          {breed === 'siamese' && (
            <g>
              {/* Back Paw left */}
              <rect x="68" y="158" width="16" height="13" rx="8" fill={secondaryColor} />
              {/* Back Paw right */}
              <rect x="116" y="158" width="16" height="13" rx="8" fill={secondaryColor} />
            </g>
          )}

          {/* Tuxedo Socks / White Paws */}
          {breed === 'tuxedo' && (
            <g>
              {/* White feet */}
              <rect x="68" y="158" width="16" height="13" rx="8" fill="#FFFFFF" />
              {/* White feet */}
              <rect x="116" y="158" width="16" height="13" rx="8" fill="#FFFFFF" />
            </g>
          )}

          {/* Normal paws if not tuxedo or siamese */}
          {breed !== 'tuxedo' && breed !== 'siamese' && (
            <g>
              <rect x="68" y="158" width="16" height="13" rx="8" fill={bodyColor} opacity="0.9" />
              <rect x="116" y="158" width="16" height="13" rx="8" fill={bodyColor} opacity="0.9" />
            </g>
          )}

          {/* Belly Patch (Secondary Color) */}
          {(breed === 'tuxedo' || breed === 'calico' || config.pattern === 'bicolor' || secondaryColor !== bodyColor) && (
            <ellipse
              cx="100"
              cy="142"
              rx="24"
              ry="22"
              fill={secondaryColor}
            />
          )}

          {/* Tabby stripes on body sides */}
          {(breed === 'tabby' || breed === 'orange') && (
            <g opacity="0.5">
              {/* Left side stripes */}
              <path d="M 60 130 H 72" stroke={stripesColor} strokeWidth="4" strokeLinecap="round" />
              <path d="M 60 140 H 75" stroke={stripesColor} strokeWidth="4" strokeLinecap="round" />
              <path d="M 60 150 H 70" stroke={stripesColor} strokeWidth="4" strokeLinecap="round" />
              {/* Right side stripes */}
              <path d="M 140 130 H 128" stroke={stripesColor} strokeWidth="4" strokeLinecap="round" />
              <path d="M 140 140 H 125" stroke={stripesColor} strokeWidth="4" strokeLinecap="round" />
              <path d="M 140 150 H 130" stroke={stripesColor} strokeWidth="4" strokeLinecap="round" />
            </g>
          )}

          {/* Calico Spots on Body */}
          {breed === 'calico' && (
            <g>
              {/* Orange spot */}
              <path d="M 61 122 C 70 120, 75 135, 64 140 Z" fill="#D97706" />
              {/* Black spot */}
              <path d="M 135 125 C 125 125, 122 138, 137 142 Z" fill="#1F2937" />
              {/* Smaller spot */}
              <circle cx="120" cy="155" r="6" fill="#D97706" />
            </g>
          )}

          {/* Fluffy Collar for Persian */}
          {breed === 'persian' && (
            <g fill="#FFFFFF" opacity="0.9">
              <circle cx="75" cy="115" r="12" />
              <circle cx="100" cy="118" r="14" />
              <circle cx="125" cy="115" r="12" />
              <circle cx="88" cy="122" r="11" />
              <circle cx="112" cy="122" r="11" />
            </g>
          )}
        </g>

        {/* 5. EARS (Twitch!) */}
        {/* Left Ear */}
        <g className="animate-ear-l">
          <path
            d="M 65 65 L 45 28 C 43 24, 52 23, 58 27 L 85 53 Z"
            fill={bodyColor}
          />
          <path
            d="M 62 60 L 51 34 C 50 32, 55 31, 59 34 L 76 52 Z"
            fill="#FFAEAE" // Cute pink inner ear
          />
          {breed === 'siamese' && (
            <path
              d="M 65 65 L 45 28 C 43 24, 49 24, 54 28 L 74 48 Z"
              fill={secondaryColor}
            />
          )}
        </g>

        {/* Right Ear */}
        <g className="animate-ear-r">
          <path
            d="M 135 65 L 155 28 C 157 24, 148 23, 142 27 L 115 53 Z"
            fill={bodyColor}
          />
          <path
            d="M 138 60 L 149 34 C 150 32, 145 31, 141 34 L 124 52 Z"
            fill="#FFAEAE"
          />
          {breed === 'siamese' && (
            <path
              d="M 135 65 L 155 28 C 157 24, 151 24, 146 28 L 126 48 Z"
              fill={secondaryColor}
            />
          )}
        </g>

        {/* 6. HEAD (Base) */}
        <g>
          {breed === 'persian' ? (
            // Extra fluffy cheek head shape for Persian
            <path
              d="M 60 85 C 50 85, 42 105, 60 110 C 70 112, 130 112, 140 110 C 158 105, 150 85, 140 85 C 140 60, 60 60, 60 85 Z"
              fill={bodyColor}
            />
          ) : (
            // Classic rounded head
            <circle
              cx="100"
              cy="85"
              r="40"
              fill={bodyColor}
            />
          )}

          {/* Siamese Face Mask */}
          {breed === 'siamese' && (
            <path
              d="M 72 82 C 65 95, 75 112, 100 112 C 125 112, 135 95, 128 82 C 122 75, 78 75, 72 82 Z"
              fill={secondaryColor}
            />
          )}

          {/* Bicolor / Tuxedo Inverted White 'V' */}
          {(breed === 'tuxedo' || config.pattern === 'bicolor' || (breed === 'calico' && colors.secondary === '#FFFFFF')) && (
            <path
              d="M 100 70 L 76 112 H 124 Z"
              fill="#FFFFFF"
            />
          )}

          {/* Tabby 'M' forehead stripes */}
          {(breed === 'tabby' || breed === 'orange') && (
            <g opacity="0.65" stroke={stripesColor} strokeWidth="3" fill="none" strokeLinecap="round">
              <path d="M 94 50 L 94 58 L 98 62 L 102 62 L 106 58 L 106 50" />
              <path d="M 88 52 L 91 58" />
              <path d="M 112 52 L 109 58" />
            </g>
          )}

          {/* Calico Spots on Head */}
          {breed === 'calico' && (
            <g>
              {/* Orange forehead patch */}
              <path d="M 70 55 C 80 50, 95 55, 90 70 C 85 75, 72 70, 70 55 Z" fill="#D97706" />
              {/* Black right eye patch */}
              <path d="M 110 60 C 130 55, 140 70, 135 90 C 125 95, 115 80, 110 60 Z" fill="#1F2937" />
            </g>
          )}
        </g>

        {/* 7. EYES */}
        <g className="animate-eye">
          {/* Left Eye Eye-Ring/Background (for expressions like angry/sleepy) */}
          {/* Render based on expression style */}
          {eyeType === 'sleepy' ? (
            <g>
              {/* Sleepy closed eyelids */}
              <path d="M 73 85 Q 83 92 93 85" stroke="#374151" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 107 85 Q 117 92 127 85" stroke="#374151" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            <g>
              {/* Left Eye ball */}
              <ellipse cx="83" cy="85" rx="10" ry="10" fill="#FFFFFF" />
              {/* Right Eye ball */}
              <ellipse cx="117" cy="85" rx="10" ry="10" fill="#FFFFFF" />

              {/* Iris Left */}
              <ellipse cx="83" cy="85" rx="8" ry="8" fill={eyeColor} />
              {/* Iris Right */}
              <ellipse cx="117" cy="85" rx="8" ry="8" fill={eyeColor} />

              {/* Pupils and highlights based on EyeType */}
              {eyeType === 'cute' && (
                <g>
                  {/* Left Pupil */}
                  <ellipse cx="83" cy="85" rx="5" ry="6" fill="#1F2937" />
                  <ellipse cx="117" cy="85" rx="5" ry="6" fill="#1F2937" />
                  {/* Sweet white reflection */}
                  <circle cx="80" cy="81" r="2.5" fill="#FFFFFF" />
                  <circle cx="114" cy="81" r="2.5" fill="#FFFFFF" />
                  <circle cx="85" cy="88" r="1.2" fill="#FFFFFF" />
                  <circle cx="119" cy="88" r="1.2" fill="#FFFFFF" />
                </g>
              )}

              {eyeType === 'sparkling' && (
                <g>
                  {/* Star shape iris / big cute pupil */}
                  <ellipse cx="83" cy="85" rx="6" ry="6" fill="#1F2937" />
                  <ellipse cx="117" cy="85" rx="6" ry="6" fill="#1F2937" />
                  {/* Sparkling crosses */}
                  <path d="M 79 85 H 87 M 83 81 V 89" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M 113 85 H 121 M 117 81 V 89" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="85" cy="83" r="1.2" fill="#FFFFFF" />
                  <circle cx="119" cy="83" r="1.2" fill="#FFFFFF" />
                </g>
              )}

              {eyeType === 'derp' && (
                <g>
                  {/* Hilarious outward looking lazy pupils */}
                  <ellipse cx="79" cy="85" rx="4" ry="4" fill="#1F2937" />
                  <ellipse cx="121" cy="85" rx="4" ry="4" fill="#1F2937" />
                  <circle cx="78" cy="83" r="1.5" fill="#FFFFFF" />
                  <circle cx="120" cy="83" r="1.5" fill="#FFFFFF" />
                </g>
              )}

              {eyeType === 'angry' && (
                <g>
                  {/* Slanted angry eyes overlay */}
                  <ellipse cx="83" cy="85" rx="8" ry="8" fill="#1F2937" />
                  <ellipse cx="117" cy="85" rx="8" ry="8" fill="#1F2937" />
                  <circle cx="81" cy="83" r="1.5" fill="#FFFFFF" />
                  <circle cx="115" cy="83" r="1.5" fill="#FFFFFF" />
                  {/* Angular brows */}
                  <path d="M 71 74 L 92 81" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 129 74 L 108 81" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
                </g>
              )}

              {eyeType === 'funny' && (
                <g>
                  {/* Tiny dots, surprised or traumatized expression */}
                  <circle cx="83" cy="85" r="2.5" fill="#1F2937" />
                  <circle cx="117" cy="85" r="2.5" fill="#1F2937" />
                  {/* Wide surprise rings around eye */}
                  <circle cx="83" cy="85" r="9" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
                  <circle cx="117" cy="85" r="9" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
                </g>
              )}
            </g>
          )}
        </g>

        {/* 8. NOSE, WHISKERS, MOUTH */}
        <g>
          {/* Pink Nose */}
          {hasAccessory('clown_nose') ? (
            <circle cx="100" cy="91" r="6" fill="#EF4444" className="animate-bounce" />
          ) : (
            <polygon points="97,91 103,91 100,94" fill="#FFAEAE" />
          )}

          {/* Cute Muzzle Area (White/Cream highlights behind mouth) */}
          <ellipse cx="96" cy="96" rx="5" ry="4" fill="none" stroke="#4B5563" strokeWidth="1" opacity="0.3" />
          <ellipse cx="104" cy="96" rx="5" ry="4" fill="none" stroke="#4B5563" strokeWidth="1" opacity="0.3" />

          {/* Mouth Expressions */}
          {expression === 'smile' && (
            <path d="M 92 95 Q 96 99 100 95 Q 104 99 108 95" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
          {expression === 'meh' && (
            <line x1="94" y1="96" x2="106" y2="96" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
          )}
          {expression === 'pout' && (
            <path d="M 94 98 Q 100 94 106 98" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
          {expression === 'shocked' && (
            <ellipse cx="100" cy="98" rx="4" ry="5" stroke="#374151" strokeWidth="2.5" fill="none" />
          )}
          {expression === 'smug' && (
            <path d="M 93 96 Q 97 99 100 96 Q 106 94 109 97" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}
          {expression === 'tongue' && (
            <g>
              <path d="M 92 95 Q 96 99 100 95 Q 104 99 108 95" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Cute pink tongue sticking out */}
              <path d="M 98 96 C 98 101, 102 101, 102 96 Z" fill="#FF4F7B" />
              <line x1="100" y1="96" x2="100" y2="99" stroke="#E11D48" strokeWidth="1" />
            </g>
          )}

          {/* Whiskers (Black or White based on bodyColor contrast) */}
          {(() => {
            const whiskerColor = (bodyColor === '#1F2937' || bodyColor === '#374151') && breed !== 'siamese' ? '#F3F4F6' : '#4B5563';
            return (
              <g opacity="0.65" stroke={whiskerColor} strokeWidth="1.5" strokeLinecap="round">
                {/* Left side whiskers */}
                <line x1="68" y1="94" x2="48" y2="90" />
                <line x1="66" y1="100" x2="45" y2="100" />
                <line x1="68" y1="106" x2="49" y2="110" />
                {/* Right side whiskers */}
                <line x1="132" y1="94" x2="152" y2="90" />
                <line x1="134" y1="100" x2="155" y2="100" />
                <line x1="132" y1="106" x2="151" y2="110" />
              </g>
            );
          })()}

          {/* Blushing cheeks for cute cats */}
          {eyeType === 'cute' && (
            <g opacity="0.5" fill="#FFAEAE">
              <ellipse cx="68" cy="92" rx="4" ry="2.5" />
              <ellipse cx="132" cy="92" rx="4" ry="2.5" />
            </g>
          )}
        </g>

        {/* 9. HEAD-LEVEL ACCESSORIES (Hats, Sunglasses) */}
        {/* Sunglasses */}
        {hasAccessory('sunglasses') && (
          <g>
            {/* Dark tinted frames */}
            <path d="M 68 85 C 68 76, 92 76, 92 85 C 92 94, 68 94, 68 85 Z" fill="#1F2937" stroke="#111827" strokeWidth="2" />
            <path d="M 108 85 C 108 76, 132 76, 132 85 C 132 94, 108 94, 108 85 Z" fill="#1F2937" stroke="#111827" strokeWidth="2" />
            {/* Connecting bridge */}
            <line x1="92" y1="83" x2="108" y2="83" stroke="#1F2937" strokeWidth="3" />
            {/* Sunglasses temples */}
            <path d="M 68 83 Q 55 80 48 84" fill="none" stroke="#1F2937" strokeWidth="2.5" />
            <path d="M 132 83 Q 145 80 152 84" fill="none" stroke="#1F2937" strokeWidth="2.5" />
            {/* Reflective white dashes */}
            <line x1="72" y1="81" x2="80" y2="89" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
            <line x1="112" y1="81" x2="120" y2="89" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* Detective Hat */}
        {hasAccessory('detective_hat') && (
          <g className="animate-bounce" style={{ transformOrigin: '100px 45px', animationDuration: '4s' }}>
            {/* Cap part */}
            <path d="M 66 45 C 66 22, 134 22, 134 45 Z" fill="#78350F" />
            {/* Hat band */}
            <rect x="65" y="41" width="70" height="6" fill="#451A03" />
            {/* Detective flap front */}
            <ellipse cx="100" cy="45" rx="36" ry="5" fill="#78350F" />
            {/* Detective cute details */}
            <path d="M 95 24 Q 100 21 105 24" fill="none" stroke="#451A03" strokeWidth="2" />
          </g>
        )}

        {/* Crown */}
        {hasAccessory('crown') && (
          <g className="animate-bounce" style={{ transformOrigin: '100px 35px', animationDuration: '3.5s' }}>
            <path d="M 80 45 L 75 25 L 90 35 L 100 20 L 110 35 L 125 25 L 120 45 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            {/* Red crown jewels */}
            <circle cx="75" cy="24" r="2.5" fill="#EF4444" />
            <circle cx="100" cy="19" r="3" fill="#3B82F6" />
            <circle cx="125" cy="24" r="2.5" fill="#EF4444" />
            {/* Crown base detail */}
            <rect x="81" y="41" width="38" height="4" fill="#D97706" rx="1" />
          </g>
        )}

        {/* Party Hat */}
        {hasAccessory('party_hat') && (
          <g className="animate-bounce" style={{ transformOrigin: '100px 40px', animationDuration: '2.8s' }}>
            {/* Main Cone */}
            <polygon points="76,45 124,45 100,10" fill="#EC4899" />
            {/* Cute pom-pom on top */}
            <circle cx="100" cy="8" r="4.5" fill="#3B82F6" />
            {/* Decorative yellow stripes */}
            <path d="M 83 35 L 111 41" stroke="#FBBF24" strokeWidth="3.5" />
            <path d="M 91 22 L 107 26" stroke="#FBBF24" strokeWidth="3.5" />
            {/* Ribbons around base */}
            <path d="M 76 45 Q 68 53 72 58" fill="none" stroke="#EC4899" strokeWidth="1.5" />
            <path d="M 124 45 Q 132 53 128 58" fill="none" stroke="#EC4899" strokeWidth="1.5" />
          </g>
        )}

        {/* 10. NECK-LEVEL ACCESSORIES (Tie, Toast, Collar) */}
        {/* Toast Collar (Funny Meme Accessory) */}
        {hasAccessory('toast_collar') && (
          <g>
            {/* Bread Slice Body */}
            <path
              d="M 50 110 C 50 92, 150 92, 150 110 C 150 135, 145 142, 130 145 C 115 147, 85 147, 70 145 C 55 142, 50 135, 50 110 Z"
              fill="#FCD34D"
              stroke="#D97706"
              strokeWidth="5.5"
            />
            {/* Bread Inner Cutout (fits cat head) */}
            <ellipse cx="100" cy="114" rx="28" ry="14" fill="#FFFFFF" stroke="#9A3412" strokeWidth="2" />
            {/* Toasty details */}
            <ellipse cx="65" cy="103" rx="4" ry="2" fill="#D97706" opacity="0.6" />
            <ellipse cx="135" cy="103" rx="4" ry="2" fill="#D97706" opacity="0.6" />
          </g>
        )}

        {/* Business Tie */}
        {hasAccessory('business_tie') && (
          <g>
            {/* Collar Band */}
            <ellipse cx="100" cy="112" rx="20" ry="4" fill="none" stroke="#EF4444" strokeWidth="3" />
            {/* Red Business Tie */}
            <path d="M 94 113 L 106 113 L 108 128 L 100 138 L 92 128 Z" fill="#EF4444" />
            {/* Cute stripes on tie */}
            <path d="M 94 120 L 104 124" stroke="#FFFFFF" strokeWidth="1.5" />
            <path d="M 93 126 L 102 130" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        )}
      </svg>
    </div>
  );
}
