import Image from 'next/image'

interface LogoProps {
  /** Height of the logo image in px (width scales automatically) */
  height?: number
  className?: string
}

export default function Logo({ height = 36, className = '' }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="JobsFoundry"
      height={height}
      width={height * 3.2}  // logo is roughly 3.2:1 aspect ratio
      className={`object-contain ${className}`}
      priority
    />
  )
}
