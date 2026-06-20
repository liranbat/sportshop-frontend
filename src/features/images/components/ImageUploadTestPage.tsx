import { useState } from "react";
import { Notice } from "@/components/Notice";
import { ImageUpload } from "@/features/images/components/ImageUpload";

// Temporary admin-only smoke page for the Form/ImageUpload primitive.
// Remove (or fold into a real admin page) when Phase 1.B / 3.B integrate the widget.
export function ImageUploadTestPage() {
  const [productsUrl, setProductsUrl] = useState<string | null>(null);
  const [categoriesUrl, setCategoriesUrl] = useState<string | null>(null);
  const [productsBusy, setProductsBusy] = useState(false);
  const [categoriesBusy, setCategoriesBusy] = useState(false);

  return (
    <main className="mx-auto w-full max-w-5xl p-8">
      <header className="mb-6 flex flex-col gap-1">
        <h1 className="text-heading-l text-text-primary">Image upload smoke</h1>
        <p className="text-body-small text-text-secondary">
          Temporary admin-only playground for the Form/ImageUpload primitive. URLs returned here are
          persisted on disk; nothing is wired into products or categories yet.
        </p>
      </header>

      <Notice
        variant="info"
        message={`uploading: products=${productsBusy ? "yes" : "no"}, categories=${categoriesBusy ? "yes" : "no"}`}
      />

      <section className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-heading-m text-text-primary">Products</h2>
            <p className="text-body-small text-text-secondary">
              JPEG / JPG / PNG / WebP / AVIF, max 12 MB
            </p>
          </div>
          <ImageUpload
            acceptedFormats={["jpg", "jpeg", "png", "webp", "avif"]}
            currentImageUrl={productsUrl}
            resourceType="products"
            onUploadSuccess={setProductsUrl}
            onUploadingStateChange={setProductsBusy}
          />
          <UrlReadout url={productsUrl} />
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-heading-m text-text-primary">Categories</h2>
            <p className="text-body-small text-text-secondary">SVG only, max 12 MB</p>
          </div>
          <ImageUpload
            acceptedFormats={["svg"]}
            currentImageUrl={categoriesUrl}
            resourceType="categories"
            onUploadSuccess={setCategoriesUrl}
            onUploadingStateChange={setCategoriesBusy}
          />
          <UrlReadout url={categoriesUrl} />
        </div>
      </section>
    </main>
  );
}

function UrlReadout({ url }: { url: string | null }) {
  return (
    <code className="block break-all rounded-lg bg-quantity-control-bg p-3 text-caption-regular text-text-secondary">
      {url ?? "(empty)"}
    </code>
  );
}
