'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit,
  FolderOpen,
  ArrowRight,
  Film,
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
import { type Movie, type MovieCategory } from './MovieCard';

interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
  _count?: { movies: number };
}

interface AdminPanelProps {
  categories: Category[];
  movies: Movie[];
  loading: boolean;
  onBack: () => void;
  onDataChange: () => void;
  onOpenFolder: (movieId: string) => void;
}

interface MovieFormData {
  title: string;
  code: string;
  slug: string;
  description: string;
  posterUrl: string;
  folderPath: string;
  year: string;
  ageRating: string;
  status: string;
  episodeInfo: string;
  subType: string;
  rating: string;
  featured: boolean;
  categoryIds: string[];
}

const emptyForm: MovieFormData = {
  title: '',
  code: '',
  slug: '',
  description: '',
  posterUrl: '',
  folderPath: '',
  year: '',
  ageRating: '',
  status: 'completed',
  episodeInfo: '',
  subType: '',
  rating: '',
  featured: false,
  categoryIds: [],
};

const statusLabels: Record<string, string> = {
  airing: 'در حال پخش',
  completed: 'تکمیل شده',
  upcoming: 'آینده',
};

export default function AdminPanel({
  categories,
  movies,
  loading,
  onBack,
  onDataChange,
  onOpenFolder,
}: AdminPanelProps) {
  const { toast } = useToast();

  // Category state
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');

  // Movie form state
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState<MovieFormData>(emptyForm);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'movie' | 'category'; id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\u0600-\u06FFa-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, ''),
    }));
  };

  const handleCategorySlugChange = (name: string) => {
    setNewCatSlug(
      name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\u0600-\u06FFa-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    );
  };

  // Open form for new movie
  const openNewMovieForm = () => {
    setEditingMovie(null);
    setFormData(emptyForm);
    setShowMovieForm(true);
  };

  // Open form for editing
  const openEditMovieForm = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      code: movie.code || '',
      slug: movie.slug,
      description: movie.description || '',
      posterUrl: movie.posterUrl || '',
      folderPath: movie.folderPath || '',
      year: movie.year?.toString() || '',
      ageRating: movie.ageRating || '',
      status: movie.status,
      episodeInfo: movie.episodeInfo || '',
      subType: movie.subType || '',
      rating: movie.rating?.toString() || '',
      featured: movie.featured || false,
      categoryIds: movie.categories.map((mc) => mc.categoryId),
    });
    setShowMovieForm(true);
  };

  // Upload poster image
  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch('/api/upload-poster', {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.url) {
        setFormData((p) => ({ ...p, posterUrl: data.url }));
        toast({ title: 'آپلود موفق', description: 'عکس پوستر آپلود شد' });
      } else {
        toast({ title: 'خطا', description: data.error || 'آپلود ناموفق', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'خطا', description: 'خطا در آپلود عکس', variant: 'destructive' });
    }
    // Reset file input
    e.target.value = '';
  };

  // Save movie (create or update)
  const handleSaveMovie = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast({ title: 'خطا', description: 'عنوان و اسلاگ الزامی است', variant: 'destructive' });
      return;
    }
    setFormSubmitting(true);
    try {
      const url = editingMovie ? `/api/movies/${editingMovie.id}` : '/api/movies';
      const method = editingMovie ? 'PUT' : 'POST';
      const body = {
        ...formData,
        year: formData.year ? parseInt(formData.year) : null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'خطا در ذخیره فیلم');
      }
      toast({ title: editingMovie ? 'فیلم ویرایش شد' : 'فیلم اضافه شد' });
      setShowMovieForm(false);
      onDataChange();
    } catch (err) {
      toast({
        title: 'خطا',
        description: err instanceof Error ? err.message : 'خطای ناشناخته',
        variant: 'destructive',
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete movie/category
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const url = deleteTarget.type === 'movie'
        ? `/api/movies/${deleteTarget.id}`
        : `/api/categories?id=${deleteTarget.id}`;
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error('خطا در حذف');
      toast({ title: 'با موفقیت حذف شد' });
      setDeleteTarget(null);
      onDataChange();
    } catch {
      toast({ title: 'خطا', description: 'عملیات حذف ناموفق بود', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  // Add category
  const handleAddCategory = async () => {
    if (!newCatName.trim() || !newCatSlug.trim()) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName, slug: newCatSlug }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'خطا');
      }
      toast({ title: 'دسته‌بندی اضافه شد' });
      setNewCatName('');
      setNewCatSlug('');
      onDataChange();
    } catch (err) {
      toast({
        title: 'خطا',
        description: err instanceof Error ? err.message : 'خطا در افزودن دسته‌بندی',
        variant: 'destructive',
      });
    }
  };

  // Toggle category in form
  const toggleCategory = (catId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(catId)
        ? prev.categoryIds.filter((id) => id !== catId)
        : [...prev.categoryIds, catId],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button
          variant="outline"
          className="border-cinematic-border bg-cinematic-surface text-cinematic-muted hover:bg-cinematic-card hover:text-white"
          onClick={onBack}
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          بازگشت به سایت
        </Button>
        <div className="flex items-center gap-2">
          <Film className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-white">پنل مدیریت</h1>
        </div>
      </div>

      {/* Categories Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-white">مدیریت دسته‌بندی‌ها</h2>
        </div>

        <div className="rounded-xl border border-cinematic-border bg-cinematic-card p-4 space-y-4">
          {/* Add Category */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <Label className="text-cinematic-muted text-sm">نام دسته‌بندی</Label>
              <Input
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  if (!newCatSlug) handleCategorySlugChange(e.target.value);
                }}
                placeholder="مثلاً: اکشن"
                className="border-cinematic-border bg-cinematic-surface text-white placeholder:text-cinematic-muted/50"
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label className="text-cinematic-muted text-sm">اسلاگ</Label>
              <Input
                value={newCatSlug}
                onChange={(e) => setNewCatSlug(e.target.value)}
                placeholder="مثلاً: action"
                dir="ltr"
                className="border-cinematic-border bg-cinematic-surface text-white placeholder:text-cinematic-muted/50"
              />
            </div>
            <Button
              onClick={handleAddCategory}
              disabled={!newCatName.trim() || !newCatSlug.trim()}
              className="bg-primary hover:bg-primary/90 text-white h-10 shrink-0"
            >
              <Plus className="h-4 w-4 ml-1" />
              افزودن
            </Button>
          </div>

          {/* Category List */}
          <div className="max-h-48 overflow-y-auto space-y-1.5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg bg-cinematic-surface" />
              ))
            ) : (
              <AnimatePresence>
                {categories.map((cat) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between rounded-lg bg-cinematic-surface/50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white">{cat.name}</span>
                      <Badge variant="outline" className="text-[10px] text-cinematic-muted border-cinematic-border" dir="ltr">
                        {cat.slug}
                      </Badge>
                      <span className="text-[10px] text-cinematic-muted">
                        ({cat._count?.movies || 0} فیلم)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => setDeleteTarget({ type: 'category', id: cat.id, name: cat.name })}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.section>

      {/* Movies Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-white">مدیریت فیلم‌ها</h2>
            <Badge variant="outline" className="text-xs text-cinematic-muted border-cinematic-border">
              {movies.length} فیلم
            </Badge>
          </div>
          <Button
            onClick={openNewMovieForm}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="h-4 w-4 ml-1" />
            افزودن فیلم
          </Button>
        </div>

        {/* Movies List */}
        <div className="rounded-xl border border-cinematic-border bg-cinematic-card overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg bg-cinematic-surface" />
              ))}
            </div>
          ) : movies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-cinematic-muted">
              <Film className="h-10 w-10 mb-2 opacity-40" />
              <p className="text-sm">فیلمی وجود ندارد</p>
            </div>
          ) : (
            <div className="max-h-[500px] overflow-y-auto">
              {movies.map((movie) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 border-b border-cinematic-border last:border-0 px-4 py-3 hover:bg-cinematic-surface/50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="shrink-0 h-14 w-10 rounded-lg overflow-hidden bg-cinematic-surface">
                    {movie.posterUrl ? (
                      <img src={movie.posterUrl} alt={movie.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg">🎬</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">{movie.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-cinematic-muted">{movie.year || '—'}</span>
                      <Badge className={cn(
                        'text-[10px] px-1 py-0',
                        movie.status === 'airing'
                          ? 'bg-rose-500/20 text-rose-400 border-0'
                          : movie.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border-0'
                          : 'bg-amber-500/20 text-amber-400 border-0'
                      )}>
                        {statusLabels[movie.status] || movie.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-cinematic-muted hover:text-amber-400 hover:bg-amber-500/10"
                      onClick={() => onOpenFolder(movie.id)}
                      title="باز کردن پوشه"
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-cinematic-muted hover:text-primary hover:bg-primary/10"
                      onClick={() => openEditMovieForm(movie)}
                      title="ویرایش"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-cinematic-muted hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => setDeleteTarget({ type: 'movie', id: movie.id, name: movie.title })}
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Movie Form Dialog */}
      <Dialog open={showMovieForm} onOpenChange={(v) => !v && setShowMovieForm(false)}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto border-cinematic-border bg-cinematic-surface p-0">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-cinematic-border bg-cinematic-surface px-6 py-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-white">
                {editingMovie ? 'ویرایش فیلم' : 'افزودن فیلم جدید'}
              </DialogTitle>
            </DialogHeader>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-cinematic-muted hover:text-white"
              onClick={() => setShowMovieForm(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-6 space-y-4">
            {/* Title, Slug & Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-cinematic-muted text-sm">عنوان *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="عنوان فیلم"
                  className="border-cinematic-border bg-cinematic-card text-white placeholder:text-cinematic-muted/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-cinematic-muted text-sm">کد</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
                  placeholder="کد اختصاصی"
                  dir="ltr"
                  className="border-cinematic-border bg-cinematic-card text-white placeholder:text-cinematic-muted/50 font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-cinematic-muted text-sm">اسلاگ *</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="movie-slug"
                  dir="ltr"
                  className="border-cinematic-border bg-cinematic-card text-white placeholder:text-cinematic-muted/50"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-cinematic-muted text-sm">توضیحات</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="توضیحات فیلم..."
                rows={3}
                className="border-cinematic-border bg-cinematic-card text-white placeholder:text-cinematic-muted/50 resize-none"
              />
            </div>

            {/* Poster URL & Folder Path */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-cinematic-muted text-sm">پوستر فیلم</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.posterUrl}
                    onChange={(e) => setFormData((p) => ({ ...p, posterUrl: e.target.value }))}
                    placeholder="https://... یا فایل رو آپلود کنید"
                    dir="ltr"
                    className="border-cinematic-border bg-cinematic-card text-white placeholder:text-cinematic-muted/50"
                  />
                  <label className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-cinematic-accent hover:bg-cinematic-accent-hover text-white text-sm whitespace-nowrap transition-colors">
                    <Upload className="w-4 h-4" />
                    انتخاب عکس
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={handlePosterUpload}
                    />
                  </label>
                </div>
                {formData.posterUrl && (
                  <div className="mt-2 relative w-20 h-28 rounded-md overflow-hidden border border-cinematic-border">
                    <img src={formData.posterUrl} alt="پوستر" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-cinematic-muted text-sm">مسیر پوشه</Label>
                <Input
                  value={formData.folderPath}
                  onChange={(e) => setFormData((p) => ({ ...p, folderPath: e.target.value }))}
                  placeholder="/path/to/folder"
                  dir="ltr"
                  className="border-cinematic-border bg-cinematic-card text-white placeholder:text-cinematic-muted/50"
                />
              </div>
            </div>

            {/* Year & Age Rating & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-cinematic-muted text-sm">سال</Label>
                <Input
                  value={formData.year}
                  onChange={(e) => setFormData((p) => ({ ...p, year: e.target.value }))}
                  placeholder="2025"
                  type="number"
                  dir="ltr"
                  className="border-cinematic-border bg-cinematic-card text-white placeholder:text-cinematic-muted/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-cinematic-muted text-sm">رده سنی</Label>
                <Select
                  value={formData.ageRating}
                  onValueChange={(v) => setFormData((p) => ({ ...p, ageRating: v }))}
                >
                  <SelectTrigger className="border-cinematic-border bg-cinematic-card text-white">
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent className="border-cinematic-border bg-cinematic-card">
                    <SelectItem value="7+">7+</SelectItem>
                    <SelectItem value="13+">13+</SelectItem>
                    <SelectItem value="16+">16+</SelectItem>
                    <SelectItem value="18+">18+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-cinematic-muted text-sm">وضعیت</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData((p) => ({ ...p, status: v }))}
                >
                  <SelectTrigger className="border-cinematic-border bg-cinematic-card text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-cinematic-border bg-cinematic-card">
                    <SelectItem value="completed">تکمیل شده</SelectItem>
                    <SelectItem value="airing">در حال پخش</SelectItem>
                    <SelectItem value="upcoming">آینده</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Episode Info & Sub Type & Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-cinematic-muted text-sm">اطلاعات قسمت</Label>
                <Input
                  value={formData.episodeInfo}
                  onChange={(e) => setFormData((p) => ({ ...p, episodeInfo: e.target.value }))}
                  placeholder="S1 EP12"
                  dir="ltr"
                  className="border-cinematic-border bg-cinematic-card text-white placeholder:text-cinematic-muted/50"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-cinematic-muted text-sm">نوع زیرنویس</Label>
                <Select
                  value={formData.subType}
                  onValueChange={(v) => setFormData((p) => ({ ...p, subType: v }))}
                >
                  <SelectTrigger className="border-cinematic-border bg-cinematic-card text-white">
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent className="border-cinematic-border bg-cinematic-card">
                    <SelectItem value="سافت ساب">سافت ساب</SelectItem>
                    <SelectItem value="دوبله">دوبله</SelectItem>
                    <SelectItem value="hardsub">هاردساب</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-cinematic-muted text-sm">امتیاز (0-10)</Label>
                <Input
                  value={formData.rating}
                  onChange={(e) => setFormData((p) => ({ ...p, rating: e.target.value }))}
                  placeholder="8.5"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  dir="ltr"
                  className="border-cinematic-border bg-cinematic-card text-white placeholder:text-cinematic-muted/50"
                />
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(v) => setFormData((p) => ({ ...p, featured: !!v }))}
                className="border-cinematic-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="featured" className="text-cinematic-muted text-sm cursor-pointer">
                نمایش در بخش ویژه (در حال پخش)
              </Label>
            </div>

            {/* Categories Multi-Select */}
            <div className="space-y-2">
              <Label className="text-cinematic-muted text-sm">دسته‌بندی‌ها</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-3 rounded-lg border border-cinematic-border bg-cinematic-card">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1.5 hover:bg-cinematic-surface transition-colors"
                  >
                    <Checkbox
                      checked={formData.categoryIds.includes(cat.id)}
                      onCheckedChange={() => toggleCategory(cat.id)}
                      className="border-cinematic-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-sm text-white">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Save / Cancel */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-cinematic-border">
              <Button
                variant="outline"
                className="border-cinematic-border bg-cinematic-card text-cinematic-muted hover:text-white hover:bg-cinematic-surface"
                onClick={() => setShowMovieForm(false)}
                disabled={formSubmitting}
              >
                انصراف
              </Button>
              <Button
                onClick={handleSaveMovie}
                disabled={formSubmitting || !formData.title.trim() || !formData.slug.trim()}
                className="bg-primary hover:bg-primary/90 text-white min-w-[120px]"
              >
                {formSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    در حال ذخیره...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Save className="h-4 w-4" />
                    ذخیره
                  </span>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent className="border-cinematic-border bg-cinematic-surface">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              تأیید حذف
            </AlertDialogTitle>
            <AlertDialogDescription className="text-cinematic-muted">
              آیا از حذف <span className="text-white font-medium">{deleteTarget?.name}</span> اطمینان دارید؟
              این عمل قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-cinematic-border bg-cinematic-card text-cinematic-muted hover:text-white hover:bg-cinematic-surface">
              انصراف
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {deleting ? 'در حال حذف...' : 'حذف'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}