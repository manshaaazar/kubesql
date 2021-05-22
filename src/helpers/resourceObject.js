const { padEnd } = require("lodash");
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
    return {
      apiVersion: "v1",
      kind: "Secret",
      metadata: {
        name: values.name,
        ...(values.namespace && { namespace: values.namespace }),
        ...(values.annotations && { annotations: values.annotations }),
      },
      ...(values.type && { type: values.type }),
      stringData: values.data,
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
        ...(values.type && { type: values.type }),
        ...(values.app && { selector: { app: values.app } }),
        ports: [
          {
            ...(values.portname && { name: values.portname }),
            port: parseInt(values.port),
            targetPort: parseInt(values.port),
          },
        ],
      },
    };
  },
  serviceAccount(values) {
    return {
      apiVersion: "v1",
      kind: "ServiceAccount",
      metadata: {
        name: values.name,
        ...(values.namespace && { namespace: values.namespace }),
      },
      secrets: values.secrets,
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
        volumeModes: "Filesystem",
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
  resourceQuota(values) {
    return {
      apiVersion: "v1",
      kind: "ResourceQuota",
      metadata: {
        name: values.name,
        ...(values.namespace && { namespace: values.namespace }),
      },
      spec: {
        hard: {
          ...(values.configmaps && { configmaps: values.configmaps }),
          ...(values.persistentvolumeclaims && {
            persistentvolumeclaims: values.persistentvolumeclaims,
          }),
          ...(values.pods && { pods: values.pods }),
          ...(values.replicationcontrollers && {
            replicationcontrollers: values.replicationcontrollers,
          }),
          ...(values.secrets && { secrets: values.secrets }),
          ...(values.services && { services: values.services }),
          ...(values.loadBalancers && {
            "services.loadBalancers": values.loadBalancers,
          }),
          ...(values.deployments && {
            "deployments.apps": values.deployments,
          }),
          ...(values.replicasets && {
            "replicasets.apps": values.replicasets,
          }),
          ...(values.statefulsets && {
            "statefulsets.apps": values.statefulsets,
          }),
          ...(values.jobs && { "jobs.batch": values.jobs }),
          ...(values.cronjobs && {
            "cronjobs.batch": values.cronjobs,
          }),
          ...(values.cpu && { "requests.cpu": values.cpu }),
          ...(values.memory && { "requests.memory": values.memory }),
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
        ...(values.namespace && { namespace: values.namespace }),
      },
      rules: values.rules,
    };
  },
  roleBinding(values, namespace) {
    return {
      apiVersion: "rbac.authorization.k8s.io/v1",
      kind: "RoleBinding",
      metadata: {
        name: values.name,
        ...(values.namespace && { namespace: values.namespace }),
      },
      subjects: [
        {
          kind: values.subjectKind,
          name: values.subjectName,
          apiGroup: "",
        },
      ],
      roleRef: {
        kind: "Role",
        name: values.role,
      },
    };
  },
  clusterRole(values) {
    return {
      apiVersion: "rbac.authorization.k8s.io/v1",
      kind: "ClusterRole",
      metadata: {
        name: values.name,
      },
      rules: values.rules,
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
  deployment(values) {
    return {
      apiVersion: "apps/v1",
      kind: "Deployment",
      metadata: {
        name: values.name,
        ...(values.namespace && { namespace: values.namespace }),
        ...(values.label && {
          labels: { dep: values.label, app: values.name },
        }),
      },
      spec: {
        selector: { matchLabels: { app: values.name } },
        ...(values.replicas && { replicas: parseInt(values.replicas) }),
        template: {
          metadata: {
            name: values.name,
            ...(values.label && {
              labels: { dep: values.label, app: values.name },
            }),
          },
          spec: {
            ...(values.volumes && {
              volumes: values.volumes.map((volume) => {
                return {
                  name: `${volume}-pvc`,
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
                ...(values.volumePaths && {
                  volumeMounts: values.volumePaths,
                }),
                ...(values.port && {
                  ports: [{ containerPort: parseInt(values.port) }],
                }),
                ...(values.env && {
                  envFrom: [{ secretRef: { name: values.env } }],
                }),
              },
            ],
          },
        },
      },
    };
  },
  imageBuildPushTaskResource() {
    const task = {
      apiVersion: "tekton.dev/v1alpha1",
      kind: "Task",
      metadata: {
        name: "buildpacks-v3-alpha",
      },
      spec: {
        inputs: {
          params: [
            {
              name: "BUILDER_IMAGE",
              description:
                "The image on which builds will run (must include v3 lifecycle and compatible buildpacks).",
            },
            {
              name: "CACHE",
              description: "The name of the persistent app cache volume.",
              default: "empty-dir",
            },
            {
              name: "USER_ID",
              description: "The user ID of the builder image user.",
              default: "1000",
            },
            {
              name: "GROUP_ID",
              description: "The group ID of the builder image user.",
              default: "1000",
            },
            {
              name: "PROCESS_TYPE",
              description: "The default process type to set on the image.",
              default: "web",
            },
            {
              name: "SOURCE_SUBPATH",
              description:
                "A subpath within the `source` input where the source to build is located.",
              default: "",
            },
          ],
          resources: [
            {
              name: "source",
              type: "git",
            },
          ],
        },
        outputs: {
          resources: [
            {
              name: "image",
              type: "image",
            },
          ],
        },
        stepTemplate: {
          env: [
            {
              name: "CNB_PLATFORM_API",
              value: "0.3",
            },
          ],
        },
        steps: [
          {
            name: "prepare",
            image: "alpine",
            imagePullPolicy: "Always",
            command: ["/bin/sh"],
            args: [
              "-c",
              'chown -R "$(inputs.params.USER_ID):$(inputs.params.GROUP_ID)" "/tekton/home" && chown -R "$(inputs.params.USER_ID):$(inputs.params.GROUP_ID)" "/layers" && chown -R "$(inputs.params.USER_ID):$(inputs.params.GROUP_ID)" "/cache" && chown -R "$(inputs.params.USER_ID):$(inputs.params.GROUP_ID)" "/workspace/source"\n',
            ],
            volumeMounts: [
              {
                name: "layers-dir",
                mountPath: "/layers",
              },
              {
                name: "$(inputs.params.CACHE)",
                mountPath: "/cache",
              },
            ],
            securityContext: {
              privileged: true,
            },
          },
          {
            name: "detect",
            image: "$(inputs.params.BUILDER_IMAGE)",
            imagePullPolicy: "Always",
            command: ["/cnb/lifecycle/detector"],
            args: [
              "-app=/workspace/source/$(inputs.params.SOURCE_SUBPATH)",
              "-group=/layers/group.toml",
              "-plan=/layers/plan.toml",
            ],
            volumeMounts: [
              {
                name: "layers-dir",
                mountPath: "/layers",
              },
            ],
          },
          {
            name: "analyze",
            image: "$(inputs.params.BUILDER_IMAGE)",
            imagePullPolicy: "Always",
            command: ["/cnb/lifecycle/analyzer"],
            args: [
              "-layers=/layers",
              "-group=/layers/group.toml",
              "-cache-dir=/cache",
              "$(outputs.resources.image.url)",
            ],
            volumeMounts: [
              {
                name: "$(inputs.params.CACHE)",
                mountPath: "/cache",
              },
              {
                name: "layers-dir",
                mountPath: "/layers",
              },
            ],
          },
          {
            name: "restore",
            image: "$(inputs.params.BUILDER_IMAGE)",
            imagePullPolicy: "Always",
            command: ["/cnb/lifecycle/restorer"],
            args: [
              "-group=/layers/group.toml",
              "-layers=/layers",
              "-cache-dir=/cache",
            ],
            volumeMounts: [
              {
                name: "$(inputs.params.CACHE)",
                mountPath: "/cache",
              },
              {
                name: "layers-dir",
                mountPath: "/layers",
              },
            ],
          },
          {
            name: "build",
            image: "$(inputs.params.BUILDER_IMAGE)",
            imagePullPolicy: "Always",
            command: ["/cnb/lifecycle/builder"],
            args: [
              "-app=/workspace/source/$(inputs.params.SOURCE_SUBPATH)",
              "-layers=/layers",
              "-group=/layers/group.toml",
              "-plan=/layers/plan.toml",
            ],
            volumeMounts: [
              {
                name: "layers-dir",
                mountPath: "/layers",
              },
            ],
          },
          {
            name: "export",
            image: "$(inputs.params.BUILDER_IMAGE)",
            imagePullPolicy: "Always",
            command: ["/cnb/lifecycle/exporter"],
            args: [
              "-app=/workspace/source/$(inputs.params.SOURCE_SUBPATH)",
              "-layers=/layers",
              "-group=/layers/group.toml",
              "-cache-dir=/cache",
              "-process-type=$(inputs.params.PROCESS_TYPE)",
              "$(outputs.resources.image.url)",
            ],
            volumeMounts: [
              {
                name: "layers-dir",
                mountPath: "/layers",
              },
              {
                name: "$(inputs.params.CACHE)",
                mountPath: "/cache",
              },
            ],
          },
        ],
        volumes: [
          {
            name: "empty-dir",
            emptyDir: {},
          },
          {
            name: "layers-dir",
            emptyDir: {},
          },
        ],
      },
    };
    return task;
  },
  imageResources({ resourceName, type, gitUrl, branch, imageUrl }) {
    let params = [];
    let metadata = {};
    if (type === "image") {
      metadata = {
        name: `${resourceName}-image`,
      };
      params.push({
        name: "url",
        value: imageUrl,
      });
    } else if (type === "git") {
      metadata = {
        name: `${resourceName}-git`,
      };
      params.push(
        { name: "revision", value: branch },
        { name: "url", value: gitUrl }
      );
    }

    return {
      apiVersion: "tekton.dev/v1alpha1",
      kind: "PipelineResource",
      metadata,
      spec: {
        type,
        params,
      },
    };
  },
  pipeline() {
    const pipeline = {
      apiVersion: "tekton.dev/v1beta1",
      kind: "Pipeline",
      metadata: {
        name: "image-pipeline",
      },
      spec: {
        resources: [
          {
            name: "image-link",
            type: "image",
          },
          {
            name: "repo-link",
            type: "git",
          },
        ],
        tasks: [
          {
            name: "buildpacks-v3-alpha",
            taskRef: {
              name: "buildpacks-v3-alpha",
            },
            params: [
              {
                name: "BUILDER_IMAGE",
                value: "gcr.io/buildpacks/builder:v1",
              },
            ],
            resources: {
              inputs: [
                {
                  name: "source",
                  resource: "repo-link",
                },
              ],
              outputs: [
                {
                  name: "image",
                  resource: "image-link",
                },
              ],
            },
          },
        ],
      },
    };
    const pipelinePvc = {
      apiVersion: "v1",
      kind: "PersistentVolumeClaim",
      metadata: {
        name: "buildpacks-cache-pvc",
      },
      spec: {
        accessModes: ["ReadWriteOnce"],
        resources: {
          requests: {
            storage: "500Mi",
          },
        },
      },
    };
    return { pipeline, pipelinePvc };
  },
  pipelineRun(values) {
    return {
      apiVersion: "tekton.dev/v1beta1",
      kind: "PipelineRun",
      metadata: {
        name: values.name,
        ...(values.namespace && { namespace: values.namespace }),
      },
      spec: {
        ServiceAccountName: values.sa,
        pipelineRef: { name: "image-pipeline" },
        resources: [
          {
            name: "image-link",
            resourceRef: { name: `${values.registryResource}-image` },
          },
          {
            name: "repo-link",
            resourceRef: { name: `${values.gitResource}-git` },
          },
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
