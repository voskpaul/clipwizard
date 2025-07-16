"use client"

import { useEffect, useRef } from "react"

interface AnimatedBackgroundProps {
  variant?: "gradient" | "particles" | "waves" | "geometric"
  className?: string
}

export function AnimatedBackground({ variant = "gradient", className = "" }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let animationId: number

    if (variant === "particles") {
      const particles: Array<{
        x: number
        y: number
        vx: number
        vy: number
        size: number
        opacity: number
      }> = []

      // Create particles
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        })
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        particles.forEach((particle) => {
          particle.x += particle.vx
          particle.y += particle.vy

          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(147, 51, 234, ${particle.opacity})`
          ctx.fill()
        })

        animationId = requestAnimationFrame(animate)
      }

      animate()
    } else if (variant === "waves") {
      let time = 0

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, "rgba(147, 51, 234, 0.1)")
        gradient.addColorStop(1, "rgba(59, 130, 246, 0.1)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.moveTo(0, canvas.height)

        for (let x = 0; x <= canvas.width; x += 10) {
          const y = canvas.height * 0.7 + Math.sin((x + time) * 0.01) * 50
          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.closePath()
        ctx.fill()

        time += 2
        animationId = requestAnimationFrame(animate)
      }

      animate()
    } else if (variant === "geometric") {
      let rotation = 0

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        for (let i = 0; i < 6; i++) {
          ctx.save()
          ctx.translate(centerX, centerY)
          ctx.rotate((rotation + i * 60) * (Math.PI / 180))

          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 200)
          gradient.addColorStop(0, `rgba(147, 51, 234, ${0.1 - i * 0.01})`)
          gradient.addColorStop(1, "rgba(147, 51, 234, 0)")

          ctx.fillStyle = gradient
          ctx.fillRect(-100, -100, 200, 200)
          ctx.restore()
        }

        rotation += 0.5
        animationId = requestAnimationFrame(animate)
      }

      animate()
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [variant])

  if (variant === "gradient") {
    return (
      <div
        className={`fixed inset-0 -z-10 ${className}`}
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
          `,
        }}
      />
    )
  }

  return <canvas ref={canvasRef} className={`fixed inset-0 -z-10 ${className}`} />
}
