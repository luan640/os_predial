import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { changePasswordAction } from "@/lib/actions/auth";

export function ChangePasswordForm({ error, message }: { error?: string; message?: string }) {
  return (
    <form action={changePasswordAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="senhaAtual">Senha atual</Label>
        <Input id="senhaAtual" name="senhaAtual" type="password" required className="h-11 md:h-8" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="novaSenha">Nova senha</Label>
        <Input
          id="novaSenha"
          name="novaSenha"
          type="password"
          minLength={6}
          required
          className="h-11 md:h-8"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
        <Input
          id="confirmarSenha"
          name="confirmarSenha"
          type="password"
          minLength={6}
          required
          className="h-11 md:h-8"
        />
      </div>

      {message && <p className="text-sm text-[color:var(--chart-2)]">{message}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <SubmitButton className="mt-2 h-11 w-full sm:h-8 sm:w-fit sm:self-end">Salvar nova senha</SubmitButton>
    </form>
  );
}
