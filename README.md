# KubeSQL

A CLI tool that lets you manage Kubernetes resources using familiar SQL syntax — create, query, update, and delete cluster objects without writing YAML.

```bash
# Create a namespace
ksql create namespace "(name my-namespace)"

# List all secrets in a namespace
ksql -q "select * from my-namespace where resource=secret"

# Delete a deployment
ksql delete from my-namespace where resource=Deployment and name=my-app
```

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [CREATE](#create)
  - [SELECT](#select)
  - [UPDATE](#update)
  - [DELETE](#delete)
- [Supported Resources](#supported-resources)
- [Command Reference](#command-reference)
- [License](#license)

---

## Overview

KubeSQL (package name: `ksql`) translates SQL-style commands into Kubernetes API calls using the official `@kubernetes/client-node` SDK. It reads your existing kubeconfig and connects to whichever cluster is set as the current context — no extra configuration needed.

The goal is to reduce the cognitive overhead of `kubectl` flags and YAML manifests for common day-to-day operations.

---

## Prerequisites

- **Node.js** v14 or later
- **kubectl** configured with a valid `kubeconfig` (the tool reads `~/.kube/config` by default)
- An accessible Kubernetes cluster

---

## Installation

```bash
# Clone the repository
git clone https://github.com/manshaaazar/kubesql.git
cd kubesql

# Install dependencies
npm install

# Install globally so the `ksql` command is available anywhere
npm install -g .
```

After global installation, verify it works:

```bash
ksql --version
# 1.0.0
```

---

## Usage

### CREATE

Create any Kubernetes resource with a `(key value, key value, ...)` argument list.

**Syntax**

```
ksql create <resource> [name] "(key value, key value, ...)"
```

**Examples**

```bash
# Namespace
ksql create namespace "(name my-namespace)"
ksql create n "(name my-namespace)"

# Secret
ksql create secret my-secret "(namespace default,username admin,password s3cr3t)"
ksql create sec my-secret "(namespace default,username admin,password s3cr3t)"

# Service
ksql create service my-svc "(namespace default,type LoadBalancer,app nginx,port 3000)"
ksql create ser my-svc "(namespace default,type LoadBalancer,app nginx,port 3000)"

# ServiceAccount
ksql create serviceAccount my-sa "(namespace default,secret token-secret)"
ksql create sa my-sa "(namespace default,secret token-secret)"

# Deployment
ksql create deployment my-app "(namespace default,image myrepo/myapp:latest,port 8080,label my-app)"
ksql create deploy my-app "(namespace default,image myrepo/myapp:latest,port 8080,label my-app)"

# PersistentVolume
ksql create persistentVolume my-pv "(namespace default,label my-pv,storage 5Gi,accessModes ReadWriteOnce,sc default,reclaimPolicy Retain)"
ksql create pv my-pv "(namespace default,label my-pv,storage 5Gi,accessModes ReadWriteOnce,sc default,reclaimPolicy Retain)"

# PersistentVolumeClaim
ksql create persistentVolumeClaim my-pvc "(namespace default,label my-pvc,pvSelector my-pv,accessModes ReadWriteOnce,sc default,storage 1Gi)"
ksql create pvc my-pvc "(namespace default,label my-pvc,pvSelector my-pv,accessModes ReadWriteOnce,sc default,storage 1Gi)"

# ResourceQuota
ksql create resourceQuota my-quota "(namespace default,configmaps 5,secrets 10)"
ksql create rq my-quota "(namespace default,configmaps 5,secrets 10)"

# Role
ksql create role my-role "(namespace default, get deployments services, create deployments)"
ksql create r my-role "(namespace default, get deployments services)"

# RoleBinding
ksql create rolebinding my-rb "(namespace default,subjectKind ServiceAccount,subjectName my-sa,role my-role)"
ksql create rb my-rb "(namespace default,subjectKind ServiceAccount,subjectName my-sa,role my-role)"

# ClusterRole
ksql create clusterRole my-cr "(namespace default, get deployments services)"
ksql create cr my-cr "(namespace default, get deployments services)"

# ClusterRoleBinding
ksql create clusterRoleBinding my-crb "(namespace default,subjectKind ServiceAccount,subjectName my-sa,role my-cr)"
ksql create crb my-crb "(namespace default,subjectKind ServiceAccount,subjectName my-sa,role my-cr)"

# Tekton ImageConfig (sets up pipeline resources for building images)
ksql create imageConfig my-img "(gitUrl https://github.com/user/repo.git,branch main,imageUrl myrepo/myapp:latest)"
ksql create iConfig my-img "(gitUrl https://github.com/user/repo.git,branch main,imageUrl myrepo/myapp:latest)"

# Tekton ImageBuilder (triggers the image build pipeline)
ksql create imageBuilder my-build "(namespace default,sa my-sa,gitResources my-img,registryResource my-img)"
ksql create iBuilder my-build "(namespace default,sa my-sa,gitResources my-img,registryResource my-img)"
```

---

### SELECT

Query resources using standard SQL SELECT syntax. Pass the query string with the `-q` flag.

**Syntax**

```
ksql -q "select <columns> from <namespace> where resource=<ResourceType>"
```

Use `*` to list all resources of that type in the namespace, or specify individual resource names as columns.

**Examples**

```bash
# List all deployments in the default namespace
ksql -q "select * from default where resource=deployment"

# Fetch a specific secret
ksql -q "select my-secret from default where resource=secret"

# Fetch multiple resources by name
ksql -q "select secret-a,secret-b from default where resource=secret"

# Get a service
ksql -q "select my-svc from default where resource=service"

# Get a pod
ksql -q "select my-pod from default where resource=pod"
```

Supported resource types for SELECT:

| Type | Alias |
|------|-------|
| `deployment` | |
| `secret` | |
| `service` | |
| `serviceaccount` | |
| `namespace` | |
| `role` | |
| `rolebinding` | |
| `clusterrole` | |
| `clusterrolebinding` | |
| `persistentvolume` | `pv` |
| `persistentvolumeclaim` | `pvc` |
| `resourcequota` | |
| `pod` | |
| `podlogs` | |
| `imageconfig` | `iconfig` |
| `imagebuilder` | `ibuilder` |

---

### UPDATE

Modify existing resources with a SQL UPDATE statement.

**Syntax**

```
ksql -q "update <name> set key=value, ... where resource=<Type> and namespace=<namespace>"
```

**Examples**

```bash
# Update a deployment's image
ksql -q "update my-app set image=myrepo/myapp:v2 where resource=deployment and namespace=default"

# Update a secret value
ksql -q "update my-secret set password=newpassword where resource=secret and namespace=default"

# Resize a PersistentVolumeClaim
ksql -q "update my-pvc set storage=10Gi where resource=pvc and namespace=default"
```

---

### DELETE

Delete a resource using a natural-language SQL DELETE expression.

**Syntax**

```
ksql delete from <namespace> where resource=<ResourceType> and name=<resourceName>
```

**Examples**

```bash
# Delete a deployment
ksql delete from default where resource=Deployment and name=my-app

# Delete a secret
ksql delete from default where resource=Secret and name=my-secret

# Delete a namespace
ksql delete from default where resource=Namespace and name=my-namespace

# Delete a Role
ksql delete from default where resource=Role and name=my-role

# Delete Tekton pipeline resources
ksql delete from default where resource=imageConfig and name=my-img
```

---

## Supported Resources

| Resource | CREATE alias | Notes |
|----------|-------------|-------|
| Namespace | `n` | |
| Secret | `sec` | |
| Service | `ser` | |
| ServiceAccount | `sa` | |
| Deployment | `deploy` | Supports volume mounts |
| PersistentVolume | `pv` | |
| PersistentVolumeClaim | `pvc` | |
| ResourceQuota | `rq` | |
| Role | `r` | |
| RoleBinding | `rb` | |
| ClusterRole | `cr` | |
| ClusterRoleBinding | `crb` | |
| ImageConfig | `iConfig` | Requires Tekton |
| ImageBuilder | `iBuilder` | Requires Tekton |

---

## Command Reference

```
ksql create <resource> [name] "(key value, ...)"   Create a Kubernetes resource
ksql delete from <ns> where resource=<R> and name=<n>  Delete a resource
ksql -q "<SQL>"                                    Execute a SELECT or UPDATE query
ksql --help                                        Show help
ksql --version                                     Show version
```

For per-resource help:

```bash
ksql create --help
ksql create deployment --help
```

---

## License

MIT — see [LICENSE](LICENSE) for details.
