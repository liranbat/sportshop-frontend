import { useMemo, useState } from "react";
import type { Ref, TextareaHTMLAttributes } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/Button";
import { FilterDropdown, type DropdownOption } from "@/components/FilterDropdown";
import { FilterDropdownLabeled } from "@/components/FilterDropdownLabeled";
import { InputFieldStacked } from "@/components/InputFieldStacked";
import { Notice } from "@/components/Notice";
import { SegmentedControl } from "@/components/SegmentedControl";
import { useCategoriesQuery } from "@/features/categories";
import { ImageUpload } from "@/features/images/components/ImageUpload";
import { useCreateAdminProductMutation } from "@/features/catalog/queries";
import {
  ONE_SIZE_TOKEN,
  ProductCreateFormSchema,
  SIZE_TOKEN_MAX_LENGTH,
  toProductCreateRequest,
  type ProductCreateForm,
} from "@/features/catalog/schema";
import { cn } from "@/lib/cn";

const PRODUCT_IMAGE_FORMATS = ["jpg", "jpeg", "png", "webp", "avif"] as const;

const DEFAULT_VALUES: ProductCreateForm = {
  name: "",
  description: "",
  categoryId: 0,
  imageUrl: "",
  price: 0,
  isMultiSize: false,
  stockRows: [{ size: ONE_SIZE_TOKEN, quantity: 0, lowStockThreshold: null }],
};

export function ProductCreatePage() {
  const navigate = useNavigate();
  const mutation = useCreateAdminProductMutation();
  const categoriesQuery = useCategoriesQuery();
  const [isUploading, setIsUploading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductCreateForm>({
    resolver: zodResolver(ProductCreateFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: DEFAULT_VALUES,
  });

  const values = useWatch({ control });
  const isMultiSize = Boolean(values.isMultiSize);
  const isFormValid = ProductCreateFormSchema.safeParse(values).success;

  const {
    fields: stockFields,
    append: appendStockRow,
    remove: removeStockRow,
  } = useFieldArray({ control, name: "stockRows" });

  const activeCategoryOptions = useMemo<DropdownOption[]>(() => {
    const cats = categoriesQuery.data ?? [];
    return cats
      .filter((c) => !c.isDeleted)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => ({ value: String(c.id), label: c.name }));
  }, [categoriesQuery.data]);

  const handleSizeModeChange = (next: "single" | "multi") => {
    const nextMulti = next === "multi";
    setValue("isMultiSize", nextMulti, { shouldValidate: true, shouldDirty: true });
    setValue(
      "stockRows",
      nextMulti ? [] : [{ size: ONE_SIZE_TOKEN, quantity: 0, lowStockThreshold: null }],
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const onSubmit = (form: ProductCreateForm) => {
    const payload = toProductCreateRequest(form);
    mutation.mutate(payload, {
      onSuccess: () => {
        reset(DEFAULT_VALUES);
      },
    });
  };

  const submitDisabled = !isFormValid || mutation.isPending || isUploading;

  return (
    <main className="h-full overflow-hidden">
      <div className="flex h-full flex-col gap-2 px-6 py-3 lg:px-10 2xl:px-14">
        <section
          aria-label="Admin product create header"
          className="flex items-center justify-between gap-2"
        >
          <h1 className="text-body-large font-semibold text-text-primary">New Product</h1>
        </section>

        <BackRow />

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-2 lg:overflow-hidden">
          {mutation.isError && (
            <Notice variant="error" message={mutation.error.message} className="mb-4" />
          )}

          {mutation.isSuccess && mutation.data && (
            <Notice
              variant="success"
              message={`Product "${mutation.data.name}" created (ID ${mutation.data.id}).`}
              className="mb-4"
            />
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col lg:min-h-0 lg:flex-1"
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
                      disabled={mutation.isPending}
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
                  disabled={mutation.isPending}
                  {...register("name")}
                />

                <Textarea
                  label="Description"
                  placeholder="Describe the product..."
                  rows={4}
                  maxLength={2000}
                  error={errors.description?.message}
                  disabled={mutation.isPending}
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
                          disabled={mutation.isPending || categoriesQuery.isPending}
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
                    disabled={mutation.isPending}
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
                    disabled={mutation.isPending}
                    className="self-start"
                  />
                </div>

                <section
                  aria-label="Stock"
                  className="flex flex-col gap-4 rounded-lg border border-border-default bg-background-card p-4 lg:min-h-0 lg:flex-1"
                >
                  <header className="flex items-center justify-between">
                    <h2 className="text-body-regular font-semibold text-text-primary">Stock</h2>
                    <span className="text-caption-regular text-text-secondary">
                      {stockFields.length === 1 ? "1 size" : `${stockFields.length} sizes`}
                    </span>
                  </header>

                  <div className="grid grid-cols-[1fr_8rem_8rem_2rem] gap-x-4 gap-y-2 text-caption-regular text-text-secondary lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
                    <span>Size</span>
                    <span>Quantity</span>
                    <span>Threshold</span>
                    <span aria-hidden="true" />

                    {stockFields.map((row, index) => {
                      const sizeError = errors.stockRows?.[index]?.size?.message;
                      const qtyError = errors.stockRows?.[index]?.quantity?.message;
                      const thresholdError = errors.stockRows?.[index]?.lowStockThreshold?.message;
                      const isOneSizeLocked = !isMultiSize;
                      return (
                        <RowCells
                          key={row.id}
                          index={index}
                          isOneSizeLocked={isOneSizeLocked}
                          sizeError={sizeError}
                          qtyError={qtyError}
                          thresholdError={thresholdError}
                          disabled={mutation.isPending}
                          register={register}
                          onRemove={() => removeStockRow(index)}
                        />
                      );
                    })}
                  </div>

                  {typeof errors.stockRows?.message === "string" && (
                    <p role="alert" className="text-caption-regular text-error-red">
                      {errors.stockRows.message}
                    </p>
                  )}

                  {isMultiSize && (
                    <div>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() =>
                          appendStockRow({ size: "", quantity: 0, lowStockThreshold: null })
                        }
                        disabled={mutation.isPending}
                        className="h-9 px-4 text-body-small"
                      >
                        + Add Size
                      </Button>
                    </div>
                  )}
                </section>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate("/catalog")}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={mutation.isPending}
                disabled={submitDisabled}
              >
                {mutation.isPending ? "Saving…" : "Save Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

type RowCellsProps = {
  index: number;
  isOneSizeLocked: boolean;
  sizeError: string | undefined;
  qtyError: string | undefined;
  thresholdError: string | undefined;
  disabled: boolean;
  register: ReturnType<typeof useForm<ProductCreateForm>>["register"];
  onRemove: () => void;
};

function RowCells({
  index,
  isOneSizeLocked,
  sizeError,
  qtyError,
  thresholdError,
  disabled,
  register,
  onRemove,
}: RowCellsProps) {
  return (
    <>
      <div className="flex flex-col gap-1">
        {isOneSizeLocked ? (
          <span className="inline-flex h-10 items-center px-1 text-body-regular text-text-primary">
            {ONE_SIZE_TOKEN}
          </span>
        ) : (
          <input
            type="text"
            placeholder="e.g. M"
            maxLength={SIZE_TOKEN_MAX_LENGTH}
            aria-invalid={Boolean(sizeError) || undefined}
            aria-label={`Size ${index + 1}`}
            disabled={disabled}
            className={cn(
              "h-10 w-full rounded-lg border bg-background-card px-3 text-body-regular focus:outline-none focus:ring-2 focus:ring-primary-blue/20",
              sizeError ? "border-error-red" : "border-border-default",
            )}
            {...register(`stockRows.${index}.size`)}
          />
        )}
        {sizeError && (
          <p role="alert" className="text-caption-regular text-error-red">
            {sizeError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <input
          type="number"
          min={0}
          step={1}
          placeholder="0"
          aria-invalid={Boolean(qtyError) || undefined}
          aria-label={`Quantity ${index + 1}`}
          disabled={disabled}
          onWheel={(e) => e.currentTarget.blur()}
          className={cn(
            "h-10 w-full rounded-lg border bg-background-card px-3 text-body-regular focus:outline-none focus:ring-2 focus:ring-primary-blue/20",
            qtyError ? "border-error-red" : "border-border-default",
          )}
          {...register(`stockRows.${index}.quantity`, { valueAsNumber: true })}
        />
        {qtyError && (
          <p role="alert" className="text-caption-regular text-error-red">
            {qtyError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <input
          type="number"
          min={0}
          step={1}
          placeholder="—"
          aria-invalid={Boolean(thresholdError) || undefined}
          aria-label={`Threshold ${index + 1}`}
          disabled={disabled}
          onWheel={(e) => e.currentTarget.blur()}
          className={cn(
            "h-10 w-full rounded-lg border bg-background-card px-3 text-body-regular focus:outline-none focus:ring-2 focus:ring-primary-blue/20",
            thresholdError ? "border-error-red" : "border-border-default",
          )}
          {...register(`stockRows.${index}.lowStockThreshold`, {
            setValueAs: (raw: unknown) => {
              if (raw === "" || raw === null || raw === undefined) return null;
              const n = Number(raw);
              return Number.isNaN(n) ? null : n;
            },
          })}
        />
        {thresholdError && (
          <p role="alert" className="text-caption-regular text-error-red">
            {thresholdError}
          </p>
        )}
      </div>

      <div className="flex items-start pt-2">
        {!isOneSizeLocked && (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            aria-label={`Remove size row ${index + 1}`}
            className="text-error-red transition-colors hover:text-error-red/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-red disabled:cursor-not-allowed disabled:text-text-placeholder"
          >
            <TrashIcon />
          </button>
        )}
      </div>
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

function BackRow() {
  return (
    <nav aria-label="Breadcrumb">
      <Link
        to="/catalog"
        className="inline-flex items-center gap-1 text-caption-regular text-text-secondary hover:text-primary-blue hover:underline focus-visible:text-primary-blue focus-visible:outline-none"
      >
        <ChevronLeft />
        Back to Catalog
      </Link>
    </nav>
  );
}

function ChevronLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1.5 14a2 2 0 0 1-2 1.8H8.5a2 2 0 0 1-2-1.8L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
