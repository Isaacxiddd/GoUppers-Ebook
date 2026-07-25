<#
  Inyecta las variables de entorno en Vercel (production) leyendo un archivo
  .env.production.local con las claves REALES. Usar DESPUES de crear las claves
  en Stripe y Supabase.

  Uso:
    1) Copiá .env.example -> .env.production.local y completá los valores reales.
    2) vercel link         (una sola vez, para asociar la carpeta al proyecto)
    3) ./scripts/set-vercel-env.ps1

  Requiere estar logueado: vercel whoami
#>

$ErrorActionPreference = "Stop"
$envFile = Join-Path $PSScriptRoot "..\.env.production.local"

if (-not (Test-Path $envFile)) {
  Write-Error "No existe .env.production.local. Copiá .env.example y completá las claves reales."
}

# Variables que van a Vercel (server-only salvo las NEXT_PUBLIC_).
$keys = @(
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_ID",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_EBOOK_BUCKET",
  "SUPABASE_EBOOK_PATH",
  "NEXT_PUBLIC_APP_URL"
)

# Parseá el .env en un hashtable.
$values = @{}
Get-Content $envFile | ForEach-Object {
  $line = $_.Trim()
  if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
    $idx = $line.IndexOf("=")
    $k = $line.Substring(0, $idx).Trim()
    $v = $line.Substring($idx + 1).Trim()
    $values[$k] = $v
  }
}

foreach ($key in $keys) {
  $val = $values[$key]
  if ([string]::IsNullOrWhiteSpace($val) -or $val -like "*...*") {
    Write-Warning "Salteando $key (vacío o placeholder)."
    continue
  }
  Write-Host "Seteando $key en production..." -ForegroundColor Cyan
  # Quitá el valor previo si existe (ignorá el error si no existía), luego agregá.
  try { vercel env rm $key production --yes 2>$null } catch {}
  $val | vercel env add $key production
}

Write-Host "`nListo. Redeploy para aplicar:  vercel --prod" -ForegroundColor Green
