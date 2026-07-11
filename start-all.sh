#!/bin/bash
# ============================================
# Script de démarrage - Plateforme Formations
# ============================================

set -e

echo "=== 1. Vérification espace disque ==="
df -h /

echo ""
echo "=== 2. Vérification K3s ==="
if ! systemctl is-active --quiet k3s; then
    echo "Démarrage de K3s..."
    sudo systemctl start k3s
    sleep 10
else
    echo "K3s déjà actif"
fi

echo ""
echo "=== 3. Vérification namespace plateforme ==="
kubectl get namespace plateforme >/dev/null 2>&1 || kubectl create namespace plateforme

echo ""
echo "=== 4. Déploiement des services ==="
cd "$(dirname "$0")"

echo "  -> Secrets..."
kubectl apply -f kubernetes/secrets/db-credentials.yaml -n plateforme

echo "  -> Postgres..."
kubectl apply -f kubernetes/postgres/persistent-volume.yaml -n plateforme
kubectl apply -f kubernetes/postgres/deployment.yaml -n plateforme
kubectl apply -f kubernetes/postgres/service.yaml -n plateforme

echo "  -> Frontend..."
kubectl apply -f kubernetes/frontend/deployment.yaml -n plateforme

echo "  -> API Gateway..."
kubectl apply -f kubernetes/api-gateway/deployment.yaml -n plateforme

echo ""
echo "=== 5. Attente des pods (30s) ==="
sleep 10
kubectl wait --for=condition=ready pod -n plateforme -l app=postgres --timeout=60s 2>/dev/null || true
kubectl wait --for=condition=ready pod -n plateforme -l app=frontend --timeout=60s 2>/dev/null || true
kubectl wait --for=condition=ready pod -n plateforme -l app=api-gateway --timeout=60s 2>/dev/null || true

echo ""
echo "=== 6. État des pods ==="
kubectl get pods -n plateforme

echo ""
echo "=== 7. IngressRoute Traefik ==="
kubectl apply -f - <<EOF 2>/dev/null || true
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: frontend
  namespace: plateforme
spec:
  entryPoints:
    - web
  routes:
    - kind: Rule
      match: PathPrefix(\`/\`)
      services:
        - name: frontend
          port: 80
EOF

echo ""
echo "=== 8. Vérification services ==="
kubectl get svc -n plateforme

echo ""
echo "=== 9. Accès ==="
echo "  Frontend : http://localhost:32521"
echo "  API Gateway : http://localhost:8080 (interne)"
echo "  Jenkins : http://localhost:8080"
echo "  SonarQube : http://localhost:9000"
echo "  Grafana : http://localhost:30000"
echo ""
echo "  Depuis machine locale : http://192.168.91.128:32521"
echo ""
echo "=== 10. Nettoyage DiskPressure ==="
kubectl taint nodes --all node.kubernetes.io/disk-pressure:NoSchedule- 2>/dev/null || true

echo ""
echo "=== Démarrage terminé ==="
