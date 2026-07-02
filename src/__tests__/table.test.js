const table = require('../helpers/table');

describe('errTable()', () => {
  test('returns a non-empty string', () => {
    const result = table.errTable({
      kind: 'Status',
      apiVersion: 'v1',
      status: 'Failure',
      message: 'not found',
      reason: 'NotFound',
      code: 404,
    });
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('roleSuccessTable()', () => {
  test('returns a non-empty string', () => {
    const result = table.roleSuccessTable({
      kind: 'Role',
      apiVersion: 'rbac.authorization.k8s.io/v1',
      metadata: { name: 'my-role', namespace: 'default' },
      rules: [],
    });
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('deleteSuccessTable()', () => {
  test('returns a non-empty string', () => {
    const result = table.deleteSuccessTable({
      kind: 'Deployment',
      apiVersion: 'apps/v1',
      status: 'Success',
    });
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
