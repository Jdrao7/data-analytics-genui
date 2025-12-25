'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    glow?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    glow = false,
    className = '',
    disabled,
    ...props
}, ref) => {
    const baseStyles = `
    relative inline-flex items-center justify-center font-medium rounded-xl
    transition-all duration-200 ease-out
    active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
  `;

    const variants = {
        primary: `
      bg-gradient-to-r from-violet-600 to-purple-600 text-white
      hover:from-violet-500 hover:to-purple-500
      focus:ring-violet-500
      ${glow ? 'shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]' : ''}
    `,
        secondary: `
      bg-white/10 text-white border border-white/20
      hover:bg-white/20 hover:border-white/30
      focus:ring-white/50
    `,
        ghost: `
      bg-transparent text-gray-400
      hover:bg-white/10 hover:text-white
      focus:ring-white/30
    `,
        danger: `
      bg-gradient-to-r from-red-600 to-rose-600 text-white
      hover:from-red-500 hover:to-rose-500
      focus:ring-red-500
    `,
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-5 py-2.5 text-sm gap-2',
        lg: 'px-8 py-4 text-base gap-2',
    };

    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading && (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            {children}

            {/* Ripple effect layer */}
            <span className="absolute inset-0 rounded-xl overflow-hidden">
                <span className="absolute inset-0 transform scale-0 bg-white/20 rounded-xl transition-transform duration-500 group-active:scale-100" />
            </span>
        </button>
    );
});

Button.displayName = 'Button';
export { Button };

// Shimmer loading skeleton
export function Skeleton({ className = '', variant = 'default' }: { className?: string; variant?: 'default' | 'circular' | 'text' }) {
    const baseStyles = 'animate-shimmer bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%]';

    const variants = {
        default: 'rounded-lg',
        circular: 'rounded-full',
        text: 'rounded h-4',
    };

    return <div className={`${baseStyles} ${variants[variant]} ${className}`} />;
}

// Card with hover effects
export function GlowCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`
      group relative p-6 rounded-2xl
      bg-white/5 border border-white/10
      transition-all duration-300
      hover:border-violet-500/50 hover:bg-white/10
      hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]
      hover:scale-[1.02]
      ${className}
    `}>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-violet-500/10 to-purple-500/10 pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

// Input with focus glow
export function GlowInput({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`
        w-full px-4 py-3 rounded-xl
        bg-white/5 border border-white/10 text-white
        placeholder-gray-500
        transition-all duration-200
        focus:outline-none focus:border-violet-500/50
        focus:bg-white/10 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)]
        ${className}
      `}
            {...props}
        />
    );
}
