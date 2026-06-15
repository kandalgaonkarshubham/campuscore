import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { resolveUploadUrl } from '../lib/urls';
import { studentSchema, type Student, type StudentFormData } from '../schemas/student.schema';

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

interface StudentFormProps {
  initialData?: Student;
  onSubmit: (data: StudentFormData, photo?: File) => Promise<void>;
  submitLabel: string;
}

function getErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })
      .response?.data?.message === 'string'
  ) {
    const data = (error as { response: { data: { message: string; errors?: Record<string, string[]> } } })
      .response.data;
    if (data.errors) {
      const firstFieldError = Object.values(data.errors).flat()[0];
      if (firstFieldError) return firstFieldError;
    }
    return data.message;
  }
  return 'Something went wrong. Please try again.';
}

function validatePhoto(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return 'Only JPEG, PNG, and WebP images are allowed';
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `File must be under ${MAX_FILE_SIZE_MB}MB`;
  }
  return null;
}

export default function StudentForm({ initialData, onSubmit, submitLabel }: StudentFormProps) {
  const [serverError, setServerError] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    resolveUploadUrl(initialData?.photoUrl ?? null),
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          course: initialData.course,
          year: initialData.year,
          dob: initialData.dob,
          email: initialData.email,
          mobile: initialData.mobile,
          gender: initialData.gender,
          address: initialData.address,
        }
      : {
          name: '',
          course: '',
          year: 1,
          dob: '',
          email: '',
          mobile: '',
          gender: 'male',
          address: '',
        },
  });

  useEffect(() => {
    if (!photo) return;

    const objectUrl = URL.createObjectURL(photo);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPhotoError('');

    if (!file) {
      setPhoto(null);
      setPreviewUrl(resolveUploadUrl(initialData?.photoUrl ?? null));
      return;
    }

    const validationError = validatePhoto(file);
    if (validationError) {
      setPhoto(null);
      setPhotoError(validationError);
      setPreviewUrl(resolveUploadUrl(initialData?.photoUrl ?? null));
      event.target.value = '';
      return;
    }

    setPhoto(file);
  };

  const handleFormSubmit = async (data: StudentFormData) => {
    setServerError('');
    try {
      await onSubmit(data, photo ?? undefined);
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {initialData && (
        <div>
          <label className="block text-sm font-medium text-slate-700">Admission Number</label>
          <p className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            {initialData.admissionNumber}
          </p>
        </div>
      )}

      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-slate-700">
          Student Photo
        </label>
        <input
          id="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
          className="mt-1 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="mt-1 text-xs text-slate-500">JPEG, PNG, or WebP. Max {MAX_FILE_SIZE_MB}MB.</p>
        {photoError && <p className="mt-1 text-xs text-red-600">{photoError}</p>}
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Student preview"
            className="mt-3 h-32 w-32 rounded-lg border border-slate-200 object-cover"
          />
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            id="name"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            {...register('name')}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="course" className="block text-sm font-medium text-slate-700">
            Course
          </label>
          <input
            id="course"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            {...register('course')}
          />
          {errors.course && <p className="mt-1 text-xs text-red-600">{errors.course.message}</p>}
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-slate-700">
            Year
          </label>
          <input
            id="year"
            type="number"
            min={1}
            max={10}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            {...register('year')}
          />
          {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year.message}</p>}
        </div>

        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-slate-700">
            Date of Birth
          </label>
          <input
            id="dob"
            type="date"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            {...register('dob')}
          />
          {errors.dob && <p className="mt-1 text-xs text-red-600">{errors.dob.message}</p>}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-slate-700">
            Gender
          </label>
          <select
            id="gender"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            {...register('gender')}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="mobile" className="block text-sm font-medium text-slate-700">
            Mobile Number
          </label>
          <input
            id="mobile"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            {...register('mobile')}
          />
          {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-slate-700">
            Address
          </label>
          <textarea
            id="address"
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            {...register('address')}
          />
          {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}
        </div>
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
