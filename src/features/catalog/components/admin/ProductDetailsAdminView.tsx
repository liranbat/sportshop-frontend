import { useCallback, useMemo, useState } from "react";
import type { Ref, TextareaHTMLAttributes } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { BackLink } from "@/components/BackLink";
import { Button } from "@/components/Button";
import { FilterDropdown, type DropdownOption } from "@/components/FilterDropdown";
import { FilterDropdownLabeled } from "@/components/FilterDropdownLabeled";
import { InputFieldStacked } from "@/components/InputFieldStacked";
import { Notice } from "@/components/Notice";
import { SegmentedControl } from "@/components/SegmentedControl";
import { categoriesQueryKeys, useCategoriesQuery } from "@/features/categories/queries";
import { ImageUpload } from "@/features/images/components/ImageUpload";
import {
  AdminProductDetailHeaderRow,
  type AdminProductDetailViewMode,
} from "@/features/catalog/components/admin/AdminProductDetailHeaderRow";
import { AdminProductArchiveModal } from "@/features/catalog/components/admin/AdminProductArchiveModal";
import { AdminProductRestoreModal } from "@/features/catalog/components/admin/AdminProductRestoreModal";
import { ProductImageSection } from "@/features/catalog/components/ProductImageSection";
import { ProductInfoSection } from "@/features/catalog/components/ProductInfoSection";
import {
  ProductUpdateFormSchema,
  toProductUpdateRequest,
  type ProductDetail,
  type ProductUpdateForm,
} from "@/features/catalog/schema";
import { useUpdateAdminProductMutation } from "@/features/catalog/queries";
import { cn } from "@/lib/cn";
import { paths } from "@/lib/paths";

const PRODUCT_IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp", "avif"] as const;
const VIEW_PARAM = "view";

function parseAdminView(raw: string | null): AdminProductDetailViewMode {
  return raw === "customer" ? "customer" : "admin";
}

type Props = {
  product: ProductDetail;
  onRefresh: () => void;
  isRefreshing: boolean;
};

function toFormValues(product: ProductDetail): ProductUpdateForm {
  return {
    name: product.name,
    description: product.description ?? "",
    categoryId: product.categoryId ?? 0,
    imageUrl: product.imageUrl ?? "",
    price: product.price,
    isMultiSize: product.isMultiSize,
    version: product.version,
  };
}

export function ProductDetailsAdminView({ product, onRefresh, isRefreshing }: Props) {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const adminView = parseAdminView(searchParams.get(VIEW_PARAM));
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const updateMutation = useUpdateAdminProductMutation(product.id);

  const handleAdminViewChange = useCallback(
    (next: AdminProductDetailViewMode) => {
      if (next === adminView) return;
      setSearchParams(
        (prev) => {
          const updated = new URLSearchParams(prev);
          if (next === "customer") {
            updated.set(VIEW_PARAM, "customer");
          } else {
            updated.delete(VIEW_PARAM);
          }
          return updated;
        },
        { replace: true },
      );
    },
    [adminView, setSearchParams],
  );

  const handleRefresh = useCallback(() => {
    updateMutation.reset();
    // bump nonce to remount AdminEditForm and drop in-flight edits.
    setRefreshNonce((n) => n + 1);
    void queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
    onRefresh();
  }, [updateMutation, queryClient, onRefresh]);

  return (
    <main className="h-full overflow-hidden">
      <div className="flex h-full flex-col gap-2 px-6 py-3 lg:px-10 2xl:px-14">
        <AdminProductDetailHeaderRow
          isArchived={product.isArchived}
          adminView={adminView}
          onAdminViewChange={handleAdminViewChange}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <BackLink to={paths.catalog()} label="Back to Catalog" />

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-2 lg:overflow-hidden">
          {adminView === "admin" ? (
            <AdminEditForm
              key={refreshNonce}
              product={product}
              mutation={updateMutation}
              isRefreshing={isRefreshing}
              onArchive={() => setIsArchiveOpen(true)}
              onRestore={() => setIsRestoreOpen(true)}
            />
          ) : (
            <CustomerPreview product={product} isRefreshing={isRefreshing} />
          )}
        </div>
      </div>

      <AdminProductArchiveModal
        key={`archive-${product.id}-${product.version}`}
        open={isArchiveOpen}
        onOpenChange={setIsArchiveOpen}
        product={product}
      />

      <AdminProductRestoreModal
        key={`restore-${product.id}-${product.version}`}
        open={isRestoreOpen}
        onOpenChange={setIsRestoreOpen}
        product={product}
      />
    </main>
  );
}

function CustomerPreview({
  product,
  isRefreshing,
}: {
  product: ProductDetail;
  isRefreshing: boolean;
}) {
  return (
    <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-2">
      <ProductImageSection name={product.name} imageUrl={product.imageUrl} />
      <ProductInfoSection product={product} isRefreshing={isRefreshing} />
    </div>
  );
}

type AdminEditFormProps = {
  product: ProductDetail;
  mutation: ReturnType<typeof useUpdateAdminProductMutation>;
  isRefreshing: boolean;
  onArchive: () => void;
  onRestore: () => void;
};

function AdminEditForm({
  product,
  mutation,
  isRefreshing,
  onArchive,
  onRestore,
}: AdminEditFormProps) {
  const categoriesQuery = useCategoriesQuery();

  const [isUploading, setIsUploading] = useState(false);

  const formValues = useMemo(() => toFormValues(product), [product]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProductUpdateForm>({
    resolver: zodResolver(ProductUpdateFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    // RHF deep-compares `values` against the current form snapshot. Background refetches that return
    // the same data are no-ops; a real server change (save / archive / restore) re-seeds + clears dirty.
    values: formValues,
  });

  const values = useWatch({ control });
  const isMultiSize = Boolean(values.isMultiSize);
  const isFormValid = ProductUpdateFormSchema.safeParse(values).success;

  const activeCategoryOptions = useMemo<DropdownOption[]>(() => {
    const cats = categoriesQuery.data ?? [];
    return cats
      .filter((c) => !c.isDeleted)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => ({ value: String(c.id), label: c.name }));
  }, [categoriesQuery.data]);

  const handleSizeModeChange = (next: "single" | "multi") => {
    setValue("isMultiSize", next === "multi", { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = (form: ProductUpdateForm) => {
    mutation.mutate(toProductUpdateRequest(form));
  };

  const submitDisabled = !isFormValid || mutation.isPending || isUploading || isRefreshing;
  const formDisabled = mutation.isPending || isRefreshing;

  return (
    <>
      {mutation.isError && (
        <Notice variant="error" message={mutation.error.message} className="mb-4" />
      )}

      {mutation.isSuccess && !isDirty && (
        <Notice variant="success" message="Product updated successfully." className="mb-4" />
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-busy={isRefreshing}
        className={cn(
          "flex flex-col transition-opacity lg:min-h-0 lg:flex-1",
          isRefreshing && "opacity-60",
        )}
      >
        <div className="flex flex-col gap-8 lg:min-h-0 lg:flex-1 lg:flex-row">
          <div className="flex flex-col gap-2 lg:min-h-0 lg:flex-1">
            <span className="text-body-small-bold text-text-primary">Image</span>
            <Controller
              control={control}
              name="imageUrl"
              render={({ field }) => (
                <ImageUpload
                  acceptedFormats={PRODUCT_IMAGE_FORMATS}
                  currentImageUrl={field.value.length > 0 ? field.value : null}
                  resourceType="products"
                  onUploadSuccess={(url) => field.onChange(url)}
                  onUploadingStateChange={setIsUploading}
                  disabled={formDisabled}
                  className="max-w-none lg:min-h-0 lg:flex-1"
                  imageBoxClassName="h-auto aspect-square lg:aspect-auto lg:min-h-0 lg:flex-1"
                />
              )}
            />
            {errors.imageUrl && (
              <p role="alert" className="text-caption-regular text-error-red">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2">
            <InputFieldStacked
              label="Product name"
              placeholder="e.g. Sample Product"
              maxLength={200}
              error={errors.name?.message}
              disabled={formDisabled}
              {...register("name")}
            />

            <Textarea
              label="Description"
              placeholder="Describe the product..."
              rows={4}
              maxLength={2000}
              error={errors.description?.message}
              disabled={formDisabled}
              {...register("description")}
            />

            <div className="flex flex-wrap items-start gap-6">
              <FilterDropdownLabeled label="Category" className="w-80">
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <FilterDropdown
                      ariaLabel="Category"
                      placeholder="Choose a category..."
                      options={activeCategoryOptions}
                      value={field.value > 0 ? String(field.value) : null}
                      onChange={(next) => field.onChange(Number(next))}
                      disabled={formDisabled || categoriesQuery.isPending}
                      className="w-full"
                    />
                  )}
                />
                {errors.categoryId && (
                  <p role="alert" className="text-caption-regular text-error-red">
                    {errors.categoryId.message}
                  </p>
                )}
              </FilterDropdownLabeled>

              <InputFieldStacked
                label="Price"
                type="number"
                step="0.01"
                min={0}
                placeholder="e.g. 99.00"
                containerClassName="max-w-60"
                error={errors.price?.message}
                disabled={formDisabled}
                {...register("price", { valueAsNumber: true })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-body-small-bold text-text-primary">Size variants</span>
              <SegmentedControl
                ariaLabel="Size variants"
                options={[
                  { value: "single", label: "Single size" },
                  { value: "multi", label: "Multiple sizes" },
                ]}
                value={isMultiSize ? "multi" : "single"}
                onChange={handleSizeModeChange}
                disabled={formDisabled}
                className="self-start"
              />
              <p className="text-caption-regular text-text-secondary">
                Flipping this resets all stock rows. Single-size collapses to one row at quantity 0;
                multi-size clears all rows.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          {product.isArchived ? (
            <Button type="button" variant="outlined" onClick={onRestore} disabled={formDisabled}>
              Restore
            </Button>
          ) : (
            <Button type="button" variant="danger" onClick={onArchive} disabled={formDisabled}>
              Archive
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={mutation.isPending}
            disabled={submitDisabled}
          >
            {mutation.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </>
  );
}

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
  label: string;
  error?: string;
  containerClassName?: string;
  ref?: Ref<HTMLTextAreaElement>;
};

function Textarea({
  label,
  error,
  containerClassName,
  className,
  disabled,
  ref,
  ...rest
}: TextareaProps) {
  const hasError = Boolean(error);
  return (
    <div className={cn("flex w-full flex-col gap-1", containerClassName)}>
      <label
        className={cn(
          "text-body-small-bold",
          disabled ? "text-text-secondary" : "text-text-primary",
        )}
      >
        {label}
      </label>
      <textarea
        ref={ref}
        disabled={disabled}
        aria-invalid={hasError || undefined}
        className={cn(
          "w-full rounded-lg border bg-background-card px-4 py-2.5 text-body-regular placeholder:text-text-placeholder transition-colors focus:outline-none",
          disabled
            ? "cursor-not-allowed border-border-default text-text-secondary"
            : hasError
              ? "border-error-red text-text-primary focus:border-error-red focus:ring-2 focus:ring-error-red/20"
              : "border-border-default text-text-primary focus:border-border-focus focus:ring-2 focus:ring-primary-blue/20",
          className,
        )}
        {...rest}
      />
      {error && (
        <p role="alert" className="text-caption-regular text-error-red">
          {error}
        </p>
      )}
    </div>
  );
}
