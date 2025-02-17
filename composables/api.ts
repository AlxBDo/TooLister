import type { PagedCollection } from "~/models/collection";
import type { FetchAllData, FetchItemData } from "~/models/api";
import type { Ref } from "vue";
import type { View } from "~~/types/view";
import type { UseFetchOptions } from "#app";
import type { SubmissionErrors } from "~~/types/error";
import type { Item } from "~/models/item";
import type { ISearchCriteria } from "~/types";

const MIME_TYPE = "application/ld+json";

const API_URL_PATH = 'apip/'

function getToken() {
  const token = useCookie("auth:token");

  if (!token || !token?.value) {
    throw new Error('Token isn\'t defined.')
  }

  return `Bearer ${token.value}`;
}

async function useApi<T>(path: string, options: UseFetchOptions<T>) {
  const response = await useFetch(path, {
    baseURL: useRuntimeConfig().public.ENTRYPOINT,

    mode: "cors",

    headers: {
      Accept: MIME_TYPE,
      Authorization: getToken()
    },

    onResponseError({ response }) {
      const data = response._data;
      const error = data["hydra:description"] || response.statusText;

      throw new Error(error);
    },

    ...options,
  });

  return response;
}

export async function useFetchList<T>(
  resource: string,
  params?: ISearchCriteria & Partial<T>
): Promise<FetchAllData<T>> {
  const items: Ref<T[]> = ref([]);
  const view: Ref<View | undefined> = ref(undefined);
  const hubUrl: Ref<URL | undefined> = ref(undefined);

  const { data, pending, error } = await useApi<T>(API_URL_PATH + resource, {
    params,

    onResponse({ response }) {
      hubUrl.value = extractHubURL(response);
    },
  });

  const value = data.value as PagedCollection<T>;
  if (value) {
    items.value = value["hydra:member"];
    view.value = value["hydra:view"];
  }

  return {
    items,
    view,
    isLoading: pending,
    error,
    hubUrl,
  };
}

export async function useFetchItem<T>(path: string): Promise<FetchItemData<T>> {
  const retrieved: Ref<T | undefined> = ref(undefined);
  const hubUrl: Ref<URL | undefined> = ref(undefined);

  const { data, pending, error } = await useApi<T>(API_URL_PATH + path, {
    onResponse({ response }) {
      retrieved.value = response._data;
      hubUrl.value = extractHubURL(response);
    }
  });

  retrieved.value = data.value as T;

  return {
    retrieved,
    isLoading: pending,
    error,
    hubUrl,
  };
}

export async function useCreateItem<T>(resource: string, payload: Item) {
  const created: Ref<T | undefined> = ref(undefined);
  const violations: Ref<SubmissionErrors | undefined> = ref(undefined);

  const { data, pending, error } = await useApi(API_URL_PATH + resource, {
    method: "POST",
    body: payload,

    onResponseError({ response }) {
      const data = response._data;
      const error = data["hydra:description"] || response.statusText;

      if (!data.violations) throw new Error(error);

      const errors: SubmissionErrors = { _error: error };
      data.violations.forEach(
        (violation: { propertyPath: string; message: string }) => {
          errors[violation.propertyPath] = violation.message;
        }
      );

      violations.value = errors;

      throw new SubmissionError(errors);
    },
  });

  created.value = data.value as T;

  return {
    created,
    isLoading: pending,
    error,
    violations,
  };
}

export async function useUpdateItem<T>(item: Item, payload: Item) {
  if (!item["@id"]) { throw new Error("Item['@id'] not defined"); }

  const updated: Ref<T | undefined> = ref(undefined);
  const violations: Ref<SubmissionErrors | undefined> = ref(undefined);

  const { data, pending, error } = await useApi(item["@id"], {
    method: "PATCH",
    body: JSON.stringify(payload),
    headers: {
      Accept: MIME_TYPE,
      "Content-Type": 'application/merge-patch+json',
      Authorization: getToken()
    },

    onResponseError({ response }) {
      const data = response._data;
      const error = data["hydra:description"] || response.statusText;

      if (!data.violations) throw new Error(error);

      const errors: SubmissionErrors = { _error: error };
      data.violations.forEach(
        (violation: { propertyPath: string; message: string }) => {
          errors[violation.propertyPath] = violation.message;
        }
      );

      violations.value = errors;

      throw new SubmissionError(errors);
    },
  });

  updated.value = data.value as T;

  return {
    updated,
    isLoading: pending,
    error,
    violations,
  };
}

export async function useDeleteItem(item: Item) {
  const error: Ref<string | undefined> = ref(undefined);

  if (!item?.["@id"]) {
    error.value = "No item found. Please reload";
    return {
      error,
    };
  }

  const { pending } = await useApi(item["@id"], { method: "DELETE" });

  return {
    isLoading: pending,
    error,
  };
}
