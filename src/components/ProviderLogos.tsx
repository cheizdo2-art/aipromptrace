interface LogoProps {
  className?: string;
}

export function GoogleLogo({ className = 'h-4 w-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function NvidiaLogo({ className = 'h-4 w-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8.948 8.798v-1.43a6.7 6.7 0 01.424-.018c3.922-.124 6.417 3.396 6.417 3.396s-2.728 3.882-5.63 3.882c-.428 0-.837-.066-1.211-.196v-4.238l-.002-.004c-1.728.142-2.063 1.386-2.063 1.386l-2.07-1.722S6.49 7.9 8.948 8.798zm0 7.424v.89a10.478 10.478 0 01-4.107-1.291l.764-.877s1.474.86 3.343 1.054v.224zm0-5.478v1.632c-.953-.146-1.47.65-1.47.65l-1.26-.93s.878-1.499 2.73-1.352zm5.652 1.4s-1.726 2.632-4.441 2.874v.862c3.66-.324 6.794-3.736 6.794-3.736s-1.804-3.636-5.377-4.384v.934c2.334.538 3.024 3.45 3.024 3.45zM22 2v20H2V2h20zm-1.2 1.2H3.2v17.6h17.6V3.2z" />
    </svg>
  );
}

export function ArceeLogo({ className = 'h-4 w-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 19h20L12 2zm0 4l6.93 12H5.07L12 6z" />
      <path d="M12 10l3 6H9l3-6z" />
    </svg>
  );
}

export function ZhipuLogo({ className = 'h-4 w-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h16v3H8.5l11 10H20v3H4v-3h11L4.5 7H4V4z" />
    </svg>
  );
}

export function MetaLogo({ className = 'h-4 w-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a4.892 4.892 0 00.684 1.59c.34.473.77.856 1.31 1.104.541.249 1.199.37 1.937.37 1.166 0 2.177-.452 3.126-1.263.948-.811 1.86-2.03 2.763-3.623l.373-.658.373.658c.903 1.593 1.815 2.812 2.763 3.623.949.811 1.96 1.263 3.126 1.263.738 0 1.396-.121 1.937-.37.54-.248.97-.63 1.31-1.104.339-.472.562-1.016.684-1.59.14-.604.21-1.267.21-1.973 0-2.566-.704-5.24-2.044-7.303C17.698 5.31 15.983 4.03 14.015 4.03c-1.166 0-2.177.452-3.126 1.263-.315.27-.618.575-.909.914a10.42 10.42 0 00-.909-.914C8.122 4.482 7.111 4.03 6.915 4.03zm.07 2.044c.913 0 1.818.502 2.623 1.263.406.384.792.84 1.147 1.36L12 10.238l1.245-1.541c.355-.52.741-.976 1.147-1.36.805-.761 1.71-1.263 2.623-1.263 1.26 0 2.463.968 3.378 2.59.915 1.621 1.457 3.865 1.457 6.106 0 .566-.056 1.088-.163 1.543a2.81 2.81 0 01-.397.93c-.165.223-.372.393-.649.52-.277.127-.629.193-1.076.193-.738 0-1.48-.339-2.244-1.003-.764-.664-1.521-1.655-2.282-2.984L12 8.762l-3.039 5.207c-.76 1.329-1.518 2.32-2.282 2.984-.764.664-1.506 1.003-2.244 1.003-.447 0-.799-.066-1.076-.193a1.807 1.807 0 01-.649-.52 2.81 2.81 0 01-.397-.93c-.107-.455-.163-.977-.163-1.543 0-2.24.542-4.485 1.457-6.106.915-1.622 2.118-2.59 3.378-2.59z" />
    </svg>
  );
}

export function MistralLogo({ className = 'h-4 w-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="1" y="3" width="4" height="4" />
      <rect x="19" y="3" width="4" height="4" />
      <rect x="1" y="10" width="4" height="4" />
      <rect x="7" y="10" width="4" height="4" />
      <rect x="13" y="10" width="4" height="4" />
      <rect x="19" y="10" width="4" height="4" />
      <rect x="1" y="17" width="4" height="4" />
      <rect x="19" y="17" width="4" height="4" />
      <rect x="7" y="3" width="4" height="4" opacity="0.6" />
      <rect x="13" y="3" width="4" height="4" opacity="0.4" />
      <rect x="7" y="17" width="4" height="4" opacity="0.4" />
      <rect x="13" y="17" width="4" height="4" opacity="0.6" />
    </svg>
  );
}

export function AlibabaLogo({ className = 'h-4 w-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 5.58 2 10c0 2.52 1.47 4.77 3.77 6.24-.24 1.07-.78 2.66-1.77 3.76 0 0 2.6-.5 4.53-1.82.94.2 1.93.32 2.97.32 5.52 0 10-3.58 10-8s-4.48-8-10-8zm-4 9a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2zm4 0a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  );
}

export function NousLogo({ className = 'h-4 w-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 110 14 7 7 0 010-14zm0 2a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
    </svg>
  );
}

export function StepFunLogo({ className = 'h-4 w-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 3l8 4.5v9L13 21l-8-4.5v-9L13 3zm0 2.25L7 8.25v7.5l6 3 6-3v-7.5l-6-3z" />
      <path d="M13 8v8M9 12h8" />
    </svg>
  );
}

export function OpenAILogo({ className = 'h-4 w-4' }: LogoProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0011.73.44 6.04 6.04 0 005.34 2.697a5.99 5.99 0 00-4.003 2.898 6.042 6.042 0 00.734 7.093 5.98 5.98 0 00.516 4.91 6.04 6.04 0 006.51 2.899 5.99 5.99 0 004.528 2.003 6.04 6.04 0 006.39-2.257 5.99 5.99 0 004.002-2.898 6.04 6.04 0 00-.734-7.093zM12.204 22.44a4.486 4.486 0 01-2.88-1.04c.036-.02.099-.056.14-.08l4.79-2.77a.78.78 0 00.395-.678v-6.76l2.025 1.168a.07.07 0 01.039.052v5.598a4.504 4.504 0 01-4.51 4.51zm-9.686-4.13a4.474 4.474 0 01-.535-3.014c.035.021.098.06.14.084l4.79 2.77a.78.78 0 00.788 0l5.848-3.375v2.337a.072.072 0 01-.028.061l-4.842 2.796a4.504 4.504 0 01-6.16-1.658zm-1.262-10.45A4.478 4.478 0 013.61 5.13v5.676a.77.77 0 00.393.676l5.848 3.374-2.025 1.17a.072.072 0 01-.067.005L2.917 13.234A4.504 4.504 0 011.256 7.86zm16.632 3.873l-5.848-3.376 2.025-1.168a.072.072 0 01.067-.006l4.842 2.796a4.5 4.5 0 01-.697 8.115V12.5a.77.77 0 00-.389-.678zm2.014-3.028a7.108 7.108 0 00-.14-.083l-4.79-2.77a.78.78 0 00-.788 0l-5.848 3.375V7.89a.072.072 0 01.028-.061l4.842-2.794a4.5 4.5 0 016.696 4.67zm-12.66 4.166l-2.025-1.168a.07.07 0 01-.039-.052V6.054a4.5 4.5 0 017.389-3.442c-.036.02-.098.055-.14.08l-4.79 2.77a.78.78 0 00-.395.676v6.733zm1.1-2.368l2.605-1.504 2.605 1.504v3.008l-2.605 1.504-2.605-1.504V10.87z" />
    </svg>
  );
}

const PROVIDER_LOGOS: Record<string, React.FC<LogoProps>> = {
  'Google': GoogleLogo,
  'NVIDIA': NvidiaLogo,
  'Arcee AI': ArceeLogo,
  'Zhipu AI': ZhipuLogo,
  'Meta': MetaLogo,
  'Mistral': MistralLogo,
  'Mistral AI': MistralLogo,
  'Alibaba': AlibabaLogo,
  'NousResearch': NousLogo,
  'StepFun': StepFunLogo,
  'OpenAI': OpenAILogo,
};

export function ProviderLogo({ provider, className = 'h-4 w-4' }: { provider: string; className?: string }) {
  const Logo = PROVIDER_LOGOS[provider];
  if (!Logo) return null;
  return <Logo className={className} />;
}

export default ProviderLogo;
