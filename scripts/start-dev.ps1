# Sobe o servidor Next.js numa janela separada, espera ficar pronto e só então abre o navegador.
# Evita abrir o navegador antes do servidor responder (causa do bug original do .bat).

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Start-Process cmd -ArgumentList '/k', 'npm run dev' -WindowStyle Normal

Write-Host "Aguardando o servidor ficar pronto em http://localhost:3000 ..."

$ready = $false
for ($i = 0; $i -lt 60; $i++) {
    try {
        Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2 | Out-Null
        $ready = $true
        break
    } catch {
        Start-Sleep -Seconds 1
    }
}

if ($ready) {
    Write-Host "Servidor pronto! Abrindo o navegador..."
    Start-Process "http://localhost:3000"
} else {
    Write-Host "O servidor nao respondeu em 60 segundos. Verifique a janela do 'npm run dev' para erros."
}
