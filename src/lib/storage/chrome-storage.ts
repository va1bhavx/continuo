const isExtension =
  typeof chrome !== "undefined" && chrome.storage !== undefined;

export const StorageService = {
  async get<T>(key: string, defaultValue: T): Promise<T> {
    if (isExtension) {
      return new Promise((res) => {
        chrome.storage.local.get([key], (result) => {
          res(result[key] !== undefined ? (result[key] as T) : defaultValue);
        });
      });
    } else {
      const local = localStorage.getItem(key);
      if (local === null) return defaultValue;
      try {
        return JSON.parse(local) as T;
      } catch (e) {
        // Fallback for raw strings previously saved without JSON stringification
        return local as unknown as T;
      }
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    if (isExtension) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => resolve());
      });
    } else {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(
        new CustomEvent("local-storage-update", {
          detail: { key, newValue: value },
        })
      );
    }
  },

  async remove(key: string): Promise<void> {
    if (isExtension) {
      return new Promise((resolve) => {
        chrome.storage.local.remove([key], () => resolve());
      });
    } else {
      localStorage.removeItem(key);
      window.dispatchEvent(
        new CustomEvent("local-storage-update", {
          detail: { key, newValue: null },
        })
      );
    }
  },

  async clear(): Promise<void> {
    if (isExtension) {
      return new Promise((resolve) => {
        chrome.storage.local.clear(() => resolve());
      });
    } else {
      localStorage.clear();
      window.dispatchEvent(
        new CustomEvent("local-storage-update", {
          detail: { key: "clear", newValue: null },
        })
      );
    }
  },
};
