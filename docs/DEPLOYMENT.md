# Deployment Guide

## Prerequisites

- Kubernetes cluster (GKE, EKS, AKS, or local)
- kubectl CLI
- Docker
- GitHub account for CI/CD

## Docker Deployment

### Using Docker Compose (Development)

```bash
# Clone repository
git clone https://github.com/monkeymadness98/AetherCrown98.git
cd AetherCrown98

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# Start services
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# View logs
docker-compose -f infrastructure/docker/docker-compose.yml logs -f

# Stop services
docker-compose -f infrastructure/docker/docker-compose.yml down
```

Access:
- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- Redis: localhost:6379

### Enable Blockchain (Optional)

```bash
# Start with blockchain profile
docker-compose -f infrastructure/docker/docker-compose.yml --profile blockchain up -d
```

## Kubernetes Deployment

### 1. Build and Push Docker Images

```bash
# Build backend
cd backend
docker build -t your-registry/aethercrown-backend:latest .
docker push your-registry/aethercrown-backend:latest

# Build frontend
cd ../frontend
docker build -t your-registry/aethercrown-frontend:latest .
docker push your-registry/aethercrown-frontend:latest
```

### 2. Update Kubernetes Manifests

Update image references in:
- `infrastructure/kubernetes/backend-deployment.yaml`
- `infrastructure/kubernetes/frontend-deployment.yaml`

Replace `aethercrown98/backend:latest` with your image.

### 3. Deploy to Kubernetes

```bash
# Apply all manifests
kubectl apply -f infrastructure/kubernetes/

# Verify deployments
kubectl get deployments
kubectl get pods
kubectl get services

# Check logs
kubectl logs -f deployment/aethercrown-backend
kubectl logs -f deployment/aethercrown-frontend
```

### 4. Configure Secrets

```bash
# Create secrets for environment variables
kubectl create secret generic backend-secrets \
  --from-literal=SUPABASE_URL=your_url \
  --from-literal=SUPABASE_KEY=your_key \
  --from-literal=STRIPE_SECRET_KEY=your_key \
  --from-literal=OPENAI_API_KEY=your_key

# Update deployment to use secrets
# Add to backend-deployment.yaml:
env:
  - name: SUPABASE_URL
    valueFrom:
      secretKeyRef:
        name: backend-secrets
        key: SUPABASE_URL
```

### 5. Configure Auto-Scaling

The HPA is already configured in `backend-deployment.yaml`:
- Min replicas: 3
- Max replicas: 10
- CPU target: 70%
- Memory target: 80%

Monitor scaling:
```bash
kubectl get hpa
kubectl describe hpa backend-hpa
```

### 6. Expose Services

For production, configure ingress:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: aethercrown-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - api.aethercrown.com
    - app.aethercrown.com
    secretName: aethercrown-tls
  rules:
  - host: api.aethercrown.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 3000
  - host: app.aethercrown.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
```

Apply ingress:
```bash
kubectl apply -f ingress.yaml
```

## CI/CD Setup

### 1. Configure GitHub Secrets

Add to your repository secrets:
- `KUBE_CONFIG`: Base64-encoded kubeconfig file
- `DOCKER_REGISTRY_TOKEN`: Container registry token

```bash
# Encode kubeconfig
cat ~/.kube/config | base64
```

### 2. GitHub Actions Workflow

Already configured in `.github/workflows/ci-cd.yml`

Features:
- Automated testing
- Security scanning
- Docker image building
- Kubernetes deployment
- Dependency updates

### 3. Trigger Deployment

```bash
# Push to main branch
git push origin main

# Or create a pull request
```

## Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:3000/health

# Kubernetes health
kubectl get pods
kubectl describe pod <pod-name>
```

### Logs

```bash
# View backend logs
kubectl logs -f deployment/aethercrown-backend

# View frontend logs
kubectl logs -f deployment/aethercrown-frontend

# View all logs
kubectl logs -f -l app=aethercrown
```

### Metrics

```bash
# Pod metrics
kubectl top pods

# Node metrics
kubectl top nodes

# HPA status
kubectl get hpa
```

## Backup & Recovery

### Database Backup

```bash
# Backup Supabase (configure in your Supabase dashboard)
# Enable automatic backups
# Configure retention period

# Manual backup
pg_dump -h <supabase-host> -U postgres -d <database> > backup.sql
```

### Redis Backup

```bash
# Redis persistence is configured in docker-compose.yml
# Data is stored in redis-data volume

# Manual backup
kubectl exec -it <redis-pod> -- redis-cli BGSAVE
```

## Scaling

### Manual Scaling

```bash
# Scale backend
kubectl scale deployment aethercrown-backend --replicas=5

# Scale frontend
kubectl scale deployment aethercrown-frontend --replicas=5
```

### Auto-Scaling

Auto-scaling is configured via HPA. Monitor with:
```bash
kubectl get hpa -w
```

## Troubleshooting

### Pod Not Starting

```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Service Not Accessible

```bash
kubectl get services
kubectl describe service <service-name>
kubectl get endpoints
```

### Database Connection Issues

1. Check Supabase credentials in secrets
2. Verify network policies
3. Check connection strings

### High Memory/CPU Usage

1. Check HPA scaling
2. Review logs for errors
3. Optimize queries
4. Increase resource limits

## Production Checklist

- [ ] Configure environment variables
- [ ] Set up database backups
- [ ] Configure SSL/TLS certificates
- [ ] Set up monitoring and alerting
- [ ] Configure log aggregation
- [ ] Test auto-scaling
- [ ] Run security scans
- [ ] Configure rate limiting
- [ ] Set up CDN
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Test disaster recovery
- [ ] Document runbook procedures

## Updating

### Rolling Update

```bash
# Update backend
kubectl set image deployment/aethercrown-backend backend=your-registry/aethercrown-backend:v2

# Monitor rollout
kubectl rollout status deployment/aethercrown-backend

# Rollback if needed
kubectl rollout undo deployment/aethercrown-backend
```

### Zero-Downtime Deployment

Already configured with:
- Rolling update strategy
- Health checks
- Readiness probes
- Multiple replicas

## Cost Optimization

1. **Right-size resources**: Adjust CPU/memory limits based on actual usage
2. **Auto-scaling**: Use HPA to scale down during low traffic
3. **Spot instances**: Use for non-critical workloads
4. **Cache optimization**: Leverage Redis for caching
5. **CDN**: Use CDN for static assets

## Security

1. **Network policies**: Restrict pod-to-pod communication
2. **RBAC**: Configure role-based access control
3. **Secrets management**: Use Kubernetes secrets or external secret managers
4. **Security scanning**: Automated via CI/CD
5. **SSL/TLS**: Enable HTTPS for all endpoints
6. **API rate limiting**: Configured in backend

## Support

For issues:
1. Check logs
2. Review documentation
3. Open GitHub issue
4. Check Kubernetes events
