'use client';

import { useState, useEffect } from 'react';

import {
  Plus,
  Trash2,
  Edit,
  ArrowRight,
  ShoppingBag,
  Tag,
  X,
  Save,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { type Product } from './ProductCard';

interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
  _count?: { products: number };
}

interface AdminPanelProps {
  categories: Category[];
  products: Product[];
  loading: boolean;
  onBack: () => void;
  onDataChange: () => void;
}

interface ProductFormData {
  title: string;
  code: string;
  slug: string;
  description: string;
  posterUrl: string;
  price: string;
  year: string;
  ageRating: string;
  status: string;
  episodeInfo: string;
  subType: string;
  rating: string;
  featured: boolean;
  categoryIds: string[];
}

const emptyForm: ProductFormData = {
  title: '',
  code: '',
  slug: '',
  description: '',
  posterUrl: '',
  price: '',
  year: '',
  ageRating: '',
  status: 'available',
  episodeInfo: '',
  subType: '',
  rating: '',
  featured: false,
  categoryIds: [],
};

function toSlug(text: string): string {
  return text
    .replace(/[\u0600-\u06FF]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
    .trim() || `product-${Date.now()}`;
}

export default function AdminPanel({
  categories,
  products,
  loading,
  onBack,
  onDataChange,
}: AdminPanelProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>('');

  // Category form state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catSaving, setCatSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'product' | 'category'; id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !editingProduct) {
      setFormData((prev) => ({ ...prev, slug: toSlug(formData.title) }));
    }
  }, [formData.title, editingProduct]);

  // Auto-generate category slug
  useEffect(() => {
    if (catName) {
      setCatSlug(toSlug(catName));
    }
  }, [catName]);

  // Poster file handler
  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPosterPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Upload poster
  const uploadPoster = async (): Promise<string | null> => {
    if (!posterFile) return formData.posterUrl || null;
    try {
      const base64 = posterPreview;
      const res = await fetch('/api/upload-poster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, filename: posterFile.name }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
    } catch {
      // fallback to base64
      return posterPreview;
    }
    return null;
  };

  // Save product
  const handleSaveProduct = async () => {
    if (!formData.title.trim()) {
      toast({ title: 'خطا', description: 'نام محصول الزامی است', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const posterUrl = await uploadPoster();
      const body = {
        title: formData.title,
        code: formData.code || null,
        slug: formData.slug || toSlug(formData.title),
        description: formData.description || null,
        posterUrl: posterUrl || null,
        price: formData.price || null,
        year: formData.year ? parseInt(formData.year) : null,
        ageRating: formData.ageRating || null,
        status: formData.status || 'available',
        episodeInfo: formData.episodeInfo || null,
        subType: formData.subType || null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        featured: formData.featured,
        categoryIds: formData.categoryIds,
      };

      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast({ title: editingProduct ? 'ویرایش شد' : 'اضافه شد', description: 'محصول با موفقیت ذخیره شد' });
        resetProductForm();
        onDataChange();
      } else {
        const data = await res.json().catch(() => ({}));
        toast({ title: 'خطا', description: data.error || 'خطا در ذخیره محصول', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطا', description: 'خطا در ارتباط با سرور', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  // Save category
  const handleSaveCategory = async () => {
    if (!catName.trim()) {
      toast({ title: 'خطا', description: 'نام دسته‌بندی الزامی است', variant: 'destructive' });
      return;
    }
    setCatSaving(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: catName, slug: catSlug || toSlug(catName), type: 'product' }),
      });
      if (res.ok) {
        toast({ title: 'اضافه شد', description: 'دسته‌بندی جدید ایجاد شد' });
        setCatName('');
        setCatSlug('');
        setShowCategoryForm(false);
        onDataChange();
      } else {
        const data = await res.json().catch(() => ({}));
        toast({ title: 'خطا', description: data.error || 'خطا در ایجاد دسته‌بندی', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطا', description: 'خطا در ارتباط با سرور', variant: 'destructive' });
    } finally {
      setCatSaving(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const url = deleteTarget.type === 'product'
        ? `/api/products/${deleteTarget.id}`
        : `/api/categories?id=${deleteTarget.id}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'حذف شد', description: `${deleteTarget.name} حذف شد` });
        setDeleteTarget(null);
        onDataChange();
      } else {
        toast({ title: 'خطا', description: 'خطا در حذف', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطا', description: 'خطا در ارتباط با سرور', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  // Edit product
  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      code: product.code || '',
      slug: product.slug,
      description: product.description || '',
      posterUrl: product.posterUrl || '',
      price: product.price || '',
      year: product.year?.toString() || '',
      ageRating: product.ageRating || '',
      status: product.status,
      episodeInfo: product.episodeInfo || '',
      subType: product.subType || '',
      rating: product.rating?.toString() || '',
      featured: product.featured || false,
      categoryIds: product.categories.map((c) => c.categoryId),
    });
    setPosterPreview(product.posterUrl || '');
    setShowProductForm(true);
  };

  const resetProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setFormData(emptyForm);
    setPosterFile(null);
    setPosterPreview('');
  };

  const toggleCategory = (catId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter((id) => id !== catId)
        : [...prev.categoryIds, catId],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100">
            <ShoppingBag className="h-5 w-5 text-pink-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">پنل مدیریت</h2>
            <p className="text-sm text-gray-500">مدیریت محصولات و دسته‌بندی‌ها</p>
          </div>
        </div>
        <Button variant="outline" onClick={onBack} className="border-fantasy-border text-gray-600 hover:bg-pink-50 hover:text-pink-600">
          <ArrowRight className="h-4 w-4 ml-1" />
          بازگشت
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-fantasy-border pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-all',
            activeTab === 'products'
              ? 'bg-pink-500 text-white shadow-sm'
              : 'text-gray-500 hover:bg-pink-50 hover:text-pink-600'
          )}
        >
          محصولات ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-all',
            activeTab === 'categories'
              ? 'bg-pink-500 text-white shadow-sm'
              : 'text-gray-500 hover:bg-pink-50 hover:text-pink-600'
          )}
        >
          دسته‌بندی‌ها ({categories.length})
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">محصولات</h3>
            <Button
              onClick={() => { resetProductForm(); setShowProductForm(true); }}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Plus className="h-4 w-4 ml-1" />
              محصول جدید
            </Button>
          </div>

          {/* Product List */}
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg bg-pink-50" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>محصولی وجود ندارد</p>
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-fantasy-border bg-white hover:bg-pink-50/50 transition-colors"
                >
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-pink-50 shrink-0">
                    {product.posterUrl ? (
                      <img src={product.posterUrl} alt={product.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-lg">✨</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-800 truncate">{product.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {product.price && (
                        <Badge className="bg-pink-100 text-pink-600 text-[10px] border-0">{product.price}</Badge>
                      )}
                      <Badge className="bg-gray-100 text-gray-500 text-[10px] border-0">
                        {product.status === 'available' ? 'موجود' : product.status === 'unavailable' ? 'ناموجود' : 'به‌زودی'}
                      </Badge>
                      {product.categories.slice(0, 2).map((c) => (
                        <Badge key={c.id} variant="outline" className="border-pink-200 text-pink-500 text-[10px]">
                          {c.category.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-pink-600 hover:bg-pink-50"
                      onClick={() => startEditProduct(product)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => setDeleteTarget({ type: 'product', id: product.id, name: product.title })}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">دسته‌بندی‌ها</h3>
            <Button
              onClick={() => setShowCategoryForm(true)}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Plus className="h-4 w-4 ml-1" />
              دسته‌بندی جدید
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-fantasy-border bg-white hover:bg-pink-50/50 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 shrink-0">
                  <Tag className="h-4 w-4 text-pink-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-800">{cat.name}</h4>
                  <p className="text-xs text-gray-400">{cat._count?.products || 0} محصول</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => setDeleteTarget({ type: 'category', id: cat.id, name: cat.name })}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>دسته‌بندی وجود ندارد</p>
            </div>
          )}
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={showProductForm} onOpenChange={(v) => !v && resetProductForm()}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto border-fantasy-border bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-800">
              {editingProduct ? 'ویرایش محصول' : 'محصول جدید'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">نام محصول *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="مثلاً: رژ لب مات رز"
                className="border-fantasy-border bg-white text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* Code & Price */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">کد محصول</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
                  placeholder="SKU"
                  className="border-fantasy-border bg-white text-gray-800 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">قیمت</Label>
                <Input
                  value={formData.price}
                  onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                  placeholder="مثلاً: ۱۵۰,۰۰۰ تومان"
                  className="border-fantasy-border bg-white text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">اسلاگ</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                placeholder="auto-generated"
                className="border-fantasy-border bg-white text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">توضیحات</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="توضیحات محصول..."
                rows={3}
                className="border-fantasy-border bg-white text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* Poster Upload */}
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">تصویر محصول</Label>
              <div className="flex items-center gap-3">
                <label className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-fantasy-border bg-pink-50 cursor-pointer hover:border-pink-300 transition-colors overflow-hidden">
                  {posterPreview ? (
                    <img src={posterPreview} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-pink-300" />
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePosterChange} />
                </label>
                {posterPreview && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => { setPosterPreview(''); setPosterFile(null); setFormData((p) => ({ ...p, posterUrl: '' })); }}
                  >
                    <X className="h-3.5 w-3.5 ml-1" />
                    حذف
                  </Button>
                )}
              </div>
            </div>

            {/* Status & SubType */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">وضعیت</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData((p) => ({ ...p, status: v }))}>
                  <SelectTrigger className="border-fantasy-border bg-white text-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="available">موجود</SelectItem>
                    <SelectItem value="unavailable">ناموجود</SelectItem>
                    <SelectItem value="upcoming">به‌زودی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">نوع</Label>
                <Input
                  value={formData.subType}
                  onChange={(e) => setFormData((p) => ({ ...p, subType: e.target.value }))}
                  placeholder="مثلاً: اورجینال"
                  className="border-fantasy-border bg-white text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Rating & Year */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">امتیاز</Label>
                <Input
                  type="number"
                  value={formData.rating}
                  onChange={(e) => setFormData((p) => ({ ...p, rating: e.target.value }))}
                  placeholder="0-10"
                  min="0"
                  max="10"
                  step="0.1"
                  className="border-fantasy-border bg-white text-gray-800 placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">سال</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
                  placeholder="2024"
                  className="border-fantasy-border bg-white text-gray-800 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(v) => setFormData((p) => ({ ...p, featured: !!v }))}
                className="border-pink-300 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
              />
              <Label htmlFor="featured" className="text-gray-700 text-sm cursor-pointer">محصول ویژه</Label>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="space-y-2">
                <Label className="text-gray-700 text-sm">دسته‌بندی‌ها</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={cn(
                        'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                        formData.categoryIds.includes(cat.id)
                          ? 'bg-pink-500 text-white'
                          : 'bg-pink-50 text-pink-400 border border-fantasy-border hover:bg-pink-100'
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <Button
              onClick={handleSaveProduct}
              disabled={saving}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white h-11"
            >
              {saving ? '...' : (
                <>
                  <Save className="h-4 w-4 ml-1" />
                  {editingProduct ? 'ذخیره تغییرات' : 'اضافه کردن محصول'}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Form Dialog */}
      <Dialog open={showCategoryForm} onOpenChange={setShowCategoryForm}>
        <DialogContent className="max-w-sm border-fantasy-border bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-800">دسته‌بندی جدید</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">نام دسته‌بندی</Label>
              <Input
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="مثلاً: آرایشی"
                className="border-fantasy-border bg-white text-gray-800 placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">اسلاگ</Label>
              <Input
                value={catSlug}
                onChange={(e) => setCatSlug(e.target.value)}
                placeholder="auto-generated"
                className="border-fantasy-border bg-white text-gray-800 placeholder:text-gray-400"
              />
            </div>
            <Button
              onClick={handleSaveCategory}
              disabled={catSaving}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              {catSaving ? '...' : 'اضافه کردن'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              حذف {deleteTarget?.type === 'product' ? 'محصول' : 'دسته‌بندی'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              آیا مطمئنید که &laquo;{deleteTarget?.name}&raquo; را می‌خواهید حذف کنید؟ این عمل غیرقابل برگشت است.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-fantasy-border text-gray-600">انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? '...' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
