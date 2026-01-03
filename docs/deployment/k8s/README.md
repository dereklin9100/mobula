# Kubernetes 部署指南 | Kubernetes Deployment Guide

## 前置条件 | Prerequisites

1. 已安装 Kubernetes 集群（版本 1.19+）
2. 已安装 `kubectl` 命令行工具
3. Docker 镜像已推送到镜像仓库（Docker Hub、ECR、或私有仓库）

## 部署步骤 | Deployment Steps

### 1. 构建并推送 Docker 镜像

```bash
# 构建镜像（以 web 为例）
docker build -f Dockerfile.prod -t <registry>/mobula-web:latest --target runner-web .

# 推送到镜像仓库
docker push <registry>/mobula-web:latest

# 重复上述步骤构建 login 和 dashboard 镜像
docker build -f Dockerfile.prod -t <registry>/mobula-login:latest --target runner-login .
docker push <registry>/mobula-login:latest

docker build -f Dockerfile.prod -t <registry>/mobula-dashboard:latest --target runner-dashboard .
docker push <registry>/mobula-dashboard:latest
```

### 2. 更新部署文件中的镜像地址

编辑 `k8s/deployment.yaml`，替换镜像地址：

```yaml
# 将以下内容
image: mobula-web:latest

# 替换为
image: <your-registry>/mobula-web:latest
```

### 3. 创建命名空间并部署应用

```bash
# 应用配置（会自动创建 mobula 命名空间）
kubectl apply -f k8s/deployment.yaml

# 查看部署状态
kubectl get deployments -n mobula

# 查看 Pod 状态
kubectl get pods -n mobula

# 查看服务
kubectl get services -n mobula
```

### 4. 查看日志

```bash
# 查看特定 Pod 的日志
kubectl logs -n mobula <pod-name>

# 实时查看日志
kubectl logs -f -n mobula <pod-name>

# 查看所有 Pods 的日志
kubectl logs -n mobula -l app=web
```

## 配置说明 | Configuration Details

### 副本数量 (Replicas)

默认配置为 2 个副本。可修改 `deployment.yaml` 中的 `replicas` 字段：

```yaml
spec:
  replicas: 3  # 修改为所需数量
```

### 资源限制

每个应用配置了 CPU 和内存限制：

- 请求 (Requests): CPU 250m, 内存 256Mi
- 限制 (Limits): CPU 500m, 内存 512Mi

可根据实际需求调整：

```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### 健康检查

配置了 Liveness 和 Readiness 探针：

```yaml
livenessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 30
```

### 自动扩容 (HPA)

使用水平 Pod 自动扩容器，基于 CPU 和内存使用率：

- 最小副本数: 2
- 最大副本数: 10
- CPU 触发阈值: 70%
- 内存触发阈值: 80%

## 访问应用 | Access Applications

### 使用 LoadBalancer

如果集群支持 LoadBalancer，会自动分配外部 IP：

```bash
kubectl get services -n mobula

# 输出示例：
# NAME        TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)        AGE
# web         LoadBalancer   10.0.0.1        123.456.78.90   80:30000/TCP   5m
```

访问应用：
- Web: http://123.456.78.90
- Login: http://123.456.78.90 (不同端口号)
- Dashboard: http://123.456.78.90 (不同端口号)

### 使用 Port-Forward (开发/测试)

```bash
# Web 应用
kubectl port-forward -n mobula svc/web 3000:80

# Login 应用
kubectl port-forward -n mobula svc/login 3001:80

# Dashboard 应用
kubectl port-forward -n mobula svc/dashboard 3002:80
```

访问: http://localhost:3000

### 使用 Ingress (推荐用于生产)

创建 `k8s/ingress.yaml`：

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

应用 Ingress：

```bash
kubectl apply -f k8s/ingress.yaml
```

## 更新应用 | Update Application

### 滚动更新 (Rolling Update)

```bash
# 更新镜像（自动触发滚动更新）
kubectl set image deployment/web web=<registry>/mobula-web:v2 -n mobula

# 查看更新进度
kubectl rollout status deployment/web -n mobula
```

### 使用 kubectl apply 更新

```bash
# 修改配置后，重新应用
kubectl apply -f k8s/deployment.yaml
```

### 回滚

```bash
# 查看历史版本
kubectl rollout history deployment/web -n mobula

# 回滚到上一个版本
kubectl rollout undo deployment/web -n mobula

# 回滚到指定版本
kubectl rollout undo deployment/web --to-revision=2 -n mobula
```

## 环境变量 | Environment Variables

在 `deployment.yaml` 中使用 ConfigMap 管理环境变量：

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

## 持久化存储 | Persistent Storage

如需存储数据，添加 PersistentVolumeClaim：

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

## 监控和日志 | Monitoring and Logging

### 使用 Prometheus 监控

```bash
# 安装 Prometheus Operator
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring
```

### 使用 Elasticsearch + Kibana 收集日志

```bash
# 安装 Fluent Bit 收集日志到 Elasticsearch
helm repo add fluent https://fluent.github.io/helm-charts
helm install fluent-bit fluent/fluent-bit -n logging
```

## 故障排查 | Troubleshooting

### Pod 无法启动

```bash
# 查看 Pod 描述信息
kubectl describe pod <pod-name> -n mobula

# 查看 Pod 日志
kubectl logs <pod-name> -n mobula

# 查看前一个容器的日志（如果容器重启过）
kubectl logs <pod-name> -n mobula --previous
```

### 连接超时

```bash
# 检查 Service 是否正常
kubectl get svc -n mobula

# 在 Pod 中测试连接
kubectl exec -it <pod-name> -n mobula -- sh
curl http://web:80
```

### 内存泄漏或 CPU 高占用

```bash
# 查看资源使用情况
kubectl top pods -n mobula

# 调整资源限制
kubectl set resources deployment web -n mobula --limits=cpu=1,memory=1Gi --requests=cpu=500m,memory=512Mi
```

## 清理资源 | Cleanup

```bash
# 删除部署（保留命名空间）
kubectl delete deployments -n mobula --all

# 删除整个命名空间
kubectl delete namespace mobula
```

## 生产检查清单 | Production Checklist

- [ ] 更新镜像地址为私有仓库
- [ ] 配置 Ingress 或 LoadBalancer
- [ ] 设置资源限制和请求
- [ ] 配置环保变量和 Secrets
- [ ] 启用日志收集和监控
- [ ] 配置备份和恢复策略
- [ ] 安全审计和 RBAC 配置
- [ ] 网络策略配置
- [ ] 健康检查和告警配置
- [ ] 文档和运维手册

## 参考资源 | References

- [Kubernetes 官方文档](https://kubernetes.io/docs/)
- [Kubernetes Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Kubernetes Services](https://kubernetes.io/docs/concepts/services-networking/service/)
- [Kubernetes HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
