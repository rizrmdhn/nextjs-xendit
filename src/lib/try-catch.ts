type TryCatchResult<T> = {
  result: T | null;
  error: unknown;
  errorMessage: string | null;
};

async function tryCatch<T>(
  fn: () => T | Promise<T>,
): Promise<TryCatchResult<T>> {
  try {
    const result = await fn();
    return { result, error: null, errorMessage: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { result: null, error, errorMessage };
  }
}

export { tryCatch };
