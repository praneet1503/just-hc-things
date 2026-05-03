const API_ROUTES = [
  {
    key: 'me',
    path: '/api/public/v1/me',
    method: 'GET',
    label: 'Profile',
    description: 'Returns the authenticated account profile.',
    verify: true,
  },
  {
    key: 'mail',
    path: '/api/public/v1/mail',
    method: 'POST',
    label: 'Mail',
    description: 'Creates a mail action; verify manually with a real payload.',
    verify: false,
  },
  {
    key: 'letters',
    path: '/api/public/v1/letters',
    method: 'GET',
    label: 'Letters',
    description: 'Lists letter resources.',
    verify: true,
  },
  {
    key: 'letterDetail',
    path: '/api/public/v1/letters/:id',
    method: 'GET',
    label: 'Letter detail',
    description: 'Fetches a letter by id.',
    verify: false,
  },
  {
    key: 'packages',
    path: '/api/public/v1/packages',
    method: 'GET',
    label: 'Packages',
    description: 'Lists package resources.',
    verify: true,
  },
  {
    key: 'packageDetail',
    path: '/api/public/v1/packages/:id',
    method: 'GET',
    label: 'Package detail',
    description: 'Fetches a package by id.',
    verify: false,
  },
  {
    key: 'lsv',
    path: '/api/public/v1/lsv',
    method: 'GET',
    label: 'LSV',
    description: 'Lists the LSV collection.',
    verify: true,
  },
  {
    key: 'lsvDetail',
    path: '/api/public/v1/lsv/:type/:id',
    method: 'GET',
    label: 'LSV detail',
    description: 'Fetches a typed LSV record by id.',
    verify: false,
  },
];

function getApiBaseUrl() {
  return process.env.API_BASE_URL || process.env.PARCEL_API_BASE_URL || '';
}

function getAuthHeaders() {
  const apiKey = process.env.API_KEY || '';
  const email = process.env.LOGIN_EMAIL || '';

  return {
    Authorization: apiKey ? `Bearer ${apiKey}` : '',
    'x-api-key': apiKey,
    'x-api-email': email,
    accept: 'application/json',
  };
}

async function fetchApiJson(routePath, options = {}) {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return {
      ok: false,
      status: 0,
      statusText: 'API_BASE_URL not configured',
      data: null,
    };
  }

  const response = await fetch(new URL(routePath, baseUrl), {
    method: options.method || 'GET',
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    data,
  };
}

function buildProbe(route, result) {
  if (!getApiBaseUrl()) {
    return {
      status: route.verify ? 'unverified' : route.key === 'mail' ? 'manual' : 'template',
      detail: 'API_BASE_URL not configured.',
      ok: false,
    };
  }

  if (!route.verify) {
    return {
      status: route.key === 'mail' ? 'manual' : 'template',
      detail: route.key === 'mail' ? 'Manual write endpoint; use a real payload.' : 'Template route; needs a real id.',
      ok: false,
    };
  }

  return {
    status: result.ok ? 'ok' : result.status === 401 || result.status === 403 ? 'auth-needed' : 'error',
    detail: `${result.status}${result.statusText ? ` ${result.statusText}` : ''}`.trim(),
    ok: result.ok,
  };
}

export async function getApiDiagnostics(options = {}) {
  const cachedResponses = options.cachedResponses || {};
  const results = await Promise.all(
    API_ROUTES.filter((route) => route.verify).map(async (route) => {
      const hasCached = Object.prototype.hasOwnProperty.call(cachedResponses, route.key);
      if (hasCached) {
        return { route, result: cachedResponses[route.key] };
      }

      return {
        route,
        result: await fetchApiJson(route.path, { method: route.method }),
      };
    }),
  );

  const routeMap = new Map(results.map(({ route, result }) => [route.key, { route, result }]));

  return {
    configured: Boolean(getApiBaseUrl()),
    baseUrl: getApiBaseUrl(),
    routes: API_ROUTES.map((route) => {
      const matched = routeMap.get(route.key);
      return {
        ...route,
        probe: buildProbe(route, matched ? matched.result : { ok: false, status: 0, statusText: '' }),
      };
    }),
  };
}

export async function getDashboardData() {
  const [me, letters, packages, lsv] = await Promise.all([
    fetchApiJson('/api/public/v1/me'),
    fetchApiJson('/api/public/v1/letters'),
    fetchApiJson('/api/public/v1/packages'),
    fetchApiJson('/api/public/v1/lsv'),
  ]);

  const letterList = Array.isArray(letters.data?.letters) ? letters.data.letters : [];
  const packageList = Array.isArray(packages.data?.packages) ? packages.data.packages : [];
  const lsvList = Array.isArray(lsv.data?.legacy_shipment_viewer_records)
    ? lsv.data.legacy_shipment_viewer_records
    : [];

  const latestLetter = letterList[0] || null;
  const latestPackage = packageList[0] || null;
  const latestLsv = lsvList[0] || null;

  const latestLetterDetail = latestLetter ? await fetchApiJson(`/api/public/v1/letters/${latestLetter.id}`) : null;

  return {
    configured: Boolean(getApiBaseUrl()),
    baseUrl: getApiBaseUrl(),
    accountId: me.data?.user?.id || '',
    responses: {
      me,
      letters,
      packages,
      lsv,
    },
    summary: {
      letters: letterList.length,
      packages: packageList.length,
      lsv: lsvList.length,
    },
    me,
    letters: {
      list: letterList,
      latest: latestLetter,
      latestDetail: latestLetterDetail,
    },
    packages: {
      list: packageList,
      latest: latestPackage,
    },
    lsv: {
      list: lsvList,
      latest: latestLsv,
    },
  };
}

export { API_ROUTES };
