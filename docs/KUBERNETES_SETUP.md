# Kubernetes Local Development Setup

This guide explains how to set up the local Kubernetes environment using Minikube, kubectl, and Helm.

## 1. The Tools

### **Minikube** (The Cluster)
Minikube runs a local Kubernetes cluster on your machine. It creates a virtual machine or uses Docker to simulate a production Kubernetes environment.

### **kubectl** (The CLI)
`kubectl` is the command-line tool used to communicate with the Kubernetes cluster. You use it to inspect nodes, pods, services, and logs.

### **Helm** (The Package Manager)
Helm is the package manager for Kubernetes (similar to `npm` for Node.js). It allows you to define, install, and upgrade Kubernetes applications using "Charts".

---

## 2. Installation (macOS)

We recommend using Homebrew:

```bash
brew install kubectl minikube helm
```

## 3. Getting Started

### Start the Cluster
```bash
minikube start
```

### Verify Connection
```bash
kubectl get nodes
```
*You should see one node named "minikube" with status "Ready".*

### Enable Ingress (Optional)
If you need to access services via a URL:
```bash
minikube addons enable ingress
```

## 4. Dashboard
Minikube comes with a built-in dashboard to visualize your cluster:
```bash
minikube dashboard
```