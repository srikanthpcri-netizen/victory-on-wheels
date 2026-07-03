const SERVICE_CENTER_TOKEN_KEY = "serviceCenterToken";
const SERVICE_CENTER_USER_KEY = "serviceCenterUser";
const SERVICE_CENTER_AUTH_EVENT = "service-center-auth-changed";

export type ServiceCenterUser = {
  id?: string;
  name?: string;
  email?: string;
};

export function getServiceCenterToken(): string | null {
  return localStorage.getItem(SERVICE_CENTER_TOKEN_KEY);
}

export function getServiceCenterUser(): ServiceCenterUser | null {
  const rawUser = localStorage.getItem(SERVICE_CENTER_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as ServiceCenterUser;
  } catch (error) {
    console.error(
      "Failed to parse service center user from localStorage",
      error,
    );
    return null;
  }
}

export function isServiceCenterLoggedIn(): boolean {
  return !!getServiceCenterToken();
}

export function setServiceCenterAuth(token: string, user: ServiceCenterUser) {
  localStorage.setItem(SERVICE_CENTER_TOKEN_KEY, token);
  localStorage.setItem(SERVICE_CENTER_USER_KEY, JSON.stringify(user));

  window.dispatchEvent(
    new CustomEvent(SERVICE_CENTER_AUTH_EVENT, {
      detail: {
        token,
        user,
        isLoggedIn: true,
      },
    }),
  );
}

export function clearServiceCenterAuth() {
  localStorage.removeItem(SERVICE_CENTER_TOKEN_KEY);
  localStorage.removeItem(SERVICE_CENTER_USER_KEY);

  window.dispatchEvent(
    new CustomEvent(SERVICE_CENTER_AUTH_EVENT, {
      detail: {
        token: null,
        user: null,
        isLoggedIn: false,
      },
    }),
  );
}

export function subscribeToServiceCenterAuthChanges(
  callback: () => void,
): () => void {
  const handler = () => {
    callback();
  };

  window.addEventListener(SERVICE_CENTER_AUTH_EVENT, handler);

  return () => {
    window.removeEventListener(SERVICE_CENTER_AUTH_EVENT, handler);
  };
}

export { SERVICE_CENTER_AUTH_EVENT };
