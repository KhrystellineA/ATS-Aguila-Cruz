export default function Background3D() {
  // Generate random positions for floating cubes
  const cubes = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${15 + Math.random() * 10}s`,
    size: 30 + Math.random() * 30,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(124, 58, 237, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>

      {/* 3D Perspective Grid Floor */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-30" style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(124, 58, 237, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'rotateX(60deg)',
          animation: 'grid-move 20s linear infinite',
        }}></div>
      </div>

      {/* Floating 3D Cubes */}
      {cubes.map(cube => (
        <div
          key={cube.id}
          className="absolute"
          style={{
            top: cube.top,
            left: cube.left,
            animation: `float-rotate ${cube.duration} infinite linear`,
            animationDelay: cube.delay,
          }}
        >
          <div
            className="relative"
            style={{
              width: `${cube.size}px`,
              height: `${cube.size}px`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* 6 faces of cube */}
            <div className="absolute inset-0 border border-purple-700/30 bg-purple-900/10" style={{ transform: `translateZ(${cube.size/2}px)` }}></div>
            <div className="absolute inset-0 border border-purple-700/30 bg-purple-900/10" style={{ transform: `rotateY(180deg) translateZ(${cube.size/2}px)` }}></div>
            <div className="absolute inset-0 border border-purple-700/30 bg-purple-900/10" style={{ transform: `rotateY(90deg) translateZ(${cube.size/2}px)` }}></div>
            <div className="absolute inset-0 border border-purple-700/30 bg-purple-900/10" style={{ transform: `rotateY(-90deg) translateZ(${cube.size/2}px)` }}></div>
            <div className="absolute inset-0 border border-purple-700/30 bg-purple-900/10" style={{ transform: `rotateX(90deg) translateZ(${cube.size/2}px)` }}></div>
            <div className="absolute inset-0 border border-purple-700/30 bg-purple-900/10" style={{ transform: `rotateX(-90deg) translateZ(${cube.size/2}px)` }}></div>
          </div>
        </div>
      ))}

      {/* Vertical and horizontal grid lines */}
      <div className="absolute inset-0 opacity-10" style={{
        background: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 49px,
            rgba(124, 58, 237, 0.2) 50px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 49px,
            rgba(124, 58, 237, 0.2) 50px
          )
        `
      }}></div>

      {/* Diagonal lines */}
      <div className="absolute inset-0 opacity-5" style={{
        background: `
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 100px,
            rgba(124, 58, 237, 0.3) 100px,
            rgba(124, 58, 237, 0.3) 101px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 100px,
            rgba(124, 58, 237, 0.3) 100px,
            rgba(124, 58, 237, 0.3) 101px
          )
        `
      }}></div>

      {/* Radial glow in center */}
      <div className="absolute inset-0 opacity-20" style={{
        background: 'radial-gradient(ellipse at center, rgba(124, 58, 237, 0.4) 0%, transparent 70%)'
      }}></div>
    </div>
  );
}
