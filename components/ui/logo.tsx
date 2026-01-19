import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Image
          src="/images/crimesafe-logo.png"
          alt="CrimeSafe Logo"
          width={size === "sm" ? 24 : size === "md" ? 32 : 48}
          height={size === "sm" ? 24 : size === "md" ? 32 : 48}
          className={`${sizeClasses[size]} object-contain`}
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold text-foreground leading-none`}>
            Crime<span className="text-primary">Safe</span>
          </h1>
          <p className="text-xs text-muted-foreground leading-none">Secure Reporting</p>
        </div>
      )}
    </div>
  )
}
