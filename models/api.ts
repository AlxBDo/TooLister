import type { Ref } from "vue";
import type { SubmissionErrors } from "../types/error";
import type { View } from "../types/view";

export interface FetchAllData<T> {
  items: Ref<T[]>;
  view: Ref<View | undefined>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
  hubUrl: Ref<URL | undefined>;
}

export interface FetchItemData<T> {
  retrieved: Ref<T | undefined>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
  hubUrl: Ref<URL | undefined>;
}

export interface CreateItemData<T> {
  created: Ref<T | undefined>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
  violations: Ref<SubmissionErrors | undefined>;
}

export interface CreateItemApiData<T> {
  item: Ref<T | undefined>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
  violations: Ref<SubmissionErrors | undefined>;
}

export interface UpdateItemData<T> {
  updated: Ref<T | undefined>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
  violations: Ref<SubmissionErrors | undefined>;
}
