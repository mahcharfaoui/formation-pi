#!/bin/bash
# Script de démarrage VM - lance Jenkins, K3s et ngrok pour le webhook GitHub
# Usage: bash start-vm.sh

echo "=== 1. Vérifier Jenkins ==="
if systemctl is-active --quiet jenkins 2>/dev/null; then
    echo "  Jenkins déjà actif"
else
    echo "  Démarrage Jenkins..."
    sudo systemctl start jenkins
    sleep 5
fi

echo "=== 2. Vérifier K3s ==="
if systemctl is-active --quiet k3s 2>/dev/null; then
    echo "  K3s déjà actif"
    kubectl get pods -n plateforme 2>/dev/null || echo "  Aucun pod dans plateforme"
else
    echo "  K3s non détecté, démarrage..."
    sudo systemctl start k3s 2>/dev/null || echo "  Ignoré"
fi

echo "=== 3. Lancer ngrok (tunnel webhook GitHub) ==="
# Tue un éventuel ancien ngrok
pkill ngrok 2>/dev/null || true
# Lance ngrok en arrière-plan
nohup ngrok http 8080 --log=stdout > /tmp/ngrok.log 2>&1 &
sleep 3

# Récupère l'URL publique ngrok
NGROK_URL=$(curl -s http://127.0.0.1:4040/api/tunnels | grep -o '"public_url":"[^"]*' | head -1 | cut -d'"' -f4)
if [ -n "$NGROK_URL" ]; then
    echo "  ✅ Webhook GitHub : ${NGROK_URL}/github-webhook/"
else
    echo "  ⚠️  ngrok peut ne pas être prêt, vérifie avec : curl http://127.0.0.1:4040/api/tunnels"
fi

echo ""
echo "=== 4. Résumé ==="
echo "  Jenkins         : http://192.168.91.128:8080"
echo "  Webhook URL     : ${NGROK_URL:-non disponible}/github-webhook/"
echo "  Dashboard ngrok : http://127.0.0.1:4040"
echo "  Logs ngrok      : tail -f /tmp/ngrok.log"
echo ""
