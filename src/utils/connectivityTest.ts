interface TestResult {
  url: string;
  success: boolean;
  status?: number;
  statusText?: string;
  responseTime: number;
  responseSize?: number;
  responseBody?: string;
  error?: string;
  errorName?: string;
  isTimeout?: boolean;
  headers?: Record<string, string>;
  timestamp: string;
}

// Test a list of endpoints to check general internet connectivity
const TEST_ENDPOINTS = [
  'https://httpbin.org/ip',  // Simple endpoint that returns IP info
  'https://www.google.com/favicon.ico',  // Small static file
  'https://api.ipify.org?format=json',  // Simple JSON response
  'https://www.cloudflare.com/cdn-cgi/trace'  // Simple text response
];

// Test Firebase endpoints with different protocols and services
const FIREBASE_ENDPOINTS = [
  // Firestore REST API
  'https://firestore.googleapis.com/v1/projects/radiosantananm-cda61/databases/(default)/documents',
  // Realtime Database
  'https://radiosantananm-cda61-default-rtdb.firebaseio.com/.json',
  // Auth REST API
  'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCdKhRlNZ_dFrEfRFWBPfKFNDyVaDHA8Jc',
  // Storage API (just check if domain resolves)
  'https://firebasestorage.googleapis.com/v0/b/radiosantananm-cda61.appspot.com/o/'
];

async function testEndpoint(url: string, options: RequestInit = {}): Promise<TestResult> {
  const startTime = Date.now();
  let timeoutId: NodeJS.Timeout | null = null;
  let response: Response | null = null;
  
  try {
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    console.log(`Testing endpoint: ${url}`);
    
    // Add CORS headers for Firebase requests
    const headers = new Headers({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      ...options.headers
    });
    
    // Add CORS headers for Firebase requests
    if (url.includes('firebase')) {
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    
    response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
      mode: 'cors',
      credentials: 'omit' as const
    });
    
    clearTimeout(timeoutId);
    timeoutId = null;
    
    const responseTime = Date.now() - startTime;
    const contentLength = response.headers.get('content-length');
    const responseSize = contentLength ? parseInt(contentLength, 10) : 0;
    
    // Try to read response text for additional error details
    let responseBody = '';
    try {
      responseBody = await response.text();
      if (responseBody.length > 1000) {
        responseBody = responseBody.substring(0, 1000) + '... [truncated]';
      }
    } catch (readError) {
      console.log('Could not read response body:', readError);
    }
    
    const result: TestResult = {
      url,
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseTime,
      responseSize,
      responseBody: response.ok ? undefined : responseBody,
      headers: Object.fromEntries(response.headers.entries()),
      timestamp: new Date().toISOString()
    };
    
    console.log(`Test result for ${url}:`, {
      ...result,
      headers: undefined, // Don't log all headers to keep console clean
      responseBody: result.responseBody ? `${result.responseBody.substring(0, 200)}...` : undefined
    });
    
    return result;
  } catch (error) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    const isTimeout = error instanceof Error && error.name === 'AbortError';
    const responseTime = Date.now() - startTime;
    
    console.error(`Error testing endpoint ${url}:`, {
      error: errorMessage,
      errorName,
      isTimeout,
      responseTime,
      responseStatus: response?.status,
      responseStatusText: response?.statusText,
      url,
      timestamp: new Date().toISOString()
    });
    
    const errorResult: TestResult = {
      url,
      success: false,
      error: errorMessage,
      errorName,
      isTimeout,
      responseTime,
      status: response?.status,
      statusText: response?.statusText,
      headers: response ? Object.fromEntries(response.headers.entries()) : undefined,
      timestamp: new Date().toISOString()
    };
    
    return errorResult;
  }
}

export async function testInternetConnectivity() {
  console.log('Testing internet connectivity...');
  const results = await Promise.all(
    TEST_ENDPOINTS.map(url => testEndpoint(url))
  );
  
  const successful = results.some(r => r.success);
  
  return {
    success: successful,
    results: results.map(r => ({
      url: r.url,
      status: r.status || 0,
      statusText: r.statusText || r.error || 'Unknown error',
      responseTime: r.responseTime,
      error: r.error,
      isTimeout: r.isTimeout
    })),
    error: successful ? undefined : 'No endpoints could be reached',
    details: results
  };
}

export async function testFirebaseConnectivity() {
  console.log('Testing Firebase connectivity...');
  const results = await Promise.all(
    FIREBASE_ENDPOINTS.map((url, index) => {
      const options: RequestInit = {};
      // Add API key to the URL for Firebase REST API endpoints
      if (index === 1) { // The signUp endpoint needs the key as a query parameter
        return testEndpoint(url, options);
      } else {
        return testEndpoint(url, options);
      }
    })
  );
  
  const successful = results.some(r => r.status && r.status < 500);
  
  return {
    success: successful,
    results: results.map(r => ({
      url: r.url,
      status: r.status || 0,
      statusText: r.status ? `${r.status} ${r.statusText || ''}`.trim() : r.error || 'Unknown error',
      responseTime: r.responseTime,
      error: r.error,
      isTimeout: r.isTimeout
    })),
    error: successful ? undefined : 'Could not connect to any Firebase services',
    details: results
  };
}
