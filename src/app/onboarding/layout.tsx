import { Building2 } from "lucide-react";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8 flex items-center gap-2 text-foreground">
        <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Building2 className="size-5" />
        </span>
        <span className="text-lg font-semibold tracking-tight">ObraCerta</span>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
