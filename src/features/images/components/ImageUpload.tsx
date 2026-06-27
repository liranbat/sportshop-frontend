import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { Notice } from "@/components/Notice";
import { useImageUploadMutation } from "@/features/images/queries";
import type { ImageResourceType } from "@/features/images/schema";
import type { ApiError } from "@/lib/api";
import { cn } from "@/lib/cn";

type Props = {
  acceptedFormats: readonly string[];
  currentImageUrl: string | null;
  resourceType: ImageResourceType;
  onUploadSuccess: (newUrl: string) => void;
  onUploadError?: (error: ApiError) => void;
  onUploadingStateChange: (isUploading: boolean) => void;
  disabled?: boolean;
  className?: string;
  imageBoxClassName?: string;
};

const EXTENSION_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
};

function buildAcceptAttribute(formats: readonly string[]): string {
  return formats
    .map((ext) => EXTENSION_TO_MIME[ext.toLowerCase()] ?? `.${ext.toLowerCase()}`)
    .join(",");
}

function extensionOf(filename: string): string | null {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex < 0 || dotIndex === filename.length - 1) return null;
  return filename.slice(dotIndex + 1).toLowerCase();
}

function formatExtensionList(formats: readonly string[]): string {
  return formats.map((f) => `.${f.toLowerCase()}`).join(", ");
}

export function ImageUpload({
  acceptedFormats,
  currentImageUrl,
  resourceType,
  onUploadSuccess,
  onUploadError,
  onUploadingStateChange,
  disabled = false,
  className,
  imageBoxClassName,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useImageUploadMutation(resourceType);
  const isUploading = mutation.isPending;
  const widgetDisabled = disabled || isUploading;

  const hasImage = currentImageUrl !== null && currentImageUrl.length > 0;

  const startUpload = useCallback(
    (file: File) => {
      const ext = extensionOf(file.name);
      const allowed = acceptedFormats.map((f) => f.toLowerCase());
      if (ext === null || !allowed.includes(ext)) {
        setErrorMessage(`Unsupported file type. Allowed: ${formatExtensionList(acceptedFormats)}.`);
        return;
      }
      setErrorMessage(null);
      onUploadingStateChange(true);
      mutation.mutate(file, {
        onSuccess: (data) => {
          onUploadSuccess(data.url);
        },
        onError: (error) => {
          const apiErr = error as ApiError;
          setErrorMessage(apiErr.message);
          onUploadError?.(apiErr);
        },
        onSettled: () => {
          onUploadingStateChange(false);
        },
      });
    },
    [acceptedFormats, mutation, onUploadingStateChange, onUploadSuccess, onUploadError],
  );

  const openFilePicker = useCallback(() => {
    if (widgetDisabled) return;
    inputRef.current?.click();
  }, [widgetDisabled]);

  return (
    <div className={cn("flex w-full max-w-120 flex-col gap-3", className)}>
      <div
        aria-busy={isUploading || undefined}
        className={cn(
          "relative flex h-80 w-full items-center justify-center overflow-hidden rounded-lg border border-border-default bg-background-card p-4",
          imageBoxClassName,
        )}
      >
        {hasImage ? (
          <img src={currentImageUrl ?? ""} alt="" className="h-full w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 text-center text-text-secondary">
            <ImagePlaceholderIcon className="h-16 w-16 text-border-default" />
            <span className="text-body-regular">Click to browse</span>
          </div>
        )}
        {isUploading && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center bg-black/40"
          >
            <Spinner className="h-12 w-12 text-white" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={buildAcceptAttribute(acceptedFormats)}
        className="sr-only"
        disabled={widgetDisabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            startUpload(file);
          }
          // reset so re-picking the same file (e.g. after an error) re-fires onChange
          event.target.value = "";
        }}
      />

      <Button
        type="button"
        variant="primary"
        onClick={openFilePicker}
        disabled={widgetDisabled}
        className="w-full"
      >
        {hasImage ? "Change image" : "Choose image"}
      </Button>

      {errorMessage !== null && <Notice variant="error" message={errorMessage} />}
    </div>
  );
}

function ImagePlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("animate-spin", className)}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
