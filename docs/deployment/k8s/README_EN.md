# Kubernetes Deployment Guide | English Version

## Prerequisites

1. Kubernetes cluster installed (version 1.19+)
2. `kubectl` command-line tool installed
3. Docker images pushed to image registry (Docker Hub, ECR, or private registry)

## Deployment Steps

### 1. Build and Push Docker Images

```bash
# Build image (using web as example)
docker build -f Dockerfile.prod -t <registry>/mobula-web:latest --target runner-web .

# Push to image registry
docker push <registry>/mobula-web:latest

# Repeat for login and dashboard
docker build -f Dockerfile.prod -t <registry>/mobula-login:latest --target runner-login .
docker push <registry>/mobula-login:latest

docker build -f Dockerfile.prod -t <registry>/mobula-dashboard:latest --target runner-dashboard .
docker push <registry>/mobula-dashboard:latest
```

### 2. Update Deployment File with Image Addresses

Edit `k8s/deployment.yaml`, replace image addresses:

```yaml
# Change this
image: mobula-web:latest

# To this
image: <your-registry>/mobula-web:latest
```

### 3. Create Namespace and Deploy Applications

```bash
# Apply configuration (automatically creates mobula namespace)
kubectl apply -f k8s/deployment.yaml

# Check deployment status
kubectl get deployments -n mobula

# Check Pod status
kubectl get pods -n mobula

# Check services
kubectl get services -n mobula
```

### 4. View Logs

```bash
# View specific Pod logs
kubectl logs -n mobula <pod-name>

# Real-time logs
kubectl logs -f -n mobula <pod-name>

# View all Pods logs
kubectl logs -n mobula -l app=web
```

## Configuration Explanation

### Replicas

Default configuration uses 2 replicas. Modify `replicas` field in `deployment.yaml`:

```yaml
spec:
  replicas: 3  # Change to desired number
```

### Resource Limits

Each application configured with CPU and memory limits:

- Requests: CPU 250m, Memory 256Mi
- Limits: CPU 500m, Memory 512Mi

Adjust based on actual needs:

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### Health Checks

Configured Liveness and Readiness probes:

```yaml
livenessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 30
```

### Horizontal Pod Autoscaler (HPA)

HPA configured based on CPU and memory usage:

- Minimum replicas: 2
- Maximum replicas: 10
- CPU trigger threshold: 70%
- Memory trigger threshold: 80%

## Access Applications

### Using LoadBalancer

If cluster supports LoadBalancer, external IP automatically assigned:

```bash
kubectl get services -n mobula

# Example output:
# NAME        TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)        AGE
# web         LoadBalancer   10.0.0.1        123.456.78.90   80:30000/TCP   5m
```

Access applications:
- Web: http://123.456.78.90
- Login: http://123.456.78.90 (different port)
- Dashboard: http://123.456.78.90 (different port)

### Using Port-Forward (Development/Testing)

```bash
# Web application
kubectl port-forward -n mobula svc/web 3000:80

# Login application
kubectl port-forward -n mobula svc/login 3001:80

# Dashboard application
kubectl port-forward -n mobula svc/dashboard 3002:80
```

Access: http://localhost:3000

### Using Ingress (Recommended for Production)

Create `k8s/ingress.yaml`:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mobula-ingress
  namespace: mobula
spec:
  ingressClassName: nginx
  rules:
  - host: web.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web
            port:
              number: 80
  - host: login.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: login
            port:
              number: 80
  - host: dashboard.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: dashboard
            port:
              number: 80
```

Apply Ingress:

```bash
kubectl apply -f k8s/ingress.yaml
```

## Application Updates

### Rolling Update

```bash
# Update image (automatically triggers rolling update)
kubectl set image deployment/web web=<registry>/mobula-web:v2 -n mobula

# Check update progress
kubectl rollout status deployment/web -n mobula
```

### Using kubectl apply

```bash
# After modifying config, reapply
kubectl apply -f k8s/deployment.yaml
```

### Rollback

```bash
# View version history
kubectl rollout history deployment/web -n mobula

# Rollback to previous version
kubectl rollout undo deployment/web -n mobula

# Rollback to specific version
kubectl rollout undo deployment/web --to-revision=2 -n mobula
```

## Environment Variables

Use ConfigMap to manage environment variables in `deployment.yaml`:

```yaml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: mobula
data:
  NODE_ENV: production
  NEXT_PUBLIC_API_URL: https://api.example.com

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
  namespace: mobula
spec:
  template:
    spec:
      containers:
      - name: web
        envFrom:
        - configMapRef:
            name: app-config
```

## Persistent Storage

For data storage, add PersistentVolumeClaim:

```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: web-pvc
  namespace: mobula
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  template:
    spec:
      containers:
      - name: web
        volumeMounts:
        - name: data
          mountPath: /app/data
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: web-pvc
```

## Monitoring and Logging

### Using Prometheus for Monitoring

```bash
# Install Prometheus Operator
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring
```

### Using Elasticsearch + Kibana for Logging

```bash
# Install Fluent Bit to collect logs to Elasticsearch
helm repo add fluent https://fluent.github.io/helm-charts
helm install fluent-bit fluent/fluent-bit -n logging
```

## Troubleshooting

### Pod Cannot Start

```bash
# View Pod description
kubectl describe pod <pod-name> -n mobula

# View Pod logs
kubectl logs <pod-name> -n mobula

# View previous container logs (if container restarted)
kubectl logs <pod-name> -n mobula --previous
```

### Connection Timeout

```bash
# Check Service status
kubectl get svc -n mobula

# Test connection in Pod
kubectl exec -it <pod-name> -n mobula -- sh
curl http://web:80
```

### Memory Leak or High CPU Usage

```bash
# Check resource usage
kubectl top pods -n mobula

# Adjust resource limits
kubectl set resources deployment web -n mobula --limits=cpu=1,memory=1Gi --requests=cpu=500m,memory=512Mi
```

## Cleanup

```bash
# Delete deployments (keep namespace)
kubectl delete deployments -n mobula --all

# Delete entire namespace
kubectl delete namespace mobula
```

## Production Checklist

- [ ] Update image address to private registry
- [ ] Configure Ingress or LoadBalancer
- [ ] Set resource limits and requests
- [ ] Configure environment variables and Secrets
- [ ] Enable log collection and monitoring
- [ ] Configure backup and recovery strategies
- [ ] Security audit and RBAC configuration
- [ ] Network policy configuration
- [ ] Health check and alert configuration
- [ ] Documentation and operations manual

## References

- [Kubernetes Official Documentation](https://kubernetes.io/docs/)
- [Kubernetes Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Kubernetes Services](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Kubernetes HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
