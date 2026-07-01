const r = require('../helpers/resourceObject');

describe('namespace()', () => {
  test('returns correct kind and name', () => {
    const result = r.namespace({ name: 'test-ns' });
    expect(result.kind).toBe('Namespace');
    expect(result.apiVersion).toBe('v1');
    expect(result.metadata.name).toBe('test-ns');
  });
});

describe('secret()', () => {
  test('returns correct kind', () => {
    const result = r.secret({ name: 'my-secret', namespace: 'default', data: {} });
    expect(result.kind).toBe('Secret');
    expect(result.apiVersion).toBe('v1');
    expect(result.metadata.name).toBe('my-secret');
    expect(result.metadata.namespace).toBe('default');
  });

  test('omits namespace when not provided', () => {
    const result = r.secret({ name: 'my-secret', data: {} });
    expect(result.metadata.namespace).toBeUndefined();
  });
});

describe('service()', () => {
  test('returns correct kind and port', () => {
    const result = r.service({ name: 'my-svc', namespace: 'default', port: '3000' });
    expect(result.kind).toBe('Service');
    expect(result.apiVersion).toBe('v1');
    expect(result.spec.ports[0].port).toBe(3000);
  });
});

describe('deployment()', () => {
  test('returns correct kind and apiVersion', () => {
    const result = r.deployment({ name: 'my-dep', namespace: 'default', volumePaths: [] });
    expect(result.kind).toBe('Deployment');
    expect(result.apiVersion).toBe('apps/v1');
    expect(result.metadata.name).toBe('my-dep');
  });

  test('sets replicas as integer', () => {
    const result = r.deployment({ name: 'dep', replicas: '3', volumePaths: [] });
    expect(result.spec.replicas).toBe(3);
  });
});

describe('pvc()', () => {
  test('returns correct kind', () => {
    const result = r.pvc({ name: 'my-pvc' });
    expect(result.kind).toBe('PersistentVolumeClaim');
    expect(result.apiVersion).toBe('v1');
  });
});

describe('pv()', () => {
  test('returns correct kind', () => {
    const result = r.pv({ name: 'my-pv', storage: '1Gi', accessModes: 'ReadWriteOnce' });
    expect(result.kind).toBe('PersistentVolume');
    expect(result.apiVersion).toBe('v1');
  });
});

describe('role()', () => {
  test('returns correct kind and apiVersion', () => {
    const result = r.role({ name: 'my-role', namespace: 'default', rules: [] });
    expect(result.kind).toBe('Role');
    expect(result.apiVersion).toBe('rbac.authorization.k8s.io/v1');
  });
});

describe('clusterRole()', () => {
  test('returns correct kind', () => {
    const result = r.clusterRole({ name: 'my-cr', rules: [] });
    expect(result.kind).toBe('ClusterRole');
    expect(result.apiVersion).toBe('rbac.authorization.k8s.io/v1');
  });
});
