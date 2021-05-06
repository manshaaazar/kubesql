const _ = require("lodash");
module.exports = {
  namespace(values) {
    return {
      apiVersion: "v1",
      kind: "Namespace",
      metadata: {
        name: `${values.name}`,
      },
    };
  },
  secret(values) {
    let data = {};
    let metadata = {};
    let type = "";
    if (values.type === "dockerconfigjson") {
      data = {
        ".dockerconfigjson": `| ${values.dockerconfigjson}`,
      };
      type = values.type;
      metadata = {
        name: values.name,
        ...(values.namespace && { namespace: values.namespace }),
      };
    } else if (values.type === "dockercfg") {
      type = values.type;
      data = {
        ".dockercfg": `| ${values.dockercfg}`,
      };
      metadata = {
        name: values.name,
        ...(values.namespace && { namespace: values.namespace }),
      };
    } else if (values.type === "sa") {
      data = values.data;
      metadata = {
        name: values.name,
        ...(values.namespace && { namespace: values.namespace }),
        annotations: {
          "kubernetes.io/service-account.name": values.sa,
        },
      };
      type = values.type;
    } else if (values.type === "opaque") {
      // encode whole keys values.keys object
      let encodedData = {};
      const dataKeys = Object.keys(values.data);
      dataKeys.forEach((key) => {
        console.log("key", key);
        const encodedValue = Buffer.from(values.data[key]).toString("base64");
        encodedData[`${key}`] = encodedValue;
      });
      console.log("encodedData", encodedData);
      data = encodedData;
      type = _.capitalize(values.type);

      metadata = {
        name: values.name,
        ...(values.namespace && { namespace: values.namespace }),
      };
    }
    return {
      apiVersion: "v1",
      kind: "Secret",
      metadata,
      type,
      data,
    };
  },
  service(values) {
    return {
      apiVersion: "v1",
      kind: "Service",
      metadata: {
        name: values.name,
        ...(values.namespace && { namespace: values.namespace }),
      },
      spec: {
        type: values.type,
        selector: {
          app: values.app,
        },
        ports: [
          {
            port: parseInt(values.port),
            targetPort: parseInt(values.port),
          },
        ],
      },
    };
  },
  pvc(values) {
    return {
      apiVersion: "v1",
      kind: "PersistentVolumeClaim",
      metadata: {
        name: values.name,
        ...(values.namespace && { namespace: values.namespace }),
        ...(values.label && { labels: { pvc: values.label } }),
      },
      spec: {
        ...(values.pvSelector && {
          selector: {
            matchLabels: {
              pvc: values.pvSelector,
            },
          },
        }),

        storageClassName: values.sc,
        accessModes: [`${values.accessModes}`],
        resources: {
          requests: {
            storage: values.storage,
          },
        },
      },
    };
  },
  pv(values) {
    return {
      apiVersion: "v1",
      kind: "PersistentVolume",
      metadata: {
        name: values.name,
        ...(values.namespace && { namespace: values.namespace }),
        ...(values.label && {
          labels: {
            pv: values.label,
          },
        }),
      },
      spec: {
        capacity: {
          storage: values.storage,
        },
        accessModes: [`${values.accessModes}`],
        ...(values.reclaimPolicy && {
          persistentVolumeReclaimPolicy: values.reclaimPolicy,
        }),
        storageClassName: values.sc,
      },
    };
  },
  resourceQuota(values, namespace) {
    return {
      apiVersion: "v1",
      kind: "ResourceQuota",
      metadata: {
        name: values.name,
        namespace: namespace,
      },
      spec: {
        hard: {
          ...(values.data.configmaps && { configmaps: values.data.configmaps }),
          ...(values.data.persistentvolumeclaims && {
            persistentvolumeclaims: values.data.persistentvolumeclaims,
          }),
          ...(values.data.pods && { pods: values.data.pods }),
          ...(values.data.replicationcontrollers && {
            replicationcontrollers: values.data.replicationcontrollers,
          }),
          ...(values.data.secrets && { secrets: values.data.secrets }),
          ...(values.data.services && { services: values.data.services }),
          ...(values.data.loadBalancers && {
            "services.loadBalancers": values.data.loadBalancers,
          }),
          ...(values.data.deployments && {
            "deployments.apps": values.data.deployments,
          }),
          ...(values.data.replicasets && {
            "replicasets.apps": values.data.replicasets,
          }),
          ...(values.data.statefulsets && {
            "statefulsets.apps": values.data.statefulsets,
          }),
          ...(values.data.jobs && { "jobs.batch": values.data.jobs }),
          ...(values.data.cronjobs && {
            "cronjobs.batch": values.data.cronjobs,
          }),
          ...(values.data.cpu && { "requests.cpu": values.data.cpu }),
          ...(values.data.memory && { "requests.memory": values.data.memory }),
        },
      },
    };
  },
  role(values, namespace) {
    return {
      apiVersion: "rbac.authorization.k8s.io/v1",
      kind: "Role",
      metadata: {
        name: values.name,
        namespace: namespace,
      },
      rules: [
        {
          apiGroups: [
            "",
            "batch",
            "extensions",
            "apps",
            "rbac.authorization.k8s.io",
            "apiextensions.k8s.io",
            "admissionregistration.k8s.io",
            "policy",
          ],
          resources: values.resources,
          verbs: values.verbs,
        },
      ],
    };
  },
  roleBinding(values, namespace) {
    return {
      apiVersion: "rbac.authorization.k8s.io/v1",
      kind: "RoleBinding",
      metadata: {
        name: values.name,
        namespace: namespace,
      },
      subjects: [
        {
          kind: values.subjectKind,
          name: values.subjectName,
          apiGroup: "rbac.authorization.k8s.io",
        },
      ],
      roleRef: {
        kind: "Role",
        name: values.role,
      },
    };
  },
  clusterRole(values, namespace) {
    return {
      apiVersion: "rbac.authorization.k8s.io/v1",
      kind: "ClusterRole",
      metadata: {
        name: values.name,
      },
      rules: [
        {
          apiGroups: [
            "",
            "batch",
            "extensions",
            "apps",
            "rbac.authorization.k8s.io",
            "apiextensions.k8s.io",
            "admissionregistration.k8s.io",
            "policy",
          ],
          resources: values.resources,
          verbs: values.verbs,
        },
      ],
    };
  },
  clusterRoleBinding(values, namespace) {
    return {
      apiVersion: "rbac.authorization.k8s.io/v1",
      kind: "ClusterRoleBinding",
      metadata: {
        name: values.name,
      },
      subjects: [
        {
          kind: values.subjectKind,
          name: values.subjectName,
          apiGroup: "rbac.authorization.k8s.io",
        },
      ],
      roleRef: {
        kind: "ClusterRole",
        name: values.role,
      },
    };
  },
  deployment(values, namespace) {
    return {
      apiVersion: "apps/v1",
      kind: "Deployment",
      namespace: values.namespace,
      metadata: {
        name: values.name,
        namespace: namespace,
        labels: { app: values.name },
      },
      spec: {
        selector: { matchLabels: { app: values.name } },
        replicas: values.replicas,
        template: {
          metadata: {
            name: values.name,
            labels: { app: values.name },
          },
          spec: {
            ...(values.volumes && {
              volumes: values.volumes.map((volume) => {
                return {
                  name: `${volume}-storage`,
                  persistentVolumeClaim: { name: volume },
                };
              }),
            }),
            ...(values.imagePullSecrets && {
              imagePullSecrets: [{ name: values.imagePullSecrets }],
            }),
            containers: [
              {
                name: values.name,
                image: values.image,
                resources: {
                  requests: {
                    ...(values.rmemory && { memory: values.rmemory }),
                    ...(values.rcpu && { cpu: values.rcpu }),
                  },
                  limits: {
                    ...(values.lmemory && { memory: values.lmemory }),
                    ...(values.lcpu && { cpu: values.lcpu }),
                  },
                },
                ...(values.command && { command: values.command }),
                ...(values.args && { args: values.args }),
                ...(values.mountPath && {
                  volumeMounts: values.volumes.map((path) => {
                    return {
                      name: `${path.volume}-storage`,
                      mountPath: { name: path.mountPath },
                    };
                  }),
                }),
                ports: [{ containerPort: values.port }],
                ...(values.envs && {
                  envFrom: [{ secretRef: { name: values.secret } }],
                }),
              },
            ],
          },
        },
      },
    };
  },
  imageResources({ kNamespace, resourceName, type, gitUrl, branch, imageUrl }) {
    let params = [];
    if (type === "image") {
      params.push({
        name: "url",
        value: imageUrl
          ? imageUrl
          : `denouementregistry.azurecr.io/${kNamespace}:${resourceName}`,
      });
    } else if (type === "git") {
      params.push(
        { name: "revision", value: branch },
        { name: "url", value: gitUrl }
      );
    }

    return {
      apiVersion: "tekton.dev/v1alpha1",
      kind: "PipelineResources",
      metadata: {
        name: resourceName,
      },
      spec: {
        type,
        params,
      },
    };
  },
  tekton() {
    const yaml = k8s.loadAllYaml(
      fs.readFileSync("./static/yamls/tekton.yaml", "utf8")
    );

    return yaml;
  },
  pipelineRun(resourceName) {
    return {
      apiVersion: "tekton.dev/v1beta1",
      kind: "PipelineRun",
      metadata: { name: resourceName },
      spec: {
        ServiceAccountName: "image-build-push-sa",
        pipelineRef: { name: "image-pipeline" },
        resources: [
          {
            name: "image-link",
            resourceRef: { name: resourceName },
          },
          { name: "repo-link", resourceRef: { name: resourceName } },
        ],
        podTemplate: {
          volumes: [
            {
              name: "buildpacks-cache",
              PersistentVolumeClaim: { claimName: "buildpacks-cache-pvc" },
            },
          ],
        },
      },
    };
  },
};
